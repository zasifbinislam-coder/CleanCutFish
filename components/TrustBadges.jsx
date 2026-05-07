"use client";

import { useLang } from "@/context/LanguageContext";
import { IconLeaf, IconShield, IconScissors, IconSnowflake, IconTruck } from "@/components/Icon";

export default function TrustBadges() {
  const { t } = useLang();
  const items = [
    { icon: IconLeaf,      title: t("trust.chemFree.t"),  sub: t("trust.chemFree.s")  },
    { icon: IconScissors,  title: t("trust.cleaned.t"),   sub: t("trust.cleaned.s")   },
    { icon: IconSnowflake, title: t("trust.vacuum.t"),    sub: t("trust.vacuum.s")    },
    { icon: IconTruck,     title: t("trust.coldChain.t"), sub: t("trust.coldChain.s") },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div key={it.title} className="card p-4 flex gap-3 items-start">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-mint/15 text-brand-teal shrink-0">
              <Icon />
            </span>
            <div>
              <div className="font-semibold text-sm text-brand-deep">{it.title}</div>
              <div className="text-xs text-brand-deep/65 leading-snug">{it.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
