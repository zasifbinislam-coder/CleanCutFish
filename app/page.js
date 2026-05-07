import Image from "next/image";
import Link from "next/link";
import {
  getAllCategories,
  getAllTestimonials,
  getBestsellers,
  getReadyToCook,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import TrustBadges from "@/components/TrustBadges";
import { IconStar, IconChevronRight } from "@/components/Icon";

export default function HomePage() {
  const categories = getAllCategories();
  const ready = getReadyToCook().slice(0, 8);
  const best = getBestsellers();
  const testimonials = getAllTestimonials();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-page grid lg:grid-cols-2 gap-10 py-12 lg:py-20 items-center">
          <div>
            <span className="section-eyebrow">মাছে-ভাতে বাঙালি · River → Kitchen</span>
            <h1 className="mt-4 text-5xl sm:text-6xl text-brand-deep leading-[1.05]">
              The freshest fish in <span className="wave-underline">Bangladesh</span>.
              Already cleaned, cut, and ready.
            </h1>
            <p className="mt-5 text-brand-deep/75 max-w-lg">
              We source every morning from fishermen in Kishoreganj, Chandpur, the
              Sundarbans and the Haors. Our team cleans, cuts, and vacuum seals the
              catch within four hours — so dinner is one pouch away.
            </p>
            <div className="mt-7 flex gap-3">
              <Link href="/shop" className="btn-primary">Shop the catch</Link>
              <Link href="/combos" className="btn-ghost">View combo packs →</Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm text-brand-deep/70">
              <div className="flex items-center gap-1 text-accent-gold">
                <IconStar /><IconStar /><IconStar /><IconStar /><IconStar />
              </div>
              <span><b className="text-brand-deep">4.9/5</b> from 1,200+ Dhaka households</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-soft border border-white">
              <Image
                src="/photofish/meghna-nodir-rui-.jpg"
                alt="Fresh Rui from the Meghna river"
                fill
                priority
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/40 via-transparent to-transparent" />
            </div>
            <FloatingCard
              className="-left-4 top-12 hidden sm:block"
              icon="🌊"
              title="Padmar Ilish"
              sub="Caught 06:14 AM · Chandpur"
            />
            <FloatingCard
              className="-right-4 bottom-12 hidden sm:block"
              icon="✓"
              title="Vacuum sealed"
              sub="Within 4 hours of catch"
            />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="container-page pb-12">
        <TrustBadges />
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-12">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="section-eyebrow">Browse by type</span>
            <h2 className="section-title mt-1">Featured Categories</h2>
          </div>
          <Link href="/shop" className="hidden sm:inline text-sm text-brand-teal hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?cat=${c.id}`}
              className="group rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-soft border border-brand-deep/5 transition"
            >
              <div className="relative aspect-[4/5] bg-brand-sand">
                <Image src={c.image} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:1024px) 50vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <div className="text-xs opacity-80">{c.nameBn}</div>
                  <div className="font-display text-xl">{c.name}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{c.blurb}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* READY TO COOK */}
      <section className="container-page py-12">
        <div className="flex items-end justify-between mb-7">
          <div>
            <span className="section-eyebrow">No prep, no mess</span>
            <h2 className="section-title mt-1">Ready to Cook</h2>
            <p className="text-sm text-brand-deep/65 mt-1">
              Scaled, gutted, sliced into kitchen-ready pieces, vacuum sealed cold.
            </p>
          </div>
          <Link href="/shop" className="hidden sm:inline text-sm text-brand-teal hover:underline">
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {ready.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="bg-brand-deep text-brand-cream py-16 mt-12">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-eyebrow text-brand-mint">Our process</span>
            <h2 className="font-display text-4xl mt-2">From the river to your fridge — in under 12 hours.</h2>
            <ol className="mt-6 space-y-4 text-brand-cream/90">
              {[
                ["1", "Sourced before sunrise", "Local fishermen in Chandpur, Kishoreganj, Sunamganj and Khulna deliver the morning catch to our regional centers."],
                ["2", "Cleaned by hand", "Each fish is scaled, gutted, gilled and chill-rinsed in food-grade water. No shortcuts. No chemicals."],
                ["3", "Cut to your kitchen", "Sliced into the pieces real Bangladeshi cooking calls for — paturi cuts, kalia steaks, or whole."],
                ["4", "Vacuum sealed cold", "Pouched in food-grade vacuum bags, packed on ice, and sent on cold-chain to your door."],
              ].map(([n, t, s]) => (
                <li key={n} className="flex gap-4">
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-mint text-brand-deep font-bold shrink-0">{n}</span>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-brand-cream/75">{s}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
            <Image
              src="/photofish/River_Ayer_1kg.jpg"
              alt="Hand-cleaned river Ayre"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 600px"
            />
          </div>
        </div>
      </section>

      {/* COMBOS PROMO */}
      <section className="container-page py-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-teal to-brand-deep text-white p-8 lg:p-12 grid lg:grid-cols-2 gap-8 items-center overflow-hidden relative">
          <div>
            <span className="section-eyebrow text-brand-mint">Family Packages</span>
            <h2 className="font-display text-4xl mt-2 mb-4">A week of dinners, in one box.</h2>
            <p className="text-brand-cream/85 mb-6 max-w-md">
              Hand-picked fish combos that mix big-river favourites with small-fish
              classics — at up to <b className="text-accent-gold">15% off</b>.
            </p>
            <Link href="/combos" className="btn-accent">
              Browse combo packs <IconChevronRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {best.slice(0, 3).map((p) => (
              <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src={p.image} alt={p.name} fill sizes="200px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-page py-12">
        <div className="text-center mb-10">
          <span className="section-eyebrow">Loved by</span>
          <h2 className="section-title mt-1">Customers across Dhaka</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-5">
              <div className="flex gap-0.5 text-accent-gold mb-3">
                {Array.from({ length: t.rating }).map((_, i) => <IconStar key={i} width={14} height={14} />)}
              </div>
              <p className="text-sm text-brand-deep/85 leading-relaxed">"{t.text}"</p>
              <div className="mt-4 text-xs text-brand-deep/60">
                <b className="text-brand-deep">{t.name}</b> · {t.city}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function FloatingCard({ className = "", icon, title, sub }) {
  return (
    <div className={`absolute card px-3 py-2.5 flex items-center gap-2.5 ${className}`}>
      <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-mint/20 text-brand-teal text-lg">{icon}</span>
      <div>
        <div className="text-sm font-semibold text-brand-deep leading-tight">{title}</div>
        <div className="text-[11px] text-brand-deep/60">{sub}</div>
      </div>
    </div>
  );
}
