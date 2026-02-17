/*
  # Create Storage Buckets for Media Files

  1. Storage Buckets
    - `images` - For all image uploads (products, hero, gallery, logos, etc.)
    - `videos` - For video uploads
  
  2. Security
    - Public read access for all files
    - Authenticated admins can upload files
    - Authenticated admins can delete files
  
  3. Configuration
    - Maximum file size: 50MB for images, 500MB for videos
    - Allowed MIME types configured for security
*/

-- Create images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create videos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Storage policies for videos bucket
CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Admins can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

CREATE POLICY "Admins can delete videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'videos'
    AND EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );