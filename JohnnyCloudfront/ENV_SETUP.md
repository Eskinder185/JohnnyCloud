# Environment Setup Instructions

## Create .env file

Create a `.env` file in your project root with the following content:

```env
# AWS Metrics API Configuration
# Set this to your deployed Lambda function URL or API Gateway endpoint
VITE_METRICS_API=https://your-lambda-function-url.lambda-url.region.on.aws

# Chat API Configuration
VITE_CHAT_API=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/chat

# Example for local development with SAM/Serverless
# VITE_METRICS_API=http://localhost:3000

# Example for API Gateway
# VITE_METRICS_API=https://your-api-id.execute-api.region.amazonaws.com/prod
```

## Alternative: Update env.example

You can also update your existing `env.example` file to include the chat API:

```env
# AWS Metrics API Configuration
# Set this to your deployed Lambda function URL or API Gateway endpoint
VITE_METRICS_API=https://your-lambda-function-url.lambda-url.region.on.aws

# Chat API Configuration
VITE_CHAT_API=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/chat

# Example for local development with SAM/Serverless
# VITE_METRICS_API=http://localhost:3000

# Example for API Gateway
# VITE_METRICS_API=https://your-api-id.execute-api.region.amazonaws.com/prod
```

Then copy it to `.env`:
```bash
cp env.example .env
```

## Restart Development Server

After creating/updating the `.env` file, restart your development server:

```bash
npm run dev
# or
yarn dev
```

This will ensure the new environment variables are loaded.

