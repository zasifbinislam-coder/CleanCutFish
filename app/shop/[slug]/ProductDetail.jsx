"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, formatBDT } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/Reviews";
import {
  IconStar,
  IconPin,
  IconLeaf,
  IconScissors,
  IconSnowflake,
  IconTruck,
  IconMinus,
  IconPlus,
  IconHeart,
  IconClose,
  IconChevronRight,
} from "@/components/Icon";

export default function ProductDetail({ product, related }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const [weight, setWeight] = useState(product.weights[0]);
  const [qty, setQty] = useState(1);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImg = gallery[activeIdx];
  const [zoomed, setZoomed] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const inStock = (product.stock ?? 0) > 0;
  const wished = has(product.id);

  function nextImg() { setActiveIdx((i) => (i + 1) % gallery.length); }
  function prevImg() { setActiveIdx((i) => (i - 1 + gallery.length) % gallery.length); }

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, gallery.length]);

  const unitPrice = product.pricePerKg * weight.multiplier;

  function handleAdd() {
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      region: product.region,
      weightLabel: weight.label,
      kg: weight.kg,
      unitPrice,
      qty,
    });
  }

  return (
    <div className="container-page py-6 lg:py-12 pb-24 lg:pb-12">
      <nav className="text-xs text-brand-deep/55 mb-5 flex flex-wrap gap-x-2">
        <Link href="/" className="hover:text-brand-teal">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-teal">Shop</Link>
        <span>/</span>
        <Link href={`/shop?cat=${product.category}`} className="hover:text-brand-teal">{product.categoryLabel}</Link>
        <span>/</span>
        <span className="text-brand-deep/80 truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <div
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onClick={() => setLightbox(true)}
            className="relative aspect-square rounded-3xl overflow-hidden bg-brand-sand cursor-zoom-in"
          >
            <Image
              src={activeImg}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 600px"
              className={`object-cover transition-transform duration-500 ${zoomed ? "scale-125" : "scale-100"}`}
            />
            {product.tags?.includes("bestseller") && (
              <span className="absolute top-4 left-4 pill bg-accent-coral text-white">★ Bestseller</span>
            )}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImg(); }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-soft hover:bg-white"
                >
                  <IconChevronRight width={18} height={18} className="rotate-180" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImg(); }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-soft hover:bg-white"
                >
                  <IconChevronRight width={18} height={18} />
                </button>
              </>
            )}
            <span className="absolute bottom-3 right-3 pill bg-brand-deep/80 text-white">
              {activeIdx + 1} / {gallery.length} · click to expand
            </span>
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {gallery.map((g, i) => (
                <button
                  key={g + i}
                  onClick={() => setActiveIdx(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    activeIdx === i ? "border-brand-teal" : "border-transparent"
                  }`}
                >
                  <Image src={g} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-brand-deep/60">
            <IconPin width={13} height={13} />
            Sourced from <b className="text-brand-deep">{product.region}</b>
            <span>·</span>
            <span>{product.river}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl text-brand-deep leading-tight">{product.name}</h1>
          <p className="text-brand-deep/60">{product.nameBn}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex gap-0.5 text-accent-gold">
              {Array.from({ length: Math.round(product.rating) }).map((_, i) => (
                <IconStar key={i} width={16} height={16} />
              ))}
            </div>
            <span className="text-sm text-brand-deep/70">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>

          <p className="mt-5 text-brand-deep/80 leading-relaxed">{product.shortDescription}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="text-3xl font-semibold text-brand-deep">{formatBDT(unitPrice)}</div>
            <div className="text-sm text-brand-deep/60">
              ({formatBDT(product.pricePerKg)}/kg)
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal mb-2">Choose weight</div>
            <div className="flex flex-wrap gap-2">
              {product.weights.map((w) => (
                <button
                  key={w.label}
                  onClick={() => setWeight(w)}
                  className={`px-4 py-2 rounded-xl text-sm border transition ${
                    weight.label === w.label
                      ? "border-brand-teal bg-brand-mint/10 text-brand-deep font-semibold"
                      : "border-brand-deep/15 text-brand-deep/75 hover:border-brand-teal/50"
                  }`}
                >
                  {w.label}
                  <span className="block text-[11px] text-brand-deep/55">
                    {formatBDT(product.pricePerKg * w.multiplier)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="inline-flex items-center border border-brand-deep/15 rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2"><IconMinus /></button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2"><IconPlus /></button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className={`btn-primary flex-1 ${!inStock ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {inStock ? `Add to basket · ${formatBDT(unitPrice * qty)}` : "Sold out"}
            </button>
            <button
              onClick={() => toggle(product.id)}
              aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
              className={`grid place-items-center w-11 h-11 rounded-full border transition ${
                wished
                  ? "bg-accent-coral text-white border-accent-coral"
                  : "border-brand-deep/15 text-brand-deep hover:text-accent-coral hover:border-accent-coral"
              }`}
            >
              <IconHeart filled={wished} />
            </button>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2">
            {[
              [IconLeaf, "Chemical-free"],
              [IconScissors, "Cleaned & cut"],
              [IconSnowflake, "Vacuum sealed"],
              [IconTruck, "Cold delivery"],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-sm text-brand-deep/75">
                <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-mint/15 text-brand-teal">
                  <Icon width={16} height={16} />
                </span>
                {label}
              </div>
            ))}
          </div>

          <div className="mt-8 card p-5">
            <h3 className="font-display text-xl text-brand-deep mb-2">How we prepare it</h3>
            <p className="text-sm text-brand-deep/80 leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      <Reviews productId={product.id} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-6">You might also love</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}

      {/* Mobile sticky bottom CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-brand-deep/10 px-4 py-3 z-30 shadow-[0_-4px_24px_-8px_rgba(11,61,92,0.18)]">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-brand-deep/55 truncate">{weight.label} · {product.region}</div>
            <div className="font-display text-xl text-brand-deep">{formatBDT(unitPrice * qty)}</div>
          </div>
          <button
            onClick={() => toggle(product.id)}
            aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            className={`grid place-items-center w-11 h-11 rounded-full border transition shrink-0 ${
              wished
                ? "bg-accent-coral text-white border-accent-coral"
                : "border-brand-deep/15 text-brand-deep"
            }`}
          >
            <IconHeart filled={wished} width={20} height={20} />
          </button>
          <button
            onClick={handleAdd}
            disabled={!inStock}
            className={`btn-primary flex-1 ${!inStock ? "opacity-50" : ""}`}
          >
            {inStock ? "+ Add to basket" : "Sold out"}
          </button>
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          className="fixed inset-0 bg-brand-deep/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(false); }}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <IconClose />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImg(); }}
                className="absolute left-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Previous"
              >
                <IconChevronRight className="rotate-180" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImg(); }}
                className="absolute right-5 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Next"
              >
                <IconChevronRight />
              </button>
            </>
          )}
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl aspect-square">
            <Image src={activeImg} alt={product.name} fill className="object-contain" priority />
          </div>
          <div className="absolute bottom-5 text-white/70 text-xs">{activeIdx + 1} / {gallery.length} · ESC to close</div>
        </div>
      )}
    </div>
  );
}
