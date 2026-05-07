// Identify the Supabase project's region by inspecting its API response.
import { config } from "dotenv";
import { resolve as dnsResolve } from "node:dns/promises";
config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const host = url.replace(/^https?:\/\//, "");

console.log(`Project URL: ${url}\n`);

// 1. Resolve the hostname → IP
try {
  const ips = await dnsResolve(host);
  console.log(`DNS A records for ${host}:`);
  for (const ip of ips) console.log(`  ${ip}`);
} catch (e) {
  console.log(`DNS error: ${e.message}`);
}

// 2. Probe the response headers for any region clue
try {
  const r = await fetch(url + "/rest/v1/", {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  });
  console.log(`\nHTTP ${r.status} response headers:`);
  for (const [k, v] of r.headers.entries()) {
    if (/region|server|x-|via|cf|cloud/i.test(k)) console.log(`  ${k}: ${v}`);
  }
} catch (e) {
  console.log(`Fetch error: ${e.message}`);
}
