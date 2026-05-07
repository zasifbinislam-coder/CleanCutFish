"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart, formatBDT } from "@/context/CartContext";
import { IconRefresh } from "@/components/Icon";

export default function AccountPage() {
  const { user, orders, signOut, hydrated } = useAuth();
  const { addItem, openMini } = useCart();
  const router = useRouter();

  function reorder(o) {
    o.lines?.forEach((l) => addItem({ ...l, qty: l.qty }));
    openMini();
  }

  useEffect(() => {
    if (hydrated && !user) router.replace("/login?next=/account");
  }, [hydrated, user, router]);

  if (!user) return <div className="container-page py-16">Loading…</div>;

  const myOrders = orders.filter((o) => o.userId === user.id || o.userEmail === user.email);

  return (
    <div className="container-page py-12">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="card p-5 h-fit space-y-4">
          <div>
            <div className="section-eyebrow">Signed in as</div>
            <div className="font-display text-xl text-brand-deep mt-1">{user.name}</div>
            <div className="text-xs text-brand-deep/60">{user.email}</div>
            {user.phone && <div className="text-xs text-brand-deep/60">{user.phone}</div>}
          </div>

          {user.role === "admin" && (
            <Link href="/admin" className="btn-accent w-full text-center">
              Open Admin Panel →
            </Link>
          )}

          <Link href="/account/addresses" className="btn-ghost w-full text-center">
            📍 Address book ({user.addresses?.length || 0})
          </Link>
          <Link href="/wishlist" className="btn-ghost w-full text-center">
            ❤ Wishlist
          </Link>

          <button
            onClick={() => { router.replace("/"); signOut(); }}
            className="btn-ghost w-full"
          >
            Sign out
          </button>
        </aside>

        <div>
          <h1 className="section-title mb-1">Your orders</h1>
          <p className="text-sm text-brand-deep/60 mb-6">
            You have placed <b>{myOrders.length}</b> {myOrders.length === 1 ? "order" : "orders"}.
          </p>

          {myOrders.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-3">🐟</div>
              <p className="text-brand-deep/70 mb-5">No orders yet — get cooking.</p>
              <Link href="/shop" className="btn-primary">Browse the catch</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((o) => (
                <div key={o.id} className="card p-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-xs text-brand-deep/55">Order ID</div>
                      <div className="font-mono text-sm font-semibold">{o.id}</div>
                    </div>
                    <StatusBadge status={o.status} />
                    <div className="text-right">
                      <div className="text-xs text-brand-deep/55">Total</div>
                      <div className="font-display text-xl text-brand-deep">{formatBDT(o.total)}</div>
                    </div>
                  </div>
                  <div className="text-xs text-brand-deep/60 mt-3 flex items-center justify-between flex-wrap gap-2">
                    <span>{o.lines?.length || 0} items · {new Date(o.createdAt).toLocaleString("en-BD")}</span>
                    <button
                      onClick={() => reorder(o)}
                      className="inline-flex items-center gap-1.5 text-brand-teal hover:text-brand-deep font-semibold"
                    >
                      <IconRefresh width={14} height={14} /> Reorder
                    </button>
                  </div>
                  {o.lines && (
                    <div className="mt-3 pt-3 border-t border-brand-deep/10 text-sm text-brand-deep/80 space-y-1">
                      {o.lines.map((l, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{l.name} <span className="text-brand-deep/50">× {l.qty}</span></span>
                          <span>{formatBDT(l.unitPrice * l.qty)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    received:  ["bg-amber-100 text-amber-800",   "Received"],
    confirmed: ["bg-blue-100 text-blue-800",     "Confirmed"],
    shipped:   ["bg-indigo-100 text-indigo-800", "Out for delivery"],
    delivered: ["bg-emerald-100 text-emerald-800","Delivered"],
    cancelled: ["bg-rose-100 text-rose-800",     "Cancelled"],
  };
  const [cls, label] = map[status] || map.received;
  return <span className={`pill ${cls}`}>{label}</span>;
}
