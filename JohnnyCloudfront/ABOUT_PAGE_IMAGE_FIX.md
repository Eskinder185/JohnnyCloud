# About Page Image Fix

## 🔍 **Issue Identified**

The About page is showing a placeholder box instead of the actual hero image because:

1. **Missing Environment Variable**: `VITE_ABOUT_HERO_IMAGE` is not set in the `.env` file
2. **Fallback Image**: The code falls back to an Unsplash image when the environment variable is missing
3. **Image File Exists**: The actual image `about-hero-team-office.jpg` exists in `public/images/about/`

## 📁 **Current File Structure**

```
public/images/about/
├── about-hero-team-office.jpg ✅ (219KB - exists)
├── README.md
└── team-photos/
    ├── chandramati-hiregoudra-developer.jpg
    ├── eskinder-kassahun-developer.jpg
    ├── fredy-tapia-project-manager.jpg
    └── README.md
```

## 🔧 **Solution**

### **Step 1: Add Environment Variable**

Add this line to your `.env` file:

```bash
VITE_ABOUT_HERO_IMAGE=/images/about/about-hero-team-office.jpg
```

### **Step 2: Restart Development Server**

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## 📋 **Complete .env Configuration**

Your `.env` file should include:

```bash
# AWS Metrics API Configuration
VITE_METRICS_API=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/metrics

# AWS Cognito Configuration
VITE_COGNITO_DOMAIN=https://us-east-1csm5oddde.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=4oc76981p9te4uegc85r0mnjg7
VITE_REDIRECT_URI=https://d1zhi8uis2cnfs.cloudfront.net/auth/callback
VITE_SIGNOUT_URI=https://d1zhi8uis2cnfs.cloudfront.net/

# AWS Lex Configuration (for mic button functionality)
VITE_AWS_REGION=us-east-1
VITE_LEX_BOT_ID=your-bot-id
VITE_LEX_BOT_ALIAS_ID=your-alias-id
VITE_LEX_LOCALE_ID=en_US

# Support & Slack
VITE_SUPPORT_EMAIL=eskewabe185@gmail.com
VITE_SLACK_CONTACTS=neofredy.tapia@gmail.com,cvhiregoudra16@gmail.com,rcanger@gmail.com,hammadikhan123@gmail.com
VITE_SLACK_JOIN_URL=

# Chat API Configuration
VITE_CHAT_API=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/chat

# Guardrails API Configuration
VITE_GUARDRAILS_API=https://<your-api>/guardrails

# Timeline API Configuration (optional)
VITE_TIMELINE_API=https://<your-api>/timeline

# Image Configuration
VITE_ABOUT_HERO_IMAGE=/images/about/about-hero-team-office.jpg
```

## 🎯 **How It Works**

### **Current Code in About.tsx:**

```typescript
const HERO =
  (import.meta.env.VITE_ABOUT_HERO_IMAGE as string) ||
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?q=80&w=1400";
```

### **What Happens:**

1. **With Environment Variable**: Uses `/images/about/about-hero-team-office.jpg`
2. **Without Environment Variable**: Falls back to Unsplash image
3. **Image Loading**: Vite serves static files from `public/` directory

## ✅ **Expected Result**

After adding the environment variable and restarting the server:

- ✅ About page will show the actual team office image
- ✅ Image will be properly sized and styled
- ✅ No more placeholder box
- ✅ Professional appearance

## 🚨 **Important Notes**

1. **Restart Required**: Environment variables are only loaded when the dev server starts
2. **File Path**: Use `/images/about/about-hero-team-office.jpg` (starts with `/`)
3. **File Exists**: The image file is confirmed to exist (219KB)
4. **Build Process**: This will also work in production builds

## 🔄 **Alternative Solutions**

If you prefer to use a different image:

1. **Replace the file**: Put your new image at `public/images/about/about-hero-team-office.jpg`
2. **Change the path**: Update `VITE_ABOUT_HERO_IMAGE` to point to a different image
3. **Use external URL**: Set `VITE_ABOUT_HERO_IMAGE` to a full URL

The fix is simple - just add the environment variable and restart your development server!

