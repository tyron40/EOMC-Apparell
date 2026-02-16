# Admin System Setup Guide

## Quick Start - Creating Your First Admin User

The easiest way to create your first admin account:

1. **Visit `/admin/setup`** in your browser
2. **Enter your email and password**
3. **Click "Create Admin Account"**
4. **Log in at `/login`** with your new credentials
5. **Click the user icon** and select "Admin Dashboard"

That's it! You now have full admin access.

## Alternative Method (Using SQL)

If you prefer to manually create an admin user:

1. Create a regular account at `/register`
2. Go to your Supabase dashboard SQL Editor
3. Run this query (replace with your email):

```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL@example.com';
```

4. Log out and log back in to see admin features

## Accessing the Admin Dashboard

Once you're logged in as an admin:
1. Click on the user icon in the header
2. Select "Admin Dashboard"
3. You now have full access to:
   - Product Management (add/edit/delete products)
   - Inventory Management (update stock levels)
   - Order Management (view and update order status)
   - Account Settings (change your password)

## Admin Features

### Product Management
- **Add New Products**: Click "Add Product" to create new items
- **Edit Products**: Update product details, pricing, and descriptions
- **Delete Products**: Remove products from the catalog
- **Set Featured Products**: Mark products to appear on the homepage
- **Manage Availability**: Control which products are available for purchase

### Inventory Management
- **Update Stock Levels**: Adjust inventory quantities for each product
- **Low Stock Alerts**: Automatically highlights products below threshold
- **Set Low Stock Threshold**: Define when products should show as low stock
- **Toggle Availability**: Quickly make products available or unavailable

### Order Management
- **View All Orders**: See complete order history
- **Update Order Status**: Change order status (pending, processing, shipped, delivered, cancelled)
- **Customer Information**: Access customer details and shipping addresses

## Stock Management

Products have the following stock-related fields:
- **stock_quantity**: Current inventory count
- **low_stock_threshold**: Alert threshold (default: 5)
- **is_available**: Whether product can be purchased

When stock_quantity falls below low_stock_threshold, the product will be highlighted in the inventory management screen.

## Image Upload

For product images, you can use:
1. **Pexels** (https://www.pexels.com) - Free stock photos
2. **Direct URLs** - Any publicly accessible image URL
3. **Future Enhancement**: Direct file upload can be added with Supabase Storage

## Changing Your Password

To change your admin password after logging in:
1. Go to the Admin Dashboard
2. Click on "Settings" in the sidebar
3. Enter your new password twice
4. Click "Update Password"

Your password will be updated immediately and you'll stay logged in.

## Security Notes

- Only users in the `admin_users` table can access admin features
- Regular users cannot see or access the admin dashboard
- All admin operations are protected by Row Level Security (RLS) policies
- Product modifications require admin authentication
- Change your password anytime from the Settings page

## Adding More Admins

To add additional admin users, repeat the process above or use the SQL query:

```sql
INSERT INTO admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'new_admin@example.com';
```
