const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cleancutfish.com.bd";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/checkout", "/api"] },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
