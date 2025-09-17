# About Page Images

Place your About page images here:

- `about-hero-team-office.jpg` - Main hero image for the About page (1200x600px recommended)

## Team Photos

Place team member photos in the `team-photos/` subdirectory:
- Use descriptive filenames with name and role: `fredy-tapia-project-manager.jpg`, `roman-canger-business-analyst.jpg`
- Recommended size: 400x400px (square format)
- Update the team data in `src/data/team.ts` to reference these images

## Current Setup

The About page is configured to use:
- `VITE_ABOUT_HERO_IMAGE` environment variable for the hero image

## Fallback

If no custom images are provided, the page will use Unsplash placeholder images.
