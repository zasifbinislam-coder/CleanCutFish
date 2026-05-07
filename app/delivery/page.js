import { IconTruck, IconSnowflake, IconShield } from "@/components/Icon";

export const metadata = { title: "Delivery & Returns · CleanCutFish" };

export default function DeliveryPage() {
  return (
    <div className="container-page py-12">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <span className="section-eyebrow">Cold-chain delivery</span>
        <h1 className="section-title mt-1">Delivery & Returns</h1>
        <p className="text-sm text-brand-deep/65 mt-2">
          Fast, cold, and traceable — every pouch is sealed with the catch date and
          rider name.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <Feature icon={IconTruck} title="Inside Dhaka" lines={[
          "Same-day if order placed before 12 PM.",
          "Otherwise next-day.",
          "Free delivery on orders ৳1,500+.",
        ]} />
        <Feature icon={IconSnowflake} title="Cold chain" lines={[
          "Insulated foam box + reusable ice packs.",
          "Temperature held at 0–4°C.",
          "Vacuum pouches sealed within 4 hours of catch.",
        ]} />
        <Feature icon={IconShield} title="Outside Dhaka" lines={[
          "24–48 hours via Sundarban / RedX cold service.",
          "Available in Chittagong, Sylhet, Khulna, Rajshahi.",
          "Charges shown at checkout based on weight.",
        ]} />
      </div>

      <div className="card p-7 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl text-brand-deep mb-3">Returns & freshness guarantee</h2>
        <p className="text-brand-deep/80 leading-relaxed">
          If any product arrives spoiled, off-smell, or visibly damaged, contact us
          within <b>4 hours</b> of delivery with a photo at{" "}
          <a href="mailto:support@cleancutfish.com" className="text-brand-teal underline">
            support@cleancutfish.com
          </a>{" "}
          or <b>+880 1700-000000</b>.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-brand-deep/85 list-disc pl-5">
          <li>We replace the item on your next delivery, OR refund the full price.</li>
          <li>No restocking or return-shipping charges from your side.</li>
          <li>We cannot accept returns for fish that has been opened, partially used, or kept above 4°C.</li>
          <li>Custom cuts (special head/belly portions) are non-refundable unless spoiled.</li>
        </ul>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, lines }) {
  return (
    <div className="card p-5">
      <span className="grid place-items-center w-11 h-11 rounded-full bg-brand-mint/15 text-brand-teal mb-3">
        <Icon />
      </span>
      <h3 className="font-display text-xl text-brand-deep">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm text-brand-deep/75">
        {lines.map((l, i) => <li key={i}>· {l}</li>)}
      </ul>
    </div>
  );
}
