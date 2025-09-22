# Background System v1.2

## Overview
A unified background system that provides brand consistency with a global base layer and page-specific overlays.

## Architecture

### Two-Layer System
1. **GlobalBase** - Always visible, provides brand consistency
2. **RouteOverlay** - Page-specific, swaps based on current route

### Key Features
- ✅ Tokenized configuration (no hard-coded URLs)
- ✅ Light/Dark theme support
- ✅ Accessibility (respects `prefers-reduced-motion`)
- ✅ Performance optimized (preloading, lazy loading)
- ✅ Subtle parallax (desktop only)
- ✅ Text readability (gradient masks)

## Configuration

### CSS Tokens
Set these in your CSS or via JavaScript:

```css
/* Dark theme */
--bg-global-url: 'url(/images/backgrounds/global-dark.webp)';
--bg-home-url: 'url(/images/backgrounds/home-aurora.webp)';
--bg-metrics-url: 'url(/images/backgrounds/metrics-waves.webp)';
--bg-guardrails-url: 'url(/images/backgrounds/guardrails-radar.webp)';
--bg-whyaws-url: 'url(/images/backgrounds/whyaws-contours.webp)';
--bg-about-url: 'url(/images/backgrounds/about-timeline.webp)';
--bg-faq-url: 'url(/images/backgrounds/faq-holo.webp)';
--bg-auth-url: 'url(/images/backgrounds/auth-minimal.webp)';
--bg-404-url: 'url(/images/backgrounds/404-minimal.webp)';

/* Overlay properties */
--bg-overlay-opacity: 0.08;
--bg-overlay-brightness: 0.9;
--bg-overlay-contrast: 1.1;
--bg-vignette-strength: 0.3;
```

### Light Theme
```css
.light {
  --bg-overlay-opacity: 0.05;
  --bg-overlay-brightness: 1.1;
  --bg-overlay-contrast: 0.9;
  --bg-vignette-strength: 0.2;
}
```

## Usage

### Setting Background URLs
```typescript
import { setBackgroundUrl } from '@/lib/backgroundUtils';

// Set global background
setBackgroundUrl('--bg-global-url', '/images/backgrounds/global-dark.webp');

// Set page-specific background
setBackgroundUrl('--bg-home-url', '/images/backgrounds/home-aurora.webp');
```

### Route Mapping
The system automatically maps routes to background tokens:

- `/` → `--bg-home-url`
- `/metrics` → `--bg-metrics-url`
- `/guardrails` → `--bg-guardrails-url`
- `/why-aws` → `--bg-whyaws-url`
- `/about` → `--bg-about-url`
- `/faq` → `--bg-faq-url`
- `/login`, `/auth/*` → `--bg-auth-url`
- `/*404*` → `--bg-404-url`

## Image Guidelines

### Global Background
- **Purpose**: Brand consistency across all pages
- **Style**: Soft star-field, dot-grid, or diagonal grain
- **Size**: 200-400KB (WEBP/AVIF)
- **Dimensions**: 1920x1080 or higher

### Page Overlays
- **Home**: Faint aurora gradient, optional voice halo when Speak is on
- **Metrics**: Abstract chart waves/mesh (blue/cyan)
- **Guardrails**: Radar sweep / concentric shield ripples (teal/green)
- **Why AWS**: Contour/isobar lines (soft drift frame)
- **About**: Subtle timeline strokes or geometric dots (neutral)
- **FAQ**: Holo-radar effect (now through overlay layer)
- **Auth/404**: Ultra-minimal blurred gradient

### Performance
- **Static**: ≤ 600KB per overlay
- **Video** (future): WebM 12-18fps, ≤ 1.2MB
- **Mobile**: Always static, no video

## Accessibility

### Reduced Motion
- No parallax or animation when `prefers-reduced-motion: reduce`
- Static images only
- Respects user preferences

### Text Readability
- Combined base+overlay ≤ 18-20% visual strength
- Top gradient mask ensures AA+ contrast for hero text
- Never exceeds 12% opacity behind long paragraphs

## Performance Features

### Preloading
- Global background preloaded in `<head>`
- Route overlays lazy-loaded on route mount
- Optional prefetch on link hover

### Optimization
- `pointer-events: none` (no interaction blocking)
- Pause animation on tab blur
- `object-fit: cover` to prevent CLS
- Efficient CSS custom properties

## Controls & Settings

### User Preferences
```typescript
// Static background mode (base only)
setBackgroundUrl('--bg-home-url', '');
setBackgroundUrl('--bg-metrics-url', '');
// ... clear all overlays
```

### Feature Flags
```typescript
// Safe rollout
const bgOverlaysEnabled = process.env.VITE_BG_OVERLAYS_V1 === 'true';
```

## QA Checklist

- [ ] Old page backgrounds removed
- [ ] Global base visible across routes
- [ ] Overlays swap instantly without flicker
- [ ] All routes show correct overlay (or none if unset)
- [ ] Light/Dark: overlays remain subtle, text AA+
- [ ] Reduced motion: static images only
- [ ] No pointer blocking
- [ ] No CLS spikes
- [ ] Mobile uses static overlays
- [ ] Network shows preload for global, lazy for overlays

## Troubleshooting

### Background Not Showing
1. Check if URL is set: `getBackgroundUrl('--bg-home-url')`
2. Verify image exists and is accessible
3. Check browser console for 404 errors
4. Ensure CSS custom property is properly formatted

### Performance Issues
1. Verify images are optimized (WEBP/AVIF)
2. Check file sizes (≤ 600KB per overlay)
3. Monitor network tab for preloading
4. Test on slower connections

### Accessibility Issues
1. Verify `prefers-reduced-motion` is respected
2. Check text contrast with background
3. Test with screen readers
4. Ensure no pointer events on backgrounds