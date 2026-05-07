"use client";

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
import { useLang } from "@/context/LanguageContext";
import { IconStar, IconChevronRight } from "@/components/Icon";

export default function HomePage() {
  const { t, isBn } = useLang();
  const categories = getAllCategories();
  const ready = getReadyToCook().slice(0, 8);
  const best = getBestsellers();
  const testimonials = getAllTestimonials();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-page grid lg:grid-cols-2 gap-8 lg:gap-10 py-8 sm:py-12 lg:py-20 items-center">
          <div>
            <span className="section-eyebrow">{t("hero.eyebrow")}</span>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl text-brand-deep leading-[1.05]">
              {isBn ? (
                <>{t("hero.title1")} {t("hero.title2")}। {t("hero.title3")}</>
              ) : (
                <>{t("hero.title1")} <span className="wave-underline">{t("hero.title2")}</span>. {t("hero.title3")}</>
              )}
            </h1>
            <p className="mt-4 sm:mt-5 text-brand-deep/75 max-w-lg text-sm sm:text-base">
              {t("hero.sub")}
            </p>
            <div className="mt-6 sm:mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">{t("hero.cta1")}</Link>
              <Link href="/combos" className="btn-ghost">{t("hero.cta2")}</Link>
            </div>
            <div className="mt-6 sm:mt-8 flex items-center gap-3 sm:gap-5 text-sm text-brand-deep/70">
              <div className="flex items-center gap-0.5 text-accent-gold">
                <IconStar width={14} height={14}/><IconStar width={14} height={14}/><IconStar width={14} height={14}/><IconStar width={14} height={14}/><IconStar width={14} height={14}/>
              </div>
              <span><b className="text-brand-deep">{isBn ? "৪.৯/৫" : "4.9/5"}</b> {t("hero.rating")}</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-soft border border-white">
              <Image
                src="/photofish/padma-ilish.jpeg"
                alt="Fresh Padmar Ilish"
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
              title={t("hero.floatPadma.title")}
              sub={t("hero.floatPadma.sub")}
            />
            <FloatingCard
              className="-right-4 bottom-12 hidden sm:block"
              icon="✓"
              title={t("hero.floatVacuum.title")}
              sub={t("hero.floatVacuum.sub")}
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
            <span className="section-eyebrow">{t("home.categoriesEyebrow")}</span>
            <h2 className="section-title mt-1">{t("home.categoriesTitle")}</h2>
          </div>
          <Link href="/shop" className="hidden sm:inline text-sm text-brand-teal hover:underline">
            {t("home.viewAll")}
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
                  <div className="text-xs opacity-80">{isBn ? c.name : c.nameBn}</div>
                  <div className="font-display text-xl">{isBn && c.nameBn ? c.nameBn : c.name}</div>
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
            <span className="section-eyebrow">{t("home.readyEyebrow")}</span>
            <h2 className="section-title mt-1">{t("home.readyTitle")}</h2>
            <p className="text-sm text-brand-deep/65 mt-1">
              {t("home.readySub")}
            </p>
          </div>
          <Link href="/shop" className="hidden sm:inline text-sm text-brand-teal hover:underline">
            {t("home.seeAll")}
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
            <span className="section-eyebrow text-brand-mint">{t("home.processEyebrow")}</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-2">{t("home.processTitle")}</h2>
            <ol className="mt-6 space-y-4 text-brand-cream/90">
              {[
                [isBn ? "১" : "1", t("home.step1Title"), t("home.step1Body")],
                [isBn ? "২" : "2", t("home.step2Title"), t("home.step2Body")],
                [isBn ? "৩" : "3", t("home.step3Title"), t("home.step3Body")],
                [isBn ? "৪" : "4", t("home.step4Title"), t("home.step4Body")],
              ].map(([n, title, body]) => (
                <li key={n} className="flex gap-4">
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-mint text-brand-deep font-bold shrink-0">{n}</span>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-brand-cream/75">{body}</div>
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
            <span className="section-eyebrow text-brand-mint">{t("home.comboEyebrow")}</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 mb-4">{t("home.comboTitle")}</h2>
            <p className="text-brand-cream/85 mb-6 max-w-md">
              {t("home.comboSub")}
            </p>
            <Link href="/combos" className="btn-accent">
              {t("home.comboCta")} <IconChevronRight className="ml-1" />
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
          <span className="section-eyebrow">{t("home.reviewsEyebrow")}</span>
          <h2 className="section-title mt-1">{t("home.reviewsTitle")}</h2>
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
