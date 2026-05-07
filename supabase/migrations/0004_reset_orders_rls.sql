-- Migration 0004 — RESET orders RLS to a known-working state.
-- Drop every conceivable policy then re-create cleanly.

alter table public.orders disable row level security;

-- Drop every existing policy on orders, no matter what it was named.
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='orders' loop
    execute format('drop policy if exists %I on public.orders', p.policyname);
  end loop;
end $$;

alter table public.orders enable row level security;

-- INSERT: anyone (anon or authenticated) can create an order.
create policy "orders_insert_anyone"
  on public.orders for insert
  to anon, authenticated
  with check (true);

-- SELECT: authenticated users see their own orders.
create policy "orders_select_own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins: full access.
create policy "orders_admin_all"
  on public.orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
