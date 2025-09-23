import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '4oc76981p9te4uegc85r0mnjg7',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN || 'https://us-east-1csm5oddde.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [import.meta.env.VITE_REDIRECT_URI || 'https://d1zhi8uis2cnfs.cloudfront.net/auth/callback'],
          redirectSignOut: [import.meta.env.VITE_SIGNOUT_URI || 'https://d1zhi8uis2cnfs.cloudfront.net/'],
          responseType: 'code' as const,
          pkce: true
        }
      }
    }
  }
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
