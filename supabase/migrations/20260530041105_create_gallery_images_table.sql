/*
  # Create gallery_images table

  The PhotoGallery component queries 'gallery_images' with 'order' and 'active' fields.
  This migration creates that table and populates it with placeholder images until
  the admin uploads the actual EOMC brand photos.

  1. New Tables
    - `gallery_images` - Stores slider images shown under hero carousel
      - `id` (uuid, primary key)
      - `image_url` (text) - full URL to image
      - `order` (int) - display order
      - `active` (boolean) - whether to show

  2. Security
    - Enable RLS
    - Public read for active images
    - Admin write access
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  "order" int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery images are publicly readable"
  ON gallery_images FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Admins can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_id = auth.uid() AND is_admin = true
    )
  );

-- Insert 5 placeholder images matching the portrait orientation of EOMC photos
INSERT INTO gallery_images (image_url, "order", active) VALUES
  ('https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1', 1, true),
  ('https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1', 2, true),
  ('https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1', 3, true),
  ('https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1', 4, true),
  ('https://images.pexels.com/photos/2620712/pexels-photo-2620712.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1', 5, true);
