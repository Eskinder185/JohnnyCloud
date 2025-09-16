# AWS Setup for Lex + Bedrock + Polly Integration

## 0) AWS Console Setup

### Bedrock Access
1. In your AWS account/region, enable access to your chosen model(s):
   - `anthropic.claude-3-haiku-20240307-v1:0` (recommended)
   - Or `amazon.titan-text-express-v1`

### Lambda Function: `lex-bedrock-fulfillment`
1. **Create Lambda function** (Python 3.11)
2. **Attach IAM policy** (see below)
3. **Set environment variables**:
   ```
   BEDROCK_MODEL_ID=anthropic.claude-3-haiku-20240307-v1:0
   SYSTEM_PROMPT="You are JohnnyCloud, an AWS cost & security assistant. Help users with AWS FinOps and SecOps questions. Be concise, helpful, and focus on cost optimization, security monitoring, and infrastructure insights."
   ```

### Lex V2 Bot: `JohnnyCloudAssistant`
1. **Create Lex V2 bot**:
   - Locale: `en_US`
   - Add 1 intent: `Assist`
   - Sample utterances:
     - "help"
     - "what's going on"
     - "explain this cost spike"
     - "show me security issues"
     - "how can I save money"
     - "what are my biggest costs"
   
2. **Configure fulfillment**:
   - Enable Lambda fulfillment
   - Select `lex-bedrock-fulfillment` function
   
3. **Build and deploy**:
   - Build the bot
   - Create alias: `prod`

## IAM Policy for Lambda

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": "arn:aws:bedrock:*:*:model/anthropic.claude-3-haiku-20240307-v1:0"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

## Frontend Integration

The frontend now includes:

### Assistant Mode Switch
- **Text (Bedrock)**: Direct Bedrock integration (current behavior)
- **Lex → Bedrock**: Lex recognizes intent/slots; Lambda uses Bedrock to answer
- **Lex → Bedrock + Polly**: Same as above + Polly speaks the reply

### Features Added
1. **Mode Selection**: Toggle between different AI processing modes
2. **Voice Responses**: Audio playback for Polly-generated speech
3. **Audio Controls**: Play/stop buttons for voice messages
4. **Error Handling**: Graceful fallbacks for service failures

### Required AWS SDK Integration
To complete the integration, you'll need to:

1. **Install AWS SDK**:
   ```bash
   npm install @aws-sdk/client-lex-runtime-v2 @aws-sdk/client-polly
   ```

2. **Configure Cognito Identity Pool** for authentication

3. **Update the service functions** in `AWSChatBot.tsx`:
   - Replace simulated `callLexRecognizeText` with actual Lex V2 SDK calls
   - Replace simulated `synthesizeSpeech` with actual Polly SDK calls

### Environment Variables
Add to your `.env` file:
```
VITE_LEX_BOT_ID=your-lex-bot-id
VITE_LEX_BOT_ALIAS=prod
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
```

## Usage

1. **Select Mode**: Choose your preferred assistant mode
2. **Ask Questions**: Type your AWS-related questions
3. **Voice Mode**: In "Lex → Bedrock + Polly" mode, responses will be spoken automatically
4. **Audio Controls**: Use play/stop buttons to control voice playback

## Benefits

- **Intent Recognition**: Lex understands user intent and context
- **Natural Language**: Better conversation flow with slot filling
- **Voice Interface**: Hands-free interaction with Polly speech synthesis
- **Scalable**: Uses AWS managed services for reliability
- **Cost Effective**: Pay only for what you use

