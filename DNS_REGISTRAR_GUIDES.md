# DNS Configuration Guides by Registrar

Complete step-by-step DNS setup for eomc.shop on different domain registrars.

---

## 🔵 GoDaddy

### Step-by-Step Instructions:

1. **Login to GoDaddy**
   - Go to: https://www.godaddy.com
   - Click "Sign In"
   - Enter your credentials

2. **Navigate to DNS Management**
   - Click on your profile icon (top right)
   - Select "My Products"
   - Find "eomc.shop" in your domain list
   - Click the three dots (⋮) next to it
   - Select "Manage DNS"

3. **Update A Record**
   - Scroll to "DNS Records" section
   - Look for existing A record with Name "@"
   - Click the pencil icon (Edit) next to it
   - OR if no A record exists, click "Add New Record"
   
   **Settings:**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   - TTL: `600 seconds` (or 1 Hour)
   
   - Click "Save"

4. **Add/Update CNAME Record**
   - Look for existing CNAME record with Name "www"
   - Click the pencil icon (Edit) next to it
   - OR if no CNAME exists, click "Add New Record"
   
   **Settings:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `1 Hour`
   
   - Click "Save"

5. **Remove Conflicting Records (Important!)**
   - Delete any other A records pointing to old IPs
   - Delete any CNAME for "@" (root domain)
   - Keep only the two records above

6. **Save Changes**
   - Click "Save" at the bottom
   - Wait 5-15 minutes for propagation

---

## 🟠 Namecheap

### Step-by-Step Instructions:

1. **Login to Namecheap**
   - Go to: https://www.namecheap.com
   - Click "Sign In"
   - Enter your credentials

2. **Navigate to Domain Management**
   - Click "Domain List" in the left sidebar
   - Find "eomc.shop"
   - Click "Manage" button next to it

3. **Access Advanced DNS**
   - Click on "Advanced DNS" tab at the top

4. **Update A Record**
   - Look for existing A Record with Host "@"
   - Click the pencil icon to edit
   - OR click "Add New Record"
   
   **Settings:**
   - Type: `A Record`
   - Host: `@`
   - Value: `76.76.21.21`
   - TTL: `Automatic` (or 5 min)
   
   - Click the green checkmark to save

5. **Add/Update CNAME Record**
   - Look for existing CNAME Record with Host "www"
   - Click the pencil icon to edit
   - OR click "Add New Record"
   
   **Settings:**
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `Automatic`
   
   - Click the green checkmark to save

6. **Remove Parking Page (If Applicable)**
   - If you see "Namecheap Parking Page" enabled
   - Turn it OFF
   - This prevents conflicts

7. **Save All Changes**
   - Changes save automatically
   - Wait 5-30 minutes for propagation

---

## 🟡 Cloudflare

### Step-by-Step Instructions:

1. **Login to Cloudflare**
   - Go to: https://dash.cloudflare.com
   - Enter your credentials

2. **Select Your Domain**
   - Click on "eomc.shop" from your domain list

3. **Navigate to DNS Settings**
   - Click "DNS" in the left sidebar
   - You'll see "DNS Records" section

4. **Add/Update A Record**
   - Click "Add record" button
   - OR click "Edit" on existing A record for "@"
   
   **Settings:**
   - Type: `A`
   - Name: `@` (or leave blank for root)
   - IPv4 address: `76.76.21.21`
   - Proxy status: **🔴 DNS only** (gray cloud, NOT orange)
   - TTL: `Auto`
   
   - Click "Save"

5. **Add/Update CNAME Record**
   - Click "Add record" button
   - OR click "Edit" on existing CNAME for "www"
   
   **Settings:**
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **🔴 DNS only** (gray cloud, NOT orange)
   - TTL: `Auto`
   
   - Click "Save"

6. **⚠️ CRITICAL: Disable Cloudflare Proxy**
   - Make sure BOTH records show **gray cloud** (DNS only)
   - NOT orange cloud (Proxied)
   - Orange cloud will break Vercel SSL
   - Click the cloud icon to toggle if needed

7. **Remove Conflicting Records**
   - Delete any old A records
   - Delete any AAAA records for "@" or "www"
   - Keep only the two records above

8. **SSL/TLS Settings (Important!)**
   - Go to "SSL/TLS" in left sidebar
   - Set SSL/TLS encryption mode to: **Full** (not Flexible, not Full Strict)
   - This allows Vercel to handle SSL

9. **Wait for Propagation**
   - Usually 2-5 minutes with Cloudflare
   - Can take up to 24 hours in rare cases

---

## 🟢 Google Domains (Now Squarespace)

### Step-by-Step Instructions:

1. **Login to Google Domains/Squarespace**
   - Go to: https://domains.google.com
   - OR: https://domains.squarespace.com
   - Sign in with your Google account

2. **Select Your Domain**
   - Click on "eomc.shop"

3. **Navigate to DNS Settings**
   - Click "DNS" in the left sidebar
   - Scroll to "Custom resource records"

4. **Add/Update A Record**
   - In the "Custom resource records" section
   
   **Settings:**
   - Name: `@`
   - Type: `A`
   - TTL: `1H` (1 hour)
   - Data: `76.76.21.21`
   
   - Click "Add"

5. **Add/Update CNAME Record**
   
   **Settings:**
   - Name: `www`
   - Type: `CNAME`
   - TTL: `1H`
   - Data: `cname.vercel-dns.com`
   
   - Click "Add"

6. **Remove Synthetic Records**
   - If you see "Synthetic records" section
   - Disable any subdomain forwarding
   - Disable website forwarding

7. **Save Changes**
   - Changes apply automatically
   - Wait 5-15 minutes for propagation

---

## 🔴 Domain.com

### Step-by-Step Instructions:

1. **Login to Domain.com**
   - Go to: https://www.domain.com
   - Click "Sign In"
   - Enter credentials

2. **Access Domain Management**
   - Click "Manage" next to eomc.shop
   - OR go to "My Domains" → select eomc.shop

3. **Navigate to DNS Settings**
   - Click "DNS & Nameservers" in left menu
   - OR click "DNS Records"

4. **Add/Update A Record**
   - Click "Add DNS Record"
   
   **Settings:**
   - Type: `A`
   - Name: `@`
   - Content: `76.76.21.21`
   - TTL: `3600` (1 hour)
   
   - Click "Add Record"

5. **Add/Update CNAME Record**
   - Click "Add DNS Record"
   
   **Settings:**
   - Type: `CNAME`
   - Name: `www`
   - Content: `cname.vercel-dns.com`
   - TTL: `3600`
   
   - Click "Add Record"

6. **Save Changes**
   - Click "Save Changes" or "Update"
   - Wait 10-30 minutes for propagation

---

## 🟣 Hover

### Step-by-Step Instructions:

1. **Login to Hover**
   - Go to: https://www.hover.com
   - Sign in

2. **Select Domain**
   - Click on "eomc.shop" from your domain list

3. **Navigate to DNS**
   - Click "DNS" tab

4. **Add/Update A Record**
   - Click "Add New"
   
   **Settings:**
   - Type: `A`
   - Hostname: `@`
   - IP Address: `76.76.21.21`
   - TTL: `900` (15 minutes)
   
   - Click "Save"

5. **Add/Update CNAME Record**
   - Click "Add New"
   
   **Settings:**
   - Type: `CNAME`
   - Hostname: `www`
   - Target: `cname.vercel-dns.com`
   - TTL: `900`
   
   - Click "Save"

6. **Remove Forwarding**
   - If domain forwarding is enabled, disable it
   - Go to "Forward" tab and remove any forwards

---

## 🔵 Bluehost

### Step-by-Step Instructions:

1. **Login to Bluehost**
   - Go to: https://my.bluehost.com
   - Sign in

2. **Navigate to Domains**
   - Click "Domains" in left sidebar
   - Find "eomc.shop"
   - Click "Manage"

3. **Access DNS Zone Editor**
   - Click "DNS Zone Editor"
   - OR click "Advanced DNS"

4. **Add/Update A Record**
   - Find existing A record or click "Add Record"
   
   **Settings:**
   - Type: `A`
   - Host: `@`
   - Points To: `76.76.21.21`
   - TTL: `14400` (4 hours)
   
   - Click "Add Record"

5. **Add/Update CNAME Record**
   
   **Settings:**
   - Type: `CNAME`
   - Host: `www`
   - Points To: `cname.vercel-dns.com`
   - TTL: `14400`
   
   - Click "Add Record"

6. **Save Changes**
   - Wait 15-30 minutes for propagation

---

## 🟢 HostGator

### Step-by-Step Instructions:

1. **Login to HostGator**
   - Go to: https://portal.hostgator.com
   - Sign in

2. **Navigate to Domains**
   - Click "Domains" in top menu
   - Find "eomc.shop"
   - Click "Manage"

3. **Access DNS Management**
   - Click "DNS Management"
   - OR "Zone Editor"

4. **Add/Update A Record**
   
   **Settings:**
   - Type: `A`
   - Name: `@`
   - Address: `76.76.21.21`
   - TTL: `3600`
   
   - Click "Add Record"

5. **Add/Update CNAME Record**
   
   **Settings:**
   - Type: `CNAME`
   - Name: `www`
   - CNAME: `cname.vercel-dns.com`
   - TTL: `3600`
   
   - Click "Add Record"

---

## ✅ Verification Steps (All Registrars)

After updating DNS records:

### 1. Check DNS Propagation
```bash
# Windows Command Prompt or PowerShell
nslookup eomc.shop

# Should show: 76.76.21.21
```

### 2. Online DNS Checker
Visit: https://dnschecker.org/#A/eomc.shop

Should show `76.76.21.21` in most locations.

### 3. Check CNAME
```bash
nslookup www.eomc.shop

# Should show: cname.vercel-dns.com
```

### 4. Wait for SSL
- Once DNS propagates, Vercel auto-issues SSL
- Check Vercel dashboard → Domains
- Should show green checkmark ✅ next to eomc.shop

### 5. Test Your Site
- Visit: https://eomc.shop
- Visit: https://www.eomc.shop
- Both should load with SSL (padlock icon)

---

## ⏱️ Typical Propagation Times

| Registrar | Typical Time | Maximum Time |
|-----------|--------------|--------------|
| Cloudflare | 2-5 minutes | 1 hour |
| GoDaddy | 10-30 minutes | 24 hours |
| Namecheap | 5-30 minutes | 48 hours |
| Google Domains | 5-15 minutes | 24 hours |
| Domain.com | 15-30 minutes | 48 hours |
| Hover | 10-20 minutes | 24 hours |
| Bluehost | 15-30 minutes | 24 hours |
| HostGator | 15-30 minutes | 24 hours |

---

## 🆘 Common Issues

### Issue: "DNS not updating"
**Solutions:**
1. Clear your DNS cache:
   ```bash
   ipconfig /flushdns
   ```
2. Try a different DNS checker
3. Wait longer (up to 48 hours in rare cases)

### Issue: "SSL certificate pending"
**Solutions:**
1. Verify DNS is pointing correctly
2. Wait for DNS to fully propagate
3. Check Vercel dashboard for errors
4. Remove and re-add domain in Vercel

### Issue: "Domain already in use"
**Solutions:**
1. Remove domain from Bolt project first
2. Wait 5-10 minutes
3. Try adding to Vercel again

---

## 📞 Need Help?

If your registrar isn't listed or you need help:

1. **Tell me your registrar name**
2. **I'll provide exact steps**
3. **Or use the standard records:**
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

Most registrars follow similar patterns!
