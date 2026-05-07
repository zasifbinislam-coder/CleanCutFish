// Apply a SQL migration via the Supabase Management API using a personal-access
// token, OR fall back to instructing the user to paste it manually.
//
// For now (no PAT), we just print the SQL with a one-click dashboard link.

import { readFileSync } from "node:fs";
import { config } from "dotenv";
config({ path: ".env.local" });

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/apply-migration.mjs <path-to-sql>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = url?.match(/\/\/([^.]+)\.supabase\.co/)?.[1];
const sql = readFileSync(file, "utf8");

console.log(`\nMigration to apply:  ${file}\n`);
console.log("─".repeat(60));
console.log(sql);
console.log("─".repeat(60));
console.log(`\n→ Open the Supabase SQL editor:`);
console.log(`  https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
console.log("→ Paste the SQL above, then click RUN.\n");
