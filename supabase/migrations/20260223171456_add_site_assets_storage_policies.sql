/*
  # Add Storage Policies for site-assets Bucket

  1. Changes
    - Add policies for site-assets bucket to allow admin uploads
    - Allow public read access for all files in site-assets
  
  2. Security
    - Admins (users in admin_users table) can upload, update, and delete files
    - Public can view all files in the bucket
*/

-- Drop existing policies for site-assets if any
DROP POLICY IF EXISTS "Admins can upload to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view site-assets" ON storage.objects;

-- Create new policies for site-assets bucket
CREATE POLICY "Admins can upload to site-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'site-assets'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can update site-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'site-assets'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    bucket_id = 'site-assets'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete from site-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'site-assets'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Public can view site-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');