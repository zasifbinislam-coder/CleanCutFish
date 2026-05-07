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
