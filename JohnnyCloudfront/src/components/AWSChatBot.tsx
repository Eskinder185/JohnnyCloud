import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import JohnnyBot from '@/components/animation/JohnnyBot';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function AWSChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Johnny-5, your AWS assistant. I can help you with cost optimization, security monitoring, and infrastructure insights. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response (replace with actual AWS integration)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="p-8 min-h-[500px] flex flex-col">
      <div className="text-center mb-6">
        <JohnnyBot className="mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">How can I help?</h3>
        <p className="text-jc-dim text-sm">
          Ask me anything about your AWS infrastructure
        </p>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 bg-black/20 rounded-lg p-4 mb-4 space-y-3 min-h-[200px] max-h-[300px] overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'bot' ? 'bg-jc-cyan/20' : 'bg-jc-green/20'
            }`}>
              <span className={`text-xs font-bold ${
                message.sender === 'bot' ? 'text-jc-cyan' : 'text-jc-green'
              }`}>
                {message.sender === 'bot' ? 'J5' : 'U'}
              </span>
            </div>
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
              <div className={`rounded-lg p-3 ${
                message.sender === 'bot' ? 'bg-white/5' : 'bg-jc-cyan/10'
              }`}>
                <p className="text-sm whitespace-pre-line">{message.text}</p>
              </div>
              <div className={`text-xs text-jc-dim mt-1 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-jc-cyan/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-jc-cyan text-xs font-bold">J5</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-jc-cyan rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-jc-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-jc-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Johnny-5 anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 focus-glow text-white placeholder-jc-dim"
          disabled={isTyping}
        />
        <Button 
          onClick={handleSendMessage} 
          className="px-4"
          disabled={!inputText.trim() || isTyping}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>
    </Card>
  );
}