/*
  # Add Site Content Management Tables

  1. New Tables
    - `hero_slides`
      - `id` (uuid, primary key)
      - `image_url` (text) - URL of the hero image
      - `title` (text) - Main heading text
      - `subtitle` (text) - Subheading text
      - `order` (integer) - Display order for slideshow
      - `active` (boolean) - Whether slide is active
      - `created_at` (timestamp)
    
    - `gallery_images`
      - `id` (uuid, primary key)
      - `image_url` (text) - URL of gallery image
      - `order` (integer) - Display order
      - `active` (boolean) - Whether image is active
      - `created_at` (timestamp)
    
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Setting key (logo_url, site_name, etc.)
      - `value` (text) - Setting value
      - `updated_at` (timestamp)
    
    - `navigation_items`
      - `id` (uuid, primary key)
      - `label` (text) - Navigation label
      - `url` (text) - Navigation URL
      - `order` (integer) - Display order
      - `active` (boolean) - Whether item is active
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public can read active content
    - Only authenticated admins can modify

  3. Initial Data
    - Default hero slide
    - Default gallery images
    - Default logo and site settings
    - Default navigation items
*/

-- Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text DEFAULT 'EXCLUSIVE STREETWEAR',
  subtitle text DEFAULT 'Limited Edition Drops',
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero slides"
  ON hero_slides FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can insert hero slides"
  ON hero_slides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update hero slides"
  ON hero_slides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can delete hero slides"
  ON hero_slides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gallery images"
  ON gallery_images FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Navigation Items Table
CREATE TABLE IF NOT EXISTS navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  "order" integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active navigation items"
  ON navigation_items FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can insert navigation items"
  ON navigation_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update navigation items"
  ON navigation_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can delete navigation items"
  ON navigation_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Insert default hero slide
INSERT INTO hero_slides (image_url, title, subtitle, "order", active) VALUES
  ('https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1920', 'EXCLUSIVE STREETWEAR', 'Limited Edition Drops', 1, true)
ON CONFLICT DO NOTHING;

-- Insert default gallery images
INSERT INTO gallery_images (image_url, "order", active) VALUES
  ('https://images.pexels.com/photos/1311590/pexels-photo-1311590.jpeg?auto=compress&cs=tinysrgb&w=400', 1, true),
  ('https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400', 2, true),
  ('https://images.pexels.com/photos/1689516/pexels-photo-1689516.jpeg?auto=compress&cs=tinysrgb&w=400', 3, true),
  ('https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400', 4, true),
  ('https://images.pexels.com/photos/1261422/pexels-photo-1261422.jpeg?auto=compress&cs=tinysrgb&w=400', 5, true)
ON CONFLICT DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('logo_url', 'https://images.pexels.com/photos/1192601/pexels-photo-1192601.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('site_name', 'STORE'),
  ('video_url', 'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4'),
  ('footer_text', '© 2024 Your Store. All rights reserved.')
ON CONFLICT (key) DO NOTHING;

-- Insert default navigation items
INSERT INTO navigation_items (label, url, "order", active) VALUES
  ('Home', '/', 1, true),
  ('Products', '/products', 2, true),
  ('Cart', '/cart', 3, true)
ON CONFLICT DO NOTHING;