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