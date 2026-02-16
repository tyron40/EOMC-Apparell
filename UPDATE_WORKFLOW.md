# How to Update Your Live Site

## 🔄 Deployment Workflow

Your site is now connected: **GitHub → Vercel → eomc.shop**

This means:
- ✅ Any changes pushed to GitHub will **automatically deploy** to Vercel
- ✅ Vercel watches your GitHub repository for changes
- ✅ No manual deployment needed after initial setup

---

## 📝 How to Update Your Site

### Method 1: Push Changes to GitHub (Automatic Deployment)

**Step 1: Make Changes Locally**
```bash
# Navigate to your project
cd C:/Users/R/Desktop/EOMC-Apparell

# Make your changes to files (edit code, add features, etc.)
```

**Step 2: Commit Changes**
```bash
# Check what files changed
git status

# Add all changed files
git add .

# Commit with a message
git commit -m "Description of your changes"
```

**Step 3: Push to GitHub**
```bash
# Push to main branch
git push origin main
```

**Step 4: Automatic Deployment**
- Vercel detects the push automatically
- Builds your project
- Deploys to production
- Updates https://eomc.shop
- Usually takes 1-3 minutes

---

### Method 2: Manual Deployment via Vercel CLI (Faster for Testing)

**When to use:** Quick updates without committing to GitHub

```bash
# Navigate to project
cd C:/Users/R/Desktop/EOMC-Apparell

# Deploy to production
vercel --prod
```

This deploys directly from your local files to Vercel.

---

## 🎯 Current Files That Need to Be Pushed

I created several new files locally that should be pushed to GitHub:

### New Files Created:
1. `vercel.json` - Vercel configuration (IMPORTANT!)
2. `DEPLOYMENT_GUIDE.md` - Deployment documentation
3. `QUICK_START.md` - Quick start guide
4. `DNS_REGISTRAR_GUIDES.md` - DNS setup guides
5. `IONOS_DNS_FIX_GUIDE.md` - IONOS-specific guide
6. `ADD_DOMAIN_TO_VERCEL.md` - Domain addition guide
7. `DEPLOYMENT_STATUS.md` - Build status
8. `.env.example` - Environment variable template
9. `UPDATE_WORKFLOW.md` - This file

### Important Files to Push:
- **vercel.json** ← CRITICAL for proper routing
- All documentation files (optional but recommended)

---

## 🚀 Push Current Changes to GitHub

Run these commands to push all the new files:

```bash
# Navigate to project
cd C:/Users/R/Desktop/EOMC-Apparell

# Check current status
git status

# Add all new files
git add .

# Commit with message
git commit -m "Add Vercel configuration and deployment documentation"

# Push to GitHub
git push origin main
```

After pushing:
- Vercel will automatically detect the changes
- Rebuild the project with vercel.json configuration
- Deploy to production
- Site will be updated in 1-3 minutes

---

## 📊 How to Monitor Deployments

### Option 1: Vercel Dashboard
1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell
2. Click on **"Deployments"** tab
3. See real-time deployment status
4. View build logs if needed

### Option 2: GitHub
1. Go to: https://github.com/tyron40/EOMC-Apparell
2. Look for the green checkmark or orange dot next to commits
3. Green ✓ = Deployed successfully
4. Orange ● = Deploying now
5. Red ✗ = Deployment failed

### Option 3: Vercel CLI
```bash
# View recent deployments
vercel ls

# View deployment logs
vercel logs
```

---

## 🔧 Common Update Scenarios

### Scenario 1: Update Product Information
```bash
# Edit files in src/pages/ or src/components/
# Then:
git add .
git commit -m "Update product information"
git push origin main
```

### Scenario 2: Change Styling
```bash
# Edit src/index.css or component files
# Then:
git add .
git commit -m "Update site styling"
git push origin main
```

### Scenario 3: Add New Features
```bash
# Create new files or modify existing ones
# Then:
git add .
git commit -m "Add new feature: [feature name]"
git push origin main
```

### Scenario 4: Update Environment Variables
```bash
# Go to Vercel Dashboard
# Settings → Environment Variables
# Add/Update variables
# Click "Redeploy" button (no git push needed)
```

---

## ⚡ Quick Reference Commands

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub (triggers auto-deploy)
git push origin main

# Manual deploy (skip GitHub)
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

## 🎯 Important Notes

### Automatic Deployment is Enabled
- ✅ Vercel is connected to your GitHub repository
- ✅ Every push to `main` branch triggers deployment
- ✅ No manual action needed after pushing

### Deployment Time
- **Average:** 1-3 minutes
- **Build time:** ~30 seconds
- **Propagation:** Instant (Vercel CDN)

### Rollback if Needed
If a deployment breaks something:
1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." menu → "Promote to Production"
4. Instant rollback!

---

## 🆘 Troubleshooting

### Issue: "Git push rejected"
**Solution:**
```bash
# Pull latest changes first
git pull origin main

# Then push
git push origin main
```

### Issue: "Deployment failed"
**Solution:**
1. Check Vercel deployment logs
2. Look for build errors
3. Fix errors locally
4. Push again

### Issue: "Changes not showing on site"
**Solution:**
1. Clear browser cache (Ctrl + Shift + R)
2. Check Vercel deployment status
3. Wait 2-3 minutes for CDN propagation
4. Try incognito/private browsing

---

## ✅ Next Steps

**Right now, you should:**

1. **Push the new files to GitHub:**
   ```bash
   cd C:/Users/R/Desktop/EOMC-Apparell
   git add .
   git commit -m "Add Vercel config and documentation"
   git push origin main
   ```

2. **Verify deployment:**
   - Watch Vercel dashboard
   - Wait 1-3 minutes
   - Visit https://eomc.shop
   - Confirm site still works

3. **Future updates:**
   - Make changes locally
   - Commit and push to GitHub
   - Vercel auto-deploys
   - Site updates automatically

---

**Your workflow is now professional and automated!** 🚀
