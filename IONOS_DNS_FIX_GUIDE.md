# Fix EOMC.shop DNS on IONOS - Step-by-Step Guide

## 🎯 Problem:
Your domain eomc.shop is pointing to the old Bolt server (75.2.60.5) instead of Vercel (76.76.21.21).

## ✅ Solution: Update DNS A Record in IONOS

### Step 1: Access DNS Settings

1. **Login to IONOS:**
   - Go to: https://www.ionos.com
   - Login to your account

2. **Navigate to Domains:**
   - Click on **"Domains & SSL"** in the top menu
   - Find **eomc.shop** in your domain list
   - Click on the domain name or the gear icon next to it

3. **Access DNS Settings:**
   - Look for **"DNS"** or **"DNS Settings"** or **"Manage DNS"**
   - Click to open DNS management

---

### Step 2: Update the A Record

1. **Find the A Record:**
   - Look for a record with:
     - Type: **A**
     - Host/Name: **@** or blank (root domain)
     - Current Value: **75.2.60.5** ❌

2. **Edit the A Record:**
   - Click **Edit** or the pencil icon next to the A record
   - Change the IP address from:
     - **Old:** `75.2.60.5`
     - **New:** `76.76.21.21`
   - TTL: Leave as default (usually 3600 or 1 hour)

3. **Save Changes:**
   - Click **Save** or **Update**
   - Confirm the change

---

### Step 3: Verify CNAME Record (Should Already Be Correct)

1. **Check for CNAME Record:**
   - Type: **CNAME**
   - Host/Name: **www**
   - Value: Should point to **cname.vercel-dns.com**

2. **If it's different:**
   - Edit it to point to: `cname.vercel-dns.com`
   - Save changes

---

### Step 4: Remove/Disable IONOS SSL Certificate (Important!)

**Why?** Vercel provides free SSL automatically. Having IONOS SSL can cause conflicts.

1. **Go to SSL/Certificates Section:**
   - In IONOS dashboard, go to **"Domains & SSL"**
   - Click on **"SSL Certificates"** or **"Manage Certificates"**

2. **For the *.eomc.shop certificate:**
   - You can either:
     - **Option A:** Leave it (it won't interfere if DNS points to Vercel)
     - **Option B:** Disable/Remove it (recommended to avoid confusion)

3. **Important:**
   - Make sure the certificate is NOT forcing a redirect
   - Vercel will handle all SSL once DNS is updated

---

### Step 5: Wait for DNS Propagation

1. **Typical wait time:** 5-15 minutes
2. **Maximum wait time:** 24-48 hours (rare)

3. **Check DNS propagation:**
   ```bash
   nslookup eomc.shop
   ```
   Should return: `76.76.21.21`

4. **Online checker:**
   - Visit: https://dnschecker.org/#A/eomc.shop
   - Should show `76.76.21.21` in most locations

---

### Step 6: Verify Site Works

Once DNS propagates:

1. **Test both URLs:**
   - https://eomc.shop ✅
   - https://www.eomc.shop ✅

2. **Both should:**
   - Load your EOMC site
   - Show green padlock (SSL)
   - No certificate errors

---

## 🔍 IONOS-Specific Tips

### Finding DNS Settings in IONOS:

**Method 1:**
1. Login → Domains & SSL
2. Click on eomc.shop
3. Look for "DNS" tab or "DNS Settings" button

**Method 2:**
1. Login → Domains & SSL
2. Click gear icon next to eomc.shop
3. Select "DNS Settings" or "Edit DNS Zone"

**Method 3:**
1. Login → Domains & SSL
2. Click "Manage" next to eomc.shop
3. Scroll to "DNS Settings" section

### Common IONOS DNS Interface:

The DNS settings usually show a table like:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 3600 |
| CNAME | www | cname.vercel-dns.com | 3600 |

**Change the A record value to:** `76.76.21.21`

---

## ⚠️ Important Notes

1. **Don't delete the A record** - just edit the IP address
2. **Keep the CNAME record** for www subdomain
3. **IONOS SSL certificate** - Not needed, Vercel handles SSL
4. **Nameservers** - Should remain IONOS nameservers (don't change these)

---

## 🆘 Troubleshooting

### Issue: Can't find DNS settings
**Solution:**
- Look for: "DNS Zone Editor", "DNS Management", "Edit DNS"
- Contact IONOS support if you can't locate it

### Issue: Changes not saving
**Solution:**
- Make sure you clicked "Save" or "Apply"
- Try clearing browser cache and logging in again
- Wait a few minutes and check again

### Issue: DNS not propagating after 24 hours
**Solution:**
- Verify the A record shows `76.76.21.21` in IONOS
- Clear your local DNS cache: `ipconfig /flushdns`
- Try accessing from a different network/device

---

## ✅ Final Checklist

- [ ] Logged into IONOS
- [ ] Found DNS settings for eomc.shop
- [ ] Updated A record from 75.2.60.5 to 76.76.21.21
- [ ] Verified CNAME record points to cname.vercel-dns.com
- [ ] Saved changes
- [ ] Waited 15-30 minutes
- [ ] Tested: nslookup eomc.shop returns 76.76.21.21
- [ ] Visited https://eomc.shop - site loads with SSL
- [ ] Visited https://www.eomc.shop - site loads with SSL

---

## 📞 Need Help?

If you're stuck:
1. Take a screenshot of your IONOS DNS settings
2. Share it with me
3. I'll tell you exactly what to change

---

**Once DNS is updated, your site will be fully live at eomc.shop!** 🎉
