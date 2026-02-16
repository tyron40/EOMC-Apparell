# Social Sharing & Meta Tags Guide

## ✅ Issues Fixed

### 1. **Admin Settings Mobile Layout**
- **Before**: Single column stack on mobile (not user-friendly)
- **After**: 2-column grid on mobile devices (sm: breakpoint)
- **Result**: Better use of screen space, more professional appearance

### 2. **Social Media Preview (Bolt.new Issue)**
- **Problem**: When sharing your site URL, it showed Bolt.new landing page
- **Cause**: Missing or incomplete Open Graph meta tags
- **Solution**: Added comprehensive meta tags for proper social sharing

---

## 📱 What Changed

### Admin Settings Page (`src/pages/admin/Settings.tsx`)
```tsx
// Mobile now shows 2 columns instead of 1
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
```

**Responsive Behavior:**
- **Mobile (< 640px)**: 1 column (very small screens)
- **Small tablets (≥ 640px)**: 2 columns
- **Desktop (≥ 1024px)**: 2 columns

### Meta Tags (`index.html`)
Added complete Open Graph and Twitter Card meta tags:

```html
<!-- Primary Meta Tags -->
<title>EYES OPEN MOUTHS CLOSED - Premium Streetwear</title>
<meta name="description" content="Discover EOMC's exclusive collection..." />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://eomc.shop/" />
<meta property="og:title" content="EYES OPEN MOUTHS CLOSED - Premium Streetwear" />
<meta property="og:description" content="Discover EOMC's exclusive collection..." />
<meta property="og:image" content="[Image URL]" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="EYES OPEN MOUTHS CLOSED - Premium Streetwear" />
<meta name="twitter:image" content="[Image URL]" />
```

---

## 🎨 How to Add Your Custom Open Graph Image

Currently using a placeholder image. Here's how to add your own EOMC branded image:

### Option 1: Upload to Supabase Storage (Recommended)

1. **Create the image:**
   - Dimensions: **1200 x 630 pixels** (required for social media)
   - Format: JPG or PNG
   - Content: EOMC logo, product showcase, or brand image
   - Keep file size under 1MB

2. **Upload to Supabase:**
   ```bash
   # Go to your Supabase dashboard
   # Storage → Create bucket "public-assets"
   # Upload your og-image.jpg
   ```

3. **Get the public URL:**
   ```
   https://[your-project].supabase.co/storage/v1/object/public/public-assets/og-image.jpg
   ```

4. **Update index.html:**
   ```html
   <meta property="og:image" content="https://[your-project].supabase.co/storage/v1/object/public/public-assets/og-image.jpg" />
   <meta name="twitter:image" content="https://[your-project].supabase.co/storage/v1/object/public/public-assets/og-image.jpg" />
   ```

### Option 2: Use Public Folder (Simpler)

1. **Create `public` folder** in project root (if it doesn't exist)

2. **Add your image:**
   ```
   EOMC-Apparell/
   ├── public/
   │   └── og-image.jpg  (1200 x 630 pixels)
   ├── src/
   └── index.html
   ```

3. **Update index.html:**
   ```html
   <meta property="og:image" content="https://eomc.shop/og-image.jpg" />
   <meta name="twitter:image" content="https://eomc.shop/og-image.jpg" />
   ```

4. **Deploy to Vercel:**
   ```bash
   git add public/og-image.jpg
   git commit -m "Add custom Open Graph image"
   git push origin main
   ```

### Option 3: Use External CDN

Upload to Imgur, Cloudinary, or any image host and use that URL.

---

## 🧪 Testing Social Sharing

After adding your custom image, test how it appears:

### Facebook Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter: `https://eomc.shop`
3. Click "Scrape Again" to refresh cache
4. Verify your image and text appear correctly

### Twitter Card Validator
1. Go to: https://cards-dev.twitter.com/validator
2. Enter: `https://eomc.shop`
3. Preview how it looks on Twitter

### LinkedIn Post Inspector
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter: `https://eomc.shop`
3. Check LinkedIn preview

### Generic Preview Tool
- https://www.opengraph.xyz/
- Enter your URL and see all social media previews

---

## 📊 What Each Platform Shows

### Facebook/Instagram
- **Title**: EYES OPEN MOUTHS CLOSED - Premium Streetwear
- **Description**: Discover EOMC's exclusive collection of premium streetwear...
- **Image**: 1200 x 630 pixels (your custom image)

### Twitter/X
- **Card Type**: Large image card
- **Title**: EYES OPEN MOUTHS CLOSED - Premium Streetwear
- **Description**: Discover EOMC's exclusive collection...
- **Image**: 1200 x 630 pixels

### LinkedIn
- **Title**: EYES OPEN MOUTHS CLOSED - Premium Streetwear
- **Description**: Discover EOMC's exclusive collection...
- **Image**: 1200 x 630 pixels

### WhatsApp/iMessage
- **Title**: EYES OPEN MOUTHS CLOSED - Premium Streetwear
- **Thumbnail**: Your og:image

---

## 🎯 Best Practices for OG Images

### Design Tips:
1. **Keep text large and readable** (minimum 60px font)
2. **Use high contrast** (dark text on light background or vice versa)
3. **Include your logo** prominently
4. **Show product or brand identity**
5. **Avoid small details** (they won't be visible in thumbnails)

### Technical Requirements:
- **Dimensions**: 1200 x 630 pixels (Facebook/Twitter standard)
- **Aspect Ratio**: 1.91:1
- **File Size**: Under 1MB (ideally 300-500KB)
- **Format**: JPG or PNG
- **Color Space**: RGB

### Example Layout:
```
┌─────────────────────────────────────┐
│                                     │
│         EOMC LOGO (centered)        │
│                                     │
│    EYES OPEN MOUTHS CLOSED          │
│    Premium Streetwear               │
│                                     │
│    [Product Image or Pattern]       │
│                                     │
│         eomc.shop                   │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Updating Meta Tags

If you want to change the title or description later:

1. **Edit `index.html`:**
   ```html
   <meta property="og:title" content="Your New Title" />
   <meta property="og:description" content="Your new description" />
   ```

2. **Commit and push:**
   ```bash
   git add index.html
   git commit -m "Update meta tags"
   git push origin main
   ```

3. **Clear social media caches** using the debugger tools above

---

## ✅ Current Status

- ✅ Meta tags properly configured
- ✅ Admin settings mobile-friendly (2 columns)
- ✅ All changes pushed to GitHub
- ⏳ Custom OG image (pending - using placeholder)

---

## 🚀 Next Steps

1. **Create your custom 1200x630 OG image** with EOMC branding
2. **Upload it** using one of the methods above
3. **Update index.html** with the new image URL
4. **Test** using Facebook Debugger and Twitter Card Validator
5. **Share your site** - it will now show EOMC branding, not Bolt.new!

---

## 📞 Need Help?

If you need help creating the OG image:
- Use Canva (free templates for social media images)
- Use Figma (professional design tool)
- Hire a designer on Fiverr ($5-20)
- Use AI tools like Midjourney or DALL-E

**Recommended Canva Template:**
Search "Open Graph Image" or "Facebook Post" and customize with EOMC branding.
