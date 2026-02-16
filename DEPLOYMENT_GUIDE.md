# EOMC Deployment Guide - Fix Domain Loop Issue

This guide will help you deploy EOMC to Vercel properly and fix the domain loop issue with eomc.shop.

## Current Situation
- **Problem**: Bolt.new has a stuck SSL provisioning job preventing domain changes
- **Solution**: Deploy directly from GitHub to Vercel, bypassing Bolt entirely
- **Repository**: https://github.com/tyron40/EOMC-Apparell.git
- **Existing Vercel Project**: https://vercel.com/tyrons-projects-584a5697/eomc-apparell

---

## Step-by-Step Deployment Process

### ✅ STEP 1: Install Dependencies (COMPLETED)
You've already cloned the repository. Now install the dependencies:

```bash
npm install
```

### ✅ STEP 2: Set Up Environment Variables

You need to create a `.env` file with your Supabase credentials:

```bash
# Create .env file
echo VITE_SUPABASE_URL=your_supabase_project_url > .env
echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env
```

**Important**: Replace with your actual Supabase credentials from:
- Supabase Dashboard → Project Settings → API

### ✅ STEP 3: Install Vercel CLI

```bash
npm install -g vercel
```

### ✅ STEP 4: Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate with the same account that owns:
- **tyrons-projects-584a5697**

### ✅ STEP 5: Link to Existing Vercel Project

```bash
vercel link
```

When prompted:
1. **Set up and deploy?** → Yes
2. **Which scope?** → tyrons-projects-584a5697
3. **Link to existing project?** → Yes
4. **What's the name of your existing project?** → eomc-apparell

This reconnects your local folder to the existing Vercel project.

### ✅ STEP 6: Add Environment Variables to Vercel

You need to add your Supabase credentials to Vercel:

**Option A: Via Vercel CLI (Recommended)**
```bash
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
```

**Option B: Via Vercel Dashboard**
1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell/settings/environment-variables
2. Add both variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Select all environments (Production, Preview, Development)

### ✅ STEP 7: Deploy to Production

```bash
vercel --prod
```

This will:
- Build your project
- Create a fresh deployment
- Reset any Bolt-linked configuration
- Give Vercel full control of SSL
- Deploy to: https://eomc-apparell.vercel.app

**Wait for deployment to complete** and verify the site loads correctly.

---

## 🔥 STEP 8: Fix the Domain Loop (CRITICAL)

This is where we permanently fix the eomc.shop domain issue.

### 8A: Remove Old Domain Configuration

1. Go to Vercel Dashboard:
   - https://vercel.com/tyrons-projects-584a5697/eomc-apparell/settings/domains

2. **Remove ALL existing domains** (if any):
   - Delete `eomc.shop` (if present)
   - Delete `www.eomc.shop` (if present)
   - Delete any Bolt-related domains

This clears the stuck SSL state.

### 8B: Add Your Domain Fresh

1. In the same Domains settings page, click **Add Domain**

2. Add your primary domain:
   ```
   eomc.shop
   ```

3. Click **Add**

4. Also add the www version:
   ```
   www.eomc.shop
   ```

5. Click **Add**

Vercel will now show you the DNS records you need to configure.

---

## 🌐 STEP 9: Configure DNS at Your Domain Registrar

**Where did you buy eomc.shop?**

### If GoDaddy:
1. Login to GoDaddy
2. Go to: My Products → Domains → eomc.shop → DNS
3. Add/Update these records:

   **A Record:**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   - TTL: `600` (or default)

   **CNAME Record:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `600` (or default)

4. Save changes

### If Namecheap:
1. Login to Namecheap
2. Go to: Domain List → Manage → Advanced DNS
3. Add/Update these records:

   **A Record:**
   - Type: `A Record`
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: `Automatic`

   **CNAME Record:**
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `Automatic`

4. Save changes

### If Cloudflare:
1. Login to Cloudflare
2. Select eomc.shop domain
3. Go to DNS → Records
4. Add/Update these records:

   **A Record:**
   - Type: `A`
   - Name: `@`
   - IPv4 address: `76.76.21.21`
   - Proxy status: `DNS only` (gray cloud)
   - TTL: `Auto`

   **CNAME Record:**
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy status: `DNS only` (gray cloud)
   - TTL: `Auto`

5. Save changes

### If Other Registrar:
Use the DNS records shown in your Vercel dashboard. The pattern is always:
- **A Record**: `@` → `76.76.21.21`
- **CNAME**: `www` → `cname.vercel-dns.com`

---

## ⏱️ STEP 10: Wait for DNS Propagation

After updating DNS:
- **Typical wait time**: 5-15 minutes
- **Maximum wait time**: 24-48 hours (rare)

### Check DNS Propagation:
```bash
# Check if DNS is updated
nslookup eomc.shop

# Or use online tool:
# https://dnschecker.org/#A/eomc.shop
```

### Verify SSL Certificate:
Once DNS propagates, Vercel will automatically:
1. Detect the domain is pointing correctly
2. Issue a free SSL certificate (Let's Encrypt)
3. Enable HTTPS for eomc.shop

You can check status in Vercel Dashboard → Domains section.

---

## ✅ STEP 11: Verify Everything Works

1. **Test the Vercel URL:**
   ```
   https://eomc-apparell.vercel.app
   ```
   Should load your site ✓

2. **Test your custom domain:**
   ```
   https://eomc.shop
   https://www.eomc.shop
   ```
   Both should load your site with SSL ✓

3. **Test admin features:**
   - Login at: https://eomc.shop/login
   - Access admin dashboard
   - Verify Supabase connection works

---

## 🎯 Why This Fixes the Domain Loop

**Before (Broken):**
```
GitHub → Bolt → Vercel → eomc.shop
              ↑
         (SSL stuck here)
```

**After (Fixed):**
```
GitHub → Vercel → eomc.shop
         ↑
    (Fresh SSL, no queue)
```

**Key differences:**
1. ✅ No Bolt in the deployment chain
2. ✅ Fresh SSL certificate request
3. ✅ Direct GitHub → Vercel connection
4. ✅ Full control over domain configuration
5. ✅ No stuck provisioning jobs

---

## 🔄 Future Deployments

After this initial setup, deploying updates is simple:

### Method 1: Automatic (Recommended)
1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
2. Vercel automatically deploys (if connected to GitHub)

### Method 2: Manual via CLI
```bash
vercel --prod
```

---

## 🆘 Troubleshooting

### Issue: "Domain is already in use"
**Solution**: The domain is still attached to the old Bolt deployment.
1. Go to Bolt dashboard
2. Remove eomc.shop from the Bolt project
3. Wait 5 minutes
4. Try adding to Vercel again

### Issue: "SSL certificate pending"
**Solution**: DNS hasn't propagated yet.
1. Verify DNS records are correct
2. Wait 15-30 minutes
3. Check https://dnschecker.org
4. Vercel will auto-issue SSL once DNS is confirmed

### Issue: "Site loads but shows 404"
**Solution**: Build configuration issue.
1. Check `vercel.json` is present
2. Verify build completed successfully
3. Check Vercel deployment logs

### Issue: "Environment variables not working"
**Solution**: Variables not set in Vercel.
1. Go to Vercel → Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy: `vercel --prod`

---

## 📋 Quick Reference Commands

```bash
# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link to existing project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs
```

---

## 🎉 Success Checklist

- [ ] Repository cloned locally
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with Supabase credentials
- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Linked to existing project
- [ ] Environment variables added to Vercel
- [ ] Deployed to production (`vercel --prod`)
- [ ] Old domains removed from Vercel
- [ ] Fresh domains added to Vercel
- [ ] DNS records updated at registrar
- [ ] DNS propagation confirmed
- [ ] SSL certificate issued
- [ ] https://eomc.shop loads correctly
- [ ] Admin features work
- [ ] Supabase connection verified

---

## 📞 Need Help?

If you encounter issues:

1. **Check Vercel deployment logs:**
   ```bash
   vercel logs
   ```

2. **Verify DNS configuration:**
   - https://dnschecker.org/#A/eomc.shop

3. **Check Vercel dashboard:**
   - https://vercel.com/tyrons-projects-584a5697/eomc-apparell

4. **Contact Vercel support** (if needed):
   - https://vercel.com/support

---

**You're now deploying like a professional developer! 🚀**

The domain loop is permanently fixed because you've taken full control of the deployment pipeline.
