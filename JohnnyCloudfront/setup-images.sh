#!/bin/bash

echo "Setting up image configuration for Why AWS and About pages..."
echo

echo "Creating .env.local file with image configuration..."
cat > .env.local << EOF
# Image Configuration
# Why AWS Page Images
VITE_WHY_AWS_IMAGE=/images/why-aws/hero.jpg
VITE_JC_IMAGE=/images/why-aws/company-logo.jpg

# About Page Images
VITE_ABOUT_HERO_IMAGE=/images/about/hero.jpg
EOF

echo
echo "✅ Image configuration created in .env.local"
echo
echo "📁 Directory structure created:"
echo "   public/images/why-aws/"
echo "   public/images/about/"
echo "   public/images/about/team-photos/"
echo
echo "📸 Next steps:"
echo "   1. Add your images to the appropriate directories"
echo "   2. Restart your development server: npm run dev"
echo "   3. Visit /why-aws and /about pages to see your images"
echo
echo "📖 See IMAGE_SETUP.md for detailed instructions"
echo
