-- ===========================================
-- Migration v4: Courier pricing fields
-- ===========================================

alter table orders
  add column if not exists courier_zone text,
  add column if not exists total_courier_weight_grams integer,
  add column if not exists courier_weight_slab text,
  add column if not exists fragile_surcharge numeric(10,2) default 0,
  add column if not exists district text;

alter table menu_items
  add column if not exists courier_supported boolean default true,
  add column if not exists courier_weight_grams integer,
  add column if not exists courier_fragile boolean default false,
  add column if not exists courier_category text;
