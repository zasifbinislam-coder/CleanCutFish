// Run all pending SQL migration files against the Supabase Postgres database.
// Connection string source (in order of preference):
//   1. SUPABASE_DB_URL env var
//   2. argv[2] (`node scripts/run-migrations.mjs "postgres://..."`)
//
// Connection string examples (from Supabase → Project Settings → Database):
//   postgresql://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:6543/postgres
//   postgresql://postgres:<pwd>@db.<ref>.supabase.co:5432/postgres

import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { config } from "dotenv";
import pg from "pg";
config({ path: ".env.local" });

const dbUrl = process.env.SUPABASE_DB_URL || process.argv[2];
if (!dbUrl) {
  console.error("✖ Need a database connection string.");
  console.error("  Either set SUPABASE_DB_URL in .env.local, or pass as argument:");
  console.error("  node scripts/run-migrations.mjs \"postgresql://postgres...\"");
  process.exit(1);
}

const dir = resolve("supabase/migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
if (!files.length) { console.log("No migrations found."); process.exit(0); }

const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
await client.connect();
console.log("✓ Connected to Postgres\n");

for (const f of files) {
  const sql = readFileSync(join(dir, f), "utf8");
  process.stdout.write(`→ Running ${f} ... `);
  try {
    await client.query(sql);
    console.log("✓");
  } catch (e) {
    console.log(`✖ ${e.message}`);
    // Continue with subsequent migrations even if one fails (idempotent SQL).
  }
}

await client.end();
console.log("\n✅ All migrations attempted.");
