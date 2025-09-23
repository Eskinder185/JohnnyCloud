import { useState, useEffect, useRef } from "react";
import { X, MessageSquare } from "lucide-react";
import { useGlobalChatbot } from "@/contexts/GlobalChatbotContext";
import { useCurrentPage } from "@/hooks/useCurrentPage";
import AskJohnnyCloudVoice from "@/components/AskJohnnyCloudVoice";

interface GlobalChatbotPanelProps {
  currentPage?: string;
  currentContext?: Record<string, any>;
}

export default function GlobalChatbotPanel({ 
  currentPage: propCurrentPage, 
  currentContext: propCurrentContext 
}: GlobalChatbotPanelProps) {
  const { isOpen, closeChatbot, isActivated } = useGlobalChatbot();
  const { pageName, pageContext } = useCurrentPage();
  const [messages, setMessages] = useState<Array<{ id: string; type: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use prop values if provided, otherwise use current page context
  const currentPage = propCurrentPage || pageName;
  const currentContext = propCurrentContext || pageContext;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message when activated
  useEffect(() => {
    if (isActivated && isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'assistant' as const,
        content: "Hello! I'm Johnny-5, your AWS cloud assistant. I heard you call my name! How can I help you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isActivated, isOpen, messages.length]);

  // Handle message from voice component
  const handleMessageSent = (question: string, answer: string) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user' as const,
      content: question,
      timestamp: new Date()
    };
    
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant' as const,
      content: answer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, assistantMessage]);
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeChatbot}
      />
      
      {/* Chatbot Panel */}
      <div className={`relative bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-full max-w-2xl h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Johnny-5 Assistant</h3>
              <p className="text-xs text-white/60">
                {isActivated ? "Activated by voice" : "Global chatbot"}
                {currentPage !== "global" && ` • ${currentPage}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? "□" : "—"}
            </button>
            <button
              onClick={closeChatbot}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <p className="text-sm" data-chat-msg>{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <AskJohnnyCloudVoice
                    askEndpoint={import.meta.env.VITE_CHAT_API || `${import.meta.env.VITE_API_BASE}/chat`}
                    context={{ 
                      global: true,
                      ...currentContext 
                    }}
                    onSent={handleMessageSent}
                  />
                </div>
                
                <button
                  onClick={clearMessages}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Clear messages"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-white/5">
              <p className="text-xs text-white/50 text-center">
                Say "Johnny 5" to activate • Press Ctrl+M to toggle hands-free mode
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
