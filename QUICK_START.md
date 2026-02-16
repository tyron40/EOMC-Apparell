# 🚀 EOMC Quick Start - Fix Domain Loop NOW

## What You Need to Know
- ✅ Repository already cloned
- ✅ You're in the right directory: `C:/Users/R/Desktop/EOMC-Apparell`
- 🎯 Goal: Get eomc.shop live in the next 15 minutes

---

## ⚡ Fast Track (Copy & Paste These Commands)

### 1️⃣ Install Dependencies
```bash
npm install
```
**Wait for this to complete before proceeding.**

---

### 2️⃣ Create Environment File

You need your Supabase credentials. Get them from:
- **Supabase Dashboard** → Your Project → **Settings** → **API**

Then create `.env` file:

**Option A: Using Command Line**
```bash
echo VITE_SUPABASE_URL=https://your-project.supabase.co > .env
echo VITE_SUPABASE_ANON_KEY=your-anon-key-here >> .env
```

**Option B: Create Manually**
Create a file named `.env` in this folder with:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 3️⃣ Install Vercel CLI
```bash
npm install -g vercel
```

---

### 4️⃣ Login to Vercel
```bash
vercel login
```
This opens your browser - login with your Vercel account.

---

### 5️⃣ Link to Your Existing Project
```bash
vercel link
```

**Answer the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → **tyrons-projects-584a5697**
- Link to existing project? → **Yes**
- Project name? → **eomc-apparell**

---

### 6️⃣ Add Environment Variables to Vercel
```bash
vercel env add VITE_SUPABASE_URL
```
Paste your Supabase URL when prompted, then:

```bash
vercel env add VITE_SUPABASE_ANON_KEY
```
Paste your Supabase anon key when prompted.

---

### 7️⃣ Deploy to Production
```bash
vercel --prod
```

**This will:**
- Build your site
- Deploy to Vercel
- Give you a live URL: `https://eomc-apparell.vercel.app`

✅ **Verify it works** by visiting the URL.

---

## 🌐 Fix the Domain (The Important Part)

### Step 1: Clean Up Old Domain Config

1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell/settings/domains

2. **Delete ALL existing domains** (if any):
   - Remove `eomc.shop`
   - Remove `www.eomc.shop`
   - Remove any other domains

This clears the stuck SSL state from Bolt.

---

### Step 2: Add Your Domain Fresh

1. In the same page, click **"Add Domain"**

2. Type: `eomc.shop` → Click **Add**

3. Click **"Add Domain"** again

4. Type: `www.eomc.shop` → Click **Add**

Vercel will show you DNS records to configure.

---

### Step 3: Update DNS at Your Registrar

**Where did you buy eomc.shop?** (GoDaddy, Namecheap, Cloudflare, etc.)

Tell me your registrar and I'll give you exact steps, OR use these standard records:

**Add these DNS records:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

### Step 4: Wait for DNS (5-15 minutes)

Check propagation:
```bash
nslookup eomc.shop
```

Or visit: https://dnschecker.org/#A/eomc.shop

---

### Step 5: Verify SSL & Domain

Once DNS propagates (usually 5-15 minutes):

1. Visit: **https://eomc.shop**
2. Visit: **https://www.eomc.shop**

Both should:
- ✅ Load your site
- ✅ Show secure padlock (SSL)
- ✅ Work perfectly

---

## 🎯 What Registrar Do You Use?

Tell me where you bought eomc.shop:

- **GoDaddy** → I'll give you exact GoDaddy steps
- **Namecheap** → I'll give you exact Namecheap steps
- **Cloudflare** → I'll give you exact Cloudflare steps
- **Other** → Tell me which one

---

## ✅ Success Checklist

- [ ] `npm install` completed
- [ ] `.env` file created with Supabase credentials
- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Linked to eomc-apparell project
- [ ] Environment variables added to Vercel
- [ ] Deployed with `vercel --prod`
- [ ] Site works at https://eomc-apparell.vercel.app
- [ ] Old domains removed from Vercel
- [ ] eomc.shop and www.eomc.shop added fresh
- [ ] DNS records updated at registrar
- [ ] https://eomc.shop works with SSL

---

## 🆘 Common Issues

### "Command not found: vercel"
**Fix:**
```bash
npm install -g vercel
```
Then close and reopen your terminal.

### "Domain already in use"
**Fix:** Remove the domain from Bolt first:
1. Go to Bolt dashboard
2. Remove eomc.shop
3. Wait 5 minutes
4. Try adding to Vercel again

### "Site shows 404"
**Fix:** The `vercel.json` file is already created. Just redeploy:
```bash
vercel --prod
```

### "Environment variables not working"
**Fix:** Make sure you added them to Vercel (not just local .env):
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```
Then redeploy.

---

## 📞 Next Steps

1. **Run the commands above** in order
2. **Tell me your domain registrar** so I can give exact DNS steps
3. **Wait for DNS to propagate** (5-15 minutes)
4. **Celebrate** when https://eomc.shop goes live! 🎉

---

**Ready? Start with Step 1 (npm install) and work your way down!**
