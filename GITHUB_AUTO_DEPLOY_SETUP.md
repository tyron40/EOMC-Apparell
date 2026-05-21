# GitHub Auto-Deployment Setup Guide

Your site is already configured for automatic deployment through Vercel's native GitHub integration!

## How It Works

Every time you push code to your GitHub repository (`tyron40/EOMC-Apparell`), Vercel automatically:
1. **Detects** the new push
2. **Clones** your latest code
3. **Builds** your project (runs `npm run build`)
4. **Deploys** to production

## Current Status

✅ **Already Configured:**
- GitHub repository connected: `tyron40/EOMC-Apparell`
- Active branch: `EOMC-Apparell/main`
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

## To Deploy Updates

Simply push your changes to GitHub:

```bash
git add .
git commit -m "Your changes"
git push
```

That's it! Vercel will automatically:
- Pull your latest code
- Run the build process
- Deploy to your live site

## Monitor Deployments

1. Go to https://vercel.com
2. Log in to your account
3. Select your project
4. View the **Deployments** tab to see:
   - Build status (building/success/failed)
   - Deployment history
   - Each deployment's URL
   - Build logs

## Environment Variables

Your Supabase credentials are already configured in Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These are automatically injected during the build process.

## Automatic Rollbacks

If a deployment fails, Vercel keeps the previous working version live, so your site won't go down.

## Preview Deployments

Push to any branch (except main/master), and Vercel creates a **preview deployment** at a unique URL:
- Test changes safely
- Share with team members
- No impact on production

## Troubleshooting

**Deployment not starting?**
- Check GitHub push was successful: `git log`
- Verify Vercel integration: https://vercel.com/dashboard
- Check build logs in Vercel dashboard

**Build failing?**
- View build logs in Vercel dashboard
- Common issues:
  - Missing dependencies: Run `npm install`
  - TypeScript errors: Run `npm run typecheck`
  - Lint errors: Run `npm run lint`

**Need to rebuild?**
- Go to Vercel dashboard
- Find the deployment
- Click "Redeploy" button

## Manual Trigger (Optional)

If you need to manually redeploy:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments" tab
4. Find a deployment → Click "..." → Select "Redeploy"

---

Your site is now fully automated! Every GitHub push = automatic deployment. 🚀
