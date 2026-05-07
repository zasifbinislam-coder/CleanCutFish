"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, formatBDT } from "@/context/CartContext";
import { IconClose, IconMinus, IconPlus } from "@/components/Icon";

export default function CartPage() {
  const { lines, subtotal, updateQty, removeItem, clear } = useCart();
  const delivery = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 80;
  const total = subtotal + delivery;

  return (
    <div className="container-page py-12">
      <h1 className="section-title mb-6">Your basket</h1>

      {lines.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-3">🐟</div>
          <p className="text-brand-deep/70 mb-6">Your basket is empty.</p>
          <Link href="/shop" className="btn-primary">Browse the catch</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-3">
            {lines.map((l) => (
              <div key={l.key} className="card p-4 flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-brand-sand shrink-0">
                  <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg text-brand-deep">{l.name}</div>
                  <div className="text-xs text-brand-deep/60">{l.weightLabel} · {l.region}</div>
                  <div className="text-sm text-brand-deep/70 mt-1">
                    {formatBDT(l.unitPrice)} per pouch
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(l.key)} className="text-brand-deep/40 hover:text-accent-coral">
                    <IconClose width={18} height={18} />
                  </button>
                  <div className="inline-flex items-center border border-brand-deep/15 rounded-full">
                    <button onClick={() => updateQty(l.key, l.qty - 1)} className="p-1.5"><IconMinus width={14} height={14} /></button>
                    <span className="w-8 text-center text-sm">{l.qty}</span>
                    <button onClick={() => updateQty(l.key, l.qty + 1)} className="p-1.5"><IconPlus width={14} height={14} /></button>
                  </div>
                  <div className="font-semibold text-brand-deep">{formatBDT(l.unitPrice * l.qty)}</div>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-brand-deep/55 hover:text-accent-coral">
              Clear basket
            </button>
          </div>

          <aside className="card p-6 h-fit lg:sticky lg:top-28">
            <h3 className="font-display text-2xl mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={formatBDT(subtotal)} />
              <Row label="Delivery" value={delivery === 0 ? "Free" : formatBDT(delivery)} hint={subtotal < 1500 ? `Add ${formatBDT(1500 - subtotal)} for free Dhaka delivery` : null} />
              <div className="border-t border-brand-deep/10 my-3" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatBDT(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full mt-5">
              Proceed to checkout
            </Link>
            <Link href="/shop" className="btn-ghost w-full mt-2">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, hint }) {
  return (
    <div>
      <div className="flex justify-between text-brand-deep/80">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      {hint && <div className="text-[11px] text-brand-teal mt-0.5">{hint}</div>}
    </div>
  );
}
