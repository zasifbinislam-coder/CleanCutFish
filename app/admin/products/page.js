"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getAllProducts } from "@/lib/products";
import { formatBDT } from "@/context/CartContext";

export default function AdminProductsPage() {
  const initial = getAllProducts();
  const [products, setProducts] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.region.toLowerCase().includes(query.toLowerCase())
  );

  function saveEdit(updated) {
    setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)));
    setEditing(null);
  }

  function deleteProduct(id) {
    if (!confirm("Delete this product? (session-only — won't persist past page reload)")) return;
    setProducts((list) => list.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-brand-deep">Products</h1>
        <input
          className="input max-w-xs"
          placeholder="Search by name or region..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2">
        💡 Edits in this prototype are session-only — they show how an admin CRUD would feel,
        but a real backend (Sanity / Strapi / Express + DB) is needed to persist changes.
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-sand">
              <tr className="text-left text-brand-deep/70">
                <th className="px-4 py-3">Photo</th>
                <th>Product</th>
                <th>Region</th>
                <th>Price/kg</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-brand-deep/5">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-sand">
                      <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                  </td>
                  <td>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-brand-deep/55">{p.nameBn}</div>
                  </td>
                  <td className="text-xs">{p.region}</td>
                  <td className="font-semibold">{formatBDT(p.pricePerKg)}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.stock > 0
                      ? <span className="pill bg-emerald-100 text-emerald-700">In stock</span>
                      : <span className="pill bg-rose-100 text-rose-700">Out</span>}
                  </td>
                  <td className="space-x-2 whitespace-nowrap">
                    <Link href={`/shop/${p.id}`} target="_blank" className="text-xs text-brand-teal hover:underline">View</Link>
                    <button onClick={() => setEditing(p)} className="text-xs text-brand-teal hover:underline">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="text-xs text-rose-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditModal product={editing} onClose={() => setEditing(null)} onSave={saveEdit} />
      )}
    </div>
  );
}

function EditModal({ product, onClose, onSave }) {
  const [draft, setDraft] = useState({ ...product });

  return (
    <div className="fixed inset-0 bg-brand-deep/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="font-display text-2xl mb-4">Edit · {product.name}</h3>
        <div className="space-y-3">
          <Field label="Name (English)" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Field label="Name (Bangla)" value={draft.nameBn} onChange={(v) => setDraft({ ...draft, nameBn: v })} />
          <Field label="Region" value={draft.region} onChange={(v) => setDraft({ ...draft, region: v })} />
          <Field label="River" value={draft.river} onChange={(v) => setDraft({ ...draft, river: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price per kg (৳)" type="number" value={draft.pricePerKg} onChange={(v) => setDraft({ ...draft, pricePerKg: +v })} />
            <Field label="Stock" type="number" value={draft.stock} onChange={(v) => setDraft({ ...draft, stock: +v })} />
          </div>
          <Field label="Image path" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">Description</label>
            <textarea
              rows={4}
              className="input"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={() => onSave(draft)} className="btn-primary flex-1">Save changes</button>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">{label}</label>
      <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="input" />
    </div>
  );
}
