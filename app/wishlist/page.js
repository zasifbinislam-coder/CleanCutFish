"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { getAllProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { ids, clear } = useWishlist();
  const all = getAllProducts();
  const items = ids.map((id) => all.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="container-page py-12">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
        <div>
          <span className="section-eyebrow">Saved for later</span>
          <h1 className="section-title mt-1">Your wishlist</h1>
          <p className="text-sm text-brand-deep/60 mt-1">
            {items.length} {items.length === 1 ? "fish" : "fish"} you've saved.
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clear} className="text-sm text-brand-deep/55 hover:text-accent-coral">
            Clear wishlist
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-3">💚</div>
          <h2 className="font-display text-2xl text-brand-deep">Nothing saved yet</h2>
          <p className="text-sm text-brand-deep/65 mt-2 mb-5">
            Tap the heart on any product to save it for later.
          </p>
          <Link href="/shop" className="btn-primary">Browse the catch</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
