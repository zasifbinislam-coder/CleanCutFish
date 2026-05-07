"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "@/lib/i18n/translations";

const KEY = "ccf_lang_v1";
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("bn"); // default Bangla
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en" || saved === "bn") setLang(saved);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang, hydrated]);

  const value = useMemo(() => ({
    lang,
    setLang,
    toggle: () => setLang((l) => (l === "bn" ? "en" : "bn")),
    isBn: lang === "bn",
    t: (key, fallback) => {
      const parts = key.split(".");
      let cur = translations[lang];
      for (const p of parts) {
        if (cur && typeof cur === "object" && p in cur) cur = cur[p];
        else { cur = undefined; break; }
      }
      if (typeof cur === "string") return cur;
      // Fallback to English if Bangla missing, then to provided fallback / key
      let en = translations.en;
      for (const p of parts) {
        if (en && typeof en === "object" && p in en) en = en[p];
        else { en = undefined; break; }
      }
      return (typeof en === "string" ? en : null) ?? fallback ?? key;
    },
  }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
