import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Square, Volume2, MessageSquare } from "lucide-react";
import { sendChat } from "@/lib/chatService";

type Props = {
  askEndpoint: string;                 // e.g. `${API}/chat` or `${API}/guardrails/summary`
  // Optional context you want to send (page, framework, etc.)
  context?: Record<string, any>;
  // Called when a question is sent (so pages can show the transcript/message)
  onSent?: (q: string, answer: string) => void;
};

export default function AskJohnnyCloudVoice({ askEndpoint: _askEndpoint, context: _context = {}, onSent }: Props) {
  const [status, setStatus] = useState<"idle" | "listening" | "speaking" | "paused">("idle");
  const [lastAnswer, setLastAnswer] = useState("");
  const [transcript, setTranscript] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");
  const recognitionRef = useRef<any>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stopTimeout = useRef<any>(null);
  const isSupported = useRef<boolean>(false);

  // --- TTS helpers ---
  const speak = (text: string) => {
    try { window.speechSynthesis.cancel(); } catch {}
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1; u.pitch = 1; u.volume = 1;
    u.onend = () => setStatus("idle");
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setStatus("speaking");
  };
  const pause = () => { if (speechSynthesis.speaking && !speechSynthesis.paused) { speechSynthesis.pause(); setStatus("paused"); } };
  const resume = () => { if (speechSynthesis.paused) { speechSynthesis.resume(); setStatus("speaking"); } };
  const stopAll = () => {
    try { speechSynthesis.cancel(); } catch {}
    try { recognitionRef.current?.stop?.(); } catch {}
    clearTimeout(stopTimeout.current);
    setStatus("idle");
  };

  // Check speech recognition support
  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    isSupported.current = !!SR;
  }, []);

  // --- STT: push-to-talk (release = send) ---
  const startListening = () => {
    if (!isSupported.current) {
      setShowTextInput(true);
      return;
    }
    
    stopAll();
    setTranscript(""); // Clear previous transcript
    
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false; // Important: set to false for push-to-talk
    rec.maxAlternatives = 1;

    // Store the final transcript for processing on release
    let finalTranscript = "";

    rec.onresult = (e: any) => {
      let interimTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Show interim results while listening
      setTranscript(finalTranscript + interimTranscript);
    };

    rec.onerror = (err: any) => {
      console.error("Speech recognition error:", err);
      setStatus("idle");
    };

    rec.onend = () => {
      // Process the final transcript when recognition ends
      if (finalTranscript.trim()) {
        processTranscript(finalTranscript.trim());
      } else {
        setStatus("idle");
      }
    };

    recognitionRef.current = rec;
    rec.start();
    setStatus("listening");
  };

  const stopAndSendOnRelease = () => {
    // Stop recognition immediately - this will trigger onend event
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Process the final transcript and send to chatbot
  const processTranscript = async (question: string) => {
    setTranscript(question);
    setStatus("idle");
    
    if (!question) return;
    
    try {
      // Use the chat service for consistent API calls
      const response = await sendChat(question, true); // true for speak
      const answer = response.message || "Sorry, I couldn't find an answer.";
      setLastAnswer(answer);
      onSent?.(question, answer);
      speak(answer);   // auto speak
    } catch (err) {
      console.error("Error sending message:", err);
      speak("Sorry, there was a problem getting the answer.");
    }
  };

  // Handle text input submission
  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    const question = textInput.trim();
    setTextInput("");
    setShowTextInput(false);
    
    try {
      // Use the chat service for consistent API calls
      const response = await sendChat(question, true); // true for speak
      const answer = response.message || "Sorry, I couldn't find an answer.";
      setLastAnswer(answer);
      onSent?.(question, answer);
      speak(answer);
    } catch (err) {
      speak("Sorry, there was a problem getting the answer.");
    }
  };

  // cleanup
  useEffect(() => () => stopAll(), []);

  const isListening = status === "listening";
  const isSpeaking = status === "speaking";
  const isPaused = status === "paused";

  return (
    <div className="space-y-3">
      {/* Main Push-to-Talk Button */}
      <div className="flex items-center gap-3">
        <button
          onMouseDown={startListening}
          onMouseUp={stopAndSendOnRelease}
          onTouchStart={(e) => { e.preventDefault(); startListening(); }}
          onTouchEnd={(e) => { e.preventDefault(); stopAndSendOnRelease(); }}
          onKeyDown={(e) => { 
            if (e.code === "Space" && !e.repeat) { 
              e.preventDefault(); 
              startListening(); 
            } 
          }}
          onKeyUp={(e) => { 
            if (e.code === "Space") { 
              e.preventDefault(); 
              stopAndSendOnRelease(); 
            } 
          }}
          aria-pressed={isListening}
          aria-label="Hold to ask JohnnyCloud"
          className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-200 transform ${
            isListening 
              ? "bg-red-500 text-white scale-110 shadow-lg shadow-red-500/50" 
              : "bg-sky-500 text-white hover:bg-sky-400 hover:scale-105 shadow-lg shadow-sky-500/30"
          }`}
          title="Hold to speak. Release to send. (Space bar also works)"
        >
          {/* Recording indicator ripple effect */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
          )}
          
          {/* Microphone icon */}
          <Mic className={`h-6 w-6 ${isListening ? "animate-pulse" : ""}`} />
        </button>

        {/* Status text */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 Speaking..." : "Ask JohnnyCloud"}
          </span>
          <span className="text-xs text-slate-400">
            {isListening ? "Release to send" : isSpeaking ? "Speaking response" : "Hold to talk"}
          </span>
        </div>

        {/* Fallback text input button */}
        {!isSupported.current && (
          <button
            onClick={() => setShowTextInput(!showTextInput)}
            className="flex items-center gap-2 rounded-lg border border-slate-600/60 px-3 py-2 text-slate-200 hover:bg-slate-600/20"
            aria-label="Toggle text input"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">Text Input</span>
          </button>
        )}
      </div>

      {/* Transcript display */}
      {transcript && (
        <div className="p-3 bg-white/10 rounded-lg border border-white/20">
          <div className="text-xs text-slate-400 mb-1">You said:</div>
          <div className="text-sm text-white">{transcript}</div>
        </div>
      )}

      {/* Text input fallback */}
      {showTextInput && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleTextSubmit();
                }
                if (e.key === "Escape") {
                  setShowTextInput(false);
                  setTextInput("");
                }
              }}
              placeholder="Type your question here..."
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
              autoFocus
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              onClick={() => {
                setShowTextInput(false);
                setTextInput("");
              }}
              className="px-3 py-2 border border-slate-600/60 text-slate-200 rounded-lg hover:bg-slate-600/20"
            >
              Cancel
            </button>
          </div>
          <div className="text-xs text-slate-400">
            Press Enter to send, Escape to cancel
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center gap-2">
        {/* Pause/Resume speech */}
        <button
          onClick={isPaused ? resume : pause}
          disabled={!isSpeaking && !isPaused}
          className="flex items-center gap-1 rounded-lg border border-slate-600/60 px-2 py-1 text-slate-200 disabled:opacity-40 hover:bg-slate-600/20"
          aria-label={isPaused ? "Resume speech" : "Pause speech"}
        >
          <Pause className="h-3 w-3" />
          <span className="text-xs">{isPaused ? "Resume" : "Pause"}</span>
        </button>

        {/* Stop speaking/listening */}
        <button
          onClick={stopAll}
          disabled={status === "idle"}
          className="flex items-center gap-1 rounded-lg border border-slate-600/60 px-2 py-1 text-slate-200 disabled:opacity-40 hover:bg-slate-600/20"
          aria-label="Stop"
        >
          <Square className="h-3 w-3" />
          <span className="text-xs">Stop</span>
        </button>

        {/* Replay last answer */}
        <button
          onClick={() => lastAnswer && speak(lastAnswer)}
          disabled={!lastAnswer}
          className="flex items-center gap-1 rounded-lg border border-slate-600/60 px-2 py-1 text-slate-200 disabled:opacity-40 hover:bg-slate-600/20"
          aria-label="Replay answer"
        >
          <Volume2 className="h-3 w-3" />
          <span className="text-xs">Replay</span>
        </button>
      </div>
    </div>
  );
}