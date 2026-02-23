/*
  # Add Admin Policies for Categories

  1. Security Changes
    - Add policy for admins to insert categories
    - Add policy for admins to update categories
    - Add policy for admins to delete categories

  2. Important Notes
    - Only authenticated admin users can modify categories
    - Public users can still view categories
*/

-- Categories: Allow admin users to insert categories
CREATE POLICY "Admins can insert categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Categories: Allow admin users to update categories
CREATE POLICY "Admins can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );

-- Categories: Allow admin users to delete categories
CREATE POLICY "Admins can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );