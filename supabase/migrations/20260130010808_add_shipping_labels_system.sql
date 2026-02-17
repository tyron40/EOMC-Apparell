/*
  # Add Shipping Labels System

  1. Changes to Orders Table
    - Add `tracking_number` (text) - Tracking number from carrier
    - Add `carrier` (text) - Shipping carrier name (USPS, FedEx, UPS, DHL, etc.)
    - Add `shipping_date` (timestamptz) - Date when order was shipped
    - Add `label_url` (text) - URL to shipping label PDF/image
    - Add `shipping_notes` (text) - Internal notes about shipping
    - Add `weight` (numeric) - Package weight in pounds
    - Add `dimensions` (jsonb) - Package dimensions {length, width, height}

  2. Security
    - Admin users can update shipping information
    - Public users can view tracking info on their orders

  3. Notes
    - This enables complete shipping label management
    - Orders can be marked as 'shipped' with tracking information
    - Admins can generate and attach shipping labels
*/

-- Add shipping-related columns to orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'tracking_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN tracking_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'carrier'
  ) THEN
    ALTER TABLE orders ADD COLUMN carrier text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_date'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'label_url'
  ) THEN
    ALTER TABLE orders ADD COLUMN label_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'shipping_notes'
  ) THEN
    ALTER TABLE orders ADD COLUMN shipping_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'weight'
  ) THEN
    ALTER TABLE orders ADD COLUMN weight numeric;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'dimensions'
  ) THEN
    ALTER TABLE orders ADD COLUMN dimensions jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create index on tracking number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Update RLS policies to allow admins to update shipping information
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'orders' AND policyname = 'Admins can update orders'
  ) THEN
    CREATE POLICY "Admins can update orders"
      ON orders FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'orders' AND policyname = 'Admins can view all orders'
  ) THEN
    CREATE POLICY "Admins can view all orders"
      ON orders FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.id = auth.uid()
        )
      );
  END IF;
END $$;
