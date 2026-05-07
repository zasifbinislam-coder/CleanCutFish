// Quick health check of Supabase setup. Run:  node scripts/verify-setup.mjs
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supa = createClient(url, serviceKey, { auth: { persistSession: false } });

console.log(`→ Project: ${url}\n`);

const checks = [];

// 1. Tables
for (const t of ["profiles", "addresses", "products", "orders", "wishlist", "coupons"]) {
  const { count, error } = await supa.from(t).select("*", { count: "exact", head: true });
  checks.push({ check: `Table ${t}`, ok: !error, value: error ? error.message : `${count} rows` });
}

// 2. Admin
const { data: admins } = await supa
  .from("profiles").select("email, role").eq("role", "admin");
checks.push({ check: "Admin user(s)", ok: admins?.length > 0, value: admins?.map(a => a.email).join(", ") || "none" });

// 3. Coupons seeded
const { data: coupons } = await supa.from("coupons").select("code");
checks.push({ check: "Coupons seeded", ok: coupons?.length >= 4, value: coupons?.map(c => c.code).join(", ") });

console.log("Check                         Status   Detail");
console.log("─".repeat(70));
for (const r of checks) {
  console.log(
    r.check.padEnd(30),
    (r.ok ? "✓ OK   " : "✖ FAIL ").padEnd(8),
    r.value
  );
}
const failed = checks.filter(c => !c.ok).length;
console.log("\n" + (failed === 0 ? "✅ All checks passed." : `⚠ ${failed} failed.`));
