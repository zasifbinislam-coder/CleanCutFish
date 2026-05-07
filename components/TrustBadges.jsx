import { IconLeaf, IconShield, IconScissors, IconSnowflake, IconTruck } from "@/components/Icon";

const items = [
  { icon: IconLeaf,      title: "100% Chemical-Free", sub: "No formalin, no artificial color." },
  { icon: IconScissors,  title: "Expertly Cleaned",   sub: "Scaled, gutted, cut to portion." },
  { icon: IconSnowflake, title: "Vacuum Sealed Cold", sub: "Sealed within 4 hours of catch." },
  { icon: IconTruck,     title: "Cold-chain Delivery",sub: "On ice, doorstep next day." },
];

export default function TrustBadges() {
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
