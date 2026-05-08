-- ===========================================
-- Migration v3: Delivery mode, fee, provider fields
-- Run this in Supabase SQL editor
-- ===========================================

-- Add delivery mode and fee columns
alter table orders
  add column if not exists delivery_mode text check (delivery_mode in ('pickup', 'local_delivery', 'courier')),
  add column if not exists delivery_fee numeric(10,2) default 0,
  add column if not exists delivery_distance_km numeric(10,2),
  add column if not exists delivery_fee_status text default 'estimated',
  add column if not exists delivery_provider_name text,
  add column if not exists delivery_partner_phone text,
  add column if not exists delivery_tracking_url text,
  add column if not exists delivery_notes text,
  add column if not exists courier_company text,
  add column if not exists courier_tracking_url text;

-- Indexes
create index if not exists idx_orders_delivery_mode on orders(delivery_mode);

-- Remove old check constraint for delivery_type if exists
alter table orders drop constraint if exists orders_delivery_type_check;
