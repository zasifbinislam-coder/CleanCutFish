// One-time bulk import of data/products.json into Supabase `products` table.
// Run with:  npm run import-products
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

// Next.js convention: prefer .env.local
config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("✖ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const products = JSON.parse(readFileSync(resolve("data/products.json"), "utf8"));

const rows = products.map((p) => ({
  id: p.id,
  name: p.name,
  name_bn: p.nameBn,
  category: p.category,
  category_label: p.categoryLabel,
  region: p.region,
  river: p.river,
  price_per_kg: p.pricePerKg,
  weights: p.weights,
  image: p.image,
  gallery: p.gallery || [],
  tags: p.tags || [],
  short_description: p.shortDescription,
  description: p.description,
  stock: p.stock || 0,
  rating: p.rating || 4.5,
  reviews: p.reviews || 0,
  ready_to_cook: !!p.readyToCook,
}));

console.log(`Importing ${rows.length} products...`);
const { error } = await supabase.from("products").upsert(rows, { onConflict: "id" });
if (error) {
  console.error("✖ Import failed:", error.message);
  process.exit(1);
}
console.log("✓ Done. Products are now in Supabase.");
