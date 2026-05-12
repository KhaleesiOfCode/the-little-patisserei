CREATE TABLE IF NOT EXISTS store_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  manual_closed boolean DEFAULT false,
  closure_starts_at timestamptz,
  closure_ends_at timestamptz,
  closure_reason text,
  updated_at timestamptz DEFAULT now(),
  updated_by text
);

INSERT INTO store_settings (manual_closed) VALUES (false)
ON CONFLICT DO NOTHING;
