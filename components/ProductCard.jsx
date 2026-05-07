"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, formatBDT } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { IconStar, IconPin, IconHeart } from "@/components/Icon";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const defaultWeight = product.weights[0];
  const inStock = (product.stock ?? 0) > 0;
  const wished = has(product.id);

  function quickAdd(e) {
    e.preventDefault();
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      region: product.region,
      weightLabel: defaultWeight.label,
      kg: defaultWeight.kg,
      unitPrice: product.pricePerKg * defaultWeight.multiplier,
      qty: 1,
    });
  }

  function toggleWish(e) {
    e.preventDefault();
    toggle(product.id);
  }

  return (
    <Link
      href={`/shop/${product.id}`}
      className="card overflow-hidden group flex flex-col hover:shadow-soft transition"
    >
      <div className="relative aspect-[4/3] bg-brand-sand">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.tags?.includes("bestseller") && (
          <span className="absolute top-3 left-3 pill bg-accent-coral/90 text-white">Bestseller</span>
        )}
        {!inStock && (
          <span className="absolute top-3 left-3 pill bg-brand-deep/90 text-white">Out of stock</span>
        )}
        {product.readyToCook && inStock && (
          <span className="absolute top-3 right-3 pill bg-white/90 text-brand-teal">
            ✓ Ready to Cook
          </span>
        )}
        <button
          onClick={toggleWish}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute bottom-3 right-3 grid place-items-center w-9 h-9 rounded-full backdrop-blur transition ${
            wished
              ? "bg-accent-coral text-white"
              : "bg-white/90 text-brand-deep hover:bg-white hover:text-accent-coral"
          }`}
        >
          <IconHeart filled={wished} width={18} height={18} />
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-xs text-brand-deep/60">
          <IconPin width={13} height={13} />
          <span>{product.region}</span>
          <span className="mx-1">·</span>
          <IconStar width={13} height={13} className="text-accent-gold" />
          <span>{product.rating}</span>
          <span className="text-brand-deep/40">({product.reviews})</span>
        </div>
        <h3 className="mt-1 font-display text-lg leading-tight text-brand-deep">
          {product.name}
        </h3>
        <p className="text-xs text-brand-deep/55">{product.nameBn}</p>
        <p className="mt-2 text-xs text-brand-deep/70 line-clamp-2 flex-1">
          {product.shortDescription}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-semibold text-brand-deep">
              {formatBDT(product.pricePerKg)}<span className="text-xs text-brand-deep/55">/kg</span>
            </div>
            <div className="text-[11px] text-brand-deep/55">
              from {formatBDT(product.pricePerKg * defaultWeight.multiplier)}
            </div>
          </div>
          <button
            onClick={quickAdd}
            disabled={!inStock}
            className={`btn-primary text-sm py-1.5 px-3 ${!inStock ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {inStock ? "+ Add" : "Sold out"}
          </button>
        </div>
      </div>
    </Link>
  );
}
