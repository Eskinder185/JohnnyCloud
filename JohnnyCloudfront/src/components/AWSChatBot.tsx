import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import JohnnyBot from '@/components/animation/JohnnyBot';
import SpeakToggle from '@/components/chat/SpeakToggle';
import AudioControls from '@/components/chat/AudioControls';
import StopVoiceButton from '@/components/chat/StopVoiceButton';
import ClearChatButton from '@/components/chat/ClearChatButton';
import { 
  setSpeakEnabled,
  setSelectedVoice,
  type VoiceId 
} from '@/lib/settingsManager';
import { sendChat, type ChatMessage } from '@/lib/chatService';
import { audioManager } from '@/lib/audio/AudioManager';
import { useWebSpeech } from '@/hooks/useWebSpeech';
import { chatStore } from '@/lib/chatStore';
import { formatTimestamp } from '@/lib/dateUtils';

export default function AWSChatBot() {
  // Initialize from chat store
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const storedState = chatStore.getState();
    return storedState.messages;
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakEnabled, setSpeakEnabledState] = useState<boolean>(() => {
    const storedState = chatStore.getState();
    return storedState.speakEnabled;
  });
  const [selectedVoice, setSelectedVoiceState] = useState<VoiceId>(() => {
    const storedState = chatStore.getState();
    return storedState.selectedVoice as VoiceId;
  });
  const [audioError, setAudioError] = useState<string | null>(null);
  const [micErrorState, setMicErrorState] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Web Speech API hook
  const { 
    listening, 
    interimTranscript, 
    finalTranscript, 
    isSupported: micSupported,
    error: micError,
    startPushToTalk,
    stopPushToTalk
  } = useWebSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioManager.stop();
    };
  }, []);

  // Auto-dismiss audio error after 5 seconds
  useEffect(() => {
    if (audioError) {
      const timer = setTimeout(() => {
        setAudioError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [audioError]);

  // Auto-dismiss mic error after 5 seconds
  useEffect(() => {
    if (micErrorState) {
      const timer = setTimeout(() => {
        setMicErrorState(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [micErrorState]);

  // Handle mic errors from the hook
  useEffect(() => {
    if (micError) {
      setMicErrorState(micError);
      // Auto-dismiss mic errors after 5 seconds
      const timer = setTimeout(() => {
        setMicErrorState(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [micError]);

  // Handle final transcript from speech recognition
  useEffect(() => {
    if (finalTranscript) {
      setInputText(finalTranscript);
      // Auto-send the message
      handleSendMessage(finalTranscript);
    }
  }, [finalTranscript]);

  // Update input text with interim transcript
  useEffect(() => {
    if (listening && interimTranscript) {
      setInputText(interimTranscript);
    }
  }, [listening, interimTranscript]);

  // Optimized speak toggle handler - batch updates
  const handleSpeakToggle = useCallback((enabled: boolean) => {
    // Batch all state updates together
    setSpeakEnabledState(enabled);
    chatStore.setSpeakEnabled(enabled);
    // Only update settings localStorage once
    setSpeakEnabled(enabled);
  }, []);

  // Optimized voice change handler - batch updates
  const handleVoiceChange = useCallback((voice: VoiceId) => {
    // Batch all state updates together
    setSelectedVoiceState(voice);
    chatStore.setSelectedVoice(voice);
    // Only update settings localStorage once
    setSelectedVoice(voice);
  }, []);

  // Push-to-talk handlers
  const handleMicPress = () => {
    // Clear any previous mic errors and stop any playing audio
    setMicErrorState(null);
    audioManager.stop();
    startPushToTalk();
  };

  const handleMicRelease = () => {
    stopPushToTalk();
  };


  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim()) return;

    // Stop any currently playing audio when user sends new message
    audioManager.stop();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    chatStore.setMessages(newMessages);
    setInputText('');
    setIsTyping(true);
    setAudioError(null);

    try {
      // Determine if we should request audio based on speak toggle
      const shouldRequestAudio = speakEnabled;

      // Always use bedrock mode now
      const response = await sendChat(textToSend, shouldRequestAudio, selectedVoice);
      
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        audio: response.audio
      };

      const finalMessages = [...newMessages, botResponse];
      setMessages(finalMessages);
      chatStore.setMessages(finalMessages);
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing your request right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      const errorMessages = [...newMessages, errorResponse];
      setMessages(errorMessages);
      chatStore.setMessages(errorMessages);
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

  const handleClearChat = () => {
    chatStore.clear();
    setMessages(chatStore.getState().messages);
  };

  return (
    <Card className="p-8 min-h-[500px] flex flex-col">
      <div className="text-center mb-6">
        <JohnnyBot className="mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">How can I help?</h3>
        <p className="text-jc-dim text-sm mb-4">
          Ask me anything about your AWS infrastructure
        </p>
        <p className="text-jc-dim text-xs mb-4">
          💡 Hold the mic button to speak, release to send
        </p>
        
        {/* Direct Bedrock Mode Label */}
        <div className="bg-black/20 rounded-lg p-3 mb-4">
          <div className="text-xs text-jc-dim mb-2">Direct Bedrock via API</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SpeakToggle 
                speakEnabled={speakEnabled}
                onSpeakToggle={handleSpeakToggle}
                selectedVoice={selectedVoice}
                onVoiceChange={handleVoiceChange}
              />
              <StopVoiceButton />
            </div>
            <ClearChatButton 
              onClear={handleClearChat} 
              threadKey="johnnycloud_chat_v2" 
            />
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
                
                {/* New audio controls */}
                {message.audio && message.sender === 'bot' && (
                  <AudioControls 
                    audio={message.audio} 
                    onError={(error) => setAudioError(error)}
                  />
                )}
                
                {/* Legacy audio support - simplified */}
                {message.audioUrl && message.sender === 'bot' && !message.audio && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-jc-dim">Voice response available</span>
                  </div>
                )}
              </div>
              <div className={`text-xs text-jc-dim mt-1 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTimestamp(message.timestamp)}
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

      {/* Audio Error Toast */}
      {audioError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center justify-between">
          <span>{audioError}</span>
          <button
            onClick={() => setAudioError(null)}
            className="text-red-300 hover:text-red-200 ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Mic Error Toast */}
      {micErrorState && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center justify-between">
          <span>{micErrorState}</span>
          <button
            onClick={() => setMicErrorState(null)}
            className="text-red-300 hover:text-red-200 ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Chat Input */}
      <div className="flex gap-2">
        {/* Push-to-Talk Mic Button */}
        <button
          onMouseDown={handleMicPress}
          onMouseUp={handleMicRelease}
          onMouseLeave={handleMicRelease}
          onTouchStart={(e) => { e.preventDefault(); handleMicPress(); }}
          onTouchEnd={(e) => { e.preventDefault(); handleMicRelease(); }}
          onKeyDown={(e) => { 
            if (e.code === "Space" && !e.repeat) { 
              e.preventDefault(); 
              handleMicPress(); 
            } 
          }}
          onKeyUp={(e) => { 
            if (e.code === "Space") { 
              e.preventDefault(); 
              handleMicRelease(); 
            } 
          }}
          className={`px-3 py-2 rounded-lg transition-all duration-200 transform ${
            listening 
              ? 'bg-jc-cyan/20 text-jc-cyan scale-110 shadow-lg shadow-jc-cyan/50' 
              : 'bg-white/10 text-jc-dim hover:bg-white/20 hover:text-white hover:scale-105'
          }`}
          disabled={!micSupported || isTyping}
          title={listening ? "Release to send" : "Hold to speak"}
        >
          {listening ? (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-jc-cyan rounded-full animate-pulse"></div>
              <span className="text-xs">Listening...</span>
            </div>
          ) : (
            <span className="text-lg">🎙️</span>
          )}
        </button>
        
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={listening ? "Listening... Release to send" : "Ask Johnny-5 anything or hold mic to speak..."}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 focus-glow text-white placeholder-jc-dim"
          disabled={isTyping}
        />
        
        <Button 
          onClick={() => handleSendMessage()} 
          className="px-4"
          disabled={!inputText.trim() || isTyping}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </Button>
      </div>
      
      {/* Quick links */}
      <div className="mt-3 text-xs opacity-70">
        Quick links:{" "}
        <a href="/guardrails" className="underline hover:opacity-80">Guardrails</a>{" • "}
        <a href="/why-aws" className="underline hover:opacity-80">Why AWS</a>{" • "}
        <a href="/metrics" className="underline hover:opacity-80">Metrics</a>
      </div>
    </Card>
  );
}