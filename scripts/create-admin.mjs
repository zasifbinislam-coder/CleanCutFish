// Create the seed admin user (admin@cleancutfish.com / admin123) and elevate
// their profile to role='admin'.  Idempotent — safe to re-run.
//
//   npm run create-admin

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("✖ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const ADMIN_EMAIL = "admin@cleancutfish.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Site Admin";
const ADMIN_PHONE = "+880 1700-000000";

console.log(`→ Ensuring admin user ${ADMIN_EMAIL}`);

// Try to create. If already exists, fetch & update role only.
const { data: created, error: createErr } = await supabase.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true,
  user_metadata: { name: ADMIN_NAME, phone: ADMIN_PHONE },
});

let userId;
if (createErr && /already.*registered|exists/i.test(createErr.message)) {
  console.log("  user already exists, looking it up...");
  const { data: list } = await supabase.auth.admin.listUsers();
  const found = list.users.find((u) => u.email === ADMIN_EMAIL);
  if (!found) { console.error("✖ Could not find existing admin user."); process.exit(1); }
  userId = found.id;
} else if (createErr) {
  console.error("✖ Create failed:", createErr.message);
  process.exit(1);
} else {
  userId = created.user.id;
  console.log("  user created");
}

// The on_auth_user_created trigger should have inserted a profiles row.
// Bump role to admin (idempotent).
const { error: roleErr } = await supabase
  .from("profiles")
  .update({ role: "admin", name: ADMIN_NAME, phone: ADMIN_PHONE })
  .eq("id", userId);

if (roleErr) {
  console.error("✖ Could not set admin role:", roleErr.message);
  console.error("  Make sure schema.sql has been run.");
  process.exit(1);
}

console.log(`✓ Admin ready. Sign in at /login with ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
