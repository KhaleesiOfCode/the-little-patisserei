-- Run this in Supabase SQL editor if you want dedicated columns
-- (The code works without it using notes/baker_notes fields)

alter table orders
  add column if not exists cancelled_by text,
  add column if not exists cancellation_reason text,
  add column if not exists requested_new_date text,
  add column if not exists requested_new_slot text;

create index if not exists idx_orders_cancelled_by on orders(cancelled_by);
