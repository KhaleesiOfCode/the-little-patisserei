-- =====================
-- Menu tables
-- =====================

create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  description text,
  food_type text default 'veg' check (food_type in ('veg', 'nonveg')),
  keywords text[],
  ingredient_tags text[],
  shelf_life text,
  is_bestseller boolean default false,
  is_new_launch boolean default false,
  is_available boolean default true,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists menu_item_prices (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid references menu_items(id) on delete cascade,
  quantity_label text not null,
  price numeric(10,2) not null,
  display_order int default 0
);

create table if not exists menu_item_media (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid references menu_items(id) on delete cascade,
  media_type text check (media_type in ('image', 'video')) not null,
  url text not null,
  alt_text text,
  display_order int default 0
);

-- =====================
-- Order tables
-- =====================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text not null,
  customer_state text,
  customer_pin text,
  delivery_date date,
  delivery_time text,
  special_instructions text,
  subtotal numeric(10,2) not null,
  delivery_charge numeric(10,2) default 50,
  total numeric(10,2) not null,
  payment_method text default 'razorpay',
  payment_status text default 'pending',
  order_status text default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  item_name text not null,
  item_price numeric(10,2) not null,
  quantity int not null,
  selected_options text,
  created_at timestamptz default now()
);

-- Enable Realtime for orders table (for live owner tracking)
alter publication supabase_realtime add table orders;

-- RLS: allow inserts from the client (anon key)
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "Allow public insert on orders" on orders;
create policy "Allow public insert on orders" on orders
  for insert to anon
  with check (true);

drop policy if exists "Allow public select on orders" on orders;
create policy "Allow public select on orders" on orders
  for select to anon
  using (true);

drop policy if exists "Allow public insert on order_items" on order_items;
create policy "Allow public insert on order_items" on order_items
  for insert to anon
  with check (true);

drop policy if exists "Allow public select on order_items" on order_items;
create policy "Allow public select on order_items" on order_items
  for select to anon
  using (true);

-- =====================
-- Indexes
-- =====================

create index if not exists idx_orders_status on orders(order_status);
create index if not exists idx_orders_created on orders(created_at desc);
create index if not exists idx_order_items_order on order_items(order_id);
