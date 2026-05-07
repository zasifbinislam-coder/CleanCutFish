"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Are your fish really chemical-free?",
    a: "Yes. We never use formalin, urea, or artificial color. Our quality team checks every batch with a pH and smell test, and we have third-party lab samples on a rolling 30-day basis. The catch goes from boat → cooler → cleaning → vacuum pouch in under 12 hours.",
  },
  {
    q: "How is the fish cleaned and cut?",
    a: "Hand-cleaned in food-grade chilled water. Each fish is scaled, gutted, gilled, and sliced into the cuts Bangladeshi cooking actually uses (paturi, kalia steaks, or whole). The pouch label tells you what's inside — gada, peti, or whole.",
  },
  {
    q: "Will it really arrive cold?",
    a: "Yes — we ship in insulated foam boxes with reusable ice packs. Vacuum pouches stay below 4°C for at least 12 hours after dispatch.",
  },
  {
    q: "Can I freeze the pouch directly?",
    a: "Yes — drop the unopened pouch straight into the freezer. It is rated for −18°C and will keep up to 3 months. Defrost overnight in the fridge before cooking.",
  },
  {
    q: "Do you deliver outside Dhaka?",
    a: "We deliver across Bangladesh in 24–48 hours via cold-chain courier. Charges depend on weight — shown at checkout.",
  },
  {
    q: "What if my fish arrives damaged or spoiled?",
    a: "Email us a photo within 4 hours of delivery. We replace or refund — your choice — no questions asked. Full policy on the Delivery page.",
  },
  {
    q: "Can I order custom cuts or whole fish?",
    a: "Yes. Add a note at checkout, or call our number. Custom cuts (special head/belly portions, no slicing, etc.) are made fresh per order.",
  },
  {
    q: "Do you accept bulk / restaurant orders?",
    a: "We supply several Dhaka restaurants. Email bulk@cleancutfish.com with your menu and we'll send a wholesale price list within a day.",
  },
  {
    q: "How do I pay?",
    a: "Cash on Delivery, bKash, or Nagad. Mobile-payment confirmation is captured at checkout.",
  },
  {
    q: "How do I cancel an order?",
    a: "Within 30 minutes of placing it: tap the order in your account → Cancel. After that, call our support line; once a fish has been cleaned and packed, we cannot cancel because it cannot be re-sold.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <div className="container-page py-12 max-w-3xl">
      <div className="text-center mb-10">
        <span className="section-eyebrow">Frequently asked</span>
        <h1 className="section-title mt-1">Questions & answers</h1>
      </div>

      <div className="space-y-2">
        {FAQS.map((f, i) => (
          <details
            key={i}
            open={open === i}
            onToggle={(e) => e.currentTarget.open && setOpen(i)}
            className="card p-5 [&_summary]:cursor-pointer [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between gap-3">
              <span className="font-display text-lg text-brand-deep">{f.q}</span>
              <span className="text-brand-teal text-2xl leading-none select-none">
                {open === i ? "−" : "+"}
              </span>
            </summary>
            <p className="mt-3 text-brand-deep/80 leading-relaxed text-sm">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 card p-6 text-center bg-gradient-to-br from-brand-teal to-brand-deep text-white">
        <h3 className="font-display text-xl">Still have a question?</h3>
        <p className="text-sm text-brand-cream/85 mt-1">We answer every email — usually within an hour.</p>
        <a href="/contact" className="btn-accent mt-4">Contact us</a>
      </div>
    </div>
  );
}
