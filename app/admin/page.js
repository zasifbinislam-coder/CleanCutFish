"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { formatBDT } from "@/context/CartContext";
import { getAllProducts } from "@/lib/products";
import { RevenueLine, StatusDonut, TopProducts } from "@/components/AdminCharts";

export default function AdminDashboard() {
  const { orders, users } = useAuth();
  const products = getAllProducts();

  const customers = users.filter((u) => u.role !== "admin");
  const revenue   = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending   = orders.filter((o) => o.status === "received").length;
  const recent    = orders.slice(0, 5);

  const stats = [
    { label: "Total revenue",  value: formatBDT(revenue),       sub: `${orders.length} orders`, color: "from-brand-teal to-brand-deep" },
    { label: "Pending orders", value: pending.toString(),       sub: "awaiting confirmation",   color: "from-accent-coral to-accent-deep" },
    { label: "Customers",      value: customers.length.toString(), sub: "registered",           color: "from-brand-mint to-brand-teal" },
    { label: "Products live",  value: products.length.toString(), sub: "in catalog",            color: "from-accent-gold to-accent-coral" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${s.color} shadow-soft`}>
            <div className="text-xs uppercase tracking-wider opacity-80">{s.label}</div>
            <div className="font-display text-3xl mt-1">{s.value}</div>
            <div className="text-xs opacity-80 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <RevenueLine orders={orders} days={30} />

      <div className="grid lg:grid-cols-2 gap-4">
        <StatusDonut orders={orders} />
        <TopProducts orders={orders} />
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-brand-deep">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand-teal hover:underline">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-10 text-brand-deep/60">
            No orders yet. Place a test order through the checkout to see it here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-deep/60 border-b border-brand-deep/10">
                  <th className="py-2">Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-b border-brand-deep/5">
                    <td className="py-2.5 font-mono text-xs">{o.id}</td>
                    <td>{o.name}</td>
                    <td>{o.lines?.length || 0}</td>
                    <td className="font-semibold">{formatBDT(o.total)}</td>
                    <td><span className="pill bg-brand-mint/15 text-brand-teal">{o.status}</span></td>
                    <td className="text-xs text-brand-deep/60">
                      {new Date(o.createdAt).toLocaleDateString("en-BD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/products" className="card p-5 hover:shadow-soft transition">
          <h3 className="font-display text-xl text-brand-deep">Manage products</h3>
          <p className="text-sm text-brand-deep/65 mt-1">Edit prices, stock, sourcing details, photos.</p>
        </Link>
        <Link href="/admin/customers" className="card p-5 hover:shadow-soft transition">
          <h3 className="font-display text-xl text-brand-deep">Manage customers</h3>
          <p className="text-sm text-brand-deep/65 mt-1">Browse signups, view their order history.</p>
        </Link>
      </div>
    </div>
  );
}
