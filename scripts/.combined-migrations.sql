-- ============ 0001_reviews.sql ============
-- Migration: add reviews table + helper view for product avg ratings.
-- Run once in: Supabase Dashboard → SQL Editor → New Query

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  user_name   text not null,
  rating      int  not null check (rating between 1 and 5),
  body        text,
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table public.reviews enable row level security;

create policy "Reviews: public read"  on public.reviews
  for select using (true);
create policy "Reviews: own insert"   on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "Reviews: own update"   on public.reviews
  for update using (auth.uid() = user_id);
create policy "Reviews: own delete"   on public.reviews
  for delete using (auth.uid() = user_id);

-- View: average rating + count per product, used to keep products.rating in sync.
create or replace view public.product_ratings as
  select product_id,
         round(avg(rating)::numeric, 1) as rating,
         count(*) as reviews
  from public.reviews
  group by product_id;


-- ============ 0002_fix_rls.sql ============
-- ============================================================================
-- Fix: "infinite recursion detected in policy for relation profiles"
--
-- Problem: the original admin-check policy on `profiles` ran a subquery
--          against `profiles`, which triggered the same policy → infinite loop.
--          This blocked the orders/wishlist/addresses INSERTs because RLS on
--          orders also runs an `is admin?` check that joins profiles.
--
-- Fix:     Move the admin check into a SECURITY DEFINER function so it
--          bypasses RLS internally, and rewrite all the policies that used
--          the recursive subquery.
-- ============================================================================

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable
as $$
  select exists(
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- Profiles -------------------------------------------------------------------
drop policy if exists "Profiles: admins read all" on public.profiles;
create policy "Profiles: admins read all" on public.profiles
  for select using (public.is_admin());

-- Products -------------------------------------------------------------------
drop policy if exists "Products: admin write" on public.products;
create policy "Products: admin write" on public.products
  for all using (public.is_admin())
  with check (public.is_admin());

-- Orders ---------------------------------------------------------------------
drop policy if exists "Orders: admin all" on public.orders;
create policy "Orders: admin all" on public.orders
  for all using (public.is_admin())
  with check (public.is_admin());

-- Coupons --------------------------------------------------------------------
drop policy if exists "Coupons: admin write" on public.coupons;
create policy "Coupons: admin write" on public.coupons
  for all using (public.is_admin())
  with check (public.is_admin());


-- ============ 0003_fix_guest_orders.sql ============
-- Migration 0003 — make guest checkout actually work.
--
-- After 0002, the recursion error went away but anon INSERTs were still
-- blocked. The original "Orders: customer creates own" policy from schema.sql
-- either wasn't created or was somehow dropped along the way. Re-create it
-- explicitly with both anon (guest) and authenticated paths.

drop policy if exists "Orders: customer creates own" on public.orders;
drop policy if exists "Orders: anyone can create" on public.orders;

create policy "Orders: anyone can create"
  on public.orders for insert
  to anon, authenticated
  with check (
    (auth.uid() is null and user_id is null)              -- guest checkout
    or (auth.uid() is not null and user_id is null)        -- logged-in user not setting a user_id (rare)
    or (auth.uid() is not null and user_id = auth.uid())   -- logged-in user creating their own order
  );

-- Also ensure the SELECT policy is sane: customers see own + admins see all.
-- (Admin-all already covers all; this just ensures customer self-read works.)
drop policy if exists "Orders: customer reads own" on public.orders;
create policy "Orders: customer reads own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- Quick sanity: addresses + wishlist may have similar gaps; ensure they're explicit.
drop policy if exists "Addresses: own" on public.addresses;
create policy "Addresses: own"
  on public.addresses for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Wishlist: own" on public.wishlist;
create policy "Wishlist: own"
  on public.wishlist for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
