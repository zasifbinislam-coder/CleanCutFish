"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatBDT } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { applyCoupon } from "@/lib/coupons";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { placeOrder, user } = useAuth();
  const { t } = useLang();
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
        <h1 className="section-title">{t("checkout.orderConfirmed")}</h1>
        <p className="mt-3 text-brand-deep/75">
          {t("checkout.thankYou")} <b>{placed.name}</b>.{" "}
          <span className="mx-1 px-2 py-0.5 bg-brand-mint/15 text-brand-teal rounded font-mono text-sm">{placed.id}</span>{" "}
          {t("checkout.hasBeenPlaced")} <b>{formatBDT(placed.total)}</b>।
        </p>
        <p className="mt-2 text-sm text-brand-deep/60">
          {placed.method === "cod" ? t("checkout.codFollowup") : t("checkout.mfsFollowup")}
        </p>
        <Link href="/" className="btn-primary mt-8">{t("common.backToHome")}</Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-brand-deep/65 mb-5">{t("checkout.empty")}</p>
        <Link href="/shop" className="btn-primary">{t("cart.browse")}</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6 lg:py-10">
      <h1 className="section-title mb-1">{t("checkout.title")}</h1>
      <p className="text-sm text-brand-deep/60 mb-6 lg:mb-8">{t("checkout.sub")}</p>

      <form onSubmit={onPlaceOrder} className="grid lg:grid-cols-[1fr_400px] gap-10">
        <div className="space-y-7">
          <Section title={t("checkout.contact")}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field name="name" label={t("checkout.fullName")} required defaultValue={user?.name || ""} />
              <Field name="phone" label={t("checkout.phone")} required placeholder="01XXXXXXXXX" defaultValue={user?.phone || ""} />
              <div className="sm:col-span-2">
                <Field name="email" type="email" label={t("checkout.email")} defaultValue={user?.email || ""} />
              </div>
            </div>
          </Section>

          <Section title={t("checkout.address")}>
            <SavedAddresses />
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Field name="address" label={t("checkout.addressLine")} required defaultValue={defaultAddr?.address || ""} />
              </div>
              <Field name="city" label={t("checkout.city")} required defaultValue={defaultAddr?.city || "Dhaka"} />
              <Field name="zone" label={t("checkout.zone")} required defaultValue={defaultAddr?.zone || ""} />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">{t("checkout.instructions")}</label>
                <textarea name="notes" rows={2} className="input" placeholder={t("checkout.instructionsPh")} />
              </div>
            </div>
          </Section>

          <Section title={t("checkout.payment")}>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: "cod",   title: t("checkout.cod"),   sub: t("checkout.codSub")   },
                { id: "bkash", title: t("checkout.bkash"), sub: t("checkout.bkashSub") },
                { id: "nagad", title: t("checkout.nagad"), sub: t("checkout.nagadSub") },
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
                {t("checkout.mobileHelp").replace("%s", method === "bkash" ? t("checkout.bkash") : t("checkout.nagad"))}
                <b className="mx-1">01700-000000</b>।
                <input name="txnId" className="input mt-2" placeholder={t("checkout.txnId")} />
              </div>
            )}
          </Section>
        </div>

        <aside className="card p-6 h-fit lg:sticky lg:top-28">
          <h3 className="font-display text-2xl mb-4">{t("checkout.yourOrder")}</h3>
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
            <div className="flex justify-between text-brand-deep/80"><span>{t("common.subtotal")}</span><span>{formatBDT(subtotal)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-teal">
                <span>{t("common.discount")} ({coupon.coupon.code})</span><span>−{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-deep/80"><span>{t("common.delivery")}</span><span>{delivery === 0 ? t("common.free") : formatBDT(delivery)}</span></div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-brand-deep/10">
              <span>{t("common.total")}</span><span>{formatBDT(total)}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-deep/10">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal mb-2">{t("checkout.promoCode")}</div>
            {coupon ? (
              <div className="flex items-center justify-between bg-brand-mint/10 rounded-xl px-3 py-2">
                <div>
                  <div className="font-mono text-sm font-semibold text-brand-teal">{coupon.coupon.code}</div>
                  <div className="text-[11px] text-brand-deep/65">{coupon.coupon.description}</div>
                </div>
                <button type="button" onClick={removeCoupon} className="text-xs text-brand-deep/55 hover:text-accent-coral">
                  {t("common.remove")}
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="input flex-1 uppercase"
                    placeholder="FRESH10"
                  />
                  <button type="button" onClick={tryApplyCoupon} className="btn-ghost py-2 px-4 text-sm">
                    {t("common.apply")}
                  </button>
                </div>
                {couponError && <div className="text-[11px] text-rose-600 mt-1">{couponError}</div>}
                <div className="text-[11px] text-brand-deep/55 mt-1">{t("checkout.promoTry")}</div>
              </>
            )}
          </div>
          <button type="submit" className="btn-primary w-full mt-5">
            {t("checkout.placeOrder")} · {formatBDT(total)}
          </button>
          <p className="text-[11px] text-brand-deep/55 mt-3 text-center">
            {t("checkout.agreement")}
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
