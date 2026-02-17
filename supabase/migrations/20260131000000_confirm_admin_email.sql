-- Confirm admin email for login
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'admin@eomc.shop';

-- Ensure admin user exists in public.users table
INSERT INTO public.users (id, email, is_admin, created_at, updated_at)
SELECT 
  id, 
  email, 
  true as is_admin,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
WHERE email = 'admin@eomc.shop'
ON CONFLICT (id) 
DO UPDATE SET 
  is_admin = true,
  updated_at = NOW();
