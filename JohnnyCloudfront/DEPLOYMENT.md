# AWS Backend Deployment Guide

## Overview
This guide will help you deploy the AWS Lambda backend for JohnnyCloud with minimal cost and maximum security.

## Architecture
- **Lambda Function**: Python 3.11 with Function URL (no API Gateway charges)
- **Cost**: Pay-per-request only (~$0.20 per 1M requests)
- **Security**: Least-privilege IAM policy for read-only access
- **Data**: On-demand AWS API calls (no constant polling)

## Step 1: Create IAM Role

1. Go to AWS IAM Console → Roles → Create Role
2. Select "AWS Service" → "Lambda"
3. Attach the policy from `infra/policy-min.json`
4. Name the role: `JohnnyCloud-Lambda-Role`

## Step 2: Create Lambda Function

1. Go to AWS Lambda Console → Create Function
2. **Function name**: `johnnycloud-metrics`
3. **Runtime**: Python 3.11
4. **Architecture**: x86_64
5. **Execution role**: Use existing role → Select `JohnnyCloud-Lambda-Role`

## Step 3: Upload Code

1. Create a ZIP file with `lambda/app.py`
2. In Lambda console → Upload from → .zip file
3. Upload the ZIP file

## Step 4: Configure Function URL

1. In Lambda console → Configuration → Function URL
2. **Auth type**: NONE (for development)
3. **CORS**: 
   - Allow origins: `*` (or your domain)
   - Allow methods: `GET, OPTIONS`
   - Allow headers: `*`
4. **Use default execution role**: Yes
5. Click "Save"

## Step 5: Test the Function

1. Copy the Function URL from the console
2. Test endpoints:
   - `{URL}/cost/summary`
   - `{URL}/security/guardduty`
   - `{URL}/network/exposure`

## Step 6: Configure Frontend

1. Create `.env` file in your project root:
   ```env
   VITE_AWS_API_URL=https://your-lambda-function-url.lambda-url.region.on.aws/
   ```

2. Restart your development server:
   ```bash
   npm run dev
   ```

## Cost Optimization

### Current Setup (Minimal Cost)
- **Lambda**: $0.20 per 1M requests
- **Function URL**: $0.60 per 1M requests
- **AWS API calls**: Free (Cost Explorer, GuardDuty, etc.)
- **Total**: ~$0.80 per 1M requests

### Optional: Caching with S3
If you want to reduce API calls, add an EventBridge schedule:

1. Create EventBridge rule: `johnnycloud-schedule`
2. **Schedule**: `rate(8 hours)` (3x per day)
3. **Target**: Lambda function `johnnycloud-metrics`
4. **Input**: `{"path": "/cache"}`

This will cache Cost Explorer data in S3, reducing real-time API calls.

## Security Notes

### Development
- Function URL auth: NONE
- CORS: Allow all origins
- IAM policy: Read-only access only

### Production
- Function URL auth: AWS_IAM
- CORS: Restrict to your domain
- Add API key or JWT validation
- Enable CloudTrail logging

## Troubleshooting

### Common Issues

1. **"Access Denied" errors**
   - Check IAM policy is attached correctly
   - Verify Cost Explorer is enabled in your account

2. **"GuardDuty not enabled"**
   - This is normal if GuardDuty isn't set up
   - The function will return `{"enabled": false}`

3. **"Security Hub not enabled"**
   - This is normal if Security Hub isn't set up
   - The function will return `{"enabled": false}`

4. **CORS errors**
   - Check Function URL CORS settings
   - Ensure your domain is allowed

### Monitoring

1. **CloudWatch Logs**: Check `/aws/lambda/johnnycloud-metrics`
2. **CloudWatch Metrics**: Monitor invocations, errors, duration
3. **Cost**: Check AWS Cost Explorer for Lambda charges

## API Endpoints

| Endpoint | Description | Data Source |
|----------|-------------|-------------|
| `/cost/summary` | MTD spend, forecast, top services | Cost Explorer |
| `/cost/anomalies` | Cost anomaly detection | Cost Explorer |
| `/security/guardduty` | Security findings (7 days) | GuardDuty |
| `/security/hub` | Failed compliance controls | Security Hub |
| `/security/iam` | IAM hygiene (MFA, old keys) | IAM |
| `/network/exposure` | Open security groups, public S3 | EC2, S3 |

## Next Steps

1. **Enable AWS Services**: Turn on Cost Explorer, GuardDuty, Security Hub
2. **Set up Budgets**: Create cost budgets for alerts
3. **Configure Anomaly Detection**: Enable Cost Anomaly Detection
4. **Add Monitoring**: Set up CloudWatch alarms for Lambda errors
5. **Security Hardening**: Switch to AWS_IAM auth for production
