"use client";

import { createBrowserClient } from "@supabase/ssr";

let _client = null;

export function getSupabaseBrowser() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[Supabase] Missing env vars — running in offline/localStorage mode.");
    return null;
  }
  _client = createBrowserClient(url, key);
  return _client;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
