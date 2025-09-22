#!/bin/bash

echo "Setting up image environment variables..."

# Check if .env file exists
if [ -f .env ]; then
    echo ".env file already exists. Backing up to .env.backup..."
    cp .env .env.backup
fi

# Create .env file with image configuration
echo "Creating .env file with image paths..."

# Copy the existing env.example content and add image variables
cp env.example .env

# Add image configuration to .env file
cat >> .env << 'EOF'

# Image Configuration
# Why AWS Page Images
VITE_WHY_AWS_IMAGE=/images/why-aws/why-aws-hero-cloud-infrastructure.jpg
VITE_JC_IMAGE=/images/why-aws/johnnycloud-company-logo.jpg

# About Page Images
VITE_ABOUT_HERO_IMAGE=/images/about/about-hero-team-office.jpg
EOF

echo ""
echo "✅ .env file created with image configuration!"
echo ""
echo "Your images are configured as:"
echo "- Why AWS Hero: /images/why-aws/why-aws-hero-cloud-infrastructure.jpg"
echo "- About Hero: /images/about/about-hero-team-office.jpg"
echo ""
echo "⚠️  Note: You still need to add a company logo at:"
echo "   /images/why-aws/johnnycloud-company-logo.jpg"
echo ""
echo "🔄 Please restart your development server:"
echo "   npm run dev"
echo ""

# Make the script executable
chmod +x setup-env-images.sh

