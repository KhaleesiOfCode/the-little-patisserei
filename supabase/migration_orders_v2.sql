-- ===========================================
-- Migration: Add new order fields (v2)
-- Run this in Supabase SQL editor
-- ===========================================

-- Add new columns to orders (existing table)
alter table orders
  add column if not exists customer_email text,
  add column if not exists delivery_type text check (delivery_type in ('chennai', 'outside_chennai')),
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists landmark text,
  add column if not exists preferred_delivery_slot text,
  add column if not exists estimated_delivery_at timestamptz,
  add column if not exists receiver_name text,
  add column if not exists receiver_phone text,
  add column if not exists alternate_phone text,
  add column if not exists full_courier_address text,
  add column if not exists courier_notes text,
  add column if not exists confirm_courier_risk boolean default false,
  add column if not exists baker_notes text,
  add column if not exists courier_tracking_number text;

-- Add egg_option column to order_items
alter table order_items
  add column if not exists product_id text,
  add column if not exists quantity_label text,
  add column if not exists egg_option text,
  add column if not exists unit_price numeric(10,2),
  add column if not exists line_total numeric(10,2);

-- Update check constraint for order_status (drop old, add new)
alter table orders drop constraint if exists orders_order_status_check;

-- Add Realtime if not already enabled
-- (The alter publication statement is idempotent in recent Supabase versions)

-- Indexes for new fields
create index if not exists idx_orders_delivery_type on orders(delivery_type);
create index if not exists idx_orders_estimated_delivery on orders(estimated_delivery_at);

-- RLS: allow baker to update orders
drop policy if exists "Allow baker update on orders" on orders;
create policy "Allow baker update on orders" on orders
  for update to anon
  using (true);
