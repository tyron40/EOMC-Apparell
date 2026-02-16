-- EOMC Admin Account Creation Script
-- This creates an admin account that you can use immediately
-- You can change the password after logging in via Settings

-- Step 1: Create the user account in Supabase Auth
-- Email: admin@eomc.shop
-- Password: EOMC2025! (change this after first login!)

-- Note: You need to run this in Supabase Dashboard → SQL Editor
-- Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql

-- IMPORTANT: After running this, you need to:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add User" (or "Invite User")
-- 3. Enter:
--    Email: admin@eomc.shop
--    Password: EOMC2025!
--    Auto Confirm User: YES (check this box)
-- 4. Click "Create User"
-- 5. Copy the user ID that was created
-- 6. Then run the query below, replacing 'USER_ID_HERE' with the actual ID

-- Step 2: Grant admin privileges
-- Replace 'USER_ID_HERE' with the actual user ID from step 1
INSERT INTO admin_users (id, email, role)
VALUES (
  'USER_ID_HERE',  -- Replace with actual user ID
  'admin@eomc.shop',
  'admin'
);

-- Alternative: If you already have a user account, just add admin privileges
-- Replace 'your-email@example.com' with your actual email
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com';
