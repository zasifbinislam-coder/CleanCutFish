"use client";

import Image from "next/image";
import { useCart, formatBDT } from "@/context/CartContext";
import { IconStar } from "@/components/Icon";

export default function CombosClient({ combos }) {
  const { addItem, openMini } = useCart();

  function addCombo(c) {
    c.items.forEach((it) => {
      const p = it.product;
      const w = p.weights.find((x) => x.label === it.weight) || p.weights[0];
      addItem({
        productId: p.id,
        name: `${p.name} (${c.name})`,
        image: p.image,
        region: p.region,
        weightLabel: w.label,
        kg: w.kg,
        unitPrice: p.pricePerKg * w.multiplier,
        qty: 1,
      });
    });
    openMini();
  }

  return (
    <div className="container-page py-12">
      <div className="text-center mb-12">
        <span className="section-eyebrow">Save up to 15%</span>
        <h1 className="section-title mt-1">Family Combo Packs</h1>
        <p className="text-sm text-brand-deep/65 mt-2 max-w-xl mx-auto">
          Hand-picked combinations that mix everyday favourites with premium catch.
          Curated for real Bangladeshi families — and bachelors who want to skip the stress.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((c) => {
          const savings = Math.round(((c.originalPrice - c.comboPrice) / c.originalPrice) * 100);
          return (
            <div key={c.id} className="card overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3]">
                <Image src={c.image} alt={c.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                <span className="absolute top-3 left-3 pill bg-accent-coral text-white">
                  Save {savings}%
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display text-2xl text-brand-deep">{c.name}</h3>
                <p className="text-xs text-brand-deep/55">{c.nameBn}</p>
                <p className="text-sm text-brand-deep/75 mt-2">{c.tagline}</p>

                <ul className="mt-4 space-y-1.5 text-sm text-brand-deep/85">
                  {c.items.map((it, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-brand-teal">✓</span>
                      <span>{it.product?.name}</span>
                      <span className="text-brand-deep/55">· {it.weight}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-brand-deep/60 mt-3">{c.serves}</div>

                <div className="mt-auto pt-5 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-brand-deep/55 line-through">
                      {formatBDT(c.originalPrice)}
                    </div>
                    <div className="text-2xl font-semibold text-brand-deep">
                      {formatBDT(c.comboPrice)}
                    </div>
                  </div>
                  <button onClick={() => addCombo(c)} className="btn-primary">
                    Add combo
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
