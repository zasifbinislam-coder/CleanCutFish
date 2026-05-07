import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config({ path: ".env.local" });

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const { data, error } = await supa.rpc("debug_orders_rls");
if (error) { console.error("✖", error); process.exit(1); }
console.log(JSON.stringify(data, null, 2));
