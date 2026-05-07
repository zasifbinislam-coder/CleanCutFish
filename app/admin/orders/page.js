"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatBDT } from "@/context/CartContext";

const STATUSES = ["received", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAuth();
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-brand-deep">Orders</h1>
        <div className="flex gap-1 flex-wrap">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs capitalize transition ${
                filter === s ? "bg-brand-teal text-white" : "bg-white text-brand-deep/70 border border-brand-deep/15"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card p-12 text-center text-brand-deep/60">No orders match.</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-sand">
                <tr className="text-left text-brand-deep/70">
                  <th className="px-4 py-3">Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Placed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id} className="border-t border-brand-deep/5">
                    <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                    <td>
                      <div className="font-medium">{o.name}</div>
                      <div className="text-xs text-brand-deep/55">{o.phone}</div>
                    </td>
                    <td>{o.lines?.length || 0}</td>
                    <td className="font-semibold">{formatBDT(o.total)}</td>
                    <td className="capitalize text-xs">{o.method}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="text-xs rounded-full px-2 py-1 border border-brand-deep/15 capitalize bg-white"
                      >
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-xs text-brand-deep/60">
                      {new Date(o.createdAt).toLocaleString("en-BD")}
                    </td>
                    <td>
                      <button
                        onClick={() => setOpen(open?.id === o.id ? null : o)}
                        className="text-xs text-brand-teal hover:underline"
                      >
                        {open?.id === o.id ? "Hide" : "Details"}
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
          <h3 className="font-display text-xl text-brand-deep mb-3">
            Order {open.id}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">Delivery</div>
              <div className="text-brand-deep/75">{open.address}, {open.zone}, {open.city}</div>
              {open.notes && <div className="text-brand-deep/55 text-xs mt-1">{open.notes}</div>}
            </div>
            <div>
              <div className="font-semibold mb-1">Payment</div>
              <div className="text-brand-deep/75 capitalize">{open.method}</div>
              {open.txnId && <div className="text-xs text-brand-deep/55">Txn: {open.txnId}</div>}
            </div>
          </div>
          <div className="mt-4 border-t border-brand-deep/10 pt-3 space-y-1 text-sm">
            {open.lines?.map((l, i) => (
              <div key={i} className="flex justify-between">
                <span>{l.name} <span className="text-brand-deep/55">× {l.qty} ({l.weightLabel})</span></span>
                <span>{formatBDT(l.unitPrice * l.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-semibold border-t border-brand-deep/10">
              <span>Total</span><span>{formatBDT(open.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
