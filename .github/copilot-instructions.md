# Jardín Infinito - AI Coding Instructions

## Architecture Overview

**Headless WordPress + Astro Static Site** with React Islands for dynamic content. WordPress API at `api.jardininfinito.com` serves product data via Custom Post Types (CPTs). Frontend is pure static Astro with selective React hydration for product loaders.

### Key Stack Decisions
- **Astro SSG** (`output: 'static'`) - No server required, static deployment to Vercel
- **React Islands** (`client:load`) - Only interactive components hydrate (product catalogs, filters)
- **Tailwind CSS 4** - Custom theme via `@theme` in `src/styles/global.css` with brand colors (`--color-primary: #447b35`, `--color-secondary: #223420`)
- **WordPress REST API** - Headless CMS, never touched directly by users

## WordPress Integration Pattern

**Critical**: All product data flows through specialized loader components that transform WordPress ACF fields into clean interfaces.

### WordPress Custom Post Types
- `productos` - General product catalog
- `regala-planta` - Gift plant collection  
- `plantas-habitar` - Indoor living plants
- `plantas-aromaticas` - Aromatic plants
- `servicios` - Service offerings

### Data Transformation Pattern (in every loader)
```typescript
// WordPress returns messy ACF fields - always transform them
interface WordPressProduct {
  acf: {
    precio?: number | string;  // Could be string "0" or number
    precio_descuento?: number | string;
    imagen_adicional_1?: number | string; // Media ID
  }
}

// Transform to clean interface
function convertToNumber(value: any): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

// Smart pricing logic: if only ONE price field has value, use it as main price
if (precioOriginal && !precioDescuento) {
  // Show precioOriginal as main price, no discount badge
}
```

### Loader Component Pattern
Each product category has a dedicated loader: `ProductsLoader.tsx`, `RegalaPlantsLoader.tsx`, `PlantasHabitarLoader.tsx`, `PlantasAromaticasLoader.tsx`. 

**Never duplicate logic** - if adding new category, copy existing loader structure:
1. Define WordPress interface matching ACF fields
2. Transform function `convertToNumber()` for string/number fields
3. Fetch from specific endpoint: `${WP_API_BASE}/wp-json/wp/v2/[cpt-name]`
4. Media image fetching via `getMediaImage(mediaId)` - handles null/0/invalid IDs
5. Map to clean `Producto` interface for `ProductCard.tsx`

## Component Architecture

### Astro Pages (Static)
- `src/pages/*.astro` - Pure static HTML, no interactivity
- Use `Layout.astro` wrapper for consistent structure
- Import Astro components directly, React components need `client:load`

### React Islands (Dynamic)
```astro
<!-- ONLY hydrate when needed -->
<ProductsLoader client:load showOnlyFeatured={true} maxProducts={6} />
```

**When to use `client:load`:**
- Product filtering/search (user interaction)
- Dynamic content loading from WordPress API
- State management (useState, useEffect)

**When NOT to use `client:load`:**
- Static sections (Header, Footer, Nosotros, Contactanos)
- Navigation menus (pure CSS/JS in `<script>` tag)

### Header Navigation Pattern
Desktop dropdown menus use **JavaScript-controlled CSS classes** (not Tailwind group hover due to spacing issues):
```typescript
// .dropdown-container, .dropdown-trigger, .dropdown-menu pattern
const dropdownContainers = document.querySelectorAll('.dropdown-container');
dropdownContainers.forEach(container => {
  let timeout;
  function showDropdown() {
    clearTimeout(timeout);
    menu.classList.remove('opacity-0', 'invisible', 'translate-y-2');
  }
  function hideDropdown() {
    timeout = setTimeout(() => { /* hide */ }, 100); // 100ms grace period
  }
});
```

**Why not `group-hover`?** Tailwind's group-hover breaks on gaps between trigger and dropdown. Use JS event listeners with timeout for smooth UX.

## Development Commands

```bash
npm run dev        # Local dev at localhost:4321
npm run build      # Static build to ./dist/
npm run preview    # Preview production build locally
```

## Styling Conventions

### Color Palette (Brand)
Main brand colors defined in `src/styles/global.css`:
- `primary` (#447b35) - Forest green, main brand color
- `secondary` (#223420) - Dark green, text/accents

Extended palette (darkest to lightest):
- `#2b4426` - Darkest green, deep forest tone
- `#3d6a32` - Dark green, rich accent
- `#447a36` - Medium-dark green, primary variant
- `#93b889` - Light green, soft highlight
- `#a6b8a1` - Lightest green, subtle background

**Usage patterns:**
- Use `hover:bg-primary/20` for hover states (20% opacity)
- Gradients: `from-lime-500 to-green-600`, `from-emerald-500 to-teal-600`
- Apply darker tones (#2b4426, #3d6a32) for headers, emphasis, and CTAs
- Apply lighter tones (#93b889, #a6b8a1) for backgrounds, cards, and subtle accents

### Animation Classes
- `animate.css` library included globally
- Common patterns: `animate__animated animate__fadeInUp animate__delay-1s`
- Custom animations in Astro `<script>` tags for menus (hamburger transforms)

### Responsive Patterns
- Mobile-first with `md:` breakpoint for desktop
- Hamburger menu: `-translate-x-full` (hidden) → `translate-x-0` (visible)
- Desktop dropdowns: `opacity-0 invisible` → `opacity-100 visible`

## WordPress API Client

Use `src/lib/wordpress.ts` class:
```typescript
const wp = new WordPressAPI('https://api.jardininfinito.com');
const products = await wp.getProducts({ per_page: 10, status: 'publish' });
const media = await wp.getMedia(imageId);
```

**Environment Variables:**
- `WORDPRESS_API_URL` - Defaults to `https://api.jardininfinito.com` if not set
- Auto-detection in loaders based on `window.location.hostname`

## Common Pitfalls

1. **TypeScript null safety in dropdowns**: Always check `menu?.classList`, `trigger?.addEventListener` - elements may not exist
2. **ACF field types**: WordPress returns strings for numbers - ALWAYS use `convertToNumber()` helper
3. **Media IDs**: Can be `0`, `"0"`, `null`, or actual number - validate before fetching: `if (!numericId || numericId === 0) return null`
4. **Pricing display**: Check both `precioOriginal` and `precioDescuento` - show discount badge ONLY if both have values > 0
5. **React hydration**: Don't use `client:load` for static content - unnecessary JavaScript
6. **Dropdown spacing**: Never rely on Tailwind `group-hover` for dropdowns with gaps - use JavaScript with timeout patterns

## File Organization

- `src/components/` - Astro components (static) and React components (dynamic)
- `src/components/shared/` - Reusable Header, Footer, Whatsapp button
- `src/pages/` - Route-based pages (Astro file-based routing)
- `src/lib/` - Utilities (WordPress API client, auth helpers)
- `src/styles/global.css` - Tailwind CSS 4 theme configuration
- `public/` - Static assets (images, videos)

## Testing Approach

No automated tests currently. Manual testing workflow:
1. Run `npm run dev` for live reload
2. Test product loaders against live WordPress API
3. Verify responsive design (mobile hamburger menu, desktop dropdowns)
4. Check pricing logic with various ACF field combinations

## Key Files to Reference

- `src/components/ProductsLoader.tsx` - Canonical loader pattern for WordPress integration
- `src/components/shared/Header.astro` - Dropdown menu implementation (JS-controlled)
- `src/lib/wordpress.ts` - API client for all WordPress requests
- `src/styles/global.css` - Brand color definitions
