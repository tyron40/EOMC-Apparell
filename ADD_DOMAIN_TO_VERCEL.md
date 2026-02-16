# Add eomc.shop Domain to Vercel - Final Step

## 🎯 Current Status:

✅ DNS A record updated in IONOS (76.76.21.21)
✅ DNS propagated successfully
✅ www.eomc.shop already working
❌ eomc.shop (root domain) not added to Vercel yet

## 🔧 Solution: Add Root Domain to Vercel

### Step 1: Access Vercel Dashboard

1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell
2. Login if needed
3. Click on **Settings** tab
4. Click on **Domains** in the left sidebar

### Step 2: Add the Root Domain

1. In the "Domains" section, you should see:
   - ✅ www.eomc.shop (already added)
   - ✅ eomc-apparell-9pr1le5am-tyrons-projects-584a5697.vercel.app

2. Click the **"Add"** button or **"Add Domain"** button

3. Enter: `eomc.shop` (without www)

4. Click **"Add"**

### Step 3: Vercel Will Verify DNS

Vercel will automatically:
1. Check if DNS points to 76.76.21.21 ✅ (it does!)
2. Verify domain ownership
3. Issue SSL certificate (takes 1-5 minutes)
4. Enable HTTPS

You should see a status like:
- ✅ **Valid Configuration** or **Active**
- 🔒 **SSL Certificate: Active**

### Step 4: Set as Primary Domain (Optional)

If you want eomc.shop to be the main domain:

1. Find `eomc.shop` in the domains list
2. Click the **three dots** (⋮) menu
3. Select **"Set as Primary Domain"**

This will make all deployments default to eomc.shop instead of the Vercel URL.

---

## 🎉 Expected Result:

After adding the domain, within 5 minutes:

✅ https://eomc.shop → Loads your site with SSL
✅ https://www.eomc.shop → Loads your site with SSL
✅ Both redirect to HTTPS automatically
✅ Green padlock in browser
✅ No certificate errors
✅ No domain loop

---

## 🔍 Troubleshooting

### Issue: "Domain is already in use"

**Cause:** Domain might still be attached to old Bolt project

**Solution:**
1. Go to Bolt dashboard: https://bolt.new
2. Find the old EOMC project
3. Go to Settings → Domains
4. Remove eomc.shop
5. Wait 5 minutes
6. Try adding to Vercel again

### Issue: "Invalid Configuration"

**Cause:** DNS not fully propagated or pointing to wrong IP

**Solution:**
1. Verify DNS: `nslookup eomc.shop` should show 76.76.21.21
2. Wait 5-10 more minutes
3. Click "Refresh" in Vercel domains page
4. Try adding again

### Issue: "SSL Certificate Pending"

**Cause:** Vercel is still issuing the certificate

**Solution:**
- This is normal
- Wait 5-10 minutes
- Certificate will auto-activate
- No action needed

---

## 📋 Quick Checklist

- [ ] Logged into Vercel dashboard
- [ ] Navigated to: Settings → Domains
- [ ] Clicked "Add Domain"
- [ ] Entered: eomc.shop
- [ ] Clicked "Add"
- [ ] Waited for SSL certificate (5 minutes)
- [ ] Verified: https://eomc.shop loads
- [ ] Verified: Green padlock shows in browser
- [ ] (Optional) Set eomc.shop as primary domain

---

## 🎯 Alternative: Add Domain via CLI

If you prefer using the command line:

```bash
# Navigate to project directory
cd C:/Users/R/Desktop/EOMC-Apparell

# Add domain
vercel domains add eomc.shop

# Check domain status
vercel domains ls
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **In Vercel Dashboard:**
   - Domain shows "Valid Configuration" ✅
   - SSL shows "Active" 🔒
   - No error messages

2. **In Browser:**
   - https://eomc.shop loads your site
   - Green padlock appears
   - No certificate warnings
   - No redirect loops

3. **DNS Check:**
   ```bash
   nslookup eomc.shop
   # Returns: 76.76.21.21
   ```

---

## 🚀 After Domain is Live

Once eomc.shop is working:

### Next Steps:

1. **Set up Supabase** (for full e-commerce functionality):
   - Create account at https://supabase.com
   - Get your project URL and anon key
   - Add to Vercel environment variables
   - Redeploy

2. **Test the site:**
   - Browse products
   - Test shopping cart
   - Try checkout process
   - Test admin login

3. **Customize content:**
   - Login to admin dashboard
   - Upload product images
   - Add product descriptions
   - Configure site settings

---

**You're almost there! Just add the domain in Vercel dashboard and you're done!** 🎉
