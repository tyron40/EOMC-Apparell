-- ============================================
-- EOMC Admin Account Creation Script
-- ============================================
-- This script creates an admin account directly in Supabase
-- Email: admin@eomc.shop
-- Password: EOMC2025!
-- ============================================

-- Step 1: Create the user in auth.users table
-- Note: This uses Supabase's auth.users table directly
-- The password will be hashed automatically

-- First, let's create the user with a confirmed email
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@eomc.shop',
    crypt('EOMC2025!', gen_salt('bf')),  -- Password: EOMC2025!
    NOW(),  -- Email confirmed immediately
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{}',
    FALSE,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    FALSE,
    NULL
)
RETURNING id;

-- Step 2: Get the user ID and add to admin_users table
-- Replace 'USER_ID_FROM_STEP_1' with the ID returned from Step 1

-- After running Step 1, copy the returned ID and use it here:
INSERT INTO admin_users (id, email, role)
VALUES (
    'USER_ID_FROM_STEP_1',  -- Replace with actual user ID
    'admin@eomc.shop',
    'admin'
);

-- ============================================
-- ALTERNATIVE: Simpler approach using Supabase Auth API
-- ============================================
-- If the above doesn't work, use this approach:

-- 1. First, check if user already exists
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@eomc.shop';

-- 2. If user exists, confirm their email
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'admin@eomc.shop';

-- 3. Add to admin_users table (replace USER_ID with actual ID from step 1)
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@eomc.shop'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if user was created
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'admin@eomc.shop';

-- Check if user has admin privileges
SELECT au.id, au.email, au.role, u.email_confirmed_at
FROM admin_users au
JOIN auth.users u ON au.id = u.id
WHERE au.email = 'admin@eomc.shop';

-- ============================================
-- CLEANUP (if needed)
-- ============================================

-- To delete and start over:
-- DELETE FROM admin_users WHERE email = 'admin@eomc.shop';
-- DELETE FROM auth.users WHERE email = 'admin@eomc.shop';
