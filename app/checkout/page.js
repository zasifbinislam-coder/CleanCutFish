"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatBDT } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { applyCoupon } from "@/lib/coupons";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { placeOrder, user } = useAuth();
  const [method, setMethod] = useState("cod");
  const [placed, setPlaced] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const discount = coupon?.discount || 0;
  const delivery = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 80;
  const total = Math.max(0, subtotal - discount + delivery);
  const addresses = user?.addresses || [];
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  function tryApplyCoupon() {
    setCouponError("");
    const res = applyCoupon(couponInput, subtotal);
    if (!res.ok) { setCoupon(null); setCouponError(res.error); return; }
    setCoupon(res);
  }
  function removeCoupon() { setCoupon(null); setCouponInput(""); setCouponError(""); }

  async function onPlaceOrder(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    let record;
    try {
      record = await placeOrder({
      name: f.get("name"),
      phone: f.get("phone"),
      email: f.get("email") || user?.email || "",
      address: f.get("address"),
      city: f.get("city"),
      zone: f.get("zone"),
      notes: f.get("notes"),
      txnId: f.get("txnId") || "",
      method,
      lines,
      subtotal,
      discount,
      couponCode: coupon?.coupon.code || null,
      delivery,
      total,
    });
    } catch (err) {
      alert("Could not place order: " + (err?.message || "unknown error"));
      return;
    }
    setPlaced({ id: record.id, name: record.name, method, total });
    clear();
  }

  if (placed) {
    return (
      <div className="container-page py-20 max-w-xl text-center">
        <div className="text-6xl mb-4">🐟</div>
        <h1 className="section-title">Order confirmed!</h1>
        <p className="mt-3 text-brand-deep/75">
          Thank you, <b>{placed.name}</b>. Your order
          <span className="mx-1 px-2 py-0.5 bg-brand-mint/15 text-brand-teal rounded font-mono text-sm">{placed.id}</span>
          has been placed for <b>{formatBDT(placed.total)}</b>.
        </p>
        <p className="mt-2 text-sm text-brand-deep/60">
          {placed.method === "cod"
            ? "We'll call to confirm. Pay cash to the rider on delivery."
            : `Please complete payment to our ${placed.method === "bkash" ? "bKash" : "Nagad"} merchant number — we'll send a payment SMS shortly.`}
        </p>
        <Link href="/" className="btn-primary mt-8">Back to home</Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-brand-deep/65 mb-5">Your basket is empty — nothing to checkout.</p>
        <Link href="/shop" className="btn-primary">Browse the catch</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="section-title mb-1">Checkout</h1>
      <p className="text-sm text-brand-deep/60 mb-8">One-page, fast — your fish is waiting.</p>

      <form onSubmit={onPlaceOrder} className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-7">
          <Section title="Contact">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field name="name" label="Full name" required defaultValue={user?.name || ""} />
              <Field name="phone" label="Phone (BD)" required placeholder="01XXXXXXXXX" defaultValue={user?.phone || ""} />
              <div className="sm:col-span-2">
                <Field name="email" type="email" label="Email (optional)" defaultValue={user?.email || ""} />
              </div>
            </div>
          </Section>

          <Section title="Delivery address">
            <SavedAddresses />
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Field name="address" label="House / Road / Area" required defaultValue={defaultAddr?.address || ""} />
              </div>
              <Field name="city" label="City" required defaultValue={defaultAddr?.city || "Dhaka"} />
              <Field name="zone" label="Thana / Zone" required defaultValue={defaultAddr?.zone || ""} />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">Delivery instructions</label>
                <textarea name="notes" rows={2} className="input" placeholder="Apartment, gate code, when to call..." />
              </div>
            </div>
          </Section>

          <Section title="Payment">
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: "cod",   title: "Cash on Delivery",   sub: "Pay cash to rider"     },
                { id: "bkash", title: "bKash",              sub: "Personal / Merchant"   },
                { id: "nagad", title: "Nagad",              sub: "Personal / Merchant"   },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`card p-4 cursor-pointer border-2 transition ${
                    method === m.id ? "border-brand-teal bg-brand-mint/5" : "border-transparent"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    className="sr-only"
                  />
                  <div className="font-semibold text-brand-deep">{m.title}</div>
                  <div className="text-xs text-brand-deep/60">{m.sub}</div>
                </label>
              ))}
            </div>
            {method !== "cod" && (
              <div className="mt-3 p-3 rounded-xl bg-brand-sand text-xs text-brand-deep/75">
                Send the total to our {method === "bkash" ? "bKash" : "Nagad"} number
                <b className="mx-1">01700-000000</b>
                and enter the transaction ID below.
                <input name="txnId" className="input mt-2" placeholder="Transaction ID" />
              </div>
            )}
          </Section>
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-28">
          <h3 className="font-display text-2xl mb-4">Your order</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {lines.map((l) => (
              <div key={l.key} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-sand shrink-0">
                  <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-brand-deep truncate">{l.name}</div>
                  <div className="text-xs text-brand-deep/55">{l.weightLabel} × {l.qty}</div>
                </div>
                <div className="text-sm font-semibold text-brand-deep">{formatBDT(l.unitPrice * l.qty)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-deep/10 mt-4 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-brand-deep/80"><span>Subtotal</span><span>{formatBDT(subtotal)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-teal">
                <span>Discount ({coupon.coupon.code})</span><span>−{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-deep/80"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatBDT(delivery)}</span></div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-brand-deep/10">
              <span>Total</span><span>{formatBDT(total)}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-deep/10">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal mb-2">Promo code</div>
            {coupon ? (
              <div className="flex items-center justify-between bg-brand-mint/10 rounded-xl px-3 py-2">
                <div>
                  <div className="font-mono text-sm font-semibold text-brand-teal">{coupon.coupon.code}</div>
                  <div className="text-[11px] text-brand-deep/65">{coupon.coupon.description}</div>
                </div>
                <button type="button" onClick={removeCoupon} className="text-xs text-brand-deep/55 hover:text-accent-coral">
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="input flex-1 uppercase"
                    placeholder="e.g. FRESH10"
                  />
                  <button type="button" onClick={tryApplyCoupon} className="btn-ghost py-2 px-4 text-sm">
                    Apply
                  </button>
                </div>
                {couponError && <div className="text-[11px] text-rose-600 mt-1">{couponError}</div>}
                <div className="text-[11px] text-brand-deep/55 mt-1">Try: FRESH10, NEWUSER15, FAMILY150</div>
              </>
            )}
          </div>
          <button type="submit" className="btn-primary w-full mt-5">
            Place order · {formatBDT(total)}
          </button>
          <p className="text-[11px] text-brand-deep/55 mt-3 text-center">
            By placing this order you agree to CleanCutFish freshness guarantee.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card p-5">
      <h3 className="font-display text-xl text-brand-deep mb-4">{title}</h3>
      {children}
    </div>
  );
}

function SavedAddresses() {
  // No-op visual hint when no saved addresses; populated automatically via defaultValue.
  return null;
}

function Field({ name, label, type = "text", ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">
        {label}
      </label>
      <input name={name} type={type} className="input" {...rest} />
    </div>
  );
}
