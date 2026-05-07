"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AddressBookPage() {
  const { user, hydrated, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login?next=/account/addresses");
  }, [hydrated, user, router]);

  if (!user) return <div className="container-page py-16">Loading…</div>;

  const addresses = user.addresses || [];

  async function handleSave(form) {
    if (editing) await updateAddress(editing.id, form);
    else await addAddress(form);
    setEditing(null);
    setAdding(false);
  }

  return (
    <div className="container-page py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <Link href="/account" className="text-xs text-brand-teal hover:underline">← Back to account</Link>
          <h1 className="section-title mt-1">Address book</h1>
          <p className="text-sm text-brand-deep/60 mt-1">
            Save addresses for faster checkout next time.
          </p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary">+ Add address</button>
      </div>

      {addresses.length === 0 && !adding ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-3">📍</div>
          <p className="text-brand-deep/70 mb-5">No saved addresses yet.</p>
          <button onClick={() => setAdding(true)} className="btn-primary">Add your first</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-lg text-brand-deep">{a.label || "Address"}</div>
                {a.isDefault && <span className="pill bg-brand-mint/15 text-brand-teal">Default</span>}
              </div>
              <div className="text-sm text-brand-deep/80">{a.address}</div>
              <div className="text-xs text-brand-deep/60 mt-1">
                {a.zone}, {a.city}
              </div>
              <div className="text-xs text-brand-deep/60">{a.phone}</div>
              <div className="mt-4 flex gap-3 text-xs">
                <button onClick={() => setEditing(a)} className="text-brand-teal hover:underline">Edit</button>
                {!a.isDefault && (
                  <button onClick={() => setDefaultAddress(a.id)} className="text-brand-teal hover:underline">
                    Make default
                  </button>
                )}
                <button onClick={() => removeAddress(a.id)} className="text-rose-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(adding || editing) && (
        <AddressForm
          initial={editing}
          onCancel={() => { setAdding(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function AddressForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial || { label: "Home", address: "", city: "Dhaka", zone: "", phone: "" });
  return (
    <div className="fixed inset-0 bg-brand-deep/50 z-50 grid place-items-center p-4">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3"
      >
        <h3 className="font-display text-2xl text-brand-deep">
          {initial ? "Edit address" : "Add address"}
        </h3>
        <Field label="Label" placeholder="Home / Office" value={form.label} onChange={(v) => setForm({ ...form, label: v })} />
        <Field label="House / Road / Area" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Thana / Zone" value={form.zone} onChange={(v) => setForm({ ...form, zone: v })} required />
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
        </div>
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="01XXXXXXXXX" />
        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn-primary flex-1">Save</button>
          <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} className="input" {...rest} />
    </div>
  );
}
