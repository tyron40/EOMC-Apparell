-- EOMC Complete CMS System
-- This migration adds all tables needed for full admin control over the site

-- 1. Site Settings (logo, colors, contact info, social media)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  site_title TEXT DEFAULT 'EYES OPEN MOUTHS CLOSED',
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  accent_color TEXT DEFAULT '#FF0000',
  font_family TEXT DEFAULT 'Inter',
  contact_email TEXT DEFAULT 'eyesopenmouthsclosed@gmail.com',
  contact_phone TEXT DEFAULT '1-xxx-xxx-xxxx',
  instagram_url TEXT DEFAULT 'https://instagram.com',
  facebook_url TEXT DEFAULT 'https://facebook.com',
  tiktok_url TEXT DEFAULT 'https://tiktok.com',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- 2. Hero Carousel Slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Photo Gallery
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Video Billboard
CREATE TABLE IF NOT EXISTS video_billboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT,
  poster_image_url TEXT,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default video billboard
INSERT INTO video_billboard (title, subtitle, is_active) 
VALUES ('EYES OPEN MOUTHS CLOSED', 'Premium Streetwear Collection', true)
ON CONFLICT DO NOTHING;

-- 5. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_photo_url TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Custom Pages
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  show_in_header BOOLEAN DEFAULT false,
  show_in_footer BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default pages
INSERT INTO pages (slug, title, content, is_published, show_in_footer, order_index) VALUES
('about', 'About Us', '<h1>About EOMC</h1><p>Eyes Open Mouths Closed - Premium streetwear brand.</p>', true, true, 1),
('contact', 'Contact', '<h1>Contact Us</h1><p>Get in touch with us.</p>', true, true, 2),
('faq', 'FAQ', '<h1>Frequently Asked Questions</h1>', true, true, 3),
('shipping', 'Shipping & Returns', '<h1>Shipping & Returns Policy</h1>', true, true, 4),
('privacy', 'Privacy Policy', '<h1>Privacy Policy</h1>', true, true, 5),
('terms', 'Terms & Conditions', '<h1>Terms & Conditions</h1>', true, true, 6),
('size-guide', 'Size Guide', '<h1>Size Guide</h1>', true, true, 7)
ON CONFLICT (slug) DO NOTHING;

-- 7. Navigation Menu Items
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('header', 'footer')),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default navigation
INSERT INTO navigation_items (label, url, location, order_index, is_active) VALUES
('Home', '/', 'header', 1, true),
('Products', '/products', 'header', 2, true),
('About', '/pages/about', 'footer', 1, true),
('Contact', '/pages/contact', 'footer', 2, true),
('FAQ', '/pages/faq', 'footer', 3, true),
('Shipping & Returns', '/pages/shipping', 'footer', 4, true)
ON CONFLICT DO NOTHING;

-- 8. Homepage Sections Control
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT UNIQUE NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  custom_title TEXT,
  custom_subtitle TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default homepage sections
INSERT INTO homepage_sections (section_name, is_visible, order_index, custom_title) VALUES
('hero_carousel', true, 1, NULL),
('photo_gallery', true, 2, 'LIFESTYLE'),
('collections', true, 3, 'COLLECTIONS'),
('video_billboard', true, 4, NULL),
('top_sellers', true, 5, 'TOP SELLERS'),
('new_arrivals', true, 6, 'NEW ARRIVALS'),
('testimonials', true, 7, 'What they''re saying')
ON CONFLICT (section_name) DO NOTHING;

-- RLS Policies

-- Site Settings: Public read, admin write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Hero Slides: Public read active, admin full access
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active hero slides"
  ON hero_slides FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage hero slides"
  ON hero_slides FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Gallery Photos: Public read active, admin full access
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gallery photos"
  ON gallery_photos FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage gallery photos"
  ON gallery_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Video Billboard: Public read active, admin full access
ALTER TABLE video_billboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active video billboard"
  ON video_billboard FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage video billboard"
  ON video_billboard FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Testimonials: Public read active, admin full access
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active testimonials"
  ON testimonials FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Pages: Public read published, admin full access
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published pages"
  ON pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Navigation Items: Public read active, admin full access
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active navigation items"
  ON navigation_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage navigation items"
  ON navigation_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Homepage Sections: Public read, admin write
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homepage sections"
  ON homepage_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage homepage sections"
  ON homepage_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_slides_active_order ON hero_slides(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_active_order ON gallery_photos(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_testimonials_active_order ON testimonials(is_active, order_index);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_navigation_items_location_order ON navigation_items(location, order_index);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_visible_order ON homepage_sections(is_visible, order_index);
