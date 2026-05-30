/*
  # Create storage buckets for site images

  Creates public storage buckets for:
  - site-assets: hero images, gallery images, collection images
  - product-images: product photos
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('site-assets', 'site-assets', true, 52428800, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']),
  ('product-images', 'product-images', true, 52428800, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Public read for both buckets
CREATE POLICY "Public read site-assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'site-assets');

CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

-- Authenticated upload for both buckets
CREATE POLICY "Authenticated upload site-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated upload product-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated update site-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated update product-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated delete site-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated delete product-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');
