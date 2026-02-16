# 🔧 Manual Admin Setup - Step by Step

Follow these exact steps to create your admin account and fix the email confirmation issue.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

Go to this URL:
```
https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/sql
```

Click **"New Query"** button

---

### Step 2: Check if User Exists

Copy and paste this query, then click **"Run"**:

```sql
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@eomc.shop';
```

**What to look for:**
- If you see a row with your email → User exists, go to Step 3
- If you see "No rows returned" → User doesn't exist, go to Step 6

---

### Step 3: Confirm the Email (If User Exists)

Copy and paste this query, then click **"Run"**:

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'admin@eomc.shop';
```

**Expected result:** "Success. 1 rows affected"

---

### Step 4: Grant Admin Privileges

Copy and paste this query, then click **"Run"**:

```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@eomc.shop';
```

**Expected result:** "Success. 1 rows affected"

**Note:** If you get "duplicate key" error, that's OK - it means admin privileges already exist.

---

### Step 5: Verify Everything Worked

Copy and paste this query, then click **"Run"**:

```sql
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    au.role
FROM auth.users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@eomc.shop';
```

**What you should see:**
- `email`: admin@eomc.shop
- `email_confirmed_at`: A timestamp (not NULL)
- `role`: admin

If you see all of these, **you're done!** Go to Step 7 to login.

---

### Step 6: Create User (If Doesn't Exist)

If the user doesn't exist, you need to create it via the Supabase UI:

1. Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/auth/users

2. Click **"Add User"** button

3. Fill in:
   - **Email:** `admin@eomc.shop`
   - **Password:** `EOMC2025!`
   - **Auto Confirm User:** ✅ **CHECK THIS BOX!**

4. Click **"Create User"**

5. Go back to **Step 4** to grant admin privileges

---

### Step 7: Login to Your Site

Now try logging in:

```
https://eomc.shop/login
```

**Credentials:**
- Email: `admin@eomc.shop`
- Password: `EOMC2025!`

**You should now be able to login!** ✅

---

## 🎯 Quick Command Reference

### Confirm Email
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@eomc.shop';
```

### Grant Admin Privileges
```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@eomc.shop';
```

### Check Status
```sql
SELECT u.email, u.email_confirmed_at, au.role
FROM auth.users u
LEFT JOIN admin_users au ON u.id = au.id
WHERE u.email = 'admin@eomc.shop';
```

---

## 🔄 Alternative: Use Different Email

If you want to use a different email (like your personal email):

### Step 1: Create account at the site
Go to: https://eomc.shop/register
- Enter your email
- Create a password
- Register

### Step 2: Grant admin privileges via SQL
```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE';
```

Replace `YOUR_EMAIL_HERE` with your actual email.

### Step 3: Confirm email via SQL
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'YOUR_EMAIL_HERE';
```

### Step 4: Logout and login again
You now have admin access!

---

## 🆘 Troubleshooting

### "No rows returned" when checking user
→ User doesn't exist. Create it via Supabase UI (Step 6)

### "Duplicate key" error when granting admin
→ Admin privileges already exist. This is OK, skip to verification (Step 5)

### Still can't login after confirming email
→ Clear browser cache (Ctrl+Shift+R) and try again
→ Check password is exactly: `EOMC2025!`

### "Invalid login credentials" error
→ Password might be wrong
→ Try resetting password in Supabase → Auth → Users

---

## ✅ Success Checklist

After completing the steps, verify:

- [ ] User exists in auth.users table
- [ ] email_confirmed_at is NOT NULL
- [ ] User exists in admin_users table
- [ ] role is 'admin'
- [ ] Can login at https://eomc.shop/login
- [ ] "Admin" link appears in header after login
- [ ] Can access https://eomc.shop/admin/dashboard

---

**Once all checks pass, you're ready to manage your store!** 🎉
