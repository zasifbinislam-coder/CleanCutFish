"use client";

import { useState } from "react";
import { IconPin, IconTruck, IconLeaf } from "@/components/Icon";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="container-page py-12">
      <div className="text-center mb-10">
        <span className="section-eyebrow">আমাদের সাথে যোগাযোগ</span>
        <h1 className="section-title mt-1">Contact us</h1>
        <p className="text-sm text-brand-deep/65 mt-2 max-w-xl mx-auto">
          Questions about a delivery, a custom order, or sourcing? We answer every
          message — usually within an hour during business hours.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="card p-6">
          {sent ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🐟</div>
              <h3 className="font-display text-2xl text-brand-deep">Thank you!</h3>
              <p className="text-sm text-brand-deep/65 mt-2">
                We've received your message and will reply to your email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <h2 className="font-display text-2xl text-brand-deep mb-2">Send a message</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Field name="name" label="Your name" required />
                <Field name="phone" label="Phone" placeholder="01XXXXXXXXX" />
              </div>
              <Field name="email" type="email" label="Email" required />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">
                  Subject
                </label>
                <select name="subject" className="input">
                  <option>General question</option>
                  <option>Order issue</option>
                  <option>Bulk / corporate order</option>
                  <option>Become a supplier</option>
                  <option>Press / partnerships</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">
                  Message
                </label>
                <textarea name="message" rows={5} className="input" required />
              </div>
              <button type="submit" className="btn-primary">Send message</button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          <InfoCard
            icon={IconPin}
            title="Pickup & cleaning center"
            lines={[
              "Plot 14, Road 2, Block C",
              "Banani, Dhaka 1213",
              "Bangladesh",
            ]}
          />
          <InfoCard
            icon={IconTruck}
            title="Delivery support"
            lines={[
              "Phone / WhatsApp: +880 1920-262202",
              "support@cleancutfish.com",
              "Open 8 AM – 9 PM (every day)",
            ]}
          />
          <InfoCard
            icon={IconLeaf}
            title="Sourcing partners"
            lines={[
              "Kishoreganj · Chandpur · Sunamganj",
              "Khulna · Cox's Bazar · Bagerhat",
              "Want to supply? sourcing@cleancutfish.com",
            ]}
          />
          <div className="card overflow-hidden">
            <iframe
              title="Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=90.39%2C23.78%2C90.42%2C23.81&layer=mapnik&marker=23.7935%2C90.4042"
              className="w-full h-56 border-0"
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ name, label, type = "text", ...rest }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-brand-teal mb-1">
        {label}
      </label>
      <input name={name} type={type} className="input" {...rest} />
    </div>
  );
}

function InfoCard({ icon: Icon, title, lines }) {
  return (
    <div className="card p-5 flex gap-3">
      <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-mint/15 text-brand-teal shrink-0">
        <Icon />
      </span>
      <div>
        <div className="font-semibold text-brand-deep">{title}</div>
        <div className="text-sm text-brand-deep/70 leading-relaxed mt-0.5">
          {lines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}
