# How to Test Edit Mode - Complete Guide

## 🎯 What Edit Mode Does
Edit mode adds **edit buttons** to the **PUBLIC HOMEPAGE** (not the admin dashboard). When enabled, admins can see edit buttons on all homepage components to modify content.

---

## 📋 Step-by-Step Testing Instructions

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Login as Admin
1. Navigate to: `http://localhost:5173/login`
2. Enter admin credentials
3. Click "Sign In"

### Step 3: Enable Edit Mode
1. Go to: `http://localhost:5173/admin/settings`
2. Find the **"Frontend Edit Mode"** card
3. Click the toggle switch to turn it **ON** (turns purple)
4. You should see: **"Edit Mode Active"** message

### Step 4: Navigate to PUBLIC HOMEPAGE
**CRITICAL:** Go to the customer-facing homepage, NOT the admin dashboard!

Navigate to: `http://localhost:5173/` (the root URL)

### Step 5: Verify Edit Buttons
You should see **8 white circular edit buttons** with pencil icons on:

1. ✏️ **Hero Carousel** (top-right of carousel)
2. ✏️ **Photo Gallery** (top-right of gallery section)
3. ✏️ **Product Showcase** (top-right of "NEW ARRIVALS")
4. ✏️ **Collections Grid** (top-right of collections)
5. ✏️ **Video Section** (top-right of video)
6. ✏️ **Video Billboard** (top-right of billboard)
7. ✏️ **Testimonials** (top-right of testimonials)
8. ✏️ **Footer** (in footer section)

### Step 6: Test Functionality
1. **Hover** over any edit button → Tooltip appears
2. **Click** any edit button → Alert popup shows
3. Navigate back to `/admin/settings`
4. Toggle edit mode **OFF**
5. Go back to `/` → All edit buttons disappear

---

## ✅ Expected Behavior

### When Edit Mode is ON + User is Admin:
- ✅ 8 edit buttons visible on homepage (`/`)
- ✅ Buttons are white circles with pencil icon
- ✅ Positioned in top-right of each section
- ✅ Hover shows tooltip
- ✅ Click shows alert (placeholder)

### When Edit Mode is OFF:
- ✅ NO edit buttons anywhere
- ✅ Normal customer view

### When User is NOT Admin:
- ✅ NO edit buttons (even if edit mode is ON)
- ✅ Edit mode toggle not accessible

---

## 🐛 Troubleshooting

### "I don't see edit buttons on homepage"

**Solution 1: Hard Refresh**
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**Solution 2: Check Edit Mode Status**
1. Open browser console (F12)
2. Type: `localStorage.getItem('editMode')`
3. Should return `"true"` when enabled

**Solution 3: Verify You're on Homepage**
- URL should be: `http://localhost:5173/`
- NOT: `http://localhost:5173/admin`

**Solution 4: Check Admin Status**
1. Open console (F12)
2. Check if logged in as admin
3. Verify `user.isAdmin === true`

### "Toggle switch doesn't work"

**Check Console for Errors:**
1. Press F12
2. Click Console tab
3. Look for red error messages
4. Common issues:
   - EditModeContext not found
   - localStorage blocked
   - React hooks error

### "Edit buttons appear but don't work"

**This is expected!** The buttons show placeholder alerts. Actual edit functionality (modals, forms, etc.) needs to be implemented in the future.

---

## 📸 Visual Guide

### Admin Settings - Edit Mode Toggle
```
┌────────────────────────────────────────┐
│ Frontend Edit Mode                     │
│ ────────────────────────────────────── │
│                                        │
│ Enable Edit Mode              [ON] ●   │ ← Purple = ON
│                                        │
│ ✓ Edit Mode Active                    │
│ Navigate to any page on the site and  │
│ you'll see edit buttons...            │
└────────────────────────────────────────┘
```

### Homepage with Edit Buttons
```
┌────────────────────────────────────────┐
│                              [✏️]       │ ← Edit button
│   HERO CAROUSEL                        │
│   (Large banner image)                 │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│                              [✏️]       │ ← Edit button
│   PHOTO GALLERY                        │
│   [img] [img] [img] [img]             │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│                              [✏️]       │ ← Edit button
│   NEW ARRIVALS                         │
│   [product] [product] [product]       │
└────────────────────────────────────────┘

... (5 more sections with edit buttons)
```

---

## 🔍 Code Verification

If buttons still don't appear, verify the code:

### Check HeroCarousel.tsx
```typescript
// Should have these imports:
import { Edit3 } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';

// Should have this code:
const { user } = useAuth();
const { isEditMode } = useEditMode();

// Should have this button:
{isEditMode && user?.isAdmin && (
  <button onClick={handleEditHero} ...>
    <Edit3 className="w-5 h-5 text-black" />
  </button>
)}
```

### Check All 8 Components
Each should have similar code:
- ✅ HeroCarousel.tsx
- ✅ PhotoGallery.tsx
- ✅ ProductShowcase.tsx
- ✅ CollectionsGrid.tsx
- ✅ VideoSection.tsx
- ✅ VideoBillboard.tsx
- ✅ Testimonials.tsx
- ✅ Footer.tsx

---

## 🆘 Still Having Issues?

1. **Restart dev server:**
   ```bash
   # Stop server (Ctrl + C)
   npm run dev
   ```

2. **Clear all browser data:**
   - Ctrl + Shift + Delete
   - Clear everything
   - Restart browser

3. **Check Git commits:**
   ```bash
   git log --oneline -5
   ```
   Should see commits about edit buttons

4. **Verify file changes:**
   ```bash
   git diff HEAD~3 src/components/HeroCarousel.tsx
   ```
   Should show edit button code added

---

## ✨ Summary

**Edit buttons are on the PUBLIC HOMEPAGE (`/`), not the admin dashboard (`/admin`).**

To see them:
1. Enable edit mode in `/admin/settings`
2. Navigate to `/` (homepage)
3. Look for white circular buttons with pencil icons
4. They appear in the top-right of each section

If you still don't see them after following all steps, there may be a caching issue or the dev server needs to be restarted.
