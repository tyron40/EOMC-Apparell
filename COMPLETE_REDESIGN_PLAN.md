# Complete EOMC Redesign - Exact Wix Replica

## Goal
Create an EXACT replica of https://robertstyron40.wixstudio.com/eyesopenmouthsclosed with:
- ✅ Perfect PC view
- ✅ Perfect mobile view
- ✅ Admin can edit EVERYTHING (including logo)

---

## Phase 1: Database Schema for Full Admin Control

### Tables Needed:

```sql
-- 1. Site Settings (logo, colors, fonts, contact info)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT,
  site_title TEXT DEFAULT 'EYES OPEN MOUTHS CLOSED',
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  accent_color TEXT DEFAULT '#FF0000',
  font_family TEXT DEFAULT 'Arial',
  contact_email TEXT,
  contact_phone TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  tiktok_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hero Carousel
CREATE TABLE hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Photo Gallery
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Collections/Categories (already exists, enhance it)
-- Add image_url, description fields

-- 5. Video Billboard
CREATE TABLE video_billboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_url TEXT,
  poster_image_url TEXT,
  title TEXT,
  subtitle TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Testimonials (enhance existing)
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_photo_url TEXT,
  rating INTEGER DEFAULT 5,
  review_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Custom Pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  show_in_header BOOLEAN DEFAULT false,
  show_in_footer BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Navigation Menu Items
CREATE TABLE navigation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  location TEXT NOT NULL, -- 'header' or 'footer'
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Homepage Sections Control
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_name TEXT UNIQUE NOT NULL, -- 'hero', 'gallery', 'collections', etc.
  is_visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  custom_title TEXT,
  custom_subtitle TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 2: Frontend Components (Exact Wix Replica)

### Homepage Sections (in order):

1. **Header**
   - Logo (editable)
   - Navigation menu (editable)
   - Cart icon
   - User icon
   - Mobile hamburger menu

2. **Hero Carousel**
   - Auto-playing slideshow
   - Navigation arrows
   - Dots indicator
   - Full-width images
   - Responsive

3. **Photo Gallery**
   - 4-column grid (desktop)
   - 2-column grid (tablet)
   - 1-column (mobile)
   - Hover effects
   - Lightbox view

4. **Collections Grid**
   - 6 categories
   - Image backgrounds
   - Hover effects
   - Click to filter products

5. **Video Billboard**
   - Full-width video/image
   - Overlay text
   - CTA button

6. **Product Showcase**
   - Featured products
   - "Shop Now" buttons
   - Product cards

7. **Testimonials**
   - Customer reviews
   - Star ratings
   - Photos
   - Carousel

8. **Footer**
   - Logo
   - Navigation links
   - Social media icons
   - Contact info
   - Copyright

### Additional Pages:

1. **Products Page**
   - Grid layout
   - Filters
   - Sort options
   - Pagination

2. **Product Detail**
   - Image gallery
   - Size selector
   - Add to cart
   - Description
   - Reviews

3. **Cart**
   - Line items
   - Quantity controls
   - Subtotal
   - Checkout button

4. **Checkout**
   - Shipping form
   - Payment (future)
   - Order summary

5. **About Us**
   - Brand story
   - Mission
   - Team

6. **Contact**
   - Contact form
   - Email
   - Phone
   - Social links

7. **FAQ**
   - Accordion style
   - Categories

8. **Shipping & Returns**
   - Policy details
   - Timeline

9. **Privacy Policy**
10. **Terms & Conditions**
11. **Size Guide**

---

## Phase 3: Admin Panel Features

### Admin Dashboard Sections:

1. **Site Settings**
   - Upload logo
   - Edit site title
   - Set colors
   - Set fonts
   - Contact info
   - Social media links

2. **Hero Carousel Manager**
   - Add/edit/delete slides
   - Upload images
   - Set titles/subtitles
   - Reorder slides
   - Enable/disable slides

3. **Photo Gallery Manager**
   - Upload photos
   - Add captions
   - Reorder photos
   - Delete photos

4. **Collections Manager**
   - Edit category names
   - Upload category images
   - Set descriptions
   - Reorder categories

5. **Video Billboard Manager**
   - Upload video
   - Set poster image
   - Edit title/subtitle
   - Enable/disable

6. **Product Manager** (existing, enhance)
   - Add products
   - Edit products
   - Manage inventory
   - Upload images

7. **Testimonials Manager**
   - Add reviews
   - Upload customer photos
   - Set ratings
   - Reorder reviews

8. **Page Manager**
   - Create custom pages
   - Rich text editor
   - SEO settings
   - Publish/unpublish

9. **Navigation Manager**
   - Add menu items
   - Reorder menu
   - Set header/footer location
   - Enable/disable items

10. **Homepage Sections**
    - Show/hide sections
    - Reorder sections
    - Edit section titles

11. **Orders Manager** (existing)
12. **Inventory Manager** (existing)

---

## Phase 4: Implementation Steps

### Step 1: Database Migrations
- Create all new tables
- Add RLS policies
- Set up storage buckets

### Step 2: Update Existing Components
- Activate Home_NEW.tsx
- Activate Header_NEW.tsx
- Make all components data-driven

### Step 3: Build Admin Managers
- Site Settings page
- Hero Carousel manager
- Gallery manager
- Collections manager
- Video manager
- Testimonials manager
- Page manager
- Navigation manager

### Step 4: Create Missing Pages
- About
- Contact
- FAQ
- Shipping & Returns
- Privacy Policy
- Terms
- Size Guide

### Step 5: Mobile Responsiveness
- Test all breakpoints
- Fix mobile menu
- Optimize images
- Touch-friendly buttons

### Step 6: Admin Edit Mode
- Add "Edit" button overlay on every element
- Click to edit in-place
- Save changes to database
- Real-time preview

---

## Phase 5: Edit-in-Place Feature

### How it works:
1. Admin logs in
2. Toggle "Edit Mode" button appears
3. Click "Edit Mode" - all editable elements get overlay
4. Click any element to edit:
   - Logo → Upload new logo
   - Text → Inline text editor
   - Image → Upload new image
   - Section → Show/hide, reorder
5. Changes save to database
6. Site updates in real-time

---

## Technical Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Image Upload**: Supabase Storage
- **Rich Text**: TipTap or Quill
- **Carousel**: React Slick
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Drag & Drop**: dnd-kit (for reordering)

---

## Timeline

- **Phase 1**: Database (1-2 hours)
- **Phase 2**: Frontend Components (3-4 hours)
- **Phase 3**: Admin Panels (4-5 hours)
- **Phase 4**: Pages (2-3 hours)
- **Phase 5**: Edit Mode (2-3 hours)
- **Testing & Polish**: 2-3 hours

**Total**: ~15-20 hours of development

---

## Next Steps

1. Create database migration with all tables
2. Build admin managers one by one
3. Make homepage data-driven
4. Add edit-in-place functionality
5. Create missing pages
6. Test mobile responsiveness
7. Deploy and test
