import { sendChatOnce, sendChatStream, type ChatMode } from '@/lib/chatApi';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  audioUrl?: string;
}

export interface ChatResponse {
  message: string;
  audioUrl?: string;
}

export async function sendChat(message: string, mode?: string): Promise<ChatResponse> {
  try {
    const chatMode = (mode as ChatMode) || "bedrock";
    
    // Message will be sent directly to API
    
    // Try streaming first, fallback to regular request
    let response = "";
    try {
      for await (const chunk of sendChatStream({
        message,
        mode: chatMode,
        sessionId: crypto.randomUUID()
      })) {
        response += chunk;
      }
    } catch (streamError) {
      // Fallback to non-streaming
      response = await sendChatOnce({
        message,
        mode: chatMode,
        sessionId: crypto.randomUUID()
      });
    }
    
    return {
      message: response,
      audioUrl: undefined // Audio handled separately for Lex modes
    };
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}

// Fallback response for when API is not available
export function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase();
  
  if (input.includes('cost') || input.includes('spend') || input.includes('billing')) {
    return "I can help you analyze your AWS costs! Check the Metrics page for real-time cost data, anomaly detection, and optimization recommendations. Would you like me to explain any specific cost metrics?";
  }
  
  if (input.includes('security') || input.includes('guardduty') || input.includes('threat')) {
    return "Security is crucial! I monitor GuardDuty findings, IAM hygiene, and network exposure. The Metrics page shows your security posture with real-time findings. What security concerns do you have?";
  }
  
  if (input.includes('ec2') || input.includes('instance') || input.includes('server')) {
    return "EC2 instances are often the biggest cost drivers. I can help you identify unused instances, recommend Reserved Instances, or suggest right-sizing opportunities. Check the Metrics page for current EC2 costs.";
  }
  
  if (input.includes('s3') || input.includes('storage') || input.includes('bucket')) {
    return "S3 storage optimization can save significant costs! I monitor for public buckets, unused storage classes, and lifecycle policies. The Metrics page shows your S3 spending breakdown.";
  }
  
  if (input.includes('help') || input.includes('what can you do')) {
    return "I'm your AWS FinOps and SecOps assistant! I can help with:\n• Cost optimization and anomaly detection\n• Security monitoring and compliance\n• Infrastructure insights and recommendations\n• Real-time AWS data analysis\n\nWhat would you like to explore?";
  }
  
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return "Hello! I'm Johnny-5, your AWS assistant. I'm here to help you optimize costs, monitor security, and get insights into your cloud infrastructure. How can I assist you today?";
  }
  
  return "I understand you're asking about AWS infrastructure. I can help with cost optimization, security monitoring, and infrastructure insights. Could you be more specific about what you'd like to know? You can also check the Metrics page for real-time data.";
}
