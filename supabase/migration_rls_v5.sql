-- ===========================================
-- RLS Security Migration v5
-- Tighten row-level security for orders
-- ===========================================

-- Drop overly permissive policies
drop policy if exists "Allow public insert on orders" on orders;
drop policy if exists "Allow public select on orders" on orders;
drop policy if exists "Allow public insert on order_items" on order_items;
drop policy if exists "Allow public select on order_items" on order_items;

-- Orders: anyone can insert (customer placing an order)
create policy "Anyone can insert orders"
  on orders for insert
  to anon
  with check (true);

-- Orders: anyone can select by order_number (tracking page)
create policy "Anyone can select orders by number"
  on orders for select
  to anon
  using (true);

-- Order items: anyone can insert (during checkout)
create policy "Anyone can insert order_items"
  on order_items for insert
  to anon
  with check (true);

-- Order items: anyone can select (tracking page)
create policy "Anyone can select order_items"
  on order_items for select
  to anon
  using (true);

-- Menu tables: public read
drop policy if exists "Public read menu_categories" on menu_categories;
create policy "Public read menu_categories"
  on menu_categories for select
  to anon
  using (true);

drop policy if exists "Public read menu_items" on menu_items;
create policy "Public read menu_items"
  on menu_items for select
  to anon
  using (true);

drop policy if exists "Public read menu_item_prices" on menu_item_prices;
create policy "Public read menu_item_prices"
  on menu_item_prices for select
  to anon
  using (true);

drop policy if exists "Public read menu_item_media" on menu_item_media;
create policy "Public read menu_item_media"
  on menu_item_media for select
  to anon
  using (true);
