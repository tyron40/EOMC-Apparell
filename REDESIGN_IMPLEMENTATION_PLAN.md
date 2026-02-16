# EOMC Site Redesign - Implementation Plan

## 🎯 Project Overview

**Goal:** Transform the current generic e-commerce site into an exact replica of the Wix site at:
https://robertstyron40.wixstudio.com/eyesopenmouthsclosed

**Scope:** Complete redesign including branding, layout, sections, and styling

**Estimated Time:** 20-30 hours of development work

---

## 📊 Current vs. Target Comparison

### Current Site (https://eomc.shop)
- Generic "STORE" branding
- Simple layout: Hero → Top Sellers → Footer
- Basic navigation: Home, Products, Cart
- Generic stock photos
- Blue accent colors
- Minimal sections

### Target Site (Wix)
- "EYES OPEN MOUTHS CLOSED" branding
- Complex layout: Hero Carousel → Gallery → New Arrivals → Collections → Video → Showcase → Testimonials → Footer
- Specific navigation: Home, Shirts, Shorts
- Custom product photos on grass backgrounds
- Black/white with bright accent colors
- Rich, multi-section homepage

---

## 🚀 Implementation Phases

### Phase 1: Critical Branding & Structure (4-6 hours)
**Priority:** CRITICAL - Do this first

#### 1.1 Update Branding
- [ ] Change site name from "STORE" to "EYES OPEN MOUTHS CLOSED"
- [ ] Create/obtain EOMC lips logo (with grills and dripping effect)
- [ ] Update favicon
- [ ] Update meta tags and SEO

#### 1.2 Update Header/Navigation
- [ ] Replace logo in header
- [ ] Update navigation menu (Home, Shirts, Shorts)
- [ ] Style header to match Wix (white background)
- [ ] Position cart and login buttons on right

#### 1.3 Color Scheme
- [ ] Change primary colors to black/white
- [ ] Add bright accent colors (orange, purple, pink, cyan)
- [ ] Update button styles
- [ ] Update link colors

**Files to modify:**
- `src/components/Header.tsx`
- `src/index.css` (global styles)
- `tailwind.config.js` (color palette)
- `index.html` (title, favicon)

---

### Phase 2: Hero Section Redesign (3-4 hours)
**Priority:** HIGH

#### 2.1 Implement Image Carousel
- [ ] Install carousel library (e.g., react-slick or swiper)
- [ ] Create carousel component
- [ ] Add navigation arrows
- [ ] Add auto-play functionality
- [ ] Make responsive

#### 2.2 Update Hero Content
- [ ] Remove text overlay ("EXCLUSIVE STREETWEAR")
- [ ] Add 3-5 hero images
- [ ] Implement smooth transitions
- [ ] Add touch/swipe support for mobile

**Files to modify:**
- `src/pages/Home.tsx`
- Create: `src/components/HeroCarousel.tsx`
- `package.json` (add carousel dependency)

---

### Phase 3: Homepage Sections (8-10 hours)
**Priority:** HIGH

#### 3.1 Photo Gallery Section (2 hours)
- [ ] Create 4-column grid component
- [ ] Add lifestyle photos
- [ ] Implement responsive layout (2 columns on mobile)
- [ ] Add hover effects

**Create:** `src/components/PhotoGallery.tsx`

#### 3.2 New Arrivals Section (2 hours)
- [ ] Replace "TOP SELLERS" with "NEW ARRIVALS"
- [ ] Update product card styling
- [ ] Add grass background to product images
- [ ] Update product naming format (with color variants)

**Modify:** `src/pages/Home.tsx`, `src/components/ProductCard.tsx`

#### 3.3 Collections Grid (2-3 hours)
- [ ] Create collections section component
- [ ] Implement 3x2 grid layout
- [ ] Add category cards (Sweaters, Shorts, Shirts, Hoodies, Hats, Sets)
- [ ] Add category images
- [ ] Link to category pages
- [ ] Add "COMING SOON" overlay for Hats

**Create:** `src/components/CollectionsGrid.tsx`

#### 3.4 Video/Billboard Section (1-2 hours)
- [ ] Create video section component
- [ ] Add video player or large image
- [ ] Style to match Wix (full-width, dramatic)
- [ ] Add overlay if needed

**Create:** `src/components/VideoBillboard.tsx`

#### 3.5 Product Showcase Section (1 hour)
- [ ] Create showcase component
- [ ] Add full-width image of products on pavement
- [ ] Make responsive

**Create:** `src/components/ProductShowcase.tsx`

#### 3.6 Testimonials Section (2 hours)
- [ ] Create testimonials component
- [ ] Add "Happy Customers" title
- [ ] Add "What they're saying" subtitle
- [ ] Create 3-column grid
- [ ] Style as Instagram-style posts
- [ ] Add customer photos and quotes

**Create:** `src/components/Testimonials.tsx`

---

### Phase 4: Footer Redesign (1-2 hours)
**Priority:** MEDIUM

#### 4.1 Update Footer Content
- [ ] Add EOMC lips logo
- [ ] Add social media icons (Instagram, Facebook, TikTok)
- [ ] Add contact information (email, phone)
- [ ] Update styling (light gray background)
- [ ] Create 3-column layout (logo, social, contact)

**Files to modify:**
- `src/components/Footer.tsx`

---

### Phase 5: Product Pages & Categories (4-5 hours)
**Priority:** MEDIUM

#### 5.1 Update Product Display
- [ ] Add grass background to all product images
- [ ] Update product naming convention
- [ ] Add color variants in parentheses
- [ ] Update product descriptions

#### 5.2 Create Category Pages
- [ ] Create Shirts page
- [ ] Create Shorts page
- [ ] Update routing
- [ ] Add category filtering

**Files to modify:**
- `src/pages/Products.tsx`
- `src/pages/ProductDetail.tsx`
- Create: `src/pages/Shirts.tsx`, `src/pages/Shorts.tsx`
- `src/App.tsx` (routing)

---

### Phase 6: Styling & Polish (3-4 hours)
**Priority:** MEDIUM

#### 6.1 Typography
- [ ] Update font families
- [ ] Set heading styles (bold, all caps where needed)
- [ ] Update body text styles
- [ ] Ensure readability

#### 6.2 Spacing & Layout
- [ ] Add generous white space
- [ ] Ensure consistent grid layouts
- [ ] Center content appropriately
- [ ] Add section padding/margins

#### 6.3 Responsive Design
- [ ] Test on mobile devices
- [ ] Adjust layouts for tablets
- [ ] Ensure touch-friendly buttons
- [ ] Test carousel on mobile

#### 6.4 Animations & Interactions
- [ ] Add hover effects
- [ ] Add smooth transitions
- [ ] Add loading states
- [ ] Add scroll animations (optional)

---

### Phase 7: Assets & Content (Variable time)
**Priority:** DEPENDS ON ASSET AVAILABILITY

#### 7.1 Logo & Branding
- [ ] Obtain EOMC lips logo (PNG and SVG)
- [ ] Create favicon from logo
- [ ] Ensure logo works on light and dark backgrounds

#### 7.2 Product Photos
- [ ] Photograph all products on grass background
- [ ] Edit and optimize images
- [ ] Upload to Supabase storage
- [ ] Update product records in database

#### 7.3 Lifestyle Photos
- [ ] Obtain/create lifestyle photos
- [ ] Edit and optimize
- [ ] Upload to storage

#### 7.4 Hero Images
- [ ] Select 3-5 hero carousel images
- [ ] Optimize for web (compress, resize)
- [ ] Upload to storage

#### 7.5 Video Content
- [ ] Obtain brand video or billboard image
- [ ] Optimize for web
- [ ] Upload to storage or video hosting

---

## 🛠️ Technical Implementation Details

### New Dependencies Needed
```json
{
  "react-slick": "^0.29.0",
  "slick-carousel": "^1.8.1",
  "@heroicons/react": "^2.0.0" (for social icons)
}
```

### New Components to Create
1. `HeroCarousel.tsx` - Image carousel for hero section
2. `PhotoGallery.tsx` - 4-column lifestyle photo grid
3. `CollectionsGrid.tsx` - 6-category grid
4. `VideoBillboard.tsx` - Video/large image section
5. `ProductShowcase.tsx` - Full-width product display
6. `Testimonials.tsx` - Customer testimonials grid
7. `SocialIcons.tsx` - Social media icon links

### Files to Modify
1. `src/components/Header.tsx` - Branding and navigation
2. `src/components/Footer.tsx` - Complete redesign
3. `src/components/ProductCard.tsx` - Update styling
4. `src/pages/Home.tsx` - Add all new sections
5. `src/index.css` - Global styles and colors
6. `tailwind.config.js` - Color palette
7. `src/App.tsx` - Update routing

### Database Changes Needed
- Update site_content table for new sections
- Add category images
- Update product photos
- Add testimonials table (optional)

---

## 📋 Step-by-Step Execution Plan

### Week 1: Foundation
**Day 1-2:** Phase 1 (Branding & Structure)
- Update branding
- Change colors
- Update header/nav

**Day 3:** Phase 2 (Hero Carousel)
- Implement carousel
- Add hero images

**Day 4-5:** Phase 3.1-3.2 (Gallery & New Arrivals)
- Create photo gallery
- Update new arrivals section

### Week 2: Content Sections
**Day 6-7:** Phase 3.3-3.4 (Collections & Video)
- Create collections grid
- Add video section

**Day 8:** Phase 3.5-3.6 (Showcase & Testimonials)
- Add product showcase
- Create testimonials

**Day 9:** Phase 4 (Footer)
- Redesign footer
- Add social media

**Day 10:** Phase 5 (Product Pages)
- Update product display
- Create category pages

### Week 3: Polish & Launch
**Day 11-12:** Phase 6 (Styling & Polish)
- Refine typography
- Perfect spacing
- Test responsive design

**Day 13-14:** Phase 7 (Assets & Content)
- Add all images
- Populate content
- Final testing

**Day 15:** Launch & Monitor
- Deploy to production
- Monitor for issues
- Gather feedback

---

## ⚠️ Important Considerations

### Assets Required
**CRITICAL:** You need to provide:
1. EOMC lips logo (high quality)
2. Product photos on grass backgrounds
3. Lifestyle/street style photos
4. Hero carousel images
5. Video or billboard image

**Without these assets, the site cannot match the Wix version exactly.**

### Time Estimate
- **With all assets ready:** 20-25 hours
- **Without assets (using placeholders):** 15-20 hours
- **Creating assets from scratch:** +10-20 hours

### Budget Considerations
- Development time: 20-30 hours
- Asset creation (if needed): 10-20 hours
- Photography (if needed): Variable
- Total project time: 30-50 hours

---

## 🎯 Minimum Viable Product (MVP)

If you want to launch quickly, focus on:

### MVP Phase 1 (8-10 hours)
1. ✅ Update branding (name, logo, colors)
2. ✅ Update header/navigation
3. ✅ Implement hero carousel
4. ✅ Update "New Arrivals" section
5. ✅ Update footer with social media

### MVP Phase 2 (Add later)
6. Photo gallery
7. Collections grid
8. Video section
9. Product showcase
10. Testimonials

---

## 📞 Next Steps

### Option A: Full Redesign
**Timeline:** 3-4 weeks
**Outcome:** Exact replica of Wix site

**Steps:**
1. Gather all assets (logos, photos, videos)
2. Follow implementation plan phases 1-7
3. Test thoroughly
4. Deploy to production

### Option B: Phased Approach
**Timeline:** 1-2 weeks for MVP, then ongoing
**Outcome:** Core features first, enhancements later

**Steps:**
1. Implement MVP Phase 1 (critical branding)
2. Launch with updated branding
3. Add sections incrementally
4. Gather user feedback

### Option C: Content-Only Update
**Timeline:** 1-2 days
**Outcome:** Keep current structure, update content only

**Steps:**
1. Update site name and logo
2. Change colors
3. Add better product photos
4. Update footer

---

## 🤔 Recommendation

Given the scope of changes needed, I recommend:

**Phased Approach (Option B)**

**Reasoning:**
1. Get the branding right immediately (most important)
2. Launch with improved look quickly
3. Add advanced features incrementally
4. Allows time to gather/create quality assets
5. Can gather user feedback along the way

**Immediate Actions:**
1. Obtain EOMC lips logo
2. Update branding and colors (Phase 1)
3. Implement hero carousel (Phase 2)
4. Update footer (Phase 4)
5. Deploy MVP

**Then gradually add:**
- Photo gallery
- Collections grid
- Video section
- Testimonials

---

Would you like me to proceed with the redesign? Please confirm:

1. **Do you have the EOMC lips logo?** (PNG/SVG)
2. **Do you have product photos on grass backgrounds?**
3. **Which approach do you prefer?** (Full, Phased, or Content-Only)
4. **Timeline preference?** (Rush in 1 week, Normal 2-3 weeks, or Gradual over time)

Once confirmed, I'll begin implementation immediately.
