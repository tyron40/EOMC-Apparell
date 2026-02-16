# EOMC Complete Implementation TODO

## ✅ COMPLETED

### Database
- [x] Created complete CMS migration (20260131010000_add_full_admin_cms.sql)
- [x] Tables: site_settings, hero_slides, gallery_photos, video_billboard, testimonials, pages, navigation_items, homepage_sections
- [x] RLS policies for all tables
- [x] Default data inserted

### Design Components (Created but not active)
- [x] HeroCarousel.tsx
- [x] PhotoGallery.tsx
- [x] CollectionsGrid.tsx
- [x] VideoBillboard.tsx
- [x] ProductShowcase.tsx
- [x] Testimonials.tsx
- [x] SocialIcons.tsx
- [x] Footer.tsx (redesigned)
- [x] Header_NEW.tsx
- [x] Home_NEW.tsx

---

## 🔄 IN PROGRESS

### Database
- [ ] Push migrations to Supabase
- [ ] Create admin account properly
- [ ] Test all tables and policies

---

## 📋 TODO - PHASE 1: Admin Panel (CMS Features)

### 1. Site Settings Manager (`/admin/site-settings`)
- [ ] Create `src/pages/admin/SiteSettings.tsx`
- [ ] Logo upload component
- [ ] Site title editor
- [ ] Color pickers (primary, secondary, accent)
- [ ] Font selector
- [ ] Contact info form (email, phone)
- [ ] Social media links (Instagram, Facebook, TikTok)
- [ ] Save button with real-time preview

### 2. Hero Carousel Manager (`/admin/hero-carousel`)
- [ ] Create `src/pages/admin/HeroCarouselManager.tsx`
- [ ] List all slides with preview
- [ ] Add new slide button
- [ ] Upload slide image
- [ ] Edit slide title/subtitle
- [ ] Set button text and link
- [ ] Drag-and-drop reordering
- [ ] Enable/disable toggle
- [ ] Delete slide with confirmation

### 3. Photo Gallery Manager (`/admin/gallery`)
- [ ] Create `src/pages/admin/GalleryManager.tsx`
- [ ] Grid view of all photos
- [ ] Bulk upload photos
- [ ] Add caption to each photo
- [ ] Drag-and-drop reordering
- [ ] Delete photos
- [ ] Enable/disable toggle

### 4. Collections Manager (`/admin/collections`)
- [ ] Enhance existing category management
- [ ] Upload category background image
- [ ] Edit category name
- [ ] Add category description
- [ ] Reorder categories
- [ ] Set category visibility

### 5. Video Billboard Manager (`/admin/video-billboard`)
- [ ] Create `src/pages/admin/VideoBillboardManager.tsx`
- [ ] Upload video file
- [ ] Upload poster image
- [ ] Edit title/subtitle
- [ ] Set button text and link
- [ ] Enable/disable toggle
- [ ] Preview video

### 6. Testimonials Manager (`/admin/testimonials`)
- [ ] Create `src/pages/admin/TestimonialsManager.tsx`
- [ ] List all testimonials
- [ ] Add new testimonial
- [ ] Upload customer photo
- [ ] Edit customer name
- [ ] Set star rating (1-5)
- [ ] Edit review text
- [ ] Drag-and-drop reordering
- [ ] Enable/disable toggle
- [ ] Delete testimonial

### 7. Page Manager (`/admin/pages`)
- [ ] Create `src/pages/admin/PageManager.tsx`
- [ ] List all pages
- [ ] Create new page
- [ ] Rich text editor (TipTap or Quill)
- [ ] SEO fields (meta title, description)
- [ ] Slug editor
- [ ] Publish/unpublish toggle
- [ ] Show in header/footer toggles
- [ ] Delete page
- [ ] Preview page

### 8. Navigation Manager (`/admin/navigation`)
- [ ] Create `src/pages/admin/NavigationManager.tsx`
- [ ] Header menu section
- [ ] Footer menu section
- [ ] Add menu item
- [ ] Edit label and URL
- [ ] Drag-and-drop reordering
- [ ] Enable/disable toggle
- [ ] Delete menu item

### 9. Homepage Sections Manager (`/admin/homepage-sections`)
- [ ] Create `src/pages/admin/HomepageSectionsManager.tsx`
- [ ] List all sections
- [ ] Show/hide toggle for each section
- [ ] Drag-and-drop reordering
- [ ] Edit section custom title
- [ ] Edit section custom subtitle
- [ ] Preview changes

### 10. Update Admin Dashboard
- [ ] Add links to all new admin pages
- [ ] Create dashboard cards for quick access
- [ ] Add statistics (total slides, photos, testimonials, etc.)

---

## 📋 TODO - PHASE 2: Frontend (Data-Driven Components)

### 1. Update Header Component
- [ ] Fetch logo from site_settings
- [ ] Fetch navigation items from navigation_items table
- [ ] Make logo clickable (editable in admin)
- [ ] Responsive mobile menu

### 2. Activate New Homepage
- [ ] Rename Home.tsx to Home_OLD.tsx
- [ ] Rename Home_NEW.tsx to Home.tsx
- [ ] Rename Header.tsx to Header_OLD.tsx
- [ ] Rename Header_NEW.tsx to Header.tsx

### 3. Make Hero Carousel Data-Driven
- [ ] Fetch slides from hero_slides table
- [ ] Display only active slides
- [ ] Order by order_index
- [ ] Auto-play functionality
- [ ] Navigation arrows
- [ ] Dots indicator

### 4. Make Photo Gallery Data-Driven
- [ ] Fetch photos from gallery_photos table
- [ ] Display only active photos
- [ ] Order by order_index
- [ ] 4-column grid (desktop)
- [ ] 2-column grid (tablet)
- [ ] 1-column (mobile)
- [ ] Lightbox on click

### 5. Make Collections Data-Driven
- [ ] Fetch from categories table
- [ ] Display category images
- [ ] 6-item grid
- [ ] Hover effects
- [ ] Link to filtered products

### 6. Make Video Billboard Data-Driven
- [ ] Fetch from video_billboard table
- [ ] Display video or poster image
- [ ] Overlay text
- [ ] CTA button
- [ ] Responsive

### 7. Make Testimonials Data-Driven
- [ ] Fetch from testimonials table
- [ ] Display only active testimonials
- [ ] Order by order_index
- [ ] Star ratings
- [ ] Customer photos
- [ ] Carousel functionality

### 8. Update Footer
- [ ] Fetch logo from site_settings
- [ ] Fetch social links from site_settings
- [ ] Fetch footer navigation from navigation_items
- [ ] Contact info from site_settings

### 9. Homepage Sections Visibility
- [ ] Fetch homepage_sections settings
- [ ] Show/hide sections based on is_visible
- [ ] Order sections by order_index
- [ ] Use custom titles if set

---

## 📋 TODO - PHASE 3: Custom Pages

### 1. Create Dynamic Page Component
- [ ] Create `src/pages/DynamicPage.tsx`
- [ ] Fetch page by slug
- [ ] Render HTML content
- [ ] SEO meta tags
- [ ] 404 if page not found or not published

### 2. Update Routing
- [ ] Add route `/pages/:slug`
- [ ] Handle dynamic pages
- [ ] Update navigation links

### 3. Create Default Page Content
- [ ] About Us page content
- [ ] Contact page with form
- [ ] FAQ page with accordion
- [ ] Shipping & Returns policy
- [ ] Privacy Policy
- [ ] Terms & Conditions
- [ ] Size Guide with charts

---

## 📋 TODO - PHASE 4: Edit-in-Place Feature

### 1. Create Edit Mode Context
- [ ] Create `src/context/EditModeContext.tsx` (enhance existing)
- [ ] Toggle edit mode state
- [ ] Track which element is being edited
- [ ] Save changes function

### 2. Create Editable Components
- [ ] `<EditableText>` - Click to edit text
- [ ] `<EditableImage>` - Click to upload new image
- [ ] `<EditableSection>` - Show/hide, reorder
- [ ] Edit overlay with pencil icon

### 3. Add Edit Mode to Admin
- [ ] "Edit Mode" toggle button in admin header
- [ ] When enabled, show edit overlays
- [ ] Click overlay to edit
- [ ] Save changes to database
- [ ] Real-time preview

### 4. Implement for Each Element
- [ ] Logo (upload new)
- [ ] Hero slides (edit inline)
- [ ] Gallery photos (upload/delete)
- [ ] Collections (edit name/image)
- [ ] Video billboard (edit text/video)
- [ ] Testimonials (edit inline)
- [ ] Footer text
- [ ] Navigation menu

---

## 📋 TODO - PHASE 5: Mobile Responsiveness

### 1. Test All Breakpoints
- [ ] Mobile (320px - 640px)
- [ ] Tablet (641px - 1024px)
- [ ] Desktop (1025px+)

### 2. Fix Mobile Issues
- [ ] Hamburger menu
- [ ] Hero carousel on mobile
- [ ] Photo gallery (1 column)
- [ ] Collections grid (2 columns)
- [ ] Product cards
- [ ] Footer layout
- [ ] Admin panel mobile view

### 3. Touch Optimization
- [ ] Larger touch targets
- [ ] Swipe gestures for carousel
- [ ] Mobile-friendly forms
- [ ] Optimized images

---

## 📋 TODO - PHASE 6: Additional Features

### 1. Image Optimization
- [ ] Compress uploaded images
- [ ] Generate thumbnails
- [ ] Lazy loading
- [ ] WebP format support

### 2. SEO Optimization
- [ ] Meta tags for all pages
- [ ] Open Graph tags
- [ ] Sitemap generation
- [ ] Robots.txt

### 3. Performance
- [ ] Code splitting
- [ ] Lazy load components
- [ ] Optimize bundle size
- [ ] CDN for images

### 4. Analytics
- [ ] Google Analytics integration
- [ ] Track page views
- [ ] Track conversions
- [ ] Admin dashboard stats

---

## 📋 TODO - PHASE 7: Testing & Deployment

### 1. Testing
- [ ] Test all admin features
- [ ] Test all public pages
- [ ] Test mobile responsiveness
- [ ] Test edit-in-place
- [ ] Test image uploads
- [ ] Test navigation
- [ ] Cross-browser testing

### 2. Bug Fixes
- [ ] Fix any console errors
- [ ] Fix any visual bugs
- [ ] Fix any functionality issues

### 3. Deployment
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test production site
- [ ] Update documentation

---

## 🎯 Priority Order

### CRITICAL (Do First):
1. Push database migrations
2. Create admin account
3. Build Site Settings Manager
4. Build Hero Carousel Manager
5. Make homepage data-driven
6. Test admin features

### HIGH (Do Next):
1. Build remaining admin managers
2. Create custom pages
3. Add edit-in-place feature
4. Mobile responsiveness

### MEDIUM (Do Later):
1. Image optimization
2. SEO optimization
3. Analytics
4. Performance optimization

---

## 📊 Progress Tracking

- **Database**: 90% complete (migrations created, need to push)
- **Admin Panel**: 0% complete (need to build all managers)
- **Frontend**: 30% complete (components created, need to make data-driven)
- **Custom Pages**: 0% complete
- **Edit-in-Place**: 0% complete
- **Mobile**: 50% complete (components responsive, need testing)
- **Testing**: 0% complete

**Overall Progress**: ~25%

---

## ⏱️ Estimated Time Remaining

- Admin Panel: 8-10 hours
- Frontend Integration: 4-5 hours
- Custom Pages: 2-3 hours
- Edit-in-Place: 3-4 hours
- Mobile Testing: 2-3 hours
- Bug Fixes & Polish: 2-3 hours

**Total**: ~21-28 hours

---

## 🚀 Next Immediate Steps

1. ✅ Confirm migration push (Y)
2. Create admin account in Supabase
3. Build Site Settings Manager
4. Build Hero Carousel Manager
5. Test uploading images
6. Make homepage use real data
7. Deploy and test
