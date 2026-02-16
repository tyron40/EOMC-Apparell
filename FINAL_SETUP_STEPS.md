# 🎯 Final Setup Steps - EOMC Apparel

Your Supabase database is ready! Now just 3 quick steps to go live:

---

## ✅ What's Already Done

- ✅ Domain configured: https://eomc.shop (with SSL)
- ✅ Vercel deployment active
- ✅ Supabase project created: "EOMC Apparel"
- ✅ Database tables created (12 migrations applied)
- ✅ Storage buckets created for images
- ✅ Security policies configured

---

## 🔑 Step 1: Get Your Supabase Credentials (2 minutes)

1. **Open this link in your browser:**
   ```
   https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/settings/api
   ```

2. **Copy these two values:**

   **A) Project URL** (at the top):
   ```
   https://yteiumctafklsjfhbijf.supabase.co
   ```
   
   **B) anon public key** (in the "Project API keys" section):
   ```
   eyJhbGc... (long string)
   ```

   Keep these handy for the next step!

---

## 🌐 Step 2: Add Credentials to Vercel (3 minutes)

1. **Open this link:**
   ```
   https://vercel.com/tyrons-projects-584a5697/eomc-apparell/settings/environment-variables
   ```

2. **Click the "Add New" button**

3. **Add the first variable:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://yteiumctafklsjfhbijf.supabase.co`
   - **Environments:** Check all three boxes:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **"Save"**

4. **Click "Add New" again for the second variable:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** (paste the long eyJhbGc... string you copied)
   - **Environments:** Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

---

## 🚀 Step 3: Redeploy Your Site (1 minute)

1. **Go to your deployments page:**
   ```
   https://vercel.com/tyrons-projects-584a5697/eomc-apparell
   ```

2. **Click the "Deployments" tab** (at the top)

3. **Find the most recent deployment** (should be at the top)

4. **Click the three dots "..."** on the right side

5. **Click "Redeploy"**

6. **Click "Redeploy" again** to confirm

7. **Wait 2-3 minutes** for the deployment to complete

---

## ✨ Step 4: Verify Your Site is Live!

1. **Open your site:**
   ```
   https://eomc.shop
   ```

2. **You should now see:**
   - ✅ The actual EOMC homepage (NOT the configuration notice)
   - ✅ Navigation menu
   - ✅ Products section
   - ✅ Footer

3. **If you still see the configuration notice:**
   - Wait another minute (deployment might still be processing)
   - Hard refresh: Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Clear browser cache and try again

---

## 👤 Step 5: Create Your Admin Account

1. **Go to the register page:**
   ```
   https://eomc.shop/register
   ```

2. **Create an account** with your email and password

3. **Make yourself an admin:**
   - Go to: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/editor
   - Click on the **"users"** table (in the left sidebar)
   - Find your user (the one you just created)
   - Click on the row to edit it
   - Find the `is_admin` column
   - Change it from `false` to `true`
   - Click the checkmark to save

4. **Login to your site:**
   ```
   https://eomc.shop/login
   ```

5. **After logging in, you should see "Admin" in the header**
   - Click it to access your admin dashboard!

---

## 🎨 Step 6: Customize Your Store

Now you can start building your store:

### Add Your First Product

1. Go to **Admin → Products**
2. Click **"Add New Product"**
3. Fill in:
   - Product name
   - Description
   - Price
   - Category
   - Available sizes
   - Stock quantity
4. Upload product images
5. Click **"Save"**

### Customize Homepage

1. Go to **Admin → Settings**
2. Edit:
   - Hero section text
   - Featured products
   - Site branding
3. Upload hero images
4. Save changes

### Create Categories

1. Go to **Admin → Products**
2. Manage categories
3. Add categories like:
   - T-Shirts
   - Hoodies
   - Accessories
4. Upload category images

---

## 📊 Your Project Dashboard Links

**Live Site:** https://eomc.shop

**Vercel Dashboard:** https://vercel.com/tyrons-projects-584a5697/eomc-apparell

**Supabase Dashboard:** https://supabase.com/dashboard/project/yteiumctafklsjfhbijf

**GitHub Repo:** https://github.com/tyron40/EOMC-Apparell

---

## 🆘 Troubleshooting

### Site still shows configuration notice after redeploy

**Solution:**
1. Verify both environment variables are set in Vercel
2. Make sure you selected all 3 environments (Production, Preview, Development)
3. Trigger another deployment
4. Clear browser cache: `Ctrl + Shift + R`

### Can't see Admin link after logging in

**Solution:**
1. Verify you set `is_admin = true` in the Supabase users table
2. Logout and login again
3. Check browser console for errors (F12)

### Images won't upload

**Solution:**
1. Check Supabase storage buckets exist
2. Verify storage policies are correct
3. Check file size (max 50MB)

### Products not showing on homepage

**Solution:**
1. Make sure you've added products in Admin → Products
2. Set products as "featured" if you want them on homepage
3. Check that products have stock > 0

---

## ✅ Final Checklist

- [ ] Got Supabase URL and anon key
- [ ] Added both environment variables to Vercel
- [ ] Redeployed the site
- [ ] Verified https://eomc.shop loads correctly
- [ ] Created user account
- [ ] Set is_admin = true in database
- [ ] Logged in and accessed admin dashboard
- [ ] Added first product
- [ ] Customized homepage

---

## 🎉 Congratulations!

Once you complete these steps, your EOMC e-commerce store will be:

✅ **Live** at https://eomc.shop  
✅ **Secure** with SSL certificate  
✅ **Connected** to Supabase database  
✅ **Ready** to accept orders  
✅ **Manageable** via admin dashboard  

**You've successfully deployed a professional e-commerce platform! 🚀**

---

## 📞 Need Help?

If you run into any issues:

1. Check the browser console (F12) for errors
2. Check Vercel deployment logs
3. Check Supabase logs
4. Review the documentation files in your project:
   - `DEPLOYMENT_GUIDE.md`
   - `ADMIN_SETUP.md`
   - `SUPABASE_SETUP_GUIDE.md`

**Happy selling! 🛍️**
