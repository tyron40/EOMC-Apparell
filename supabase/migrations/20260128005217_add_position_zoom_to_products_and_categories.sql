/*
  # Add Position and Zoom Controls to Products and Categories

  ## Changes Made
  
  1. Products Table
    - Add `position_x` column (percentage -50 to 50, default 0)
    - Add `position_y` column (percentage -50 to 50, default 0)
    - Add `zoom` column (scale 0.5 to 3.0, default 1.0)
  
  2. Categories Table
    - Add `position_x` column (percentage -50 to 50, default 0)
    - Add `position_y` column (percentage -50 to 50, default 0)
    - Add `zoom` column (scale 0.5 to 3.0, default 1.0)
  
  ## Security Notes
  - No RLS changes needed
  - All columns have safe default values
*/

-- Add position and zoom columns to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'position_x'
  ) THEN
    ALTER TABLE products ADD COLUMN position_x integer DEFAULT 0 CHECK (position_x >= -50 AND position_x <= 50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'position_y'
  ) THEN
    ALTER TABLE products ADD COLUMN position_y integer DEFAULT 0 CHECK (position_y >= -50 AND position_y <= 50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'zoom'
  ) THEN
    ALTER TABLE products ADD COLUMN zoom numeric(3,2) DEFAULT 1.0 CHECK (zoom >= 0.5 AND zoom <= 3.0);
  END IF;
END $$;

-- Add position and zoom columns to categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'position_x'
  ) THEN
    ALTER TABLE categories ADD COLUMN position_x integer DEFAULT 0 CHECK (position_x >= -50 AND position_x <= 50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'position_y'
  ) THEN
    ALTER TABLE categories ADD COLUMN position_y integer DEFAULT 0 CHECK (position_y >= -50 AND position_y <= 50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'zoom'
  ) THEN
    ALTER TABLE categories ADD COLUMN zoom numeric(3,2) DEFAULT 1.0 CHECK (zoom >= 0.5 AND zoom <= 3.0);
  END IF;
END $$;
