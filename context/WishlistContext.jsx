"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

const WishlistContext = createContext(null);
const KEY = "ccf_wishlist_v1";

// Hybrid wishlist:
//   - Anonymous visitors → localStorage (so the heart still works without an account).
//   - Signed-in users    → Supabase `wishlist` table (syncs across devices).
//   - On sign-in we merge the local wishlist INTO Supabase, then clear local.

export function WishlistProvider({ children }) {
  const supabase = isSupabaseConfigured() ? getSupabaseBrowser() : null;
  const [ids, setIds] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // 1. Bootstrap localStorage on mount (instant, sync).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // 2. Watch auth changes, fetch user wishlist, and merge any local into Supabase.
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    async function syncForUser(uid) {
      if (!uid) { setUserId(null); return; }
      // Read remote
      const { data: remote } = await supabase
        .from("wishlist").select("product_id").eq("user_id", uid);
      if (cancelled) return;
      const remoteIds = (remote || []).map((r) => r.product_id);

      // Merge local (if any) into remote
      const localIds = readLocal();
      const newOnes = localIds.filter((id) => !remoteIds.includes(id));
      if (newOnes.length) {
        await supabase.from("wishlist").insert(
          newOnes.map((product_id) => ({ user_id: uid, product_id }))
        );
        try { localStorage.removeItem(KEY); } catch {}
      }
      const merged = Array.from(new Set([...remoteIds, ...newOnes]));
      if (cancelled) return;
      setUserId(uid);
      setIds(merged);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncForUser(session?.user?.id || null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      syncForUser(session?.user?.id || null);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [supabase]);

  // 3. Persist back. For anonymous → localStorage. For signed-in → Supabase mutations.
  function persistAnon(next) {
    setIds(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }

  async function add(productId) {
    if (userId && supabase) {
      await supabase.from("wishlist").insert({ user_id: userId, product_id: productId });
      setIds((curr) => Array.from(new Set([...curr, productId])));
    } else {
      persistAnon(Array.from(new Set([...ids, productId])));
    }
  }
  async function remove(productId) {
    if (userId && supabase) {
      await supabase.from("wishlist").delete()
        .eq("user_id", userId).eq("product_id", productId);
      setIds((curr) => curr.filter((x) => x !== productId));
    } else {
      persistAnon(ids.filter((x) => x !== productId));
    }
  }
  async function toggle(productId) {
    if (ids.includes(productId)) await remove(productId);
    else await add(productId);
  }
  async function clear() {
    if (userId && supabase) {
      await supabase.from("wishlist").delete().eq("user_id", userId);
    } else {
      try { localStorage.removeItem(KEY); } catch {}
    }
    setIds([]);
  }

  const value = useMemo(() => ({
    ids, count: ids.length, hydrated, syncedToCloud: !!userId,
    has: (id) => ids.includes(id),
    toggle, add, remove, clear,
  }), [ids, hydrated, userId]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

function readLocal() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
