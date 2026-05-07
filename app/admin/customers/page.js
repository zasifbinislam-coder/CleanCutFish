"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatBDT } from "@/context/CartContext";

export default function AdminCustomersPage() {
  const { users, orders } = useAuth();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);

  const customers = users
    .filter((u) => u.role !== "admin")
    .filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    )
    .map((u) => {
      const myOrders = orders.filter((o) => o.userId === u.id || o.userEmail === u.email);
      const spent = myOrders.reduce((s, o) => s + (o.total || 0), 0);
      return { ...u, orderCount: myOrders.length, spent, myOrders };
    });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-brand-deep">Customers</h1>
        <input
          className="input max-w-xs"
          placeholder="Search name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {customers.length === 0 ? (
        <div className="card p-12 text-center text-brand-deep/60">
          No customers yet. Sign up at <code className="bg-brand-sand px-1.5 py-0.5 rounded">/signup</code> to test.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-sand">
                <tr className="text-left text-brand-deep/70">
                  <th className="px-4 py-3">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Spent</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-brand-deep/5">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="text-xs">{c.email}</td>
                    <td className="text-xs">{c.phone || "—"}</td>
                    <td>{c.orderCount}</td>
                    <td className="font-semibold">{formatBDT(c.spent)}</td>
                    <td className="text-xs text-brand-deep/60">
                      {new Date(c.createdAt).toLocaleDateString("en-BD")}
                    </td>
                    <td>
                      <button
                        onClick={() => setOpen(open?.id === c.id ? null : c)}
                        className="text-xs text-brand-teal hover:underline"
                      >
                        {open?.id === c.id ? "Hide" : "Orders"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open && (
        <div className="card p-5">
          <h3 className="font-display text-xl text-brand-deep mb-3">{open.name}'s orders</h3>
          {open.myOrders.length === 0 ? (
            <p className="text-sm text-brand-deep/60">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {open.myOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between border-b border-brand-deep/5 py-2 text-sm">
                  <span className="font-mono text-xs">{o.id}</span>
                  <span className="text-brand-deep/60">{o.lines?.length || 0} items</span>
                  <span className="capitalize text-xs">{o.status}</span>
                  <span className="font-semibold">{formatBDT(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
