export const metadata = { title: "Terms & Conditions · CleanCutFish" };

export default function TermsPage() {
  return (
    <article className="container-page py-12 max-w-3xl prose-content">
      <span className="section-eyebrow">Legal</span>
      <h1 className="section-title mt-1 mb-2">Terms & Conditions</h1>
      <p className="text-xs text-brand-deep/55 mb-8">Last updated: 7 May 2026</p>

      <Section title="1. Who we are">
        CleanCutFish (&quot;we&quot;, &quot;us&quot;) is a Bangladeshi-registered fish-delivery
        service operating from Dhaka. By placing an order, registering an account,
        or browsing this site, you agree to these terms.
      </Section>

      <Section title="2. Orders & acceptance">
        An order is an offer to buy. We reserve the right to confirm, modify, or
        cancel any order — including for stock shortage, delivery-area limits, or
        suspected fraud. You will be informed by phone or email if so, and any
        prepayment will be refunded in full to the original payment method.
      </Section>

      <Section title="3. Pricing">
        Prices are quoted in BDT (৳) and may change without notice. All prices are
        per-kg unless stated. Final invoiced amounts depend on actual cleaned weight
        — small variances (±10%) are possible because fish are natural products.
        Promotional prices apply only while stocks last.
      </Section>

      <Section title="4. Payment">
        We accept Cash on Delivery, bKash, and Nagad. For mobile payments you must
        share the transaction ID at checkout. Orders are not dispatched until we
        verify payment. Cash on Delivery may require a phone confirmation before
        dispatch.
      </Section>

      <Section title="5. Delivery">
        Inside Dhaka: same-day or next-day delivery, depending on the cut-off time.
        Outside Dhaka: 24–48 hours. We deliver in cold-chain insulated boxes. You
        must accept the delivery in person; if no one is available, we will retry
        once. Repeated failed deliveries may incur a re-delivery fee.
      </Section>

      <Section title="6. Freshness guarantee">
        If any product arrives spoiled, off-smell, or visibly damaged, contact us
        within 4 hours of delivery with a photo. We will replace the item or refund
        the full price — your choice. We do not accept returns for fish that has
        been opened, partially used, or stored above 4°C for several hours after
        delivery.
      </Section>

      <Section title="7. Account responsibility">
        You are responsible for keeping your password secure. We are not liable for
        loss caused by unauthorized account access. You may close your account at
        any time by emailing support@cleancutfish.com.
      </Section>

      <Section title="8. Acceptable use">
        You agree not to scrape our catalogue, abuse coupon codes, harass our
        fishermen partners, or attempt to impersonate other users. We may suspend
        accounts that violate these rules.
      </Section>

      <Section title="9. Liability">
        Our total liability for any single order is limited to the amount paid for
        that order. We are not liable for indirect or consequential damages, except
        where Bangladeshi law states otherwise.
      </Section>

      <Section title="10. Changes & contact">
        We may update these terms; the version on this page is always the active
        one. Contact: legal@cleancutfish.com.
      </Section>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-7">
      <h2 className="font-display text-2xl text-brand-deep mb-2">{title}</h2>
      <p className="text-brand-deep/80 leading-relaxed">{children}</p>
    </section>
  );
}
