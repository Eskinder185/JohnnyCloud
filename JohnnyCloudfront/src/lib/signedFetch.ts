import { AwsClient } from "aws4fetch";

export async function signedFetch(url: string, creds: any, init: RequestInit = {}) {
  const region = import.meta.env.VITE_AWS_REGION;
  const aws = new AwsClient({ 
    accessKeyId: creds.accessKeyId, 
    secretAccessKey: creds.secretAccessKey, 
    sessionToken: creds.sessionToken, 
    region, 
    service: "lambda" 
  });
  return aws.fetch(url, { 
    method: init.method || "GET", 
    headers: init.headers, 
    body: init.body 
  });
}

