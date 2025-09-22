# Voice and Speech Recognition Setup Instructions

## Issues Fixed

### 1. Speech Recognition "no-speech" Error
- **Problem**: The Web Speech API was throwing "no-speech" errors when no speech was detected within the default timeout
- **Solution**: 
  - Added comprehensive error handling with user-friendly messages
  - Implemented a 10-second timeout to prevent indefinite listening
  - Added automatic error dismissal after 5 seconds
  - Improved error messages for different speech recognition error types

### 2. Environment Configuration Missing
- **Problem**: No `.env` file existed, causing missing environment variables
- **Solution**: Created comprehensive environment variable setup instructions

## Environment Variables Setup

You need to create a `.env.local` file in your project root with the following variables:

```bash
# AWS Metrics API Configuration
VITE_METRICS_API=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/metrics

# AWS Cognito Configuration
VITE_COGNITO_DOMAIN=https://us-east-1csm5oddde.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=4oc76981p9te4uegc85r0mnjg7
VITE_REDIRECT_URI=https://d1zhi8uis2cnfs.cloudfront.net/auth/callback
VITE_SIGNOUT_URI=https://d1zhi8uis2cnfs.cloudfront.net/

# AWS Lex Configuration (for mic button functionality)
VITE_AWS_REGION=us-east-1
VITE_LEX_BOT_ID=your-bot-id
VITE_LEX_BOT_ALIAS_ID=your-alias-id
VITE_LEX_LOCALE_ID=en_US

# Support & Slack
VITE_SUPPORT_EMAIL=eskewabe185@gmail.com
VITE_SLACK_CONTACTS=neofredy.tapia@gmail.com,cvhiregoudra16@gmail.com,rcanger@gmail.com,hammadikhan123@gmail.com
VITE_SLACK_JOIN_URL=

# Chat API Configuration
VITE_CHAT_API=https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/chat

# AWS Identity Pool for STS credentials (needed for Lex/Bedrock)
VITE_AWS_REGION=us-east-1
VITE_IDENTITY_POOL_ID=<your-identity-pool-id>
```

## Required AWS Resources

### 1. AWS Identity Pool
You need to set up an AWS Identity Pool (Cognito Identity Pool) to get the `VITE_IDENTITY_POOL_ID`:

1. Go to AWS Cognito Console
2. Create an Identity Pool
3. Configure it for unauthenticated access
4. Set up IAM roles with permissions for:
   - Amazon Bedrock (for text-to-speech)
   - Amazon Lex (if using Lex integration)
   - Any other AWS services your chat API uses

### 2. AWS Lex Bot (Optional)
If you want to use Lex integration:
1. Create a Lex bot in the AWS Console
2. Set up the bot with appropriate intents
3. Update `VITE_LEX_BOT_ID` and `VITE_LEX_BOT_ALIAS_ID`

## How to Create the Environment File

### Option 1: Using Command Line
```bash
# Navigate to your project directory
cd C:\Users\eskew\github\JohnnyCloud\JohnnyCloudfront

# Create the .env.local file
copy env.example .env.local

# Then edit .env.local with your actual values
```

### Option 2: Using File Explorer
1. Navigate to your project directory
2. Copy `env.example` and rename it to `.env.local`
3. Edit `.env.local` with a text editor
4. Replace placeholder values with your actual AWS resource IDs

## Voice Features

### Speech Recognition (Speech-to-Text)
- Uses the browser's Web Speech API
- Supports continuous listening with interim results
- Handles various error conditions gracefully
- Auto-timeout after 10 seconds of no speech
- Clear visual feedback during listening

### Voice Synthesis (Text-to-Speech)
- Uses AWS Bedrock Polly for high-quality voice synthesis
- Supports multiple voice options: Joanna, Matthew, Ivy, Salli, Justin
- Audio controls for play/pause/replay
- Handles autoplay restrictions gracefully

## Testing the Features

### 1. Test Speech Recognition
1. Click the microphone button (🎙️) in the chat interface
2. Speak clearly into your microphone
3. The speech should be transcribed and appear in the input field
4. If you get "no-speech" errors, try:
   - Speaking louder
   - Moving closer to the microphone
   - Checking microphone permissions in your browser

### 2. Test Voice Synthesis
1. Enable "Speak reply" toggle in the chat interface
2. Select a voice from the dropdown
3. Send a message to the bot
4. The bot's response should be read aloud
5. Use the audio controls to play/pause/replay the audio

## Browser Compatibility

### Speech Recognition
- **Chrome**: Full support
- **Edge**: Full support  
- **Safari**: Limited support
- **Firefox**: Not supported

### Voice Synthesis
- Works in all modern browsers via AWS Bedrock Polly

## Troubleshooting

### Common Issues

1. **"Microphone not supported"**
   - Use Chrome or Edge browser
   - Ensure you're using HTTPS (required for microphone access)

2. **"No speech detected"**
   - Check microphone permissions
   - Speak clearly and wait for the timeout
   - Try refreshing the page

3. **Voice synthesis not working**
   - Check your AWS Identity Pool configuration
   - Ensure your IAM role has Bedrock permissions
   - Verify the chat API is returning audio data

4. **Environment variables not loading**
   - Restart your development server after creating `.env.local`
   - Ensure the file is in the project root directory
   - Check that variable names start with `VITE_`

## Security Notes

- Never commit `.env.local` to version control
- Use IAM roles with minimal required permissions
- Consider using AWS IAM roles for service accounts in production
- Regularly rotate AWS credentials

## Next Steps

1. Create the `.env.local` file with your AWS resource IDs
2. Restart your development server
3. Test both speech recognition and voice synthesis
4. Configure AWS Identity Pool with appropriate permissions
5. Set up Lex bot if needed for advanced voice interactions



