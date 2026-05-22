/*
  # Populate Categories and Products

  1. Categories
    - Shirts, Shorts, Hoodies, Sweaters, Leather Sets, PPP Sets, Jerseys
  
  2. Products
    - Statement Tees in multiple colors
    - Pretty Paid & Putup Tee
    - Hoodies and apparel items
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, position) VALUES
  ('Shirts', 'shirts', 'Premium statement tees and casual shirts', 1),
  ('Shorts', 'shorts', 'High-quality shorts collection', 2),
  ('Hoodies', 'hoodies', 'Comfortable hoodies and sweatshirts', 3),
  ('Sweaters', 'sweaters', 'Luxury sweater collection', 4),
  ('Leather Sets', 'leather-sets', 'Premium leather apparel sets', 5),
  ('PPP SETS', 'ppp-sets', 'Exclusive PPP collection sets', 6),
  ('Jerseys', 'jerseys', 'Performance jerseys', 7)
ON CONFLICT DO NOTHING;

-- Insert Products - Shirts Category
INSERT INTO products (category_id, name, slug, description, price, sizes, colors, stock, featured, position)
SELECT 
  (SELECT id FROM categories WHERE slug = 'shirts'),
  name, slug, description, price, sizes, colors, stock, featured, position
FROM (
  VALUES
    ('Statement Tee (Orange C.R.E.A.M)', 'statement-tee-orange-cream', 'Premium cotton statement tee with CREAM collection graphics', 35.00, 'S,M,L,XL,XXL', 'Orange,White', 25, true, 1),
    ('Statement Tee (Black Rose)', 'statement-tee-black-rose', 'Black rose collection statement tee with vibrant graphics', 35.00, 'S,M,L,XL,XXL', 'Black,White', 20, true, 2),
    ('Statement Tee (Sugar Plum)', 'statement-tee-sugar-plum', 'Sugar plum collection premium tee with embroidered details', 35.00, 'S,M,L,XL,XXL', 'Pink,Lavender', 15, true, 3),
    ('Statement Tee (BLK Carolina)', 'statement-tee-blk-carolina', 'Black Carolina collection statement tee', 35.00, 'S,M,L,XL,XXL', 'Black,Navy', 18, true, 4),
    ('Statement Tee (Cotton Candy)', 'statement-tee-cotton-candy', 'Cotton candy collection with pastel graphics', 35.00, 'S,M,L,XL,XXL', 'Mint,Pink', 22, true, 5),
    ('Statement Tee (Carolina Classic)', 'statement-tee-carolina-classic', 'Carolina classic collection premium tee', 35.00, 'S,M,L,XL,XXL', 'Cream,Navy', 20, true, 6),
    ('Pretty Paid & Putup Tee (BLK)', 'pretty-paid-putup-tee-blk', 'Pretty Paid & Putup collection black tee with photo graphics', 40.00, 'S,M,L,XL,XXL', 'Black', 12, true, 7)
) AS t(name, slug, description, price, sizes, colors, stock, featured, position)
ON CONFLICT (slug) DO NOTHING;

-- Insert Hero Slides
INSERT INTO hero_slides (image_url, title, subtitle, position) VALUES
  ('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&h=600&fit=crop', 'EYES OPEN MOUTHS CLOSED', 'Premium Streetwear Collection', 1),
  ('https://images.unsplash.com/photo-1552062407-291826ad9196?w=1200&h=600&fit=crop', 'New Arrivals', 'Fresh styles just dropped', 2)
ON CONFLICT DO NOTHING;

-- Insert Photo Gallery
INSERT INTO photo_gallery (image_url, title, position) VALUES
  ('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 'Gallery 1', 1),
  ('https://images.unsplash.com/photo-1505886657187-36d3c3c51e8f?w=400&h=500&fit=crop', 'Gallery 2', 2),
  ('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop', 'Gallery 3', 3),
  ('https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400&h=500&fit=crop', 'Gallery 4', 4),
  ('https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop', 'Gallery 5', 5)
ON CONFLICT DO NOTHING;

-- Insert Collections
INSERT INTO collections (name, image_url, category_id, position) VALUES
  ('Statement Tees', 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=500&h=500&fit=crop', (SELECT id FROM categories WHERE slug = 'shirts'), 1),
  ('Premium Hoodies', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', (SELECT id FROM categories WHERE slug = 'hoodies'), 2),
  ('Shorts Collection', 'https://images.unsplash.com/photo-1506629082632-01d0d88d7d7d?w=500&h=500&fit=crop', (SELECT id FROM categories WHERE slug = 'shorts'), 3),
  ('Leather Sets', 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop', (SELECT id FROM categories WHERE slug = 'leather-sets'), 4),
  ('PPP Sets', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500&h=500&fit=crop', (SELECT id FROM categories WHERE slug = 'ppp-sets'), 5),
  ('Jerseys', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', (SELECT id FROM categories WHERE slug = 'jerseys'), 6)
ON CONFLICT DO NOTHING;

-- Insert Testimonials
INSERT INTO testimonials (author_name, author_avatar, content, rating, position) VALUES
  ('Alex M.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', 'EOMC has the best quality streetwear. The Statement Tees are incredible!', 5, 1),
  ('Jordan K.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', 'Premium quality and amazing customer service. Highly recommend!', 5, 2),
  ('Sam T.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 'The designs are fire. Been a customer since day one.', 5, 3),
  ('Casey L.', 'https://images.unsplash.com/photo-1507528148343-53fc97d8ec43?w=100&h=100&fit=crop', 'Worth every penny. Best investment in my wardrobe.', 5, 4)
ON CONFLICT DO NOTHING;

-- Insert Site Settings
INSERT INTO site_settings (logo_text, site_title, site_description) VALUES
  ('EOMC', 'EYES OPEN MOUTHS CLOSED', 'Premium Streetwear Collection - Discover EOMC exclusive apparel')
ON CONFLICT DO NOTHING;

-- Insert Video Section
INSERT INTO video_sections (title, video_url, description, position) VALUES
  ('EOMC Collection Showcase', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Experience the premium EOMC streetwear collection', 1)
ON CONFLICT DO NOTHING;
