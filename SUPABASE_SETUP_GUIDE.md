# Supabase Project Setup Guide for EOMC

This guide will walk you through creating and configuring your Supabase project for the EOMC e-commerce platform.

---

## 🎯 Current Status

You have a terminal waiting for Supabase login. Here's what to do:

### Step 1: Login to Supabase

**In your terminal (currently running):**
1. Press **Enter** to open the browser
2. Login with your Supabase account (or create one if you don't have it)
3. Authorize the CLI
4. Return to the terminal - you should see "Finished supabase login"

---

## 📋 Step 2: Create a New Supabase Project

After logging in, run these commands:

### 2A: Create the Project via CLI

```bash
supabase projects create eomc-apparel --org-id <your-org-id> --db-password <strong-password> --region us-east-1
```

**Important Notes:**
- Replace `<your-org-id>` with your Supabase organization ID
- Replace `<strong-password>` with a secure database password (save this!)
- You can change the region if needed (us-east-1, eu-west-1, etc.)

**To find your org-id:**
```bash
supabase orgs list
```

### 2B: Alternative - Create via Supabase Dashboard

If CLI creation doesn't work, you can create the project manually:

1. Go to: https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: EOMC Apparel
   - **Database Password**: (create a strong password and save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

---

## 🔗 Step 3: Link Your Local Project to Supabase

Once your project is created:

```bash
# Link to your Supabase project
supabase link --project-ref <your-project-ref>
```

**To find your project-ref:**
- Go to: https://supabase.com/dashboard
- Select your project
- Go to **Settings** → **General**
- Copy the **Reference ID**

---

## 🗄️ Step 4: Run Database Migrations

Your project already has all the necessary database migrations in the `supabase/migrations/` folder. Let's apply them:

```bash
# Push all migrations to your Supabase project
supabase db push
```

This will create all the tables, policies, and storage buckets needed for EOMC:

**Tables Created:**
- `users` - User accounts and admin roles
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `site_content` - Homepage content (hero, featured products)
- `shipping_labels` - Shipping label tracking

**Storage Buckets:**
- `product-images` - Product photos
- `category-images` - Category images
- `site-images` - Homepage images
- `shipping-labels` - Shipping label PDFs

---

## 🔑 Step 5: Get Your API Credentials

After migrations are complete:

### 5A: Get Credentials from Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your **EOMC Apparel** project
3. Go to **Settings** → **API**
4. Copy these values:

   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

### 5B: Or Get via CLI

```bash
# Get project URL
supabase status

# Get API keys
supabase projects api-keys --project-ref <your-project-ref>
```

---

## 🌐 Step 6: Add Credentials to Vercel

Now add these credentials to your Vercel deployment:

### Option A: Via Vercel CLI (Recommended)

```bash
# Add Supabase URL
vercel env add VITE_SUPABASE_URL production
# Paste your project URL when prompted

# Add Supabase anon key
vercel env add VITE_SUPABASE_ANON_KEY production
# Paste your anon key when prompted
```

### Option B: Via Vercel Dashboard

1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell/settings/environment-variables
2. Click **"Add New"**
3. Add first variable:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
4. Click **"Save"**
5. Add second variable:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
6. Click **"Save"**

---

## 🚀 Step 7: Redeploy Your Site

After adding environment variables:

### Option A: Trigger Redeploy via Vercel Dashboard

1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell
2. Click **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**
5. Confirm

### Option B: Redeploy via CLI

```bash
vercel --prod
```

### Option C: Push to GitHub (Auto-deploys)

```bash
git commit --allow-empty -m "Trigger redeploy with Supabase credentials"
git push origin main
```

---

## ✅ Step 8: Verify Everything Works

After redeployment (wait 2-3 minutes):

### 8A: Test the Site

1. Visit: **https://eomc.shop**
2. You should now see the actual EOMC store (not the configuration notice)
3. The site should load with products, categories, etc.

### 8B: Create Your First Admin User

1. Go to: **https://eomc.shop/register**
2. Create an account with your email
3. Go to Supabase Dashboard → **Table Editor** → **users** table
4. Find your user record
5. Set `is_admin` to `true`
6. Save

### 8C: Access Admin Dashboard

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

## 🎨 Step 9: Customize Your Store

Now that everything is working:

### Add Products

1. Go to: **Admin** → **Products**
2. Click **"Add New Product"**
3. Fill in:
   - Name
   - Description
   - Price
   - Category
   - Sizes available
   - Stock quantity
4. Upload product images
5. Click **"Save"**

### Customize Homepage

1. Go to: **Admin** → **Settings**
2. Edit:
   - Hero section (main banner)
   - Featured products
   - Site colors/branding
3. Upload hero images
4. Save changes

### Set Up Categories

1. Go to: **Admin** → **Products** → **Categories**
2. Add categories like:
   - T-Shirts
   - Hoodies
   - Accessories
   - etc.
3. Upload category images

---

## 🔒 Security Best Practices

### Database Password

- **NEVER** commit your database password to Git
- Store it securely (password manager)
- You'll need it for:
  - Direct database access
  - Database backups
  - Advanced configurations

### API Keys

- The **anon key** is safe to use in frontend code
- The **service_role key** should NEVER be exposed in frontend
- Only use service_role key in backend/server code

### Row Level Security (RLS)

Your migrations already set up RLS policies:
- ✅ Public can view products
- ✅ Only admins can edit products
- ✅ Users can only see their own orders
- ✅ Only admins can manage all orders

---

## 📊 Monitoring Your Database

### View Database Activity

```bash
# See database logs
supabase db logs

# Monitor real-time activity
supabase db inspect
```

### Backup Your Database

```bash
# Create a backup
supabase db dump -f backup.sql

# Restore from backup
supabase db reset --db-url <your-db-url>
```

---

## 🆘 Troubleshooting

### Issue: "supabase link" fails

**Solution:**
```bash
# Make sure you're logged in
supabase login

# List your projects
supabase projects list

# Link with explicit project ref
supabase link --project-ref <your-ref>
```

### Issue: Migrations fail

**Solution:**
```bash
# Check migration status
supabase migration list

# Try pushing again
supabase db push

# If still fails, reset and push
supabase db reset
supabase db push
```

### Issue: Site still shows configuration notice

**Solutions:**
1. Verify environment variables are set in Vercel
2. Trigger a new deployment
3. Check browser console for errors
4. Clear browser cache and reload

### Issue: Can't login as admin

**Solutions:**
1. Verify you set `is_admin = true` in the users table
2. Logout and login again
3. Check Supabase logs for auth errors

---

## 📋 Quick Reference Commands

```bash
# Login to Supabase
supabase login

# List organizations
supabase orgs list

# List projects
supabase projects list

# Create new project
supabase projects create <name> --org-id <org-id> --db-password <password>

# Link local project
supabase link --project-ref <ref>

# Push migrations
supabase db push

# Check migration status
supabase migration list

# View database logs
supabase db logs

# Get project status
supabase status
```

---

## 🎉 Success Checklist

- [ ] Logged into Supabase CLI
- [ ] Created Supabase project (or linked existing)
- [ ] Ran database migrations (`supabase db push`)
- [ ] Got API credentials (URL + anon key)
- [ ] Added credentials to Vercel environment variables
- [ ] Redeployed site
- [ ] Site loads at https://eomc.shop (no configuration notice)
- [ ] Created admin user account
- [ ] Set `is_admin = true` in database
- [ ] Accessed admin dashboard
- [ ] Added first product
- [ ] Customized homepage content

---

## 📞 Need Help?

### Supabase Resources

- **Documentation**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com
- **GitHub**: https://github.com/supabase/supabase

### Project-Specific Help

- Check `ADMIN_SETUP.md` for admin features
- Check `DEPLOYMENT_GUIDE.md` for deployment issues
- Review migration files in `supabase/migrations/` to understand database structure

---

**You're almost there! Once Supabase is configured, your EOMC store will be fully functional! 🚀**
