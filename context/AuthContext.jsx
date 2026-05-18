"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

const AuthContext = createContext(null);

// =============================================================================
// CleanCutFish auth + data layer
//
//  - Auth, profiles, addresses, and orders all live in Supabase.
//  - Wishlist intentionally stays in localStorage for fast offline reads.
//  - When Supabase env vars are missing, the context throws clear errors so
//    UI flows surface a "backend not configured" message instead of silently
//    no-op'ing.
// =============================================================================

export function AuthProvider({ children }) {
  const supabase = isSupabaseConfigured() ? getSupabaseBrowser() : null;
  const [user, setUser] = useState(null);          // {id,name,email,phone,role,addresses}
  const [users, setUsers] = useState([]);          // admin only
  const [orders, setOrders] = useState([]);        // current user's orders OR all (admin)
  const [hydrated, setHydrated] = useState(false);

  // ---------- helpers ----------------------------------------------------------
  const fetchProfile = useCallback(async (sessionUser) => {
    if (!sessionUser || !supabase) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sessionUser.id)
      .maybeSingle();
    if (!profile) return null;
    const { data: addresses } = await supabase
      .from("addresses").select("*").eq("user_id", sessionUser.id).order("created_at");
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone || "",
      role: profile.role,
      addresses: (addresses || []).map((a) => ({
        id: a.id, label: a.label, address: a.address,
        zone: a.zone, city: a.city, phone: a.phone, isDefault: a.is_default,
      })),
    };
  }, [supabase]);

  const refreshOrders = useCallback(async (current) => {
    if (!supabase || !current) { setOrders([]); return; }
    const isAdmin = current.role === "admin";
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("user_id", current.id);
    const { data } = await query;
    setOrders((data || []).map(rowToOrder));
  }, [supabase]);

  const refreshUsers = useCallback(async (current) => {
    if (!supabase || current?.role !== "admin") { setUsers([]); return; }
    const { data } = await supabase.from("profiles").select("*").order("created_at");
    setUsers((data || []).map((p) => ({
      id: p.id, name: p.name, email: p.email,
      phone: p.phone || "", role: p.role, createdAt: p.created_at,
    })));
  }, [supabase]);

  // ---------- bootstrap session ------------------------------------------------
  useEffect(() => {
    if (!supabase) { setHydrated(true); return; }
    let mounted = true;

    async function bootstrap() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      const profile = session?.user ? await fetchProfile(session.user) : null;
      if (!mounted) return;
      setUser(profile);
      await Promise.all([refreshOrders(profile), refreshUsers(profile)]);
      if (mounted) setHydrated(true);
    }
    bootstrap();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = session?.user ? await fetchProfile(session.user) : null;
      setUser(profile);
      await Promise.all([refreshOrders(profile), refreshUsers(profile)]);
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [supabase, fetchProfile, refreshOrders, refreshUsers]);

  const value = useMemo(() => ({
    user,
    users,
    orders,
    hydrated,
    isAdmin: user?.role === "admin",
    backendReady: !!supabase,

    // -- auth --
    async signUp({ name, email, password, phone }) {
      if (!supabase) return { ok: false, error: "Supabase not configured." };
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name, phone: phone || "" } },
      });
      if (error) return { ok: false, error: error.message };
      // Email confirmation may be required depending on project settings.
      if (!data.session) {
        return { ok: true, needsConfirm: true,
          message: "Account created. If email confirmation is enabled, check your inbox before signing in." };
      }
      return { ok: true };
    },

    async signIn({ email, password }) {
      if (!supabase) return { ok: false, error: "Supabase not configured." };
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) return { ok: false, error: error.message };
      // Tiny role-only query so the login page can route immediately.
      // The full hydration (orders, addresses, all-customer fetch for admin)
      // happens in the background via onAuthStateChange.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { ok: true, user: null };
      const { data: prof } = await supabase
        .from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      return { ok: true, user: { role: prof?.role || "customer" } };
    },

    async signOut() {
      if (supabase) await supabase.auth.signOut();
      setUser(null); setOrders([]); setUsers([]);
    },

    // -- orders --
    async placeOrder(order) {
      if (!supabase) throw new Error("Supabase not configured.");
      const id = "CCF-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      const row = {
        id,
        user_id: user?.id || null,
        user_email: user?.email || order.email || "guest",
        name: order.name, phone: order.phone, email: order.email || null,
        address: order.address, city: order.city, zone: order.zone,
        notes: order.notes || null,
        method: order.method,
        txn_id: order.txnId || null,
        coupon_code: order.couponCode || null,
        subtotal: order.subtotal,
        discount: order.discount || 0,
        delivery: order.delivery || 0,
        total: order.total,
        status: "received",
        lines: order.lines,
      };
      // Plain INSERT — no .select(). Anon checkout has no SELECT policy on
      // orders (intentional: guests can't read orders), so RETURNING would
      // fail with an RLS error. We build the record locally from the row we
      // sent, since the DB stores it as-is.
      const { error } = await supabase.from("orders").insert(row);
      if (error) throw error;
      const record = rowToOrder({
        ...row,
        created_at: new Date().toISOString(),
      });
      setOrders((curr) => [record, ...curr]);
      // Fire-and-forget email receipts. Never block the success page on
      // SMTP — if the email fails the order is still safely in Supabase.
      fetch("/api/order-placed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          name: order.name,
          email: order.email || null,
          phone: order.phone,
          address: order.address,
          city: order.city,
          zone: order.zone,
          notes: order.notes,
          method: order.method,
          txnId: order.txnId || null,
          lines: order.lines,
          subtotal: order.subtotal,
          discount: order.discount || 0,
          delivery: order.delivery || 0,
          total: order.total,
        }),
      }).catch(() => {
        /* offline / network issue — silent. */
      });
      return record;
    },

    async updateOrderStatus(id, status) {
      if (!supabase) return;
      await supabase.from("orders").update({ status }).eq("id", id);
      const target = orders.find((o) => o.id === id);
      setOrders((curr) => curr.map((o) => (o.id === id ? { ...o, status } : o)));
      // Fire-and-forget status email to the customer (only if we have
      // their email on the order). Never block the admin UI on SMTP.
      if (target?.email) {
        fetch("/api/order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order: { id: target.id, name: target.name, email: target.email },
            status,
          }),
        }).catch(() => {
          /* network issue — silent */
        });
      }
    },

    // -- addresses --
    async addAddress(addr) {
      if (!supabase || !user) return;
      const isFirst = (user.addresses || []).length === 0;
      const { data, error } = await supabase.from("addresses").insert({
        user_id: user.id,
        label: addr.label || "Home",
        address: addr.address, zone: addr.zone, city: addr.city,
        phone: addr.phone || "",
        is_default: isFirst,
      }).select().single();
      if (error) return;
      const next = [...(user.addresses || []), {
        id: data.id, label: data.label, address: data.address,
        zone: data.zone, city: data.city, phone: data.phone, isDefault: data.is_default,
      }];
      setUser({ ...user, addresses: next });
    },

    async updateAddress(id, patch) {
      if (!supabase || !user) return;
      await supabase.from("addresses").update({
        label: patch.label, address: patch.address, zone: patch.zone,
        city: patch.city, phone: patch.phone,
      }).eq("id", id);
      setUser({
        ...user,
        addresses: (user.addresses || []).map((a) => (a.id === id ? { ...a, ...patch } : a)),
      });
    },

    async removeAddress(id) {
      if (!supabase || !user) return;
      await supabase.from("addresses").delete().eq("id", id);
      const remaining = (user.addresses || []).filter((a) => a.id !== id);
      // ensure one default remains
      if (remaining.length && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
        await supabase.from("addresses").update({ is_default: true }).eq("id", remaining[0].id);
      }
      setUser({ ...user, addresses: remaining });
    },

    async setDefaultAddress(id) {
      if (!supabase || !user) return;
      // Clear all defaults, then set the chosen one.
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
      await supabase.from("addresses").update({ is_default: true }).eq("id", id);
      setUser({
        ...user,
        addresses: (user.addresses || []).map((a) => ({ ...a, isDefault: a.id === id })),
      });
    },
  }), [supabase, user, users, orders, hydrated, fetchProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function rowToOrder(r) {
  return {
    id: r.id,
    userId: r.user_id,
    userEmail: r.user_email,
    name: r.name, phone: r.phone, email: r.email,
    address: r.address, city: r.city, zone: r.zone,
    notes: r.notes,
    method: r.method, txnId: r.txn_id, couponCode: r.coupon_code,
    subtotal: Number(r.subtotal),
    discount: Number(r.discount || 0),
    delivery: Number(r.delivery || 0),
    total: Number(r.total),
    status: r.status,
    lines: r.lines,
    createdAt: r.created_at,
  };
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
