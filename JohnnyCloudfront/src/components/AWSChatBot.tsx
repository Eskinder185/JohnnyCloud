import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import JohnnyBot from '@/components/animation/JohnnyBot';
import ModeToggle from '@/components/chat/ModeToggle';
import { getAssistantMode, setAssistantMode, type AssistantMode } from '@/lib/settings';
import { sendChat, getFallbackResponse, type ChatMessage } from '@/lib/chatService';

export default function AWSChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm Johnny-5, your AWS assistant. I can help you with cost optimization, security monitoring, and infrastructure insights. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [assistantMode, setAssistantModeState] = useState<AssistantMode>(getAssistantMode());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mode change handler with persistence
  const changeMode = (mode: AssistantMode) => {
    setAssistantModeState(mode);
    setAssistantMode(mode); // persist choice
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(console.error);
      setIsPlayingAudio(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      let botResponseText: string;
      let audioUrl: string | undefined;

      switch (assistantMode) {
        case 'bedrock':
          // Direct Bedrock integration via API
          try {
            const response = await sendChat(currentInput, 'bedrock');
            botResponseText = response.message;
            audioUrl = response.audioUrl;
          } catch (error) {
            console.error('Chat API error:', error);
            botResponseText = getFallbackResponse(currentInput);
          }
          break;
          
        case 'lex':
          // Lex + Bedrock (text only)
          try {
            const response = await sendChat(currentInput, 'lex');
            botResponseText = response.message;
          } catch (error) {
            console.error('Lex API error:', error);
            botResponseText = getFallbackResponse(currentInput);
          }
          break;
          
        case 'lex+voice':
          // Lex + Bedrock + Polly (voice)
          try {
            const response = await sendChat(currentInput, 'lex+voice');
            botResponseText = response.message;
            audioUrl = response.audioUrl;
          } catch (error) {
            console.error('Lex+Voice API error:', error);
            botResponseText = getFallbackResponse(currentInput);
          }
          break;
          
        default:
          botResponseText = getFallbackResponse(currentInput);
      }

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        audioUrl
      };

      setMessages(prev => [...prev, botResponse]);
      
      // Auto-play audio if available
      if (audioUrl && assistantMode === 'lex+voice') {
        setTimeout(() => playAudio(audioUrl), 500);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
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
        <p className="text-jc-dim text-sm mb-4">
          Ask me anything about your AWS infrastructure
        </p>
        
        {/* Assistant Mode Switch */}
        <div className="bg-black/20 rounded-lg p-3 mb-4">
          <div className="text-xs text-jc-dim mb-2">Assistant Mode</div>
          <ModeToggle mode={assistantMode} onChange={changeMode} />
          <div className="text-xs text-jc-dim mt-2">
            {assistantMode === 'bedrock' && 'Direct Bedrock integration via API'}
            {assistantMode === 'lex' && 'Lex recognizes intent, Bedrock generates response'}
            {assistantMode === 'lex+voice' && 'Lex + Bedrock + voice synthesis'}
          </div>
        </div>
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
                {message.audioUrl && message.sender === 'bot' && (
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => isPlayingAudio ? stopAudio() : playAudio(message.audioUrl!)}
                      className="flex items-center gap-1 px-2 py-1 bg-jc-cyan/20 text-jc-cyan rounded text-xs hover:bg-jc-cyan/30 transition-colors"
                    >
                      {isPlayingAudio ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                          Stop
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Play
                        </>
                      )}
                    </button>
                    <span className="text-xs text-jc-dim">Voice response</span>
                  </div>
                )}
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
      
      {/* Hidden audio element for voice playback */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
        onError={() => setIsPlayingAudio(false)}
      />
    </Card>
  );
}