/*
  # Complete Product Schema Fix

  1. Add missing fields to products table
  2. Add missing fields to custom_pages table
  3. Update all products with proper data
*/

DO $$
BEGIN
  -- Add missing product fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_fit') THEN
    ALTER TABLE products ADD COLUMN image_fit text DEFAULT 'contain';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'position_x') THEN
    ALTER TABLE products ADD COLUMN position_x int DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'position_y') THEN
    ALTER TABLE products ADD COLUMN position_y int DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'zoom') THEN
    ALTER TABLE products ADD COLUMN zoom decimal(3,2) DEFAULT 1.0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_quantity') THEN
    ALTER TABLE products ADD COLUMN stock_quantity int DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'low_stock_threshold') THEN
    ALTER TABLE products ADD COLUMN low_stock_threshold int DEFAULT 5;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
    ALTER TABLE products ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_available') THEN
    ALTER TABLE products ADD COLUMN is_available boolean DEFAULT true;
  END IF;
END $$;

-- Create custom_pages table if it doesn't exist
CREATE TABLE IF NOT EXISTS custom_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  nav_order int DEFAULT 0,
  show_in_nav boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom pages are publicly readable"
  ON custom_pages FOR SELECT
  TO public
  USING (active = true);

-- Update all products with real Pexels images and complete data
UPDATE products SET 
  image_url = 'https://images.pexels.com/photos/2620712/pexels-photo-2620712.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
  image_fit = 'cover',
  stock_quantity = 25,
  is_featured = true,
  is_available = true
WHERE slug = 'statement-tee-orange-cream';

UPDATE products SET 
  image_url = 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
  image_fit = 'cover',
  stock_quantity = 20,
  is_featured = true,
  is_available = true
WHERE slug = 'statement-tee-black-rose';

UPDATE products SET 
  image_url = 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
  image_fit = 'cover',
  stock_quantity = 15,
  is_featured = true,
  is_available = true
WHERE slug = 'statement-tee-sugar-plum';

UPDATE products SET 
  image_url = 'https://images.pexels.com/photos/1559827/pexels-photo-1559827.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
  image_fit = 'cover',
  stock_quantity = 18,
  is_featured = true,
  is_available = true
WHERE slug = 'statement-tee-blk-carolina';

UPDATE products SET 
  image_url = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
  image_fit = 'cover',
  stock_quantity = 22,
  is_featured = true,
  is_available = true
WHERE slug = 'statement-tee-cotton-candy';

UPDATE products SET 
  image_url = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
  image_fit = 'cover',
  stock_quantity = 20,
  is_featured = true,
  is_available = true
WHERE slug = 'statement-tee-carolina-classic';

UPDATE products SET 
  image_url = 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?auto=compress&cs=tinysrgb&w=500&h=600&dpr=1',
  image_fit = 'cover',
  stock_quantity = 12,
  is_featured = true,
  is_available = true
WHERE slug = 'pretty-paid-putup-tee-blk';

-- Update all remaining products with stock quantity
UPDATE products SET 
  stock_quantity = COALESCE(stock_quantity, 0),
  low_stock_threshold = 5,
  is_available = true
WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- Update hero slides with real images
UPDATE hero_slides SET 
  image_url = 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1',
  title = 'EYES OPEN MOUTHS CLOSED',
  subtitle = 'Premium Streetwear',
  active = true
WHERE position = 1;

-- Update photo gallery with proper images
UPDATE photo_gallery SET 
  image_url = 'https://images.pexels.com/photos/2620712/pexels-photo-2620712.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1'
WHERE position = 1;

UPDATE photo_gallery SET 
  image_url = 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1'
WHERE position = 2;

UPDATE photo_gallery SET 
  image_url = 'https://images.pexels.com/photos/1559827/pexels-photo-1559827.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1'
WHERE position = 3;

UPDATE photo_gallery SET 
  image_url = 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1'
WHERE position = 4;

UPDATE photo_gallery SET 
  image_url = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&dpr=1'
WHERE position = 5;

-- Update collections with proper images
UPDATE collections SET 
  image_url = 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
WHERE position = 1;

UPDATE collections SET 
  image_url = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
WHERE position = 2;

UPDATE collections SET 
  image_url = 'https://images.pexels.com/photos/1559827/pexels-photo-1559827.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
WHERE position = 3;

UPDATE collections SET 
  image_url = 'https://images.pexels.com/photos/2620712/pexels-photo-2620712.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
WHERE position = 4;

UPDATE collections SET 
  image_url = 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
WHERE position = 5;

UPDATE collections SET 
  image_url = 'https://images.pexels.com/photos/1426170/pexels-photo-1426170.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
WHERE position = 6;
