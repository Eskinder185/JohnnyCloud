# Background System Documentation

## Overview

The JohnnyCloud background system provides route-aware animated backgrounds with performance optimization and accessibility compliance.

## Architecture

### Components

- **`BackgroundManager`**: Main orchestrator component that manages global base layer and page overlays
- **`GlobalBaseLayer`**: Ultra-subtle parallax dotted grid that's always present
- **Page Overlays**: Route-specific background effects that switch based on current page

### Page-Specific Overlays

1. **Home** (`HomeOverlay`): Aurora ribbons + voice halo when voice is active
2. **Metrics** (`MetricsOverlay`): Cost waves with gentle movement
3. **Guardrails** (`GuardrailsOverlay`): Radar sweep + shield ripple after remediation
4. **Why AWS** (`WhyAwsOverlay`): Migration isobars with contour line morphing
5. **FAQ/About** (`FaqAboutOverlay`): Digital rain effect

## Motion Preferences

### Settings Store (`motionStore`)

- **Auto**: Respects system `prefers-reduced-motion` setting
- **On**: Always show animations
- **Off**: Always disable animations
- **Static Background**: Override all animations with static background

### Persistence

Settings are stored in localStorage with key `jc_ui_motion_v1`:
```json
{
  "background": "auto",
  "staticBackground": false
}
```

## Performance Features

### Optimization

- **GPU-Friendly**: All animations use CSS transforms only
- **Single Overlay**: Only one overlay active at a time
- **Tab Visibility**: Animations pause when tab is not visible
- **Reduced Motion**: Full support for system preferences

### Animation Timing

- **Global Base**: 30s cycle with 6-10% opacity
- **Page Overlays**: 25-40s cycles with 6-12% opacity
- **Voice Halo**: 3s pulse when voice is active
- **Shield Ripple**: 2s one-time animation after remediation

## Accessibility

### Compliance

- **WCAG AA**: Color contrast ≥4.5:1 for all text
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce`
- **Focus States**: Visible focus rings on all interactive elements
- **Non-Color Cues**: Icons and labels supplement color information

### Settings UI

Motion settings panel in header provides:
- Background animation preference (Auto/On/Off)
- Static background override toggle
- System reduced motion status display

## Usage

### Basic Implementation

```tsx
import BackgroundManager from '@/components/background/BackgroundManager';

function App() {
  return (
    <div>
      <BackgroundManager />
      {/* Your app content */}
    </div>
  );
}
```

### With Voice Integration

```tsx
<BackgroundManager isVoiceActive={isSpeaking} />
```

### With Remediation Feedback

```tsx
<BackgroundManager showShieldRipple={remediationSuccess} />
```

## Customization

### Adding New Overlays

1. Create new overlay component in `src/components/background/overlays/`
2. Add route mapping in `BackgroundManager.tsx`
3. Follow existing patterns for animation timing and opacity

### Modifying Animation Timing

Update keyframes in overlay components:
```css
@keyframes custom-animation {
  0%, 100% { /* start/end states */ }
  50% { /* middle state */ }
}
```

## Troubleshooting

### Common Issues

1. **Animations not showing**: Check motion preferences and system settings
2. **Performance issues**: Verify only one overlay is active
3. **Accessibility concerns**: Ensure reduced motion is respected

### Debug Mode

Enable debug logging by setting `localStorage.setItem('jc_debug_motion', 'true')`

## Future Enhancements

- WebGL-based overlays for more complex effects
- User-customizable overlay preferences
- A/B testing for animation effectiveness
- Integration with user analytics for motion preferences
