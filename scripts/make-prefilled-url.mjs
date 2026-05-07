// Build a Supabase SQL editor URL with the migrations pre-pasted.
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { config } from "dotenv";
config({ path: ".env.local" });

const ref = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/\/\/([^.]+)\.supabase\.co/)[1];
const dir = resolve("supabase/migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const combined = files
  .map((f) => `-- ============ ${f} ============\n${readFileSync(join(dir, f), "utf8")}`)
  .join("\n\n");

const url = `https://supabase.com/dashboard/project/${ref}/sql/new?content=${encodeURIComponent(combined)}`;

if (url.length > 8000) {
  console.log(`⚠ URL is ${url.length} chars — browser may not accept this long.`);
  console.log(`  Saving to scripts/.combined-migrations.sql instead.\n`);
  const fs = await import("node:fs");
  fs.writeFileSync("scripts/.combined-migrations.sql", combined);
  console.log("→ Open the SQL editor:");
  console.log(`  https://supabase.com/dashboard/project/${ref}/sql/new`);
  console.log("→ Then paste contents of scripts/.combined-migrations.sql");
} else {
  console.log("→ Click this link, then click RUN at the top:");
  console.log(`\n${url}\n`);
}

console.log(`(${combined.length} chars of SQL · ${files.length} migrations)`);
