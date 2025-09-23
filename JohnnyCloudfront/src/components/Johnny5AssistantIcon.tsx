import { useState, useEffect } from "react";
import { useGlobalChatbot } from "@/contexts/GlobalChatbotContext";

type AssistantStatus = "idle" | "listening" | "speaking";

export default function Johnny5AssistantIcon() {
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const { isOpen, toggleChatbot } = useGlobalChatbot();

  // Listen for wake word detection and chatbot state changes
  useEffect(() => {
    const handleWakeWordDetected = () => {
      setStatus("listening");
    };

    const handleChatbotActivated = () => {
      setStatus("speaking");
    };

    const handleChatbotClosed = () => {
      setStatus("idle");
    };

    // Listen for custom events from WakeWordListener
    window.addEventListener("wakeWordDetected", handleWakeWordDetected);
    window.addEventListener("chatbotActivated", handleChatbotActivated);
    window.addEventListener("chatbotClosed", handleChatbotClosed);

    // Also listen for chatbot state changes
    if (isOpen) {
      setStatus("speaking");
    } else {
      setStatus("idle");
    }

    return () => {
      window.removeEventListener("wakeWordDetected", handleWakeWordDetected);
      window.removeEventListener("chatbotActivated", handleChatbotActivated);
      window.removeEventListener("chatbotClosed", handleChatbotClosed);
    };
  }, [isOpen]);

  const getStatusLabel = () => {
    switch (status) {
      case "idle": return "Idle";
      case "listening": return "Listening...";
      case "speaking": return "Speaking...";
      default: return "Idle";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "idle": return "text-gray-400";
      case "listening": return "text-cyan-400";
      case "speaking": return "text-purple-400";
      default: return "text-gray-400";
    }
  };

  const getAnimationClass = () => {
    switch (status) {
      case "idle": return "opacity-50";
      case "listening": return "johnny5-listening text-cyan-400";
      case "speaking": return "johnny5-speaking text-purple-400";
      default: return "opacity-50";
    }
  };

  return (
    <button
      onClick={toggleChatbot}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all duration-300 ${getAnimationClass()}`}
      aria-label={`Johnny 5 assistant - ${getStatusLabel()}`}
      title={`Johnny 5 Assistant - ${getStatusLabel()}. Click to toggle hands-free mode.`}
    >
      {/* Johnny 5 Robot Icon */}
      <div className="relative">
        {/* Robot Head */}
        <div className={`w-8 h-8 ${getStatusColor()} transition-colors duration-300`}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            {/* Robot Head */}
            <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" opacity="0.8"/>
            {/* Eyes */}
            <circle cx="8" cy="10" r="1.5" fill="white"/>
            <circle cx="16" cy="10" r="1.5" fill="white"/>
            {/* Eye pupils */}
            <circle cx="8" cy="10" r="0.5" fill="currentColor"/>
            <circle cx="16" cy="10" r="0.5" fill="currentColor"/>
            {/* Mouth */}
            <rect x="10" y="14" width="4" height="1" rx="0.5" fill="white"/>
            {/* Antenna */}
            <line x1="12" y1="6" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="3" r="1" fill="currentColor"/>
          </svg>
        </div>
        
        {/* Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black transition-colors duration-300 ${
          status === "idle" ? "bg-gray-500" :
          status === "listening" ? "bg-cyan-400 animate-pulse" :
          "bg-purple-400 animate-pulse"
        }`} />
      </div>
    </button>
  );
}
