-- ============================================================
-- CleanCutFish — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. PROFILES (extends auth.users) -------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text not null,
  email       text not null unique,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Profiles: update own" on public.profiles
  for update using (auth.uid() = id);
create policy "Profiles: admins read all" on public.profiles
  for select using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- 2. ADDRESSES ----------------------------------------------------------------
create table public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  label       text default 'Home',
  address     text not null,
  zone        text,
  city        text not null default 'Dhaka',
  phone       text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.addresses enable row level security;
create policy "Addresses: own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. PRODUCTS -----------------------------------------------------------------
create table public.products (
  id              text primary key,
  name            text not null,
  name_bn         text,
  category        text not null,
  category_label  text,
  region          text,
  river           text,
  price_per_kg    numeric(10,2) not null,
  weights         jsonb not null,                -- [{label, kg, multiplier}]
  image           text,
  gallery         text[] default '{}',
  tags            text[] default '{}',
  short_description text,
  description     text,
  stock           int not null default 0,
  rating          numeric(2,1) default 4.5,
  reviews         int default 0,
  ready_to_cook   boolean default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.products enable row level security;
create policy "Products: public read" on public.products for select using (true);
create policy "Products: admin write" on public.products
  for all using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

-- 4. ORDERS -------------------------------------------------------------------
create table public.orders (
  id            text primary key,                -- e.g. CCF-A1B2C3
  user_id       uuid references public.profiles(id) on delete set null,
  user_email    text,
  name          text not null,
  phone         text not null,
  email         text,
  address       text not null,
  city          text,
  zone          text,
  notes         text,
  method        text not null check (method in ('cod', 'bkash', 'nagad')),
  txn_id        text,
  coupon_code   text,
  subtotal      numeric(10,2) not null,
  discount      numeric(10,2) default 0,
  delivery     numeric(10,2) default 0,
  total         numeric(10,2) not null,
  status        text not null default 'received'
                check (status in ('received','confirmed','shipped','delivered','cancelled')),
  lines         jsonb not null,                  -- [{productId,name,image,qty,unitPrice,weightLabel,kg,region}]
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.orders enable row level security;
create policy "Orders: customer reads own" on public.orders
  for select using (auth.uid() = user_id);
create policy "Orders: customer creates own" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "Orders: admin all" on public.orders
  for all using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

-- 5. WISHLIST -----------------------------------------------------------------
create table public.wishlist (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  text not null references public.products(id) on delete cascade,
  added_at    timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.wishlist enable row level security;
create policy "Wishlist: own" on public.wishlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6. COUPONS ------------------------------------------------------------------
create table public.coupons (
  code         text primary key,
  type         text not null check (type in ('percent','flat')),
  value        numeric(10,2) not null,
  min_subtotal numeric(10,2) not null default 0,
  description  text,
  active       boolean not null default true,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.coupons enable row level security;
create policy "Coupons: public read active" on public.coupons
  for select using (active = true);
create policy "Coupons: admin write" on public.coupons
  for all using ((select role from public.profiles where id = auth.uid()) = 'admin')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

-- 7. AUTO-CREATE PROFILE ON SIGNUP ----------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. UPDATED_AT TRIGGERS ------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_products_touch  before update on public.products
  for each row execute function public.touch_updated_at();
create trigger trg_orders_touch    before update on public.orders
  for each row execute function public.touch_updated_at();
