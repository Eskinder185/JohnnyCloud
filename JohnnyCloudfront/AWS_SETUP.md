# AWS API Configuration

This application connects directly to your AWS Lambda function for real-time metrics data.

## Configuration
To connect to real AWS data, you need to:

### 1. Deploy the Lambda Function
The `lambda/app.py` file contains the AWS API endpoints. Deploy this to AWS Lambda with the following permissions:
- `ce:GetCostAndUsage`
- `ce:GetCostForecast` 
- `ce:GetAnomalies`
- `guardduty:ListDetectors`
- `guardduty:ListFindings`
- `guardduty:GetFindings`
- `securityhub:GetFindings`
- `iam:GetAccountPasswordPolicy`
- `iam:ListUsers`
- `iam:ListMFADevices`
- `iam:ListAccessKeys`
- `iam:GetAccessKeyLastUsed`
- `ec2:DescribeSecurityGroups`
- `s3:ListBuckets`
- `s3:GetPublicAccessBlock`
- `s3:GetBucketPolicyStatus`

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```bash
# For Lambda Function URL
VITE_METRICS_API=https://your-lambda-function-url.lambda-url.region.on.aws

# For API Gateway
VITE_METRICS_API=https://your-api-id.execute-api.region.amazonaws.com/prod

# For local development
VITE_METRICS_API=http://localhost:3000
```

### 3. Available Endpoints
The API provides these endpoints:
- `GET /cost/summary` - Cost summary and top services
- `GET /cost/anomalies` - Cost anomaly detection
- `GET /security/guardduty` - GuardDuty findings
- `GET /security/hub` - Security Hub compliance
- `GET /security/iam` - IAM hygiene checks
- `GET /network/exposure` - Network security assessment

### 4. CORS Configuration
The Lambda function includes CORS headers. For production, set the `CORS_ORIGIN` environment variable to your domain.

## Development
- Run `npm run dev` to start the development server
- Set `VITE_METRICS_API` in your `.env` file to connect to your deployed Lambda function
- The Metrics page will show loading states and error messages if the API is not configured or unavailable
