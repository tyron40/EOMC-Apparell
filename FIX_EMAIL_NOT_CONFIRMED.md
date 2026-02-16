# 🔧 Fix "Email Not Confirmed" Error - Quick Solution

## Problem
You created an admin account in Supabase, but when you try to log in at https://eomc.shop/login, you get an "Email not confirmed" error.

## ✅ Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project: **yteiumctafklsjfhbijf**
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run This SQL Command

**Copy and paste this EXACT command** (replace the email with yours):

```sql
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'your-email@example.com';
```

**⚠️ IMPORTANT:** Replace `'your-email@example.com'` with your actual email address!

**Example:**
```sql
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'tyron@example.com';
```

### Step 3: Click "Run" Button

You should see: **Success. 1 row(s) affected**

### Step 4: Verify It Worked

Run this query to check:

```sql
SELECT email, email_confirmed_at, confirmed_at
FROM auth.users
WHERE email = 'your-email@example.com';
```

You should see your email with timestamps in both columns.

### Step 5: Try Logging In Again

1. Go to https://eomc.shop/login
2. Enter your email and password
3. Click "Sign In"

**It should work now!** ✅

---

## 🔄 Alternative Method: Disable Email Confirmation

If you want to disable email confirmation entirely for easier testing:

### Step 1: Go to Supabase Authentication Settings
1. Supabase Dashboard → Authentication → Settings
2. Scroll to **Email Auth**

### Step 2: Disable Email Confirmation
1. Find "Enable email confirmations"
2. **Toggle it OFF**
3. Click "Save"

### Step 3: Create New Account
Now when you create accounts, they'll be automatically confirmed.

---

## 🚨 Still Not Working?

### Check 1: Verify User Exists in Both Tables

```sql
-- Check auth.users table
SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email = 'your-email@example.com';

-- Check public.users table
SELECT id, email, is_admin
FROM public.users
WHERE email = 'your-email@example.com';
```

### Check 2: Make Sure You're an Admin

```sql
UPDATE public.users
SET is_admin = true
WHERE email = 'your-email@example.com';
```

### Check 3: Clear Browser Cache
1. Open browser settings
2. Clear cache and cookies
3. Try logging in again

### Check 4: Try Incognito/Private Mode
Sometimes cached data causes issues. Try logging in using incognito mode.

---

## 📝 What Happened?

When you created the account in Supabase directly (not through the website), it created the user but didn't automatically confirm the email. The website requires confirmed emails to log in.

By running the SQL command above, you're manually confirming the email, which allows you to log in.

---

## ✅ Success Checklist

After running the fix, you should be able to:
- [ ] Log in at https://eomc.shop/login
- [ ] See your email in the user menu
- [ ] Access the Admin Dashboard at https://eomc.shop/admin
- [ ] Manage products, orders, and settings

---

## 🎯 Next Steps After Logging In

1. **Upload EOMC Logo**
   - Go to Admin → Settings
   - Upload your lips logo

2. **Add Products**
   - Go to Admin → Products
   - Add your apparel items

3. **Update Site Content**
   - Add hero images
   - Add gallery photos
   - Update collections

4. **Test Everything**
   - Browse the site
   - Add items to cart
   - Test checkout flow

---

**Need more help?** Check these guides:
- `ADMIN_LOGIN_GUIDE.md` - Complete admin setup
- `CONTENT_SETUP_GUIDE.md` - How to add content
- `COMPLETE_ADMIN_SETUP.md` - Full admin configuration

---

**Quick Reference:**

**Your Supabase Project:** yteiumctafklsjfhbijf
**Your Site:** https://eomc.shop
**Admin Login:** https://eomc.shop/login
**Admin Dashboard:** https://eomc.shop/admin
