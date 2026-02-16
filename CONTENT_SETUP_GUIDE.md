# Content Setup Guide - Match Bolt.new Design

Your EOMC site code already includes all the design elements from Bolt.new. You just need to add content through the admin dashboard.

## 🎨 Current Design Features (Already in Code)

✅ Hero slideshow with text overlays
✅ Top Sellers gallery carousel
✅ New Arrivals product grid
✅ Collections (categories) section
✅ Video section
✅ Testimonials carousel
✅ Responsive design
✅ Image position and zoom controls

---

## 📋 Steps to Match Bolt.new Design

### Step 1: Add Environment Variables to Vercel

**CRITICAL: Do this first!**

1. Go to: https://vercel.com/tyrons-projects-584a5697/eomc-apparell/settings/environment-variables

2. Add these two variables:
   - `VITE_SUPABASE_URL` = `https://yteiumctafklsjfhbijf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0ZWl1bWN0YWZrbHNqZmhiaWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTQxMTcsImV4cCI6MjA4NjA3MDExN30.Sqoq8RPI8guW0fp2KYncZnyHCqBis5qVxOWCGMccSlA`

3. Select all environments (Production, Preview, Development)

4. Redeploy the site

---

### Step 2: Create Admin Account

1. Visit: https://eomc.shop/register
2. Create your account
3. Go to Supabase: https://supabase.com/dashboard/project/yteiumctafklsjfhbijf/editor
4. Click "users" table
5. Find your user and set `is_admin = true`
6. Login at: https://eomc.shop/login

---

### Step 3: Add Hero Slideshow Images

The hero section at the top of the homepage.

**How to add:**
1. Go to homepage
2. Click the edit icon (pencil) in top-right of hero section
3. Click "Add New Slide"
4. Upload image (recommended: 1920x1080px or larger)
5. Choose image fit:
   - **Cover** - fills the frame (recommended for hero)
   - **Contain** - fits inside without cropping
6. Add title (e.g., "EXCLUSIVE STREETWEAR")
7. Add subtitle (e.g., "Limited Edition Drops")
8. Adjust position and zoom if needed
9. Click "Add"

**Recommended:**
- Add 3-5 hero slides
- Use high-quality lifestyle/product images
- Keep text short and impactful

---

### Step 4: Add Gallery Images (Top Sellers)

The horizontal scrolling gallery below the hero.

**How to add:**
1. Scroll to "Top Sellers" section
2. Click edit icon (pencil)
3. Click "Add New Image"
4. Choose image fit (Cover recommended)
5. Upload product/lifestyle images
6. Repeat for 8-12 images

**Tips:**
- Use vertical/portrait images (3:4 ratio works best)
- Mix product shots with lifestyle images
- Maintain consistent style/color grading

---

### Step 5: Create Product Categories

The "Collections" section with rounded image tiles.

**How to add:**
1. Go to Admin → Products
2. Click "Manage Categories"
3. Add categories like:
   - T-Shirts
   - Hoodies
   - Jackets
   - Accessories
   - Pants
   - Shoes
4. For each category:
   - Upload a representative image
   - Choose "Cover" for image fit
   - Adjust position/zoom to frame the subject well

**Tips:**
- Use square images (1:1 ratio)
- Show the product type clearly
- Use lifestyle shots when possible

---

### Step 6: Add Products

Products appear in "New Arrivals" and throughout the site.

**How to add:**
1. Go to Admin → Products
2. Click "Add New Product"
3. Fill in:
   - Name
   - Description
   - Price
   - Category
   - Available sizes (S, M, L, XL, etc.)
   - Stock quantity
4. Upload product images:
   - Main image (shows in grid)
   - Additional images (show in product detail)
5. Choose image fit (Cover recommended)
6. Adjust position/zoom
7. Click "Save"

**Recommended:**
- Add at least 6-12 products initially
- Use high-quality product photos
- Write compelling descriptions
- Set realistic stock quantities

---

### Step 7: Add Video Section

The full-width video section in the middle of the page.

**How to add:**
1. Scroll to video section on homepage
2. Click edit icon (pencil)
3. Upload video file (MP4 recommended)
4. Video will auto-play on loop

**Tips:**
- Keep video under 50MB for fast loading
- Use 1920x1080 resolution
- Show products in action or lifestyle content
- Ensure video looks good on mute (auto-plays muted)

---

### Step 8: Customize Site Settings

**Logo and Branding:**
1. Go to Admin → Settings
2. Update site name
3. Upload logo
4. Set brand colors

**Footer:**
- Social media links
- Contact information
- Copyright text

---

## 🎯 Content Checklist

To fully match the Bolt.new design, add:

**Hero Section:**
- [ ] 3-5 hero slides with images
- [ ] Compelling titles and subtitles
- [ ] Proper image positioning

**Top Sellers Gallery:**
- [ ] 8-12 gallery images
- [ ] Mix of product and lifestyle shots
- [ ] Consistent visual style

**Products:**
- [ ] At least 6-12 products
- [ ] Multiple product images each
- [ ] Complete product details
- [ ] Stock quantities set

**Categories:**
- [ ] 4-6 product categories
- [ ] Category images uploaded
- [ ] Images properly positioned

**Video:**
- [ ] Brand/product video uploaded
- [ ] Video optimized for web

**Settings:**
- [ ] Site name updated
- [ ] Logo uploaded
- [ ] Social media links added

---

## 📸 Image Guidelines

### Hero Images
- **Size:** 1920x1080px or larger
- **Format:** JPG or PNG
- **Style:** Lifestyle, atmospheric, brand-focused
- **Orientation:** Landscape

### Gallery Images (Top Sellers)
- **Size:** 800x1200px (portrait)
- **Format:** JPG or PNG
- **Style:** Product-focused or lifestyle
- **Orientation:** Portrait (3:4 ratio)

### Product Images
- **Size:** 1000x1000px minimum
- **Format:** JPG or PNG
- **Style:** Clean, well-lit product shots
- **Orientation:** Square or portrait
- **Background:** White or lifestyle setting

### Category Images
- **Size:** 800x800px
- **Format:** JPG or PNG
- **Style:** Representative of category
- **Orientation:** Square

### Video
- **Size:** Max 50MB
- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080px
- **Length:** 15-60 seconds
- **Audio:** Optional (plays muted)

---

## 🚀 Quick Start Workflow

1. **Add credentials to Vercel** → Redeploy
2. **Create admin account** → Set is_admin = true
3. **Add 3 hero slides** (takes 5 minutes)
4. **Add 8 gallery images** (takes 10 minutes)
5. **Create 4 categories** (takes 10 minutes)
6. **Add 6 products** (takes 20 minutes)
7. **Upload video** (takes 5 minutes)

**Total time: ~1 hour to fully populate the site**

---

## 💡 Pro Tips

1. **Use consistent image style** - Same color grading, lighting, and mood
2. **Optimize images before upload** - Use tools like TinyPNG to reduce file size
3. **Test on mobile** - Most users will view on phones
4. **Update regularly** - Add new products weekly to keep site fresh
5. **Use the edit mode** - Toggle edit mode on/off to see changes live

---

## 🔄 The Design is Already There!

The code from your GitHub repo already includes:
- ✅ All layout sections
- ✅ Responsive design
- ✅ Image carousels
- ✅ Admin editing tools
- ✅ Position/zoom controls
- ✅ Video support

**You just need to add the content!**

Once you add the Supabase credentials to Vercel and populate the database with content, your site will look exactly like the Bolt.new version.

---

## 📞 Need Help?

If the design doesn't match after adding content:
1. Check that environment variables are set in Vercel
2. Verify the site has been redeployed
3. Clear browser cache (Ctrl+Shift+R)
4. Check that you're logged in as admin to see edit controls

The design is already perfect in the code - it just needs content! 🎨
