import Image from "next/image";
import Link from "next/link";
import TrustBadges from "@/components/TrustBadges";

export const metadata = { title: "Our Story · CleanCutFish" };

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="section-eyebrow">Our story</span>
          <h1 className="section-title mt-2">Built around the rivers of Bangladesh.</h1>
          <p className="mt-5 text-brand-deep/80 leading-relaxed">
            CleanCutFish started in a single room in Kishoreganj, with two coolers and a
            promise: that families in Dhaka should be able to taste fish the way it
            tastes at the riverbank — fresh, firm, and free of formalin.
          </p>
          <p className="mt-3 text-brand-deep/80 leading-relaxed">
            Today we work with fishing communities across Chandpur, Sunamganj, Khulna,
            and the Sundarbans. We pay our fishermen the same morning they catch. We
            clean and cut everything by hand within four hours. We vacuum-seal the
            pouches cold and ship in cold-chain — straight to your door.
          </p>
          <Link href="/shop" className="btn-primary mt-7">Browse the catch</Link>
        </div>
        <div className="relative aspect-square rounded-[2rem] overflow-hidden">
          <Image
            src="/photofish/nodir-katol.jpg"
            alt="Fresh Katol from the river"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 600px"
          />
        </div>
      </div>

      <div className="mt-16">
        <TrustBadges />
      </div>
    </div>
  );
}
