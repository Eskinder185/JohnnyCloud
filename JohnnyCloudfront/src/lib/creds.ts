import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

export async function getAwsCreds(idToken: string) {
  const region = import.meta.env.VITE_AWS_REGION;
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;
  const providerKey = `cognito-idp.${region}.amazonaws.com/${userPoolId}`;
  const provider = fromCognitoIdentityPool({ 
    identityPoolId, 
    logins: { [providerKey]: idToken }, 
    clientConfig: { region } 
  });
  return await provider();
}

