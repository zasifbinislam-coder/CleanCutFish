"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-20 bg-brand-deep text-brand-cream">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl">CleanCutFish</div>
          <p className="mt-3 text-sm/6 text-brand-cream/75 max-w-md">
            {t("footer.tagline",
              "Premium fish, sourced direct from rivers, ponds, and fishing communities across Bangladesh — cleaned, cut, vacuum sealed, and delivered cold to your door. Zero formalin. Zero shortcuts.")}
          </p>
          <div className="mt-5 flex gap-2">
            <input className="input bg-white/95 text-brand-deep" placeholder={t("footer.emailPh", "Email for fresh-catch alerts")} />
            <button className="btn-accent whitespace-nowrap">{t("footer.subscribe", "Subscribe")}</button>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-3">{t("nav.shop")}</h4>
          <ul className="space-y-2 text-sm text-brand-cream/85">
            <li><Link href="/shop?cat=large-river" className="hover:text-white">{t("nav.riverFish")}</Link></li>
            <li><Link href="/shop?cat=small" className="hover:text-white">{t("nav.smallFish")}</Link></li>
            <li><Link href="/shop?cat=sea" className="hover:text-white">{t("footer.seaFish", "Sea Fish")}</Link></li>
            <li><Link href="/shop?cat=shrimp" className="hover:text-white">{t("nav.shrimp")}</Link></li>
            <li><Link href="/shop?cat=shutki" className="hover:text-white">{t("nav.shutki")}</Link></li>
            <li><Link href="/combos" className="hover:text-white">{t("nav.comboPacks")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg mb-3">{t("footer.help", "Help")}</h4>
          <ul className="space-y-2 text-sm text-brand-cream/85">
            <li><Link href="/about" className="hover:text-white">{t("nav.ourStory")}</Link></li>
            <li><Link href="/delivery" className="hover:text-white">{t("nav.delivery")}</Link></li>
            <li><Link href="/faq" className="hover:text-white">{t("nav.faq")}</Link></li>
            <li><Link href="/contact" className="hover:text-white">{t("nav.contact")}</Link></li>
            <li><Link href="/account" className="hover:text-white">{t("nav.account")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-cream/60 flex flex-wrap justify-center gap-x-4 gap-y-1">
        <span>© {new Date().getFullYear()} CleanCutFish · Bangladesh</span>
        <Link href="/terms" className="hover:text-white">{t("nav.terms")}</Link>
        <Link href="/privacy" className="hover:text-white">{t("nav.privacy")}</Link>
      </div>
    </footer>
  );
}
