# Admin Mobile Layout & Edit Mode Implementation Plan

## Issues to Fix:

### 1. Admin Dashboard Pages - Mobile Layout
Currently, several admin pages stack content in single columns on mobile, making them hard to use.

**Pages to Fix:**
- ✅ Settings.tsx - DONE (already has 2-column grid)
- ⏳ Dashboard.tsx - Stats cards use `md:grid-cols-3` (stacks on mobile)
- ⏳ ProductManager.tsx - Table layout (needs mobile optimization)
- ⏳ InventoryManager.tsx - Needs review
- ⏳ OrdersManager.tsx - Needs review

### 2. Edit Mode Buttons Missing
Edit mode toggle works, but edit buttons are missing from many components.

**Components WITH Edit Buttons:**
- ✅ ProductCard.tsx
- ✅ Header (old backup version)
- ✅ Home (old backup version)
- ✅ ProductDetail.tsx

**Components MISSING Edit Buttons:**
- ❌ HeroCarousel.tsx - No edit buttons for hero images
- ❌ PhotoGallery.tsx - No edit buttons for gallery images
- ❌ ProductShowcase.tsx - No edit buttons
- ❌ CollectionsGrid.tsx - No edit buttons for categories
- ❌ VideoSection.tsx - No edit buttons for video
- ❌ VideoBillboard.tsx - No edit buttons
- ❌ Testimonials.tsx - No edit buttons
- ❌ Footer.tsx - No edit buttons

## Implementation Steps:

### Phase 1: Fix Admin Dashboard Mobile Layouts

1. **Dashboard.tsx**
   - Change stats grid from `md:grid-cols-3` to `sm:grid-cols-2 lg:grid-cols-3`
   - Ensure Quick Actions maintain 2-column grid on mobile

2. **ProductManager.tsx**
   - Add responsive table wrapper with horizontal scroll
   - Consider card view for mobile instead of table

3. **InventoryManager.tsx & OrdersManager.tsx**
   - Review and apply similar mobile-friendly patterns

### Phase 2: Add Edit Buttons to All Components

For each component, add:
```tsx
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import { Edit3 } from 'lucide-react';

const { user } = useAuth();
const { isEditMode } = useEditMode();

// Then in JSX:
{isEditMode && user?.isAdmin && (
  <button
    onClick={() => handleEdit()}
    className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
    title="Edit this section"
  >
    <Edit3 className="w-5 h-5 text-black" />
  </button>
)}
```

**Components to Update:**
1. HeroCarousel - Edit hero images
2. PhotoGallery - Edit gallery images
3. ProductShowcase - Edit section title/products
4. CollectionsGrid - Edit categories
5. VideoSection - Edit video URL
6. VideoBillboard - Edit billboard content
7. Testimonials - Edit testimonials
8. Footer - Edit footer content

### Phase 3: Testing

1. Test all admin pages on mobile devices
2. Toggle edit mode and verify buttons appear on all sections
3. Test edit functionality for each component
4. Verify responsive behavior at all breakpoints

## Expected Outcome:

✅ All admin pages show 2-column layouts on tablets/mobile
✅ Edit mode toggle shows edit buttons on EVERY section
✅ Professional, user-friendly admin experience
✅ Easy content management throughout the site
