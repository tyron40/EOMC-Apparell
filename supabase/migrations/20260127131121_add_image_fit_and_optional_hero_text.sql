/*
  # Add Image Fit Options and Optional Hero Text

  ## Changes Made
  
  1. Image Fit Options
    - Add `image_fit` column to hero_slides (contain, cover, fill)
    - Add `image_fit` column to gallery_images
    - Add `image_fit` column to products
    - Add `image_fit` column to categories
    - Default to 'contain' for all tables
  
  2. Optional Hero Text
    - Make `title` and `subtitle` nullable in hero_slides
    - Allow hero slides with just images, no text required
  
  ## Security Notes
  - No RLS changes needed
  - All columns have safe default values
*/

-- Add image_fit column to hero_slides and make text optional
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'image_fit'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN image_fit text DEFAULT 'contain' CHECK (image_fit IN ('contain', 'cover', 'fill'));
  END IF;
END $$;

-- Make title and subtitle optional in hero_slides
ALTER TABLE hero_slides ALTER COLUMN title DROP NOT NULL;
ALTER TABLE hero_slides ALTER COLUMN title DROP DEFAULT;
ALTER TABLE hero_slides ALTER COLUMN subtitle DROP NOT NULL;
ALTER TABLE hero_slides ALTER COLUMN subtitle DROP DEFAULT;

-- Add image_fit column to gallery_images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_images' AND column_name = 'image_fit'
  ) THEN
    ALTER TABLE gallery_images ADD COLUMN image_fit text DEFAULT 'contain' CHECK (image_fit IN ('contain', 'cover', 'fill'));
  END IF;
END $$;

-- Add image_fit column to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_fit'
  ) THEN
    ALTER TABLE products ADD COLUMN image_fit text DEFAULT 'contain' CHECK (image_fit IN ('contain', 'cover', 'fill'));
  END IF;
END $$;

-- Add image_fit column to categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'image_fit'
  ) THEN
    ALTER TABLE categories ADD COLUMN image_fit text DEFAULT 'contain' CHECK (image_fit IN ('contain', 'cover', 'fill'));
  END IF;
END $$;
