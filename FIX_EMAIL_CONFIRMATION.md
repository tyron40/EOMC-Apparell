# 🔧 Fix "Email Not Confirmed" Error

## The Problem
Supabase requires email confirmation by default. When you create an account, it sends a confirmation email, but we need to bypass this for admin accounts.

## ✅ Quick Fix (2 Minutes)

### Step 1: Go to Supabase Users Dashboard
```
https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users
```

### Step 2: Find Your User
Look for the user with email: `admin@eomc.shop` (or whatever email you used)

### Step 3: Confirm the Email
1. Click on the user row to open details
2. Look for **"Email Confirmed"** field
3. If it says `false` or shows a toggle:
   - Click the toggle to turn it ON
   - Or click "Confirm Email" button
4. Save changes

### Step 4: Try Logging In Again
```
https://eomc.shop/login
```
- Email: `admin@eomc.shop`
- Password: `EOMC2025!`

You should now be able to login! ✅

---

## 🔄 Alternative: Delete and Recreate with Auto-Confirm

If the above doesn't work, delete the user and recreate with auto-confirm:

### Step 1: Delete the Existing User
1. Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users
2. Find user: `admin@eomc.shop`
3. Click "..." menu → "Delete User"
4. Confirm deletion

### Step 2: Create New User with Auto-Confirm
1. Click **"Add User"** button
2. Fill in:
   - **Email:** `admin@eomc.shop`
   - **Password:** `EOMC2025!`
   - **Auto Confirm User:** ✅ **CHECK THIS BOX!** (This is the key!)
3. Click "Create User"

### Step 3: Get the User ID
1. Find the newly created user in the list
2. Click on it to see details
3. Copy the **User ID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 4: Grant Admin Privileges
1. Go to SQL Editor:
   ```
   https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql
   ```
2. Click "New Query"
3. Paste this (replace `USER_ID_HERE` with the ID you copied):
   ```sql
   INSERT INTO admin_users (id, email, role)
   VALUES (
     'USER_ID_HERE',
     'admin@eomc.shop',
     'admin'
   );
   ```
4. Click "Run"

### Step 5: Login
```
https://eomc.shop/login
```
- Email: `admin@eomc.shop`
- Password: `EOMC2025!`

Should work now! ✅

---

## 🛠️ Permanent Fix: Disable Email Confirmation

To prevent this issue in the future, disable email confirmation requirement:

### Step 1: Go to Authentication Settings
```
https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/settings
```

### Step 2: Disable Email Confirmation
1. Scroll to **"Email Auth"** section
2. Find **"Enable email confirmations"**
3. Toggle it **OFF**
4. Click "Save"

Now future users won't need email confirmation!

---

## 📋 Quick Checklist

Follow these steps in order:

**Option 1: Confirm Existing User (Fastest)**
- [ ] Go to Supabase → Auth → Users
- [ ] Find user: `admin@eomc.shop`
- [ ] Click to open details
- [ ] Toggle "Email Confirmed" to ON
- [ ] Try logging in again

**Option 2: Recreate with Auto-Confirm**
- [ ] Delete existing user
- [ ] Create new user
- [ ] ✅ CHECK "Auto Confirm User" box
- [ ] Copy user ID
- [ ] Run SQL to grant admin privileges
- [ ] Login

**Option 3: Disable Email Confirmation (Permanent)**
- [ ] Go to Auth Settings
- [ ] Disable "Enable email confirmations"
- [ ] Save
- [ ] Recreate user

---

## 🎯 Recommended Solution

**Do this (takes 2 minutes):**

1. **Go to:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users
2. **Find:** `admin@eomc.shop`
3. **Click** on the user
4. **Toggle** "Email Confirmed" to ON
5. **Login** at: https://eomc.shop/login

**Done!** ✅

---

## 🆘 Still Having Issues?

If you still can't login after confirming the email:

1. **Check the user exists:**
   - Go to Supabase → Auth → Users
   - Verify `admin@eomc.shop` is in the list

2. **Check admin privileges:**
   - Go to Supabase → Table Editor → admin_users
   - Verify your user ID is in the table

3. **Try password reset:**
   - Go to Supabase → Auth → Users
   - Click "..." → "Send password reset email"
   - Check email and reset password

4. **Check browser console:**
   - Press F12 on login page
   - Look for error messages
   - Share any errors you see

---

**After fixing, you'll be able to login and manage your store! 🎉**
