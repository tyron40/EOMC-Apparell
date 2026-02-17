/*
  # Add Stock Management and Admin System

  ## Changes Made
  1. New Columns
    - Add `stock_quantity` column to products table with default value of 0
    - Add `low_stock_threshold` column to products table with default value of 5
    - Add `is_available` column to products table with default value of true

  2. New Tables
    - `admin_users` table to track admin roles
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `role` (text, defaults to 'admin')
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on admin_users table
    - Add policies for admin user management
    - Update products table policies to allow admin modifications

  4. Important Notes
    - Only authenticated admin users can modify products
    - Admin users table links to Supabase auth.users
    - Stock tracking enabled for inventory management
*/

-- Add stock management columns to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 100;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'low_stock_threshold'
  ) THEN
    ALTER TABLE products ADD COLUMN low_stock_threshold integer DEFAULT 5;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'is_available'
  ) THEN
    ALTER TABLE products ADD COLUMN is_available boolean DEFAULT true;
  END IF;
END $$;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can view their own records
CREATE POLICY "Admins can view own record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Only existing admins can insert new admin users
CREATE POLICY "Admins can create other admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Products: Allow admin users to update products
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Products: Allow admin users to insert products
CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Products: Allow admin users to delete products
CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
