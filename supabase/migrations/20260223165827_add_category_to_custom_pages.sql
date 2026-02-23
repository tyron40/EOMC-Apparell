/*
  # Add Category to Custom Pages

  1. Changes
    - Add `category_id` column to `custom_pages` table
    - This allows custom pages to display products from a specific category

  2. Security
    - No RLS changes needed (existing policies cover the new column)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_pages' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE custom_pages ADD COLUMN category_id uuid REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;