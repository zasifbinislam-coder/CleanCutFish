"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { formatBDT } from "@/context/CartContext";

export default function AdminProductsPage() {
  const supabase = getSupabaseBrowser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    const { data, error } = await supabase.from("products").select("*").order("name");
    if (error) setError(error.message);
    setProducts(data || []);
    setLoading(false);
  }
  useEffect(() => { if (supabase) load(); }, [supabase]);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.region?.toLowerCase().includes(query.toLowerCase())
  );

  async function saveProduct(p) {
    const row = {
      id: p.id,
      name: p.name,
      name_bn: p.name_bn,
      category: p.category,
      category_label: p.category_label,
      region: p.region,
      river: p.river,
      price_per_kg: Number(p.price_per_kg),
      weights: typeof p.weights === "string" ? JSON.parse(p.weights) : p.weights,
      image: p.image,
      gallery: p.gallery || [],
      tags: p.tags || [],
      short_description: p.short_description,
      description: p.description,
      stock: Number(p.stock || 0),
      ready_to_cook: !!p.ready_to_cook,
    };
    const { error } = await supabase.from("products").upsert(row);
    if (error) { alert("Save failed: " + error.message); return; }
    setEditing(null); setAdding(false);
    load();
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { alert("Delete failed: " + error.message); return; }
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl text-brand-deep">
          Products <span className="text-base text-brand-deep/55">({products.length})</span>
        </h1>
        <div className="flex gap-2">
          <input
            className="input"
            placeholder="Search by name or region..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setAdding(true)} className="btn-primary whitespace-nowrap">
            + Add product
          </button>
        </div>
      </div>

      {error && (
        <div className="card p-3 bg-rose-50 border-rose-200 text-rose-700 text-sm">{error}</div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-brand-deep/60">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-brand-deep/60">No products match.</div>
        ) : (
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
                        {p.image && (
                          <Image src={p.image} alt="" fill sizes="48px" className="object-cover" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-brand-deep/55">{p.name_bn}</div>
                    </td>
                    <td className="text-xs">{p.region}</td>
                    <td className="font-semibold">{formatBDT(Number(p.price_per_kg))}</td>
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
        )}
      </div>

      {(editing || adding) && (
        <ProductFormModal
          initial={editing}
          isNew={adding}
          onCancel={() => { setEditing(null); setAdding(false); }}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}

function ProductFormModal({ initial, isNew, onCancel, onSave }) {
  const blank = {
    id: "", name: "", name_bn: "", category: "large-river",
    category_label: "Large River Fish", region: "", river: "",
    price_per_kg: 500, stock: 10, image: "",
    short_description: "", description: "", ready_to_cook: true,
    weights: [
      { label: "500 g", kg: 0.5, multiplier: 0.5 },
      { label: "1 kg", kg: 1, multiplier: 1 },
    ],
    gallery: [], tags: [],
  };
  const [draft, setDraft] = useState(initial || blank);

  const categories = [
    ["small", "Small Fish"],
    ["large-river", "Large River Fish"],
    ["sea", "Sea Fish"],
    ["shrimp", "Shrimp"],
    ["shutki", "Dry Fish (Shutki)"],
  ];

  return (
    <div className="fixed inset-0 bg-brand-deep/50 z-50 grid place-items-center p-4">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(draft); }}
        className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[92vh] overflow-y-auto"
      >
        <h3 className="font-display text-2xl text-brand-deep mb-4">
          {isNew ? "Add new product" : `Edit · ${initial?.name}`}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="ID (slug)" disabled={!isNew} required value={draft.id} onChange={(v) => setDraft({ ...draft, id: v })} placeholder="e.g. nodir-katol" />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">Category</label>
            <select className="input" value={draft.category} onChange={(e) => {
              const cat = e.target.value;
              const label = categories.find(([c]) => c === cat)?.[1] || "";
              setDraft({ ...draft, category: cat, category_label: label });
            }}>
              {categories.map(([c, l]) => <option key={c} value={c}>{l}</option>)}
            </select>
          </div>
          <Field label="Name (English)" required value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <Field label="Name (Bangla)" value={draft.name_bn || ""} onChange={(v) => setDraft({ ...draft, name_bn: v })} />
          <Field label="Region" value={draft.region || ""} onChange={(v) => setDraft({ ...draft, region: v })} />
          <Field label="River / Source" value={draft.river || ""} onChange={(v) => setDraft({ ...draft, river: v })} />
          <Field label="Price per kg (৳)" type="number" required value={draft.price_per_kg} onChange={(v) => setDraft({ ...draft, price_per_kg: v })} />
          <Field label="Stock" type="number" value={draft.stock} onChange={(v) => setDraft({ ...draft, stock: v })} />
          <div className="sm:col-span-2">
            <Field label="Image path or URL" value={draft.image || ""} onChange={(v) => setDraft({ ...draft, image: v })} placeholder="/photofish/your-fish.jpg" />
          </div>
          <div className="sm:col-span-2">
            <Field label="Short description" value={draft.short_description || ""} onChange={(v) => setDraft({ ...draft, short_description: v })} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">Full description</label>
            <textarea
              rows={4} className="input"
              value={draft.description || ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={!!draft.ready_to_cook}
                   onChange={(e) => setDraft({ ...draft, ready_to_cook: e.target.checked })}
                   className="accent-brand-teal" />
            Ready to cook (shows the badge)
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          <button type="submit" className="btn-primary flex-1">
            {isNew ? "Create product" : "Save changes"}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        {...rest}
      />
    </div>
  );
}
