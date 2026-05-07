# 🐟 Supabase Setup — CleanCutFish

This is the migration plan from the localStorage prototype to a real Supabase backend.

## Step 1 — Create the project

1. Go to <https://supabase.com>, sign in, click **New project**.
2. Pick the **Singapore** region (closest to Bangladesh).
3. Set a strong DB password (save it!).
4. Wait ~2 minutes for the project to spin up.

## Step 2 — Run the schema

1. In the Supabase dashboard → **SQL Editor → New Query**.
2. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. New query → paste [`supabase/seed.sql`](supabase/seed.sql) → **Run**.

This creates 6 tables — `profiles`, `addresses`, `products`, `orders`, `wishlist`, `coupons` — with full Row-Level Security policies and a trigger that auto-creates a `profile` row whenever a new user signs up.

## Step 3 — Send me these three values

From **Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   ← (admin only, never paste in chats — DM/email me)
```

## Step 4 — Copy them into `.env.local`

```bash
cp .env.example .env.local
# then paste the three keys
```

## Step 5 — I'll wire it up

Once you give me the URL + anon key, I will:

- Replace `localStorage`-based auth in [`context/AuthContext.jsx`](context/AuthContext.jsx) with Supabase auth (signup, signin, session refresh, password reset)
- Migrate orders to write to `orders` table (instead of localStorage)
- Migrate wishlist to `wishlist` table (per-user, syncs across devices)
- Migrate addresses to `addresses` table
- Connect admin product CRUD in [`app/admin/products/page.js`](app/admin/products/page.js) to actually persist
- Connect coupon validation to the `coupons` table

The UI doesn't change — just the data layer behind it.

## Step 6 — Import your products

Once Supabase is connected, run a one-time import to push `data/products.json` into the `products` table. I'll write the script (`scripts/import-products.mjs`) when you're ready.

---

## Architectural notes

- **Why Supabase**: BD-friendly free tier, Postgres-native (so you can write raw SQL when needed), real-time updates out of the box (admin sees new orders without refresh), built-in auth + storage in one platform.
- **Auth strategy**: Email + password to start (matches your existing UX). Can add Google / Phone OTP later in 5 minutes.
- **Storage**: Once we go live, product photos move from `public/photofish/` to a Supabase Storage bucket called `products`, accessed via signed URLs. Cheaper at scale and easier for non-devs to upload.
- **Migrations**: New schema changes go in `supabase/migrations/NNNN_description.sql` and are applied via the Supabase CLI (or pasted into the SQL Editor for small changes).
