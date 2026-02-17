-- ============================================
-- COMPLETE CMS SETUP - TABLES + POLICIES
-- ============================================

-- 1. CREATE ALL TABLES
CREATE TABLE IF NOT EXISTS site_logo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT DEFAULT 'EOMC Logo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS navigation_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_title TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_billboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('site-assets', 'site-assets', true),
  ('hero-slides', 'hero-slides', true),
  ('gallery', 'gallery', true),
  ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. ENABLE RLS
ALTER TABLE site_logo ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_billboard ENABLE ROW LEVEL SECURITY;

-- 4. CREATE POLICIES FOR TABLES

-- site_logo
CREATE POLICY "Public can view site_logo"
  ON site_logo FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage site_logo"
  ON site_logo FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- navigation_pages
CREATE POLICY "Public can view navigation_pages"
  ON navigation_pages FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage navigation_pages"
  ON navigation_pages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- gallery_photos
CREATE POLICY "Public can view gallery_photos"
  ON gallery_photos FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage gallery_photos"
  ON gallery_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- testimonials
CREATE POLICY "Public can view testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- video_billboard
CREATE POLICY "Public can view video_billboard"
  ON video_billboard FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage video_billboard"
  ON video_billboard FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- 5. DROP EXISTING STORAGE POLICIES (if any)
DROP POLICY IF EXISTS "Public can view site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view hero-slides" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to hero-slides" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update hero-slides" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from hero-slides" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public can view videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete from videos" ON storage.objects;

-- 6. CREATE STORAGE POLICIES

-- site-assets
CREATE POLICY "Public can view site-assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload to site-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'site-assets' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update site-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'site-assets' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete from site-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'site-assets' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- hero-slides
CREATE POLICY "Public can view hero-slides"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'hero-slides');

CREATE POLICY "Admins can upload to hero-slides"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hero-slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update hero-slides"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hero-slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete from hero-slides"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hero-slides' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- gallery
CREATE POLICY "Public can view gallery"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload to gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gallery' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update gallery"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'gallery' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete from gallery"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'gallery' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- videos
CREATE POLICY "Public can view videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'videos');

CREATE POLICY "Admins can upload to videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete from videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );
