/*
  # Add Image Position and Zoom Controls

  ## Changes Made
  
  1. Hero Slides Positioning
    - Add `position_x` column (percentage -50 to 50, default 0)
    - Add `position_y` column (percentage -50 to 50, default 0)
    - Add `zoom` column (scale 0.5 to 3.0, default 1.0)
    - These allow admins to reposition and zoom images within the hero slider
  
  ## Security Notes
  - No RLS changes needed
  - All columns have safe default values
*/

-- Add position and zoom columns to hero_slides
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'position_x'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN position_x integer DEFAULT 0 CHECK (position_x >= -50 AND position_x <= 50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'position_y'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN position_y integer DEFAULT 0 CHECK (position_y >= -50 AND position_y <= 50);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hero_slides' AND column_name = 'zoom'
  ) THEN
    ALTER TABLE hero_slides ADD COLUMN zoom numeric(3,2) DEFAULT 1.0 CHECK (zoom >= 0.5 AND zoom <= 3.0);
  END IF;
END $$;
