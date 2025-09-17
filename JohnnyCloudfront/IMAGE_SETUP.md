# Image Setup Guide

## 📁 Directory Structure Created

The following directories have been created for your images:

```
public/
├── images/
│   ├── why-aws/
│   │   ├── hero.jpg (add your Why AWS hero image here)
│   │   └── company-logo.jpg (add your company logo here)
│   └── about/
│       ├── hero.jpg (add your About page hero image here)
│       └── team-photos/
│           ├── john-doe.jpg (add team member photos here)
│           ├── jane-smith.jpg
│           └── placeholder-avatar.jpg
```

## 🔧 Environment Variables Setup

Add these lines to your `.env` file (or create one if it doesn't exist):

```env
# Image Configuration
# Why AWS Page Images
VITE_WHY_AWS_IMAGE=/images/why-aws/why-aws-hero-cloud-infrastructure.jpg
VITE_JC_IMAGE=/images/why-aws/johnnycloud-company-logo.jpg

# About Page Images
VITE_ABOUT_HERO_IMAGE=/images/about/about-hero-team-office.jpg
```

## 📸 Recommended Image Specifications

### Why AWS Page
- **Hero Image** (`/images/why-aws/why-aws-hero-cloud-infrastructure.jpg`):
  - Size: 1200x600px (2:1 aspect ratio)
  - Format: JPG or WebP
  - File size: < 500KB
  - Content: AWS cloud infrastructure, technology, or business imagery

- **Company Logo** (`/images/why-aws/johnnycloud-company-logo.jpg`):
  - Size: 200x200px (square)
  - Format: PNG with transparency or JPG
  - File size: < 100KB

### About Page
- **Hero Image** (`/images/about/about-hero-team-office.jpg`):
  - Size: 1200x600px (2:1 aspect ratio)
  - Format: JPG or WebP
  - File size: < 500KB
  - Content: Team working, office environment, or company culture

- **Team Photos** (`/images/about/team-photos/`):
  - Size: 400x400px (square)
  - Format: JPG
  - File size: < 200KB each
  - Content: Professional headshots

## 🚀 How to Add Images

1. **Add your images to the created directories:**
   ```bash
   # Copy your images to the appropriate directories
   cp your-hero-image.jpg public/images/why-aws/hero.jpg
   cp your-about-hero.jpg public/images/about/hero.jpg
   cp team-photo.jpg public/images/about/team-photos/john-doe.jpg
   ```

2. **Update your `.env` file** with the image paths (see above)

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## 🔄 Fallback Images

The pages are already configured with fallback images from Unsplash, so they will work even without your custom images:

- **Why AWS**: Falls back to a cloud infrastructure image
- **About**: Falls back to a team/office image

## 📱 Image Optimization Tips

1. **Use WebP format** for better compression (modern browsers)
2. **Provide multiple sizes** for responsive design
3. **Optimize file sizes** to improve page load speed
4. **Use descriptive alt text** for accessibility

## 🎯 Quick Test

After adding images and updating your `.env` file:

1. Visit `http://localhost:5173/why-aws` - should show your custom hero image
2. Visit `http://localhost:5173/about` - should show your custom hero image
3. Check browser dev tools to ensure images load without 404 errors

## 📝 Notes

- Images in the `public/` directory are served directly by Vite
- Environment variables starting with `VITE_` are available in the browser
- The current code already handles fallbacks if images are missing
- Team photos can be referenced directly in the team data files
