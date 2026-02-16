# 🎯 Complete Admin Setup - Final Guide

This is your complete guide to set up admin access for EOMC. Follow these steps exactly.

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Easiest Method (Recommended)

**Step 1:** Double-click this file to open Supabase SQL Editor:
```
open-supabase-sql.bat
```

**Step 2:** In the SQL Editor, click **"New Query"**

**Step 3:** Copy and paste this command, then click **"Run"**:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@eomc.shop';
```

**Step 4:** Copy and paste this command, then click **"Run"**:
```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@eomc.shop';
```

**Step 5:** Login at:
```
https://eomc.shop/login
```
- Email: `admin@eomc.shop`
- Password: `EOMC2025!`

**Done!** ✅

---

## 📋 Detailed Instructions

### If the Quick Start Didn't Work

Follow the complete step-by-step guide in:
```
MANUAL_ADMIN_SETUP_GUIDE.md
```

This guide includes:
- ✅ How to check if user exists
- ✅ How to confirm email
- ✅ How to grant admin privileges
- ✅ How to verify everything worked
- ✅ Troubleshooting steps

---

## 🔑 Your Admin Credentials

**Email:** `admin@eomc.shop`  
**Password:** `EOMC2025!`

**Important:** Change your password after first login!
- Go to: Admin → Settings → Change Password

---

## 🌐 Important URLs

### Your Site
- **Homepage:** https://eomc.shop
- **Login:** https://eomc.shop/login
- **Admin Dashboard:** https://eomc.shop/admin/dashboard

### Supabase
- **SQL Editor:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql
- **Users:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users
- **Dashboard:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf

---

## ✅ Verification Checklist

After running the SQL commands, verify:

- [ ] Run this SQL to check status:
```sql
SELECT u.email, u.email_confirmed_at, au.role
FROM auth.users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@eomc.shop';
```

- [ ] You should see:
  - email: `admin@eomc.shop`
  - email_confirmed_at: (a timestamp, not NULL)
  - role: `admin`

- [ ] Login works at https://eomc.shop/login
- [ ] "Admin" link appears in header
- [ ] Can access admin dashboard

---

## 🆘 Common Issues & Solutions

### Issue: "Email not confirmed"
**Solution:** Run this SQL:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@eomc.shop';
```

### Issue: "No admin link in header"
**Solution:** Run this SQL:
```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@eomc.shop';
```

### Issue: "User doesn't exist"
**Solution:** 
1. Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users
2. Click "Add User"
3. Email: `admin@eomc.shop`
4. Password: `EOMC2025!`
5. ✅ Check "Auto Confirm User"
6. Click "Create User"
7. Then run the admin privileges SQL above

### Issue: "Invalid login credentials"
**Solution:** 
- Make sure password is exactly: `EOMC2025!` (case-sensitive)
- Try clearing browser cache (Ctrl+Shift+R)
- Reset password in Supabase if needed

---

## 📚 All Documentation Files

1. **`COMPLETE_ADMIN_SETUP.md`** ⭐ **YOU ARE HERE**
   - Quick start guide
   - All essential info in one place

2. **`MANUAL_ADMIN_SETUP_GUIDE.md`**
   - Detailed step-by-step instructions
   - Individual SQL commands
   - Troubleshooting

3. **`FIX_EMAIL_CONFIRMATION.md`**
   - Fixes email confirmation issues
   - Multiple solution methods

4. **`CREATE_YOUR_ADMIN_ACCOUNT.md`**
   - Original admin creation guide
   - Password change instructions

5. **`CONTENT_SETUP_GUIDE.md`**
   - How to add products
   - How to add content
   - Site customization

---

## 🎯 What to Do After Login

Once you successfully login as admin:

### 1. Change Your Password (2 minutes)
- Click "Admin" in header
- Go to "Settings"
- Change password to something secure
- Save

### 2. Add Products (30 minutes)
- Click "Admin" → "Product Manager"
- Click "Add New Product"
- Fill in details
- Upload images
- Save

### 3. Customize Content (30 minutes)
- Go to homepage
- Click "Edit Mode" toggle (top right)
- Click on any section to edit
- Upload images
- Change text
- Save changes

### 4. Test Your Store (15 minutes)
- Browse products
- Add to cart
- Test checkout
- Verify everything works

---

## 🎉 Success!

Once you complete the setup:

✅ You have full admin access  
✅ You can manage products  
✅ You can process orders  
✅ You can customize content  
✅ Your store is ready for business  

---

## 📞 Quick Reference

### SQL Commands (Copy & Paste)

**Confirm Email:**
```sql
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'admin@eomc.shop';
```

**Grant Admin:**
```sql
INSERT INTO admin_users (id, email, role) SELECT id, email, 'admin' FROM auth.users WHERE email = 'admin@eomc.shop';
```

**Check Status:**
```sql
SELECT u.email, u.email_confirmed_at, au.role FROM auth.users u LEFT JOIN admin_users au ON u.id = au.id WHERE u.email = 'admin@eomc.shop';
```

### Login Info
```
URL: https://eomc.shop/login
Email: admin@eomc.shop
Password: EOMC2025!
```

### Supabase SQL Editor
```
https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql
```

---

**Your EOMC store is ready! Just run the SQL commands and login! 🚀**
