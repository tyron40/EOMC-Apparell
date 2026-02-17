/*
  # Fix Storage Policies for Admin Users

  1. Changes
    - Drop existing storage policies that check raw_user_meta_data
    - Create new policies that check the admin_users table instead
  
  2. Security
    - Admins (users in admin_users table) can upload, update, and delete files
    - Public can view all files in both buckets
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete videos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view videos" ON storage.objects;

-- Create new policies for images bucket
CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Create new policies for videos bucket
CREATE POLICY "Admins can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');