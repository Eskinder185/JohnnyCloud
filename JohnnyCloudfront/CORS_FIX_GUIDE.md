# CORS Fix Guide for JohnnyCloud APIs

## Problem
The APIs are returning HTML error pages instead of JSON when called from the browser, causing "Unexpected token '<'" errors.

## Root Cause
API Gateway CORS configuration is not properly set up to allow requests from the local development server.

## Solution

### 1. Fix API Gateway CORS Configuration

In your AWS API Gateway console:

1. **Go to your API Gateway**
   - Navigate to: `https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com`

2. **Enable CORS for each resource:**
   - Select your API
   - Go to Resources
   - For each resource (`/metrics`, `/guardrails`, `/chat`):
     - Select the resource
     - Click "Actions" → "Enable CORS"
     - Configure CORS settings:
       ```
       Access-Control-Allow-Origin: *
       Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
       Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
       ```
     - Click "Enable CORS and replace existing CORS headers"

3. **Deploy the API:**
   - Go to Actions → Deploy API
   - Select your stage (e.g., "prod" or "default")
   - Click "Deploy"

### 2. Alternative: Use a Proxy Server

If you can't modify the API Gateway CORS settings, you can use a proxy server for local development:

1. **Install cors-anywhere:**
   ```bash
   npm install -g cors-anywhere
   ```

2. **Start the proxy server:**
   ```bash
   cors-anywhere
   ```

3. **Update your .env file:**
   ```
   VITE_API_BASE=http://localhost:8080/https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com
   ```

### 3. Test the Fix

1. **Open the test file:**
   - Open `test-api.html` in your browser
   - Click "Test Guardrails API" and "Test Metrics API"
   - Check the console for detailed response information

2. **Check the Network tab:**
   - Open DevTools → Network tab
   - Look for the API requests
   - Verify they return JSON instead of HTML

### 4. Expected Results

After fixing CORS:
- APIs should return JSON responses
- No more "Unexpected token '<'" errors
- Background animation should work with real data
- Guardrails page should load properly

### 5. Troubleshooting

If you still see HTML responses:
1. Check if the API Gateway is deployed to the correct stage
2. Verify the CORS headers are set correctly
3. Try using a different browser or incognito mode
4. Check if there are any API Gateway authorizers blocking the requests

## Quick Test Commands

```bash
# Test from command line (should work)
curl -X GET "https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/guardrails/summary?framework=CIS"

# Test from browser (should work after CORS fix)
# Open test-api.html in browser and click the test buttons
```