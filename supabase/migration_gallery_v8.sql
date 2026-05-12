CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

drop policy if exists "Public read gallery_images" on gallery_images;
create policy "Public read gallery_images"
  on gallery_images for select
  to anon
  using (true);
