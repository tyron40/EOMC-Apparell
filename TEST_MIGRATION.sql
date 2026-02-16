-- ============================================
-- TEST MIGRATION RESULTS
-- ============================================
-- Run this in Supabase SQL Editor to verify the migration worked

-- 1. CHECK ALL TABLES EXIST
SELECT 
  'site_logo' as table_name,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'site_logo'
  ) as exists
UNION ALL
SELECT 
  'navigation_pages',
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'navigation_pages'
  )
UNION ALL
SELECT 
  'gallery_photos',
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'gallery_photos'
  )
UNION ALL
SELECT 
  'testimonials',
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'testimonials'
  )
UNION ALL
SELECT 
  'video_billboard',
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'video_billboard'
  );

-- 2. CHECK TABLE STRUCTURES
SELECT 
  'site_logo columns' as info,
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position) as details
FROM information_schema.columns
WHERE table_name = 'site_logo'
UNION ALL
SELECT 
  'navigation_pages columns',
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position)
FROM information_schema.columns
WHERE table_name = 'navigation_pages'
UNION ALL
SELECT 
  'gallery_photos columns',
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position)
FROM information_schema.columns
WHERE table_name = 'gallery_photos'
UNION ALL
SELECT 
  'testimonials columns',
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position)
FROM information_schema.columns
WHERE table_name = 'testimonials'
UNION ALL
SELECT 
  'video_billboard columns',
  string_agg(column_name || ' (' || data_type || ')', ', ' ORDER BY ordinal_position)
FROM information_schema.columns
WHERE table_name = 'video_billboard';

-- 3. CHECK RLS IS ENABLED
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('site_logo', 'navigation_pages', 'gallery_photos', 'testimonials', 'video_billboard')
ORDER BY tablename;

-- 4. CHECK POLICIES EXIST
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('site_logo', 'navigation_pages', 'gallery_photos', 'testimonials', 'video_billboard')
ORDER BY tablename, policyname;

-- 5. CHECK STORAGE BUCKETS
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE id IN ('site-assets', 'hero-slides', 'gallery', 'videos')
ORDER BY name;

-- 6. CHECK STORAGE POLICIES
SELECT 
  bucket_id,
  name as policy_name,
  definition
FROM storage.policies
WHERE bucket_id IN ('site-assets', 'hero-slides', 'gallery', 'videos')
ORDER BY bucket_id, name;

-- 7. TEST INSERT (as admin) - This will verify admin policies work
-- Note: Replace 'YOUR_ADMIN_USER_ID' with your actual admin user ID
-- You can get it from: SELECT id FROM admin_users WHERE role = 'admin';

-- Uncomment and run these after replacing YOUR_ADMIN_USER_ID:
/*
-- Test site_logo insert
INSERT INTO site_logo (image_url, alt_text)
VALUES ('https://example.com/test-logo.png', 'Test Logo')
RETURNING *;

-- Test navigation_pages insert
INSERT INTO navigation_pages (title, slug, content, is_active)
VALUES ('Test Page', 'test-page', 'Test content', true)
RETURNING *;

-- Test gallery_photos insert
INSERT INTO gallery_photos (image_url, title, is_active)
VALUES ('https://example.com/test-photo.jpg', 'Test Photo', true)
RETURNING *;

-- Test testimonials insert
INSERT INTO testimonials (customer_name, content, rating, is_active)
VALUES ('Test Customer', 'Great service!', 5, true)
RETURNING *;

-- Test video_billboard insert
INSERT INTO video_billboard (video_url, title, is_active)
VALUES ('https://example.com/test-video.mp4', 'Test Video', true)
RETURNING *;
*/

-- 8. CLEANUP TEST DATA (run after testing)
/*
DELETE FROM site_logo WHERE alt_text = 'Test Logo';
DELETE FROM navigation_pages WHERE slug = 'test-page';
DELETE FROM gallery_photos WHERE title = 'Test Photo';
DELETE FROM testimonials WHERE customer_name = 'Test Customer';
DELETE FROM video_billboard WHERE title = 'Test Video';
*/
