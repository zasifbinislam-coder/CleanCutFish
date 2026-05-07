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
