import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";
import WhatsAppButton from "@/components/WhatsAppButton";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cleancutfish.com.bd";

const SITE_TITLE = "CleanCutFish — River-fresh fish, cleaned, cut, vacuum sealed";
const SITE_DESC =
  "Premium fish from rivers, ponds, and coasts of Bangladesh. Scaled, cut and vacuum-packed Ready to Cook. 100% chemical free. Doorstep delivery.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s · CleanCutFish" },
  description: SITE_DESC,
  keywords: [
    "fish delivery Bangladesh",
    "online fish bd",
    "ilish chandpur",
    "ruhi katol delivery",
    "shutki online",
    "ready to cook fish",
    "মাছ ডেলিভারি",
    "অনলাইন মাছ",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CleanCutFish",
    title: SITE_TITLE,
    description: SITE_DESC,
    locale: "bn_BD",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "food",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&family=Baloo+Da+2:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <LanguageProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <main className="bg-wave-pattern">{children}</main>
                <MiniCart />
                <WhatsAppButton />
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
