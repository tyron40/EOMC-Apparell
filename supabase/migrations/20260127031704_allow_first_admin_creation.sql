/*
  # Allow First Admin Creation

  ## Changes Made
  1. Update admin_users policies to allow initial admin creation
     - Drop existing restrictive insert policy
     - Add new policy that allows first admin to be created when no admins exist
     - Keep existing admin creation policy for subsequent admins

  2. Security Notes
     - Only allows insert when admin_users table is empty (first admin)
     - Once first admin exists, only existing admins can create new admins
*/

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Admins can create other admins" ON admin_users;

-- Allow creation of first admin when no admins exist
CREATE POLICY "Allow first admin creation"
  ON admin_users
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM admin_users)
  );

-- Allow existing admins to create new admins
CREATE POLICY "Existing admins can create new admins"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
    )
  );
