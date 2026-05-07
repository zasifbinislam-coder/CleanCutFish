-- Migration 0005 — debug helper. Creates an RPC that dumps the current
-- RLS state for the orders table so the client can inspect it.

create or replace function public.debug_orders_rls()
returns json
language sql security definer
set search_path = public, pg_catalog
as $$
  select json_build_object(
    'rls_enabled',
      (select relrowsecurity
         from pg_class
        where relname = 'orders'
          and relnamespace = (select oid from pg_namespace where nspname = 'public')),
    'policies',
      (select coalesce(
         json_agg(json_build_object(
           'name', policyname,
           'permissive', permissive,
           'cmd', cmd,
           'roles', roles,
           'qual', qual,
           'with_check', with_check
         )),
         '[]'::json)
       from pg_policies
       where schemaname = 'public' and tablename = 'orders'),
    'triggers',
      (select coalesce(
         json_agg(json_build_object('name', tgname, 'enabled', tgenabled)),
         '[]'::json)
       from pg_trigger t
         join pg_class c on t.tgrelid = c.oid
       where c.relname = 'orders' and not tgisinternal),
    'columns',
      (select json_agg(json_build_object(
         'name', column_name,
         'nullable', is_nullable,
         'default', column_default
       ))
       from information_schema.columns
       where table_schema = 'public' and table_name = 'orders')
  );
$$;

revoke all on function public.debug_orders_rls() from public;
grant execute on function public.debug_orders_rls() to anon, authenticated, service_role;
