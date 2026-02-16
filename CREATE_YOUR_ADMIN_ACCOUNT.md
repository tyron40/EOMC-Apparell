# 🔐 Create Your Admin Account - Easy Guide

This guide will help you create your admin account in 5 minutes so you can start managing your EOMC store.

---

## 🚀 Quick Method: Use the Admin Setup Page (Recommended)

This is the **easiest and fastest** way to create your admin account.

### Step 1: Visit the Admin Setup Page

Open your browser and go to:
```
https://eomc.shop/admin/setup
```

### Step 2: Fill in the Form

**Admin Email:** Choose one of these options:
- `admin@eomc.shop` (professional)
- `tyron@eomc.shop` (personal)
- Or use your own email address

**Password:** Create a strong password
- Minimum 6 characters
- Suggestion: `EOMC2025!` (easy to remember, change it later)
- Or create your own

**Confirm Password:** Enter the same password again

### Step 3: Click "Create Admin Account"

The system will:
1. Create your user account
2. Automatically grant admin privileges
3. Redirect you to the login page

### Step 4: Login

You'll be redirected to:
```
https://eomc.shop/login
```

Enter:
- **Email:** The email you just used
- **Password:** The password you just created

### Step 5: Access Admin Dashboard

After login, you'll see:
- "Admin" link in the header
- Click it to access the dashboard

Or go directly to:
```
https://eomc.shop/admin/dashboard
```

### Step 6: Change Password (Optional)

If you want to change your password:
1. Go to Admin → Settings
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click "Change Password"

---

## 🎯 Recommended Admin Credentials

For easy access, I recommend:

**Email:** `admin@eomc.shop`  
**Password:** `EOMC2025!` (change after first login)

This is easy to remember and professional.

---

## 🔄 Alternative Method: Create via Supabase Dashboard

If the admin setup page doesn't work for some reason, use this method:

### Step 1: Go to Supabase Dashboard

```
https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users
```

### Step 2: Create User

1. Click **"Add User"** or **"Invite User"** button
2. Fill in:
   - **Email:** `admin@eomc.shop` (or your email)
   - **Password:** `EOMC2025!` (or your password)
   - **Auto Confirm User:** ✅ CHECK THIS BOX (important!)
3. Click **"Create User"**

### Step 3: Copy User ID

After creating the user:
1. Find the user in the list
2. Click on the user to see details
3. Copy the **User ID** (long string like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 4: Grant Admin Privileges

1. Go to SQL Editor:
   ```
   https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql
   ```

2. Click **"New Query"**

3. Paste this SQL (replace `USER_ID_HERE` with the ID you copied):
   ```sql
   INSERT INTO admin_users (id, email, role)
   VALUES (
     'USER_ID_HERE',
     'admin@eomc.shop',
     'admin'
   );
   ```

4. Click **"Run"** or press `Ctrl+Enter`

5. You should see: "Success. No rows returned"

### Step 5: Login

Now go to:
```
https://eomc.shop/login
```

Enter:
- **Email:** `admin@eomc.shop`
- **Password:** `EOMC2025!`

You're now logged in as admin!

---

## ✅ Verify Admin Access

After logging in, check that you have admin access:

1. **Look for "Admin" link in header**
   - If you see it, you're an admin ✅

2. **Try accessing admin dashboard**
   - Go to: `https://eomc.shop/admin/dashboard`
   - If it loads, you're an admin ✅

3. **Check admin features**
   - Click "Admin" in header
   - You should see:
     - Product Manager
     - Inventory Manager
     - Orders Manager
     - Settings

---

## 🔐 Security Recommendations

### Change Your Password After First Login

1. Go to: `https://eomc.shop/admin/settings`
2. Click "Change Password"
3. Enter current password: `EOMC2025!`
4. Enter new strong password
5. Confirm new password
6. Click "Change Password"

### Create a Strong Password

Good password examples:
- `MyEOMC$tore2025!`
- `EOMC-Secure-Admin-2025`
- `Str33tw3ar!Admin`

Password requirements:
- At least 12 characters (recommended)
- Mix of uppercase and lowercase
- Include numbers
- Include special characters (!@#$%^&*)

---

## 🎯 Quick Reference

### Your Admin Credentials (Default)

**Email:** `admin@eomc.shop`  
**Password:** `EOMC2025!`  
**Note:** Change password after first login!

### Important URLs

**Admin Setup:** https://eomc.shop/admin/setup  
**Login:** https://eomc.shop/login  
**Dashboard:** https://eomc.shop/admin/dashboard  
**Settings:** https://eomc.shop/admin/settings  

### Supabase Dashboard

**Project:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf  
**Users:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users  
**SQL Editor:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql  

---

## 🆘 Troubleshooting

### "Email already registered" error

**Solution:** The email is already in use. Either:
1. Use a different email
2. Or login with that email if you already created an account

### "Admin setup already completed" message

**Solution:** An admin account already exists. 
1. If it's yours, just login at `/login`
2. If you forgot the password, use Supabase to reset it

### Can't see "Admin" link after login

**Solution:** Your account doesn't have admin privileges yet.
1. Go to Supabase → SQL Editor
2. Run this query (replace with your email):
   ```sql
   INSERT INTO admin_users (id, email, role)
   SELECT id, email, 'admin'
   FROM auth.users
   WHERE email = 'your-email@example.com';
   ```
3. Logout and login again

### Forgot admin password

**Solution:** Reset via Supabase:
1. Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users
2. Find your user
3. Click "..." → "Send password reset email"
4. Check your email for reset link

---

## 📋 Step-by-Step Checklist

Follow this checklist to create your admin account:

- [ ] Go to https://eomc.shop/admin/setup
- [ ] Enter email: `admin@eomc.shop`
- [ ] Enter password: `EOMC2025!`
- [ ] Confirm password: `EOMC2025!`
- [ ] Click "Create Admin Account"
- [ ] Wait for redirect to login page
- [ ] Login with same credentials
- [ ] Verify "Admin" link appears in header
- [ ] Click "Admin" to access dashboard
- [ ] Go to Settings and change password
- [ ] Save new password securely

---

## 🎉 You're Ready!

Once you've created your admin account and logged in, you can:

✅ Add products  
✅ Manage inventory  
✅ Process orders  
✅ Edit site content  
✅ Upload images and videos  
✅ Customize your store  

**Next step:** Follow `CONTENT_SETUP_GUIDE.md` to add products and content to your store!

---

**Your admin account is the key to managing your entire EOMC store! 🔑**
