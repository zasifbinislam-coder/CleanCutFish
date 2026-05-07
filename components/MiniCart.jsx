"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, formatBDT } from "@/context/CartContext";
import { IconClose, IconMinus, IconPlus } from "@/components/Icon";

export default function MiniCart() {
  const { miniOpen, closeMini, lines, subtotal, updateQty, removeItem } = useCart();

  return (
    <>
      <div
        onClick={closeMini}
        className={`fixed inset-0 bg-brand-deep/40 z-50 transition-opacity ${
          miniOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-brand-cream z-50 shadow-2xl
          flex flex-col transition-transform ${
            miniOpen ? "translate-x-0" : "translate-x-full"
          }`}
        aria-label="Mini cart"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-deep/10">
          <div>
            <div className="section-eyebrow">Your basket</div>
            <h3 className="font-display text-2xl">Catch of the day</h3>
          </div>
          <button onClick={closeMini} aria-label="Close cart"
            className="p-2 rounded-full hover:bg-brand-deep/5">
            <IconClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {lines.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🐟</div>
              <p className="text-brand-deep/70">Your basket is empty.</p>
              <Link href="/shop" onClick={closeMini} className="btn-primary mt-5">
                Browse the catch
              </Link>
            </div>
          )}

          {lines.map((l) => (
            <div key={l.key} className="flex gap-3 card p-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-sand shrink-0">
                {l.image && (
                  <Image src={l.image} alt={l.name} fill className="object-cover" sizes="80px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-brand-deep truncate">{l.name}</div>
                <div className="text-xs text-brand-deep/60">{l.weightLabel} · {l.region}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="inline-flex items-center border border-brand-deep/15 rounded-full">
                    <button onClick={() => updateQty(l.key, l.qty - 1)} className="p-1.5"><IconMinus width={14} height={14}/></button>
                    <span className="w-8 text-center text-sm">{l.qty}</span>
                    <button onClick={() => updateQty(l.key, l.qty + 1)} className="p-1.5"><IconPlus width={14} height={14}/></button>
                  </div>
                  <div className="font-semibold text-brand-deep">{formatBDT(l.unitPrice * l.qty)}</div>
                </div>
              </div>
              <button onClick={() => removeItem(l.key)} className="text-brand-deep/40 hover:text-accent-coral self-start">
                <IconClose width={16} height={16}/>
              </button>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-brand-deep/10 px-5 py-4 bg-white">
            <div className="flex justify-between text-sm text-brand-deep/70">
              <span>Subtotal</span>
              <span>{formatBDT(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-brand-deep/60 mt-1">
              <span>Delivery</span>
              <span>{subtotal >= 1500 ? "Free in Dhaka" : "Calculated at checkout"}</span>
            </div>
            <Link href="/checkout" onClick={closeMini} className="btn-primary w-full mt-4">
              Checkout · {formatBDT(subtotal)}
            </Link>
            <Link href="/cart" onClick={closeMini} className="btn-ghost w-full mt-2">
              View full basket
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
