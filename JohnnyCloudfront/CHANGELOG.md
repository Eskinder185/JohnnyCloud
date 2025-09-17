# Changelog

## [Latest] - Background System & Typography Refresh

### Added
- **New Background System**: Route-aware animated backgrounds with performance optimization
  - `BackgroundManager` component with global base layer and page-specific overlays
  - Global base layer with ultra-subtle parallax dotted grid (30s cycle, 6-10% opacity)
  - Page-specific overlays: Home (aurora ribbons + voice halo), Metrics (cost waves), Guardrails (radar sweep + shield ripple), Why AWS (migration isobars), FAQ/About (digital rain)
  - Motion preferences system with localStorage persistence (`jc_ui_motion_v1`)
  - Respects `prefers-reduced-motion` and provides manual "Static background" toggle
  - Animations pause when tab is not visible for performance

- **Typography System**: Enhanced readability with new font tokens and color system
  - Font stack: Inter for headings/body, JetBrains Mono for code
  - Typography scale: H1 (40px/700), H2 (32px/700), H3 (24px/600), Body (16px/400), Small (14px/400)
  - Text color tokens: Primary (#E6F1FF), Secondary (#B5C7DB), Muted (#8EA0B5), Inverse (#0B1220)
  - Link colors: Default (#7FD1FF), Hover (#A7E3FF) with proper focus states
  - Severity colors: Success (#3DDC97), Warning (#F6C453), Danger (#FF6B6B), Info (#6FB7FF)

- **Motion Settings UI**: Settings panel in header for animation preferences
  - Auto (respect system), Always on, Always off options
  - Static background override toggle
  - System reduced motion status display

### Changed
- **Background Performance**: All animations use GPU-friendly transforms, ≤1 overlay active
- **Accessibility**: Enhanced focus states, color contrast ≥4.5:1, non-color meaning cues
- **Typography**: Applied new font tokens across all components for better readability
- **Body Styles**: Updated to use new text-primary color and font features

### Technical Details
- Created `src/lib/motionStore.ts` for motion preference management
- Created `src/components/background/` directory with BackgroundManager and overlay components
- Updated `tailwind.config.js` with new typography tokens and color system
- Added typography utility classes to `src/index.css`
- Updated `src/layouts/RootLayout.tsx` to include BackgroundManager
- Added `src/components/settings/MotionSettings.tsx` for user preferences

### Performance
- **CPU Impact**: Low, animations use CSS transforms only
- **Memory**: Efficient with single overlay active per route
- **Accessibility**: Full support for reduced motion preferences
- **Mobile**: Optimized for low-power mode detection

### Impact
- **Visual**: Subtle, non-distracting animations that enhance brand consistency
- **UX**: Route-aware backgrounds provide contextual visual feedback
- **Accessibility**: Full compliance with motion preferences and contrast requirements
- **Performance**: Smooth 60fps animations with automatic pause when tab hidden

---

## Previous Entries
*[Previous changelog entries would continue here...]*