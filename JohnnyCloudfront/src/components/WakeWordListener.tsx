import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import WakeWordNotification from "./WakeWordNotification";

interface WakeWordListenerProps {
  onWakeWordDetected: () => void;
  onChatbotActivated: () => void;
}

export default function WakeWordListener({ 
  onWakeWordDetected, 
  onChatbotActivated 
}: WakeWordListenerProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastDetection, setLastDetection] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState<string>("");
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  // Create audio context for feedback sounds
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play feedback sound
  const playFeedbackSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.2);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.2);
    } catch (error) {
      console.log('Audio feedback not available:', error);
    }
  }, []);

  // Show visual feedback
  const showVisualFeedback = useCallback(() => {
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);
  }, []);

  // Start listening for wake word
  const startListening = useCallback(async () => {
    if (!isSupported) return;

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        console.log("🎤 Wake word listener started");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = (finalTranscript + interimTranscript).toLowerCase();
        
        // Check for wake word "johnny 5" or variations
        const wakeWordPatterns = [
          "johnny 5",
          "johnny five",
          "johnny5",
          "johnny-5"
        ];

        const hasWakeWord = wakeWordPatterns.some(pattern => 
          fullTranscript.includes(pattern)
        );

        if (hasWakeWord && finalTranscript) {
          console.log("🎯 Wake word detected:", finalTranscript);
          setLastDetection(finalTranscript);
          setNotificationText(finalTranscript);
          
          // Provide feedback
          playFeedbackSound();
          showVisualFeedback();
          setShowNotification(true);
          
          // Emit custom event for Johnny5AssistantIcon
          window.dispatchEvent(new CustomEvent("wakeWordDetected"));
          
          // Trigger wake word detection
          onWakeWordDetected();
          
          // Activate chatbot
          setTimeout(() => {
            onChatbotActivated();
            // Emit custom event for Johnny5AssistantIcon
            window.dispatchEvent(new CustomEvent("chatbotActivated"));
          }, 500);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Wake word recognition error:", event.error);
        if (event.error === "not-allowed") {
          setPermissionGranted(false);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Restart listening if it was intentionally started
        if (isListening) {
          setTimeout(() => {
            if (isListening) {
              recognition.start();
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (error) {
      console.error("Failed to start wake word listener:", error);
      setPermissionGranted(false);
    }
  }, [isSupported, isListening, onWakeWordDetected, onChatbotActivated, playFeedbackSound, showVisualFeedback]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    console.log("🎤 Wake word listener stopped");
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [stopListening]);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Wake Word Notification */}
      <WakeWordNotification
        show={showNotification}
        onClose={() => setShowNotification(false)}
        detectedText={notificationText}
      />

      {/* Visual Feedback Overlay */}
      {showFeedback && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-8 animate-pulse">
            <Volume2 className="w-16 h-16 text-blue-400" />
          </div>
        </div>
      )}

      {/* Wake Word Listener Controls */}
      <div className="fixed top-4 right-4 z-40">
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300">Listening for "Johnny 5"</span>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-all duration-200 ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            }`}
            title={`${isListening ? "Stop" : "Start"} hands-free mode (Ctrl+M)`}
            aria-label={`${isListening ? "Stop" : "Start"} wake word listening`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Last Detection Display */}
      {lastDetection && (
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm">
            <div className="text-xs text-blue-300 mb-1">Last detected:</div>
            <div className="text-sm text-white font-medium">"{lastDetection}"</div>
          </div>
        </div>
      )}

      {/* Permission Request Overlay */}
      {!permissionGranted && isSupported && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md mx-4 backdrop-blur-sm">
            <div className="text-center">
              <Mic className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Enable Hands-Free Mode
              </h3>
              <p className="text-white/70 mb-4">
                Allow microphone access to use voice commands. Say "Johnny 5" to activate the chatbot from anywhere on the site.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={startListening}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Allow Microphone
                </button>
                <button
                  onClick={() => setPermissionGranted(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
