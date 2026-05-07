import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name) { return cookieStore.get(name)?.value; },
      set() {},
      remove() {},
    },
  });
}

// Admin client — service-role key, server-only. Never expose to the browser.
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
