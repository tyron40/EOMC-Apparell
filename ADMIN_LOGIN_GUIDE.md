# 🔐 Admin Login & Setup Guide - EOMC

Complete guide for setting up and accessing the admin dashboard.

---

## 🚀 Quick Start - Create Your First Admin Account

### Method 1: Admin Setup Page (Recommended - Easiest)

**Step-by-Step:**

1. **Navigate to the Admin Setup Page:**
   ```
   https://eomc.shop/admin/setup
   ```

2. **Fill in the form:**
   - **Admin Email:** Your email address
   - **Password:** Minimum 6 characters (use a strong password!)
   - **Confirm Password:** Re-enter the same password

3. **Click "Create Admin Account"**
   - System creates your user account
   - Automatically grants admin privileges
   - Adds you to the `admin_users` table

4. **You'll see a success message:**
   - "Admin Account Created!"
   - Automatically redirects to login page

5. **Login with your credentials:**
   ```
   https://eomc.shop/login
   ```
   - Use the email and password you just created
   - After login, you'll see "Admin" link in the header

6. **Access Admin Dashboard:**
   - Click "Admin" in the header
   - Or go directly to: `https://eomc.shop/admin/dashboard`

**Security Note:**
- The setup page only works for the FIRST admin account
- Once an admin exists, the page redirects to login
- This prevents unauthorized admin creation

---

### Method 2: Manual Database Method

If you already have a regular user account and want to make it an admin:

**Step 1: Register a Regular Account**
```
https://eomc.shop/register
```

**Step 2: Get Your User ID**

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/editor
   ```

2. Click on **"users"** table (under Authentication)

3. Find your email and copy the **"id"** value

**Step 3: Add Admin Privileges**

1. In Supabase, click **SQL Editor** (left sidebar)

2. Run this query (replace with your actual user ID):
   ```sql
   INSERT INTO admin_users (id, email, role)
   VALUES (
     'your-user-id-here',
     'your-email@example.com',
     'admin'
   );
   ```

3. Click **"Run"**

**Step 4: Logout and Login Again**
- Logout from the site
- Login again with your credentials
- You now have admin access!

---

## 🔑 How Admin Login Works

### Authentication Flow

1. **User enters email/password** at `/login`
2. **Supabase Auth validates credentials**
3. **System checks `admin_users` table** for user's ID
4. **If found:** `user.isAdmin = true` is set in AuthContext
5. **Admin features become visible** throughout the app

### What Happens After Login

**For Regular Users:**
- Can browse products
- Can add to cart
- Can checkout
- Can view their own orders

**For Admin Users (Everything above PLUS):**
- "Admin" link appears in header
- Access to `/admin/*` routes
- Edit Mode toggle in header
- Can manage products, inventory, orders
- Can edit site content (hero, gallery, video)
- Can view all customer orders

---

## 🛡️ Security Features

### Database Level Security (Row Level Security - RLS)

**Products Table:**
```sql
-- Anyone can read products
SELECT: public

-- Only admins can create/update/delete
INSERT/UPDATE/DELETE: admin_users only
```

**Orders Table:**
```sql
-- Users can read their own orders
SELECT: user_id = auth.uid()

-- Admins can read all orders
SELECT: is_admin = true

-- Only admins can update order status
UPDATE: admin_users only
```

**Admin Users Table:**
```sql
-- Only admins can read admin list
SELECT: admin_users only

-- Only admins can create new admins
INSERT: admin_users only
```

### Frontend Guards

**Route Protection:**
```typescript
// Admin routes check for admin status
if (!user?.isAdmin) {
  navigate('/'); // Redirect to home
}
```

**Component Visibility:**
```typescript
// Admin buttons only show to admins
{user?.isAdmin && (
  <Link to="/admin">Admin</Link>
)}
```

**Edit Mode:**
```typescript
// Edit mode toggle only visible to admins
{isEditMode && user?.isAdmin && (
  <button>Edit</button>
)}
```

---

## 📊 Admin Dashboard Overview

### Main Dashboard (`/admin/dashboard`)

Your command center with quick access to:

- **Product Manager** - Add/edit/delete products
- **Inventory Manager** - Track stock levels
- **Orders Manager** - Process customer orders
- **Settings** - Change password, site settings

### Product Manager (`/admin/products`)

**Add New Products:**
- Product name, description, price
- Category assignment
- Main image + gallery images (multiple)
- Available sizes (S, M, L, XL, XXL checkboxes)
- Stock quantity
- Low stock threshold
- Featured product toggle
- Availability toggle

**Edit Products:**
- Click edit button on any product
- Advanced image controls:
  - **Fit:** Contain, Cover, or Fill
  - **Position:** Move image (-50% to +50% X/Y)
  - **Zoom:** 0.5x to 3.0x
  - Live preview as you adjust
- Update any field
- Save changes

**Delete Products:**
- Remove products completely
- Confirmation prompt prevents accidents

### Inventory Manager (`/admin/inventory`)

**Stock Tracking:**
- View all products with current stock
- Yellow highlight for low stock items
- Update quantities directly
- Set custom thresholds per product

**Quick Actions:**
- Increase/decrease stock with +/- buttons
- Toggle availability without changing stock
- See which products need restocking

### Orders Manager (`/admin/orders`)

**Order List:**
- All customer orders
- Order number (ORD-XXXXXXXX)
- Customer name and email
- Order total
- Current status
- Order date

**Order Details (Click any order):**
- Full customer information
- Complete shipping address
- Itemized product list
- Order total breakdown

**Status Management:**
- Pending → Processing → Shipped → Delivered
- Or mark as Cancelled

**Shipping Label System:**
- Tracking number
- Carrier (USPS, FedEx, UPS, DHL, Custom)
- Shipping date
- Upload label (PDF/image)
- Shipping notes
- Package weight
- Dimensions (L × W × H)

### Settings (`/admin/settings`)

**Change Password:**
- Enter current password
- Enter new password
- Confirmation required
- Stay logged in after change

---

## 🎨 Edit Mode (Content Management)

### How to Use Edit Mode

1. **Enable Edit Mode:**
   - Look for "Edit Mode: OFF" button in header (admin only)
   - Click to turn ON
   - Edit buttons appear on editable content

2. **Edit Content:**
   - Navigate to any page
   - Click edit buttons on sections you want to change
   - Make your changes
   - Save

3. **Disable Edit Mode:**
   - Click "Edit Mode: ON" to turn OFF
   - Edit buttons disappear
   - Site returns to normal view

### What You Can Edit

**Hero Slideshow (Homepage):**
- Add slides: Upload image, add title/subtitle
- Edit slides: Change image, adjust position/zoom, edit text
- Delete slides: Remove unwanted slides
- Slides auto-rotate every 5 seconds

**Gallery Images (Top Sellers):**
- Add images: Upload new photos
- Set fit: Contain, Cover, or Fill
- Delete images: Remove from gallery
- Auto-ordering

**Video Section:**
- Upload new video (MP4, WebM, MOV)
- Video auto-plays on loop, muted
- Great for brand storytelling

**Collections/Categories:**
- Edit category name
- Upload new category image
- Adjust image fit, position, zoom
- Changes update across entire site

**Product Cards:**
- Quick edit from product listings
- Jump to full product manager

---

## 🔄 Common Admin Workflows

### Fulfilling an Order

1. Go to **Orders Manager**
2. Click on "Pending" order
3. Change status to **"Processing"**
4. Prepare and pack the items
5. Create shipping label (via Stamps.com, ShipStation, etc.)
6. Click **"Edit Shipping Info"**
7. Add:
   - Tracking number
   - Carrier
   - Shipping date
   - Upload label PDF/image
8. Save changes
9. Change status to **"Shipped"**
10. Customer can now track their order
11. When delivered, mark as **"Delivered"**

### Adding a New Product

1. Go to **Product Manager**
2. Click **"Add New Product"**
3. Fill in:
   - Name
   - Description
   - Price
   - Category
4. Upload images:
   - Main product image
   - Additional gallery images
5. Select available sizes
6. Set stock quantity
7. Set low stock threshold (e.g., 5)
8. Mark as featured (optional)
9. Click **"Save"**
10. Product appears on site immediately

### Updating Homepage Content

1. Enable **Edit Mode** (header toggle)
2. Navigate to homepage
3. Click edit button on section to change:
   - Hero slideshow
   - Gallery images
   - Video
4. Upload new images or edit text
5. Adjust position/zoom if needed
6. Save changes
7. Turn off Edit Mode when done

### Managing Inventory

1. Go to **Inventory Manager**
2. Review stock levels
3. Yellow highlights show low stock items
4. Update quantities:
   - Click +/- buttons
   - Or enter new quantity directly
5. Toggle availability for out-of-stock items
6. Save changes

---

## 👥 Adding More Admins

### Option 1: Via Admin Dashboard (Future Feature)

Currently, you need to use the database method.

### Option 2: Via Database

1. Have the new admin register at `/register`
2. Go to Supabase → SQL Editor
3. Run:
   ```sql
   INSERT INTO admin_users (id, email, role)
   SELECT id, email, 'admin'
   FROM auth.users
   WHERE email = 'new-admin@example.com';
   ```
4. New admin logs out and back in
5. They now have admin access

---

## 🆘 Troubleshooting

### Can't Access Admin Setup Page

**Problem:** Page redirects to login

**Cause:** An admin account already exists

**Solution:** Use the existing admin credentials or use Method 2 to add yourself as admin

### Admin Link Not Showing After Login

**Problem:** Logged in but no "Admin" link in header

**Cause:** User not in `admin_users` table

**Solution:**
1. Check Supabase → `admin_users` table
2. Verify your user ID is listed
3. If not, add it using SQL method
4. Logout and login again

### Can't Edit Products/Orders

**Problem:** Edit buttons don't work or show errors

**Cause:** Database RLS policies blocking access

**Solution:**
1. Verify you're logged in as admin
2. Check browser console for errors
3. Verify `admin_users` table has your user ID
4. Check Supabase logs for permission errors

### Forgot Admin Password

**Problem:** Can't login to admin account

**Solution:**
1. Go to `/login`
2. Click "Forgot password?" (if available)
3. Or reset via Supabase Dashboard:
   - Go to Authentication → Users
   - Find your user
   - Click "..." → "Send password reset email"
4. Check email for reset link

### Edit Mode Not Working

**Problem:** Edit buttons don't appear

**Cause:** Not logged in as admin or Edit Mode not enabled

**Solution:**
1. Verify you're logged in
2. Check "Admin" link is visible in header
3. Click "Edit Mode: OFF" to enable
4. Refresh page if needed

---

## 📋 Admin Checklist

### Initial Setup
- [ ] Create first admin account at `/admin/setup`
- [ ] Login with admin credentials
- [ ] Verify "Admin" link appears in header
- [ ] Access admin dashboard
- [ ] Change password in Settings

### Daily Tasks
- [ ] Check Orders Manager for new orders
- [ ] Update order statuses
- [ ] Monitor inventory levels
- [ ] Respond to low stock alerts

### Weekly Tasks
- [ ] Review all pending orders
- [ ] Update featured products
- [ ] Check for stuck orders
- [ ] Review inventory thresholds

### Content Updates
- [ ] Enable Edit Mode
- [ ] Update hero images for promotions
- [ ] Refresh gallery images
- [ ] Update video for campaigns
- [ ] Disable Edit Mode when done

---

## 🔐 Security Best Practices

1. **Use Strong Passwords:**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Don't reuse passwords

2. **Limit Admin Access:**
   - Only give admin to trusted users
   - Review admin list regularly
   - Remove inactive admins

3. **Logout When Done:**
   - Always logout on shared computers
   - Don't save passwords in browser on public devices

4. **Monitor Activity:**
   - Review order changes
   - Check product modifications
   - Watch for unusual activity

5. **Keep Credentials Secure:**
   - Don't share admin passwords
   - Use password manager
   - Enable 2FA if available (future feature)

---

## 📞 Support

If you encounter issues:

1. **Check browser console** (F12) for errors
2. **Check Supabase logs** in dashboard
3. **Verify database permissions** in RLS policies
4. **Review this guide** for solutions

---

**You now have complete control over your EOMC store! 🎉**

Use the admin dashboard to manage products, process orders, and customize your site content.
