export const metadata = { title: "Privacy Policy · CleanCutFish" };

export default function PrivacyPage() {
  return (
    <article className="container-page py-12 max-w-3xl">
      <span className="section-eyebrow">Legal</span>
      <h1 className="section-title mt-1 mb-2">Privacy Policy</h1>
      <p className="text-xs text-brand-deep/55 mb-8">Last updated: 7 May 2026</p>

      <Section title="What we collect">
        Account info (name, email, phone), delivery addresses, order history,
        payment-confirmation IDs, and basic device data (IP, browser) for fraud
        prevention. We never store full card numbers or bKash/Nagad PINs.
      </Section>

      <Section title="How we use it">
        To process orders, communicate delivery updates, prevent fraud, send
        opt-in fresh-catch alerts, and improve the site. We do not sell your data.
      </Section>

      <Section title="Who we share it with">
        Only delivery riders (limited to your name, address, phone), payment
        partners (bKash / Nagad transaction confirmation), and Bangladeshi tax
        authorities if legally required.
      </Section>

      <Section title="Data retention">
        Account & order data is retained as long as your account exists, plus 24
        months for tax/audit. You can request deletion at privacy@cleancutfish.com.
      </Section>

      <Section title="Your rights">
        Access, correct, export, or delete your data — email
        privacy@cleancutfish.com from your registered email address. We respond
        within 14 days.
      </Section>

      <Section title="Cookies">
        We use a small number of essential cookies (session, cart). No third-party
        advertising trackers. Analytics is aggregated and anonymous.
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
