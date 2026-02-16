-- ============================================
-- CONFIRM ADMIN EMAIL - INSTANT FIX
-- ============================================
-- This script manually confirms your admin email
-- so you can log in immediately without email verification
--
-- HOW TO USE:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Paste this entire script
-- 3. Replace 'your-email@example.com' with your actual email
-- 4. Click "Run"
-- 5. Try logging in again
-- ============================================

-- Step 1: Confirm the email in auth.users table
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'your-email@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- Step 2: Verify the update worked
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'your-email@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- ============================================
-- EXPECTED RESULT:
-- You should see your user with:
-- - email_confirmed_at: [current timestamp]
-- - confirmed_at: [current timestamp]
--
-- If you see these timestamps, your email is confirmed!
-- You can now log in at: https://eomc.shop/login
-- ============================================

-- Step 3: Also make sure you're an admin in the users table
UPDATE public.users
SET 
  is_admin = true,
  updated_at = NOW()
WHERE email = 'your-email@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- Step 4: Verify admin status
SELECT 
  id,
  email,
  is_admin,
  created_at
FROM public.users
WHERE email = 'your-email@example.com';  -- ⚠️ REPLACE WITH YOUR EMAIL

-- ============================================
-- TROUBLESHOOTING:
--
-- If you still can't log in after running this:
--
-- 1. Clear your browser cache and cookies
-- 2. Try incognito/private browsing mode
-- 3. Make sure you're using the exact same email
-- 4. Check the password is correct
--
-- If the user doesn't exist in public.users table:
-- Run this to create it:
--
-- INSERT INTO public.users (id, email, is_admin)
-- SELECT id, email, true
-- FROM auth.users
-- WHERE email = 'your-email@example.com'
-- ON CONFLICT (id) DO UPDATE
-- SET is_admin = true;
-- ============================================
