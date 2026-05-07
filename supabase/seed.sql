-- Seed coupons (run after schema.sql)
insert into public.coupons (code, type, value, min_subtotal, description) values
  ('FRESH10',    'percent', 10,  0,    '10% off your order — for everyone.'),
  ('FAMILY150',  'flat',    150, 1500, '৳150 off when you spend ৳1,500+.'),
  ('NEWUSER15',  'percent', 15,  0,    '15% off your first order.'),
  ('ILISH200',   'flat',    200, 2000, '৳200 off premium river-fish orders ৳2,000+.')
on conflict (code) do nothing;

-- Seed products: import from data/products.json via your import script,
-- or paste insert statements here once you have your final catalog.
