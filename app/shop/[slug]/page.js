import { notFound } from "next/navigation";
import { getAllProducts, getProductById, getProductsByCategory } from "@/lib/products";
import ProductDetail from "./ProductDetail";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://cleancutfish.com.bd";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }) {
  const p = getProductById(params.slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.name} · CleanCutFish`,
    description: p.shortDescription,
    openGraph: {
      title: p.name,
      description: p.shortDescription,
      images: [p.image],
      type: "website",
    },
  };
}

export default function Page({ params }) {
  const product = getProductById(params.slug);
  if (!product) notFound();

  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image],
    brand: { "@type": "Brand", name: "CleanCutFish" },
    offers: {
      "@type": "Offer",
      url: `${SITE}/shop/${product.id}`,
      priceCurrency: "BDT",
      price: product.pricePerKg,
      availability: (product.stock ?? 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.reviews
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}
