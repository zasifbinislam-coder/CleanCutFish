// Probe Supabase pooler endpoints across regions to find the right one.
import pg from "pg";
import { config } from "dotenv";
config({ path: ".env.local" });

const password = process.env.SUPABASE_DB_PASSWORD;
if (!password) { console.error("Set SUPABASE_DB_PASSWORD env var first."); process.exit(1); }

const ref = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/\/\/([^.]+)\.supabase\.co/)[1];

const regions = [
  "ap-northeast-2",  // Seoul
  "ca-central-1",    // Canada
  "eu-central-2",    // Zurich
  "eu-west-3",       // Paris
  "eu-north-1",      // Stockholm
];

for (const region of regions) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  process.stdout.write(`Trying ${region}... `);
  const client = new pg.Client({
    host, port: 5432,
    user: `postgres.${ref}`,
    password,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    await client.query("select 1");
    console.log("✓ FOUND IT.");
    await client.end();
    console.log(`\nUse this connection string:`);
    console.log(`postgresql://postgres.${ref}:<password>@${host}:5432/postgres`);
    process.exit(0);
  } catch (e) {
    console.log(`✗ ${e.message.split("\n")[0]}`);
    try { await client.end(); } catch {}
  }
}

console.log("\n✖ No region matched. Password may be wrong, or project is in an unusual region.");
process.exit(1);
