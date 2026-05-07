// Show all RLS policies for the public schema using service-role key.
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// pg_policies isn't directly exposed via PostgREST. Use a workaround through
// the open data api: select from information_schema-equivalent view we control.
// Easiest: just probe by attempting inserts with different roles.

// 1. Check we can read orders with service role (bypasses RLS).
const { count, error } = await supa.from("orders").select("*", { count: "exact", head: true });
console.log("Orders count (service role, bypasses RLS):", count, error?.message || "");

// 2. List all RLS policies via the postgres meta endpoint.
//    Supabase exposes pg_policies through the REST API on `pg_catalog`,
//    but we need a tiny helper view. Inline: just test inserts.

console.log("\nTesting inserts with anon key:");
const anon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Attempt 1: with user_id = null
let r = await anon.from("orders").insert({
  id: "TEST-A1", user_id: null, user_email: "a@a.com",
  name: "T", phone: "1", address: "A", city: "Dhaka",
  method: "cod", subtotal: 1, total: 1, lines: [],
}).select();
console.log("  user_id=null:", r.error ? "✖ " + r.error.message : "✓ inserted");
if (!r.error) await supa.from("orders").delete().eq("id", "TEST-A1");

// Attempt 2: omit user_id entirely
r = await anon.from("orders").insert({
  id: "TEST-A2", user_email: "a@a.com",
  name: "T", phone: "1", address: "A", city: "Dhaka",
  method: "cod", subtotal: 1, total: 1, lines: [],
}).select();
console.log("  user_id omitted:", r.error ? "✖ " + r.error.message : "✓ inserted");
if (!r.error) await supa.from("orders").delete().eq("id", "TEST-A2");
