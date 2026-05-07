"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

function ShopInner({ products, categories, regions }) {
  const sp = useSearchParams();
  const initialCat = sp.get("cat") || "all";
  const initialQ = sp.get("q") || "";

  const [cat, setCat] = useState(initialCat);
  const [region, setRegion] = useState("all");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState("popular");
  const [readyOnly, setReadyOnly] = useState(false);
  const [query, setQuery] = useState(initialQ);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (region !== "all") list = list.filter((p) => p.region === region);
    if (readyOnly) list = list.filter((p) => p.readyToCook);
    list = list.filter((p) => p.pricePerKg <= maxPrice);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameBn?.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q)
      );
    }
    if (sort === "low") list.sort((a, b) => a.pricePerKg - b.pricePerKg);
    else if (sort === "high") list.sort((a, b) => b.pricePerKg - a.pricePerKg);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    return list;
  }, [products, cat, region, maxPrice, sort, readyOnly, query]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <span className="section-eyebrow">Today's catch</span>
        <h1 className="section-title mt-1">
          {initialQ ? <>Results for &ldquo;{initialQ}&rdquo;</> : "Shop fresh fish"}
        </h1>
        <p className="text-sm text-brand-deep/65 mt-1">
          {initialQ
            ? "Adjust your search or filters below."
            : "Filter by river, region, type and price. Every fish vacuum-sealed within 4 hours."}
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="card p-5 h-fit lg:sticky lg:top-28 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-2">Search</label>
            <input
              className="input"
              placeholder="Ilish, Ayre, Tengra..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <FilterGroup label="Category">
            <FilterRadio name="cat" label="All fish" value="all" checked={cat === "all"} onChange={setCat} />
            {categories.map((c) => (
              <FilterRadio key={c.id} name="cat" label={c.name} value={c.id} checked={cat === c.id} onChange={setCat} />
            ))}
          </FilterGroup>

          <FilterGroup label="Sourcing region">
            <FilterRadio name="region" label="All regions" value="all" checked={region === "all"} onChange={setRegion} />
            {regions.map((r) => (
              <FilterRadio key={r} name="region" label={r} value={r} checked={region === r} onChange={setRegion} />
            ))}
          </FilterGroup>

          <FilterGroup label={`Max price · ৳${maxPrice}/kg`}>
            <input
              type="range"
              min={300}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(+e.target.value)}
              className="w-full accent-brand-teal"
            />
          </FilterGroup>

          <label className="flex items-center gap-2 text-sm text-brand-deep/85">
            <input
              type="checkbox"
              checked={readyOnly}
              onChange={(e) => setReadyOnly(e.target.checked)}
              className="accent-brand-teal w-4 h-4"
            />
            Ready-to-cook only
          </label>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="text-sm text-brand-deep/65">
              <b className="text-brand-deep">{filtered.length}</b> products
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input w-auto"
            >
              <option value="popular">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="low">Price · low to high</option>
              <option value="high">Price · high to low</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="card p-12 text-center text-brand-deep/60">
              No fish match those filters. Try widening the price or region.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-brand-teal mb-2">{label}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterRadio({ name, label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-brand-deep/85 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="accent-brand-teal"
      />
      {label}
    </label>
  );
}

export default function ShopClient(props) {
  return (
    <Suspense fallback={<div className="container-page py-10">Loading…</div>}>
      <ShopInner {...props} />
    </Suspense>
  );
}
