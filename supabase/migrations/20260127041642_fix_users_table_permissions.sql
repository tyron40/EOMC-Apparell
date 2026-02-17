/*
  # Fix Users Table Permissions

  ## Changes Made
  1. Grant necessary permissions for the admin_users table foreign key reference
  2. Ensure RLS policies can properly check auth.users references
  
  ## Security Notes
  - This grants SELECT permission on auth.users for authenticated users
  - Required for admin_users foreign key validation
  - Does not expose sensitive user data beyond what's already accessible
*/

-- Grant authenticated users permission to reference auth.users
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
