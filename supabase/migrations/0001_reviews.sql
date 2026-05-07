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
