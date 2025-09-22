# JohnnyCloud Local Development Guide

## 🚀 **Your App is Already Running!**

Based on the terminal output, your JohnnyCloud application is already running locally:

### **✅ Current Status:**
- **Development Server**: Running on `http://localhost:5173`
- **Environment File**: `.env` exists
- **Node.js Processes**: Active (2 processes running)

## 🌐 **Access Your Local Application:**

### **1. Open in Browser:**
```
http://localhost:5173
```

### **2. Available Pages:**
- **Home**: `http://localhost:5173/`
- **Metrics**: `http://localhost:5173/metrics`
- **Guardrails**: `http://localhost:5173/guardrails`
- **Why AWS**: `http://localhost:5173/why-aws`
- **About**: `http://localhost:5173/about`
- **FAQ**: `http://localhost:5173/faq`
- **Login**: `http://localhost:5173/login`

## 🔧 **Environment Setup:**

### **1. Check Your .env File:**
Make sure your `.env` file contains these essential variables:

```bash
# AWS API Base Configuration
VITE_API_BASE=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com

# AWS Cognito Configuration
VITE_COGNITO_DOMAIN=https://us-east-1csm5oddde.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=4oc76981p9te4uegc85r0mnjg7
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_SIGNOUT_URI=http://localhost:5173/

# Image Configuration
VITE_WHY_AWS_IMAGE=/images/whyawss.jpg
VITE_ABOUT_HERO_IMAGE=/images/finsecop.jpg
VITE_JC_IMAGE=/images/johnny5_login.png
```

### **2. Key Differences for Local Development:**
- **Redirect URI**: Should be `http://localhost:5173/auth/callback` (not CloudFront URL)
- **Signout URI**: Should be `http://localhost:5173/` (not CloudFront URL)

## 🛠️ **Development Commands:**

### **Start Development Server:**
```bash
npm run dev
```

### **Build for Production:**
```bash
npm run build
```

### **Preview Production Build:**
```bash
npm run preview
```

### **Install Dependencies:**
```bash
npm install
```

## 🧪 **Testing Your Local Setup:**

### **1. Check Console Logs:**
Open browser DevTools (F12) and look for:
```
🖼️ Why AWS Image Path: /images/whyawss.jpg
🖼️ About Page Image Path: /images/finsecop.jpg
🌊 useMetricsSignal: Starting with APIs: {...}
🌊 Background signal updated: {...}
```

### **2. Test Features:**
- **✅ Images**: Should load on Why AWS and About pages
- **✅ Background**: Animated waves should be visible
- **✅ Voice Assistant**: Should work on Guardrails and Why AWS pages
- **✅ Navigation**: All pages should load without errors

### **3. Test API Connections:**
- **Metrics API**: Should attempt to connect to your AWS endpoints
- **Guardrails API**: May show 500 errors (backend issue, not frontend)
- **Chat API**: Should work with Bedrock integration

## 🔍 **Troubleshooting:**

### **Issue 1: Images Not Loading**
**Solution**: Check that images exist in `public/images/`:
```bash
ls public/images/
```

### **Issue 2: API Errors**
**Expected**: You may see CORS or 500 errors - this is normal for local development
**Solution**: The app is designed to work even with API failures

### **Issue 3: Authentication Issues**
**Solution**: Make sure your `.env` has the correct Cognito configuration

### **Issue 4: Port Already in Use**
**Solution**: The app will automatically try port 5174 if 5173 is busy

## 📱 **Local Development Features:**

### **✅ What Works Locally:**
- **Frontend UI**: All pages and components
- **Image Loading**: Local images from `public/images/`
- **Background Animation**: Live background system
- **Voice Assistant**: Speech-to-text and text-to-speech
- **Navigation**: All routing and page transitions
- **Responsive Design**: Mobile and desktop layouts

### **⚠️ What Requires Backend:**
- **Real API Data**: Metrics, guardrails, chat responses
- **Authentication**: Login/logout functionality
- **Live Data**: Cost and security metrics

## 🎯 **Quick Start Checklist:**

- **✅ Development server running** on `http://localhost:5173`
- **✅ .env file exists** with proper configuration
- **✅ Images available** in `public/images/`
- **✅ Dependencies installed** (`npm install` completed)
- **✅ Browser access** to local application

## 🚀 **Next Steps:**

1. **Open your browser** to `http://localhost:5173`
2. **Test the navigation** between different pages
3. **Check the console** for any errors or debug logs
4. **Test the voice assistant** on Guardrails and Why AWS pages
5. **Verify images load** on Why AWS and About pages

## 🎉 **You're All Set!**

Your JohnnyCloud application is running locally and ready for development! The frontend is fully functional, and you can test all the UI features, animations, and interactions. Any API-related issues are expected since you're running locally, but the application is designed to handle these gracefully.

**Happy coding!** 🚀✨



