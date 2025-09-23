# AWS Cognito Authentication Setup

## 1. AWS Console Setup

### Cognito User Pool
1. **Create User Pool**:
   - Go to Amazon Cognito → User Pools → Create user pool
   - Choose "Cognito user pool" → Configure sign-in experience
   - Sign-in options: Email
   - Configure security requirements (default is fine)
   - Configure sign-up experience (default is fine)
   - Configure message delivery (use Cognito default)
   - Integrate your app → App client name: `JohnnyCloudApp`
   - App client settings:
     - ✅ Public client (no secret)
     - ✅ Implicit grant (simple)
     - OAuth scopes: `openid`, `email`, `profile`
     - Callback URLs:
       - `http://localhost:5173/auth/callback`
       - `https://app.yourdomain.com/auth/callback`
     - Sign-out URLs:
       - `http://localhost:5173/`
       - `https://app.yourdomain.com/`
   - Review and create

2. **Note the values**:
   - User Pool ID: `us-east-1_xxxxx`
   - App Client ID: `xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Domain: `yourbrand.auth.us-east-1.amazoncognito.com`

### Cognito Identity Pool
1. **Create Identity Pool**:
   - Go to Amazon Cognito → Identity Pools → Create identity pool
   - Identity pool name: `JohnnyCloudIdentityPool`
   - ✅ Enable access to unauthenticated identities (optional)
   - Authentication providers → Cognito → Add your User Pool ID and App Client ID
   - Review and create

2. **Note the values**:
   - Identity Pool ID: `us-east-1:xxxx-xxxx-xxxx-xxxx`
   - Authenticated role ARN: `arn:aws:iam::account:role/Cognito_JohnnyCloudIdentityPoolAuth_Role`

### Lambda Function URL Protection
1. **Protect your Metrics Lambda**:
   - Go to Lambda → Your metrics function → Function URL
   - Edit → Auth type: `AWS_IAM`
   - CORS: Allow your app origins
   - Save

2. **Update IAM Policy**:
   - Go to IAM → Roles → Your Cognito authenticated role
   - Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "InvokeMetricsFnUrlOnly",
      "Effect": "Allow",
      "Action": "lambda:InvokeFunctionUrl",
      "Resource": [
        "arn:aws:lambda:<region>:<account-id>:function:<metrics-fn-name>",
        "arn:aws:lambda:<region>:<account-id>:function:<metrics-fn-name>:*"
      ],
      "Condition": { 
        "StringEquals": { 
          "lambda:FunctionUrlAuthType": "AWS_IAM" 
        } 
      }
    }
  ]
}
```

## 2. Environment Variables

Create/update your `.env` file:

```env
# AWS Configuration
VITE_AWS_REGION=us-east-1

# Cognito Configuration
VITE_COGNITO_DOMAIN=https://yourbrand.auth.us-east-1.amazoncognito.com
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxx-xxxx-xxxx-xxxx

# Redirect URLs
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_SIGNOUT_URI=http://localhost:5173/

# API Endpoints
VITE_METRICS_API=https://abc123.lambda-url.us-east-1.on.aws
VITE_CHAT_API=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/chat
```

## 3. Install Required Dependencies

```bash
npm install @aws-sdk/credential-providers aws4fetch
```

## 4. Test Checklist

### Authentication Flow
- [ ] Visit `/login` → "Continue with Cognito" opens Hosted UI
- [ ] After login, you land on `/metrics`
- [ ] Navbar shows "Sign out" when authenticated
- [ ] Navbar shows "Login" when not authenticated

### Protected Routes
- [ ] `/metrics` redirects to `/login` if not signed in
- [ ] Metrics calls succeed only when signed in
- [ ] Lambda Function URL requires AWS_IAM authentication

### Home Page
- [ ] "Sign in with Cognito" button works
- [ ] Redirects to Cognito Hosted UI

## 5. Production Setup

### Update Environment Variables
For production, update these in your `.env`:

```env
VITE_REDIRECT_URI=https://app.yourdomain.com/auth/callback
VITE_SIGNOUT_URI=https://app.yourdomain.com/
```

### HTTPS Setup
- Use AWS Lightsail, ALB, or CloudFront for TLS
- No CloudFront required for basic setup

## 6. Optional: User Info Display

To show "Signed in as user@email.com" in the header, you can decode the ID token:

```typescript
// Add to src/lib/auth.ts
export function getUserEmail(): string | null {
  const token = sessionStorage.getItem("ID_TOKEN");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || null;
  } catch {
    return null;
  }
}
```

## 7. Security Notes

- ✅ No API Gateway required (cost savings)
- ✅ Cognito MAU-based pricing only
- ✅ Lambda Function URLs with AWS_IAM auth
- ✅ SigV4 signed requests from browser
- ✅ No secrets in frontend code
- ✅ Session-based authentication (no persistent storage)

## 8. Troubleshooting

### Common Issues
1. **CORS errors**: Ensure Lambda Function URL CORS allows your domain
2. **403 Forbidden**: Check IAM policy on Cognito authenticated role
3. **Token expired**: Tokens expire after 1 hour by default
4. **Redirect issues**: Verify callback URLs in Cognito User Pool

### Debug Steps
1. Check browser console for errors
2. Verify environment variables are loaded
3. Check Cognito User Pool configuration
4. Verify Lambda Function URL auth type is AWS_IAM


















