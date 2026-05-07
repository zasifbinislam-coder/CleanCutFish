// Test if a guest (anon) user can insert into the orders table.
// This reproduces what the checkout page does for non-logged-in users.

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supa = createClient(url, anon, { auth: { persistSession: false } });

const id = "CCF-TEST" + Math.random().toString(36).slice(2, 5).toUpperCase();

const { data, error } = await supa.from("orders").insert({
  id,
  user_id: null,
  user_email: "guest-test@example.com",
  name: "Test Guest",
  phone: "01700000000",
  address: "Test 123",
  city: "Dhaka",
  zone: "Dhanmondi",
  method: "cod",
  subtotal: 340,
  discount: 0,
  delivery: 80,
  total: 420,
  lines: [{ productId: "pabda-haor", name: "Haorer Pabda", qty: 1, unitPrice: 340, weightLabel: "500 g" }],
}).select().single();

if (error) {
  console.error("✖ Insert blocked:", error.message);
  console.error("  Hint:", error.hint || "(none)");
  console.error("  Details:", error.details || "(none)");
  process.exit(1);
}

console.log("✓ Guest order inserted as", data.id);

// Cleanup the test row
await supa.from("orders").delete().eq("id", id);
console.log("✓ Test row removed");
