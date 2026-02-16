-- ============================================
-- SIMPLE ADMIN ACCOUNT SETUP
-- ============================================
-- Run this in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql
-- ============================================

-- STEP 1: Check if admin user already exists
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@eomc.shop';

-- STEP 2: If user exists, confirm their email
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'admin@eomc.shop';

-- STEP 3: Add admin privileges
-- This will add the user to admin_users table
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@eomc.shop'
AND NOT EXISTS (
    SELECT 1 FROM admin_users WHERE email = 'admin@eomc.shop'
);

-- STEP 4: Verify everything worked
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    au.role,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN 'Email Confirmed ✓'
        ELSE 'Email NOT Confirmed ✗'
    END as email_status,
    CASE 
        WHEN au.id IS NOT NULL THEN 'Admin Privileges ✓'
        ELSE 'NOT Admin ✗'
    END as admin_status
FROM auth.users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@eomc.shop';
