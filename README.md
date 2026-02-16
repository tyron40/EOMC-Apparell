# EOMC Apparel - E-Commerce Platform

A production-ready, full-featured e-commerce platform built with React, TypeScript, Vite, and Supabase. This system provides a complete online shopping experience with advanced admin capabilities for managing products, inventory, orders, and site content.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
  - [Customer Features](#customer-features)
  - [Admin Features](#admin-features)
  - [Content Management](#content-management)
- [Database Architecture](#database-architecture)
- [Getting Started](#getting-started)
- [Admin Setup](#admin-setup)
- [Security Features](#security-features)
- [Image Management](#image-management)
- [Order Fulfillment](#order-fulfillment)

---

## Overview

EOMC Apparel is a modern, responsive e-commerce platform designed for apparel retailers. It features a clean, professional design with comprehensive admin tools for managing all aspects of an online store. The platform prioritizes user experience, security, and maintainability.

## Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Routing:** React Router DOM 7
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Email/Password)
- **Storage:** Supabase Storage (Images & Videos)
- **Icons:** Lucide React

---

## Features

### Customer Features

#### 1. Shopping Experience
- **Product Browsing**
  - Grid-based product catalog with responsive design
  - Product filtering by category
  - Product search functionality
  - Featured product displays on homepage
  - Individual product detail pages with multiple images
  - Size selection for apparel items
  - Real-time stock availability indicators

- **Shopping Cart**
  - Add products to cart with size selection
  - Adjust quantities directly in cart
  - Remove items from cart
  - Persistent cart using session storage
  - Real-time price calculations
  - Visual cart icon with item count in header

- **Checkout Process**
  - Multi-step checkout form
  - Customer information collection (name, email, phone)
  - Shipping address validation
  - Order summary with itemized pricing
  - Order confirmation page with order number
  - Automatic inventory deduction on purchase

#### 2. User Interface
- **Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes (mobile, tablet, desktop)
  - Touch-friendly interface elements
  - Smooth animations and transitions

- **Homepage Sections**
  - Dynamic hero slideshow with customizable images and text
  - Top sellers gallery with horizontal scrolling
  - New arrivals section featuring latest products
  - Collections showcase organized by category
  - Full-screen video section for brand storytelling
  - Customer testimonials/featured products carousel
  - Call-to-action buttons and messaging

- **Navigation**
  - Clean header with logo and navigation links
  - User account dropdown (login/register/profile)
  - Shopping cart icon with item counter
  - Mobile-responsive navigation menu
  - Footer with social links and company information

#### 3. Account Management
- **User Authentication**
  - Email/password registration
  - Secure login system
  - Session persistence
  - Logout functionality
  - Password validation

### Admin Features

#### 1. Admin Dashboard
Centralized control panel accessible only to admin users, providing:
- Quick access to all management tools
- Navigation to product, inventory, and order management
- Account settings
- Edit mode toggle for in-place content editing

#### 2. Product Management
Comprehensive product control system:
- **Add New Products**
  - Product name and description
  - Pricing configuration
  - Category assignment
  - Multiple image uploads with URL support
  - Available sizes (S, M, L, XL, XXL)
  - Featured product designation
  - Initial stock quantity setup
  - Low stock threshold configuration
  - Availability toggle

- **Edit Existing Products**
  - Update all product information
  - Modify pricing and descriptions
  - Change product images
  - Adjust size availability
  - Update stock levels
  - Control product visibility

- **Advanced Image Controls**
  - Image fit options (contain, cover, fill)
  - Image position adjustment (X/Y axis)
  - Zoom controls (0.5x to 3.0x)
  - Real-time preview of adjustments
  - Apply controls to main product image
  - Individual control for product gallery images

- **Delete Products**
  - Remove products from catalog
  - Confirmation prompts to prevent accidents

#### 3. Inventory Management
Dedicated interface for stock control:
- **Real-Time Stock Tracking**
  - Current quantity for all products
  - Visual low stock indicators
  - Quick quantity adjustment
  - Stock history (via database)

- **Stock Configuration**
  - Set low stock thresholds per product
  - Enable/disable product availability
  - Bulk stock updates
  - Automatic low stock highlighting

- **Inventory Insights**
  - Products below threshold flagged
  - Out-of-stock product identification
  - Stock level sorting and filtering

#### 4. Order Management
Complete order fulfillment system:
- **Order Overview**
  - All orders displayed in chronological order
  - Order number, customer details, and totals
  - Current order status
  - Order date tracking

- **Order Details**
  - Itemized product list with sizes and quantities
  - Individual product pricing
  - Order total calculation
  - Customer contact information
  - Full shipping address
  - Order creation timestamp

- **Status Management**
  - Update order status (Pending → Processing → Shipped → Delivered → Cancelled)
  - Status change history
  - Visual status indicators

- **Shipping Label System**
  - Add tracking numbers
  - Specify shipping carrier (USPS, FedEx, UPS, DHL, etc.)
  - Record shipping date
  - Upload shipping label PDFs/images
  - Add internal shipping notes
  - Record package weight and dimensions
  - Quick access to shipping information

#### 5. Settings & Account Management
- **Admin Account Settings**
  - Change admin password securely
  - Stay logged in after password change
  - Supabase Auth integration

### Content Management

#### 1. Edit Mode System
Unique in-place editing capability:
- **Toggle Edit Mode**
  - Accessible from header (admin users only)
  - Persistent across sessions (localStorage)
  - Shows edit buttons on editable content
  - Non-intrusive design

- **Inline Content Editing**
  - Edit content directly on the page
  - No need to navigate to separate admin panels
  - Real-time visual feedback
  - Save changes immediately to database

#### 2. Hero Slideshow Management
- **Add/Edit/Delete Slides**
  - Upload hero images
  - Optional title and subtitle text overlays
  - Image fit controls (contain, cover, fill)
  - Position and zoom adjustments
  - Slide ordering
  - Active/inactive toggle
  - Multiple slides with auto-rotation (5-second intervals)

- **Slideshow Controls**
  - Dot indicators for navigation
  - Manual slide switching
  - Smooth fade transitions

#### 3. Gallery Management
- **Top Sellers Gallery**
  - Add/remove gallery images
  - Image fit selection for each image
  - Automatic ordering
  - Horizontal scroll interface
  - Responsive grid layout

- **Gallery Organization**
  - Drag-to-scroll interface
  - Navigation arrows
  - Snap-to-grid scrolling
  - Mobile-optimized touch controls

#### 4. Video Content Management
- **Background Video Section**
  - Upload video files (MP4, WebM, QuickTime)
  - Auto-play with loop
  - Muted by default for UX
  - Full-screen video display
  - Replace video via edit mode

#### 5. Category/Collection Management
- **Edit Collections**
  - Update category names
  - Upload category images
  - Image fit, position, and zoom controls
  - Real-time preview
  - Maintain category slugs for URLs

---

## Database Architecture

### Tables and Relationships

#### 1. Authentication & Users
- **auth.users** (Supabase managed)
  - Handles user authentication
  - Email/password storage
  - Session management

- **admin_users**
  - Links to auth.users
  - Grants admin privileges
  - Role assignment (admin)
  - Created_at timestamp

#### 2. Products & Categories
- **products**
  - Product information (name, description, price)
  - Category relationship (foreign key)
  - Image URLs (main + gallery)
  - Available sizes (array)
  - Stock quantity and availability
  - Low stock threshold
  - Featured product flag
  - Image display controls (fit, position, zoom)
  - Slug for URL routing
  - Timestamps

- **categories**
  - Category name and slug
  - Category image URL
  - Image display controls (fit, position, zoom)
  - Timestamps

#### 3. Cart & Orders
- **cart_items**
  - Session-based cart tracking
  - Product reference
  - Size selection
  - Quantity
  - Temporary storage (not persistent long-term)

- **orders**
  - Order number (unique identifier)
  - Customer information (name, email, phone)
  - Shipping address (JSONB)
  - Order items (JSONB array)
  - Order total
  - Order status (pending, processing, shipped, delivered, cancelled)
  - Shipping information:
    - Tracking number
    - Carrier name
    - Shipping date
    - Label URL
    - Shipping notes
    - Package weight
    - Package dimensions (JSONB)
  - Created timestamp

#### 4. Content Management
- **hero_slides**
  - Hero image URL
  - Optional title and subtitle
  - Display order
  - Active/inactive status
  - Image fit, position, zoom controls
  - Timestamps

- **gallery_images**
  - Gallery image URL
  - Display order
  - Active/inactive status
  - Image fit control
  - Timestamps

- **site_settings**
  - Key-value pairs for site configuration
  - Currently stores: video_url
  - Updated timestamp

### Storage Buckets
- **product-images** - Product and category images
- **site-content** - Hero images, gallery images
- **videos** - Background videos
- **shipping-labels** - Uploaded shipping label PDFs

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- **Public access:** Read-only for products, categories, and active content
- **Admin-only:** Full CRUD for products, orders, content management
- **Authenticated users:** Cart management, order creation
- **Security-first approach:** No data exposed without explicit policy

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eomc-apparel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   - Open your Supabase project dashboard
   - Navigate to SQL Editor
   - Run all migration files in order from `supabase/migrations/`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Create your first admin user at `/admin/setup`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Admin Setup

### Creating Your First Admin User

#### Method 1: Admin Setup Page (Recommended)
1. Navigate to `/admin/setup` in your browser
2. Enter email and password
3. Click "Create Admin Account"
4. Login at `/login` with your credentials
5. Access admin dashboard from user menu

#### Method 2: SQL Query
1. Register a normal account at `/register`
2. Open Supabase SQL Editor
3. Run the following query:
   ```sql
   INSERT INTO admin_users (id, email, role)
   SELECT id, email, 'admin'
   FROM auth.users
   WHERE email = 'your-email@example.com';
   ```
4. Log out and log back in

### Adding Additional Admins
Use Method 2 (SQL Query) with the new admin's email address.

### Admin Access
- Admin features only appear after logging in as an admin
- User icon in header shows "Admin Dashboard" option
- Edit mode toggle appears in header for admins
- All admin tools require authentication

---

## Security Features

### Authentication
- **Supabase Auth Integration**
  - Industry-standard password hashing
  - Secure session management
  - HTTPS enforcement in production
  - Token-based authentication

### Authorization
- **Role-Based Access Control (RBAC)**
  - Admin role checked server-side
  - Frontend guards for admin routes
  - Database-level permission enforcement

### Database Security
- **Row Level Security (RLS) on all tables**
  - Admins can modify products and content
  - Public users can only read published data
  - Users can only modify their own cart items
  - Order creation requires validation

- **Input Validation**
  - Frontend form validation
  - Database constraints (NOT NULL, UNIQUE)
  - Type safety with TypeScript
  - SQL injection prevention (Supabase handles)

### Data Protection
- **No sensitive data exposure**
  - Environment variables for API keys
  - No credentials in source code
  - Secure storage bucket policies
  - CORS properly configured

---

## Image Management

### Upload System
- **Automatic Image Optimization**
  - Client-side image resizing before upload
  - Maximum dimensions: 1920x1920 pixels
  - Quality optimization for web
  - Format: JPEG with 0.9 quality
  - Reduces storage costs and improves load times

### Image Controls
Every image in the system supports:
- **Fit Options**
  - Contain: Image fits inside frame (maintains aspect ratio)
  - Cover: Image fills frame (may crop)
  - Fill: Image stretches to fill frame

- **Position Controls**
  - X-axis: -50% to +50% (horizontal shift)
  - Y-axis: -50% to +50% (vertical shift)
  - Reset button to center image

- **Zoom Controls**
  - Range: 0.5x to 3.0x
  - Slider and button controls
  - Real-time preview
  - Fine-tune image focal point

### Storage Organization
- **Supabase Storage Integration**
  - Dedicated buckets for different content types
  - Unique filenames with timestamps
  - Public URL generation
  - CDN delivery for fast loading

### Supported Formats
- **Images:** JPEG, PNG, WebP, GIF
- **Videos:** MP4, WebM, QuickTime (MOV)

---

## Order Fulfillment

### Order Workflow

#### 1. Order Reception
- Customer completes checkout
- Order created with "pending" status
- Stock automatically deducted
- Order number generated (ORD-XXXXXXXX)

#### 2. Order Processing
- Admin views order in Orders Manager
- Status updated to "processing"
- Items prepared for shipment
- Package weight and dimensions recorded

#### 3. Shipping
- Create shipping label (external service or manual)
- Upload label PDF to order
- Add tracking number and carrier
- Set shipping date
- Add any shipping notes
- Status updated to "shipped"

#### 4. Delivery
- Customer receives package
- Admin marks order as "delivered"
- Order complete

#### 5. Cancellations
- Status can be changed to "cancelled" at any time
- Manual stock adjustment if needed

### Shipping Label Features
- **Integrated Label Management**
  - Upload shipping labels directly to orders
  - Support for all major carriers
  - Track package dimensions and weight
  - Internal notes for fulfillment team
  - Quick access to tracking information

- **Carrier Support**
  - USPS
  - FedEx
  - UPS
  - DHL
  - Regional carriers
  - Custom carrier entry

---

## Project Structure

```
eomc-apparel/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ImagePositionControls.tsx
│   │   ├── ImageUploadWithResize.tsx
│   │   └── ProductCard.tsx
│   ├── context/           # React context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── EditModeContext.tsx
│   ├── lib/               # Utility functions and configs
│   │   ├── imageResize.ts
│   │   ├── storage.ts
│   │   └── supabase.ts
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── InventoryManager.tsx
│   │   │   ├── OrdersManager.tsx
│   │   │   ├── ProductManager.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Setup.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Products.tsx
│   │   └── Register.tsx
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   ├── types.ts           # TypeScript type definitions
│   └── index.css          # Global styles
├── supabase/
│   └── migrations/        # Database migration files
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Key Features Summary

### For Store Owners
- Complete product catalog management
- Real-time inventory tracking with low stock alerts
- Order management with shipping integration
- Visual content editor (no coding required)
- Responsive admin dashboard
- Secure authentication and authorization

### For Customers
- Beautiful, responsive shopping experience
- Easy product browsing and filtering
- Smooth checkout process
- Size selection for apparel
- Real-time stock availability
- Mobile-optimized interface

### Technical Highlights
- Type-safe development with TypeScript
- Production-ready database with RLS
- Automatic image optimization
- Session-based cart persistence
- Clean component architecture
- Comprehensive admin tools
- In-place content editing
- Modern, maintainable codebase

---

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- Modular component architecture
- Context API for state management

---

## Future Enhancement Possibilities

- Email notifications for orders
- Customer order history and tracking
- Product reviews and ratings
- Wishlist functionality
- Advanced search with filters
- Discount codes and promotions
- Multi-currency support
- Integration with shipping APIs (Shippo, EasyPost)
- Analytics dashboard for sales insights
- Product variants (colors, styles)
- Customer accounts with saved addresses
- Payment processing integration
- Automated low stock notifications

---

## Support

For detailed admin setup instructions, see [ADMIN_SETUP.md](./ADMIN_SETUP.md)

---

## License

Private project - All rights reserved

---

## Credits

Built with:
- React + TypeScript
- Vite
- Supabase
- Tailwind CSS
- Lucide React Icons

Stock images from Pexels.com
