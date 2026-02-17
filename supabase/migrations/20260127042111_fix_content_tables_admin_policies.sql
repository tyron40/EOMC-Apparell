/*
  # Fix Content Tables Admin Policies

  ## Changes Made
  1. Drop old policies that check raw_user_meta_data
  2. Create new policies that check the admin_users table instead
  
  ## Tables Updated
  - hero_slides
  - gallery_images
  - site_settings
  - navigation_items
  
  ## Security Notes
  - All admin operations now check the admin_users table
  - Public users can still view active content
  - Only authenticated admins can modify content
*/

-- ========================================
-- HERO SLIDES POLICIES
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins can insert hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Admins can update hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Admins can delete hero slides" ON hero_slides;

-- Create new policies
CREATE POLICY "Admins can insert hero slides"
  ON hero_slides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update hero slides"
  ON hero_slides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete hero slides"
  ON hero_slides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ========================================
-- GALLERY IMAGES POLICIES
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins can insert gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON gallery_images;

-- Create new policies
CREATE POLICY "Admins can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ========================================
-- SITE SETTINGS POLICIES
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins can insert site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;

-- Create new policies
CREATE POLICY "Admins can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Add delete policy for completeness
CREATE POLICY "Admins can delete site settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- ========================================
-- NAVIGATION ITEMS POLICIES
-- ========================================

-- Drop old policies
DROP POLICY IF EXISTS "Admins can insert navigation items" ON navigation_items;
DROP POLICY IF EXISTS "Admins can update navigation items" ON navigation_items;
DROP POLICY IF EXISTS "Admins can delete navigation items" ON navigation_items;

-- Create new policies
CREATE POLICY "Admins can insert navigation items"
  ON navigation_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update navigation items"
  ON navigation_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete navigation items"
  ON navigation_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
