# Visual Builder - Editable Elements Guide

This guide shows all the elements that can be edited through the Visual Builder and their locations in the codebase.

## 🎯 Currently Editable via Visual Builder

These elements are stored in the Supabase database and can be edited directly through the Visual Builder:

### 🏠 Hero Section (`content.hero`)
**Location**: `src/spa-pages/Home.tsx` lines 150-190
- ✅ **Hero Title** - Main headline text
- ✅ **Hero Subtitle** - Descriptive text below title
- ✅ **Primary Button Text** - "View Products" button
- ✅ **Primary Button Link** - Where the button redirects
- ✅ **Secondary Button Text** - "Get Quote" button  
- ✅ **Secondary Button Link** - Where the button redirects

### 📊 Statistics Section (`content.statistics`)
**Location**: `src/spa-pages/Home.tsx` lines 83-95
- ✅ **Years Experience** - "35+" text
- ✅ **Projects Completed** - "500+" text
- ✅ **Happy Clients** - "300+" text
- ✅ **Rating** - "4.6" number
- ✅ **Rating Out Of** - "/5" text

### ℹ️ About Section (`content.about`)
**Location**: `src/spa-pages/Home.tsx` lines 230-280
- ✅ **About Title** - Section heading
- ✅ **About Description** - Main paragraph text
- ✅ **Features List** - Bullet points (array)
- ✅ **Years Badge Number** - "35+" in badge
- ✅ **Years Badge Text** - "Years of Trust"
- ✅ **About Image** - Section image

### 🎯 CTA Section (`content.cta`)
**Location**: `src/spa-pages/Home.tsx` lines 365-390
- ✅ **CTA Title** - "Ready to Get Started?"
- ✅ **CTA Description** - Descriptive text
- ✅ **CTA Button Text** - "Get Free Quote"
- ✅ **CTA Button Link** - "/contact"

### 🛍️ Products (`products` table)
**Location**: `src/spa-pages/Home.tsx` lines 297-325
- ✅ **Product Name** - Individual product titles
- ✅ **Product Description** - Product descriptions
- ✅ **Product Images** - Product photos
- ✅ **Product Prices** - Pricing information
- ✅ **Product Features** - Feature lists
- ✅ **Featured Status** - Whether shown on homepage

### 💬 Testimonials (`testimonials` table)
**Location**: `src/spa-pages/Home.tsx` lines 347-360
- ✅ **Customer Name** - Testimonial author
- ✅ **Company Name** - Customer's company
- ✅ **Testimonial Text** - Review content
- ✅ **Rating** - Star rating (1-5)
- ✅ **Customer Image** - Profile photo

### ⚙️ Settings (`settings` table)
**Location**: Various components
- ✅ **Company Name** - Used in navbar, footer
- ✅ **Company Logo** - Site-wide logo
- ✅ **Contact Information** - Phone, email, address
- ✅ **Social Media Links** - Facebook, Instagram, etc.
- ✅ **Theme Colors** - Primary, secondary colors
- ✅ **Categories** - Product categories

## 🔧 Elements Requiring Code Changes

These elements are hardcoded and need manual code editing:

### 🏠 Hero Section Styling
**Location**: `src/spa-pages/Home.tsx` lines 118-149
- ❌ **Background Color** - Currently matte black
- ❌ **Logo Size** - h-40 md:h-48 lg:h-56
- ❌ **Text Colors** - Gold, white, gray-300
- ❌ **Animations** - Framer Motion settings

**To Change**: Edit the className attributes and Tailwind classes

### 📊 Statistics Section Layout
**Location**: `src/spa-pages/Home.tsx` lines 195-225
- ❌ **Section Background** - bg-dark class
- ❌ **Grid Layout** - grid-cols-2 md:grid-cols-4
- ❌ **Icons** - Calendar, Award, Users, Star
- ❌ **Animation Timing** - Framer Motion delays

**To Change**: Edit the JSX structure and Tailwind classes

### 🎨 Product Section Styling
**Location**: `src/spa-pages/Home.tsx` lines 283-335
- ❌ **Section Title** - "Our Premium Products"
- ❌ **Section Description** - Hardcoded paragraph
- ❌ **Grid Layout** - md:grid-cols-2 lg:grid-cols-3
- ❌ **Button Text** - "Contact Our Expert", "View All Products"
- ❌ **Button Links** - /contact, /products

**To Change**: Edit the JSX content and Link href attributes

### 💬 Testimonials Section Layout
**Location**: `src/spa-pages/Home.tsx` lines 336-365
- ❌ **Section Title** - "What Our Clients Say"
- ❌ **Section Description** - Hardcoded text
- ❌ **Grid Layout** - md:grid-cols-3
- ❌ **Card Styling** - bg-gray-50, rounded-xl

**To Change**: Edit the JSX structure and styling classes

### 🧭 Navigation Menu
**Location**: `src/components/Layout/Navbar.tsx`
- ❌ **Menu Items** - Home, Products, About, Contact
- ❌ **Menu Order** - Navigation sequence
- ❌ **Mobile Menu** - Hamburger menu behavior

**To Change**: Edit the navigation array and JSX

### 🦶 Footer Content
**Location**: `src/components/Layout/Footer.tsx`
- ❌ **Footer Sections** - Company info, quick links, contact
- ❌ **Copyright Text** - "© 2024 Shyam Trading Company"
- ❌ **Footer Links** - Privacy, Terms, etc.

**To Change**: Edit the footer JSX structure

## 🚀 How to Make More Elements Editable

To make hardcoded elements editable through the Visual Builder:

### Step 1: Add to Database Schema
Add new fields to the `content` table in `database/schema.sql`:

```sql
-- Example: Making product section title editable
UPDATE content SET data = jsonb_set(data, '{productSection}', '{
    "title": "Our Premium Products",
    "description": "Discover our comprehensive range...",
    "buttons": {
        "primary": {"text": "Contact Our Expert", "link": "/contact"},
        "secondary": {"text": "View All Products", "link": "/products"}
    }
}'::jsonb) WHERE section = 'homepage';
```

### Step 2: Update TypeScript Interface
Add the new fields to `ContentData` interface in `src/lib/databaseManager.ts`:

```typescript
export interface ContentData {
  // ... existing fields
  productSection?: {
    title: string
    description: string
    buttons: {
      primary: { text: string; link: string }
      secondary: { text: string; link: string }
    }
  }
}
```

### Step 3: Update Component
Replace hardcoded values with database values:

```typescript
// Before (hardcoded)
<h2>Our Premium Products</h2>

// After (editable)
<h2>{content?.productSection?.title || "Our Premium Products"}</h2>
```

### Step 4: Update ContentEditor
Add detection for the new elements in `src/admin/components/builder/ContentEditor.tsx`:

```typescript
// Add to detectContentSection function
if (element.closest('.product-section-title')) {
  return { section: 'productSection', field: 'title' }
}
```

## 📍 Quick Reference - File Locations

| Element Type | File Location | Lines |
|-------------|---------------|-------|
| Hero Section | `src/spa-pages/Home.tsx` | 118-190 |
| Statistics | `src/spa-pages/Home.tsx` | 83-95, 195-225 |
| About Section | `src/spa-pages/Home.tsx` | 230-280 |
| Products Section | `src/spa-pages/Home.tsx` | 283-335 |
| Testimonials | `src/spa-pages/Home.tsx` | 336-365 |
| CTA Section | `src/spa-pages/Home.tsx` | 365-390 |
| Navigation | `src/components/Layout/Navbar.tsx` | Full file |
| Footer | `src/components/Layout/Footer.tsx` | Full file |
| Global Styles | `src/app/globals.css` | Full file |

## 🎨 Styling Classes Reference

| Element | Current Classes | Purpose |
|---------|----------------|---------|
| Hero Background | `bg-black` | Matte black background |
| Hero Title | `text-gold drop-shadow-lg` | Gold text with shadow |
| Statistics Section | `bg-dark` | Dark background |
| Product Cards | `bg-white rounded-xl shadow-lg` | White cards with shadow |
| CTA Section | `bg-gradient-to-r from-gold to-gold-dark` | Gold gradient |

This guide helps you understand what can be edited through the Visual Builder versus what requires code changes.
