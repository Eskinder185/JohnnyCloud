# Image Loading Fix Instructions

## Problem
Your images are in the right place in the `public` folder, but they're not loading because the environment variables are not set.

## Solution

### Option 1: Run the Setup Script (Recommended)

**Windows:**
```bash
setup-env-images.bat
```

**Linux/Mac:**
```bash
chmod +x setup-env-images.sh
./setup-env-images.sh
```

### Option 2: Manual Setup

1. **Create a `.env` file** in your project root (if it doesn't exist)

2. **Copy the contents from `env.example`** to your `.env` file

3. **Add these lines to the end of your `.env` file:**
```env
# Image Configuration
# Why AWS Page Images
VITE_WHY_AWS_IMAGE=/images/why-aws/why-aws-hero-cloud-infrastructure.jpg
VITE_JC_IMAGE=/images/why-aws/johnnycloud-company-logo.jpg

# About Page Images
VITE_ABOUT_HERO_IMAGE=/images/about/about-hero-team-office.jpg
```

4. **Restart your development server:**
```bash
npm run dev
```

## What's Happening

Your images are correctly placed in:
- ✅ `public/images/why-aws/why-aws-hero-cloud-infrastructure.jpg`
- ✅ `public/images/about/about-hero-team-office.jpg`

But the frontend code is looking for environment variables:
- `VITE_WHY_AWS_IMAGE` - for the Why AWS page hero image
- `VITE_ABOUT_HERO_IMAGE` - for the About page hero image
- `VITE_JC_IMAGE` - for the company logo

Without these environment variables, the code falls back to Unsplash placeholder images.

## Missing Image

You still need to add a company logo:
- **Path:** `public/images/why-aws/johnnycloud-company-logo.jpg`
- **Size:** 200x200px (square)
- **Format:** PNG with transparency or JPG

## After Setup

Once you've set up the `.env` file and restarted your dev server:
1. Visit `/why-aws` - should show your custom hero image
2. Visit `/about` - should show your custom hero image
3. Check browser dev tools to ensure no 404 errors

## Troubleshooting

If images still don't load:
1. **Check the browser console** for 404 errors
2. **Verify file paths** match exactly (case-sensitive)
3. **Ensure dev server was restarted** after adding `.env` file
4. **Check that images are in the `public` folder** (not `src`)

The images should now load correctly! 🎉

