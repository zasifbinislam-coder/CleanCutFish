// Build a Supabase SQL editor URL pre-filled with a single migration file.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";
config({ path: ".env.local" });

const file = process.argv[2];
if (!file) { console.error("Usage: node scripts/make-single-url.mjs <path-to-sql>"); process.exit(1); }

const ref = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/\/\/([^.]+)\.supabase\.co/)[1];
const sql = readFileSync(resolve(file), "utf8");
const url = `https://supabase.com/dashboard/project/${ref}/sql/new?content=${encodeURIComponent(sql)}`;

console.log(url);
