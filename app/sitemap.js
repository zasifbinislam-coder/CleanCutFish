import { getAllProducts } from "@/lib/products";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cleancutfish.com.bd";

export default function sitemap() {
  const now = new Date().toISOString();

  const staticPaths = [
    "", "/shop", "/combos", "/about", "/contact",
    "/faq", "/delivery", "/terms", "/privacy",
    "/login", "/signup",
  ];

  const productPaths = getAllProducts().map((p) => `/shop/${p.id}`);

  return [...staticPaths, ...productPaths].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/shop/") ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.startsWith("/shop") ? 0.8 : 0.5,
  }));
}
