# Get Your Supabase Credentials

Your Supabase project "EOMC Apparel" has been created successfully!

**Project URL:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf

---

## Step 1: Get Your API Credentials

1. Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/settings/api

2. You'll see two important values:

   **Project URL:**
   ```
   https://yteiumctafklsjfhbijf.supabase.co
   ```

   **anon/public key:** (Long string starting with `eyJ...`)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Copy both values - you'll need them in the next step

---

## Step 2: Add Credentials to Vercel

Now we need to add these to your Vercel deployment.

### Option A: Via Vercel Dashboard (Easiest)

1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell/settings/environment-variables

2. Click **"Add New"**

3. Add first variable:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://yteiumctafklsjfhbijf.supabase.co`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

4. Add second variable:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** (paste your anon key here)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - Click **"Save"**

### Option B: Via Vercel CLI

```bash
# Add Supabase URL
vercel env add VITE_SUPABASE_URL production
# When prompted, paste: https://yteiumctafklsjfhbijf.supabase.co

# Add Supabase anon key
vercel env add VITE_SUPABASE_ANON_KEY production
# When prompted, paste your anon key
```

---

## Step 3: Redeploy Your Site

After adding the environment variables, trigger a new deployment:

### Option A: Via Vercel Dashboard

1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell
2. Click **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**
5. Confirm

### Option B: Via CLI

```bash
vercel --prod
```

### Option C: Via Git Push

```bash
git commit --allow-empty -m "Trigger redeploy with Supabase credentials"
git push origin main
```

---

## Step 4: Verify Your Site

After redeployment (wait 2-3 minutes):

1. Visit: **https://eomc.shop**
2. You should now see the actual EOMC store (not the configuration notice!)
3. The site should load with the homepage

---

## Step 5: Create Your Admin Account

1. Go to: **https://eomc.shop/register**
2. Create an account with your email
3. Go to Supabase Dashboard: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/editor
4. Click on **"users"** table
5. Find your user record
6. Click to edit
7. Set `is_admin` to `true`
8. Save

---

## Step 6: Access Admin Dashboard

1. Login at: **https://eomc.shop/login**
2. After login, you should see an **"Admin"** link in the header
3. Click it to access the admin dashboard
4. You can now:
   - Add products
   - Manage inventory
   - View orders
   - Edit site content
   - Upload images

---

## Quick Reference

**Project Reference ID:** `yteiumctafklsjfhbijf`

**Project URL:** `https://yteiumctafklsjfhbijf.supabase.co`

**Database Password:** `EOMC2024!Secure#Pass` (keep this secure!)

**Supabase Dashboard:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf

**Vercel Dashboard:** https://vercel.com/tyrons-projects-584a5697/eomc-apparell

**Your Live Site:** https://eomc.shop

---

## ✅ Checklist

- [ ] Got Project URL from Supabase
- [ ] Got anon key from Supabase
- [ ] Added VITE_SUPABASE_URL to Vercel
- [ ] Added VITE_SUPABASE_ANON_KEY to Vercel
- [ ] Redeployed site
- [ ] Verified https://eomc.shop loads (no configuration notice)
- [ ] Created admin account
- [ ] Set is_admin = true in database
- [ ] Logged in and accessed admin dashboard

---

**Once you complete these steps, your EOMC e-commerce store will be fully functional! 🎉**
