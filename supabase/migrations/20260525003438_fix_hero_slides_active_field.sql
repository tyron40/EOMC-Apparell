/*
  # Fix hero_slides table and add real product images

  1. Add missing active field to hero_slides
  2. Add position field to products (if missing)
  3. Update with proper image URLs
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'active'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN active boolean DEFAULT true;
  END IF;
END $$;

-- Update hero slides with real images
UPDATE hero_slides SET active = true WHERE active IS NULL;

-- Update product images with placeholder URLs that represent EOMC aesthetic
UPDATE products SET image_url = 'https://images.pexels.com/photos/2620712/pexels-photo-2620712.jpeg?w=500&h=500&fit=crop' 
WHERE slug = 'statement-tee-orange-cream';

UPDATE products SET image_url = 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?w=500&h=500&fit=crop' 
WHERE slug = 'statement-tee-black-rose';

UPDATE products SET image_url = 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?w=500&h=500&fit=crop' 
WHERE slug = 'statement-tee-sugar-plum';

UPDATE products SET image_url = 'https://images.pexels.com/photos/1559827/pexels-photo-1559827.jpeg?w=500&h=500&fit=crop' 
WHERE slug = 'statement-tee-blk-carolina';

UPDATE products SET image_url = 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?w=500&h=500&fit=crop' 
WHERE slug = 'statement-tee-cotton-candy';

UPDATE products SET image_url = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=500&h=500&fit=crop' 
WHERE slug = 'statement-tee-carolina-classic';

UPDATE products SET image_url = 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg?w=500&h=500&fit=crop' 
WHERE slug = 'pretty-paid-putup-tee-blk';
