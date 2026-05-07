import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";

export const metadata = {
  title: "CleanCutFish — River-fresh fish, cleaned, cut, vacuum sealed",
  description:
    "Premium fish from rivers, ponds, and coasts of Bangladesh. Scaled, cut and vacuum-packed Ready to Cook. 100% chemical free. Doorstep delivery.",
  metadataBase: new URL("https://cleancutfish.example"),
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
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
