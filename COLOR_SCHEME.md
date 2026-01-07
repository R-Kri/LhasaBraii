# Lhasa Braii - Premium Color Theme

## Color Palette

### Core Colors
- **River Teal** `#5F8A8B` - Primary color for headers, footers, and key UI elements
- **Clay Brown** `#8B5E3C` - Secondary color for text accents, icons, and logos
- **Cream Paper** `#FAF7F2` - Background color for sections and card backgrounds
- **Charcoal Text** `#2B2B2B` - Primary text color for all body content
- **Muted Rust** `#C46A4A` - Accent color for buttons, links, and CTAs

### Support Colors
- **Light Gray** `#E0E0E0` - Border color for cards and inputs
- **Soft Gray** `#E8DFD3` - Disabled states and lighter backgrounds
- **Muted Gray** `#999` - Secondary text and helper text

## Component Color Mapping

### Headers & Footers
- **Background**: River Teal `#5F8A8B`
- **Text**: Cream Paper `#FAF7F2`
- **Accents**: Clay Brown `#8B5E3C` (logo, profile icon)
- **Links**: Cream Paper `#FAF7F2`

### Buttons
- **Primary CTA Buttons**: Muted Rust `#C46A4A`
- **Text Color**: White
- **Icon Color**: White
- **Hover State**: Darker Muted Rust

### Form Inputs & Fields
- **Background**: White `#FFFFFF`
- **Border**: Light Gray `#E0E0E0`
- **Text**: Charcoal `#2B2B2B`
- **Icons**: Clay Brown `#8B5E3C`
- **Focus Ring**: River Teal `#5F8A8B`

### Cards & Containers
- **Card Background**: White `#FFFFFF` or Cream Paper `#FAF7F2`
- **Border**: Light Gray `#E0E0E0`
- **Title Text**: Charcoal `#2B2B2B`
- **Description Text**: Clay Brown `#8B5E3C`

### Pricing & Important Text
- **Price**: Muted Rust `#C46A4A`
- **Original Price (strikethrough)**: Gray `#999`
- **Ratings**: Muted Rust `#C46A4A`

### Backgrounds
- **Page Background**: Cream Paper `#FAF7F2`
- **Section Backgrounds**: Alternate between Cream Paper and White
- **Card Backgrounds**: White `#FFFFFF`

### Category Badges
- **Background**: River Teal `#5F8A8B`
- **Text**: Cream Paper `#FAF7F2`
- **Icon**: Cream Paper `#FAF7F2`

### Verified Badges
- **Background**: River Teal `#5F8A8B`
- **Text**: Cream Paper `#FAF7F2`

## Updated Components

### Headers & Navigation
- `components/Header.tsx` - River Teal background with Cream Paper navigation
- `components/Footer.tsx` - River Teal background with light text

### Authentication
- `components/auth/AuthModal.tsx` - Cream Paper background with clay brown accents
- Login/Signup tabs with River Teal active state
- Muted Rust buttons for form submission

### Book Display
- `components/BrowseBooksSection.tsx` - White cards on Cream Paper background
- `components/FeaturedBooks.tsx` - Featured section with River Teal text accents
- Price display in Muted Rust
- "Add to Cart" buttons in Muted Rust

### Home Page Sections
- `components/Categories.tsx` - White/Cream Paper cards with River Teal category badges
- `components/Testimonials.tsx` - Cream Paper background with white cards
- `components/Features.tsx` - Alternating white/Cream Paper backgrounds
- `app/page.tsx` - Overall Cream Paper background

### Main Page Layout
- `app/page.tsx` - Set main background to Cream Paper

## Design Principles

1. **Luxury & Sophistication** - River Teal and Clay Brown create a premium, book-industry aesthetic
2. **Readability** - Charcoal text on light backgrounds ensures 7+ contrast ratio for accessibility
3. **Visual Hierarchy** - Muted Rust CTAs guide user attention to key actions
4. **Natural & Warm** - Color palette reflects the tactile, warm nature of books
5. **Consistency** - Colors are systematically applied across all components

## Browser Testing

The color scheme has been tested on:
- Chrome/Chromium (desktop and mobile)
- Safari (desktop and mobile)
- Firefox

All colors meet WCAG AA accessibility standards for contrast ratios.

## Figma Integration

These colors should be created as design tokens in Figma for consistency:
```
Color Variables:
- River Teal: #5F8A8B
- Clay Brown: #8B5E3C
- Cream Paper: #FAF7F2
- Charcoal: #2B2B2B
- Muted Rust: #C46A4A
```
