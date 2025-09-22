import { useEffect, useRef, useState } from "react";
import { Mic, Pause, Square, Volume2 } from "lucide-react";

type Props = {
  askEndpoint: string;                 // e.g. `${API}/chat` or `${API}/guardrails/summary`
  // Optional context you want to send (page, framework, etc.)
  context?: Record<string, any>;
  // Called when a question is sent (so pages can show the transcript/message)
  onSent?: (q: string, answer: string) => void;
};

export default function AskJohnnyCloudVoice({ askEndpoint, context = {}, onSent }: Props) {
  const [status, setStatus] = useState<"idle" | "listening" | "speaking" | "paused">("idle");
  const [lastAnswer, setLastAnswer] = useState("");
  const recognitionRef = useRef<any>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stopTimeout = useRef<any>(null);

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

  // --- STT: push-to-talk (release = send) ---
  const startListening = () => {
    stopAll();
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported in this browser."); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = async (e: any) => {
      const question = (e.results?.[0]?.[0]?.transcript || "").trim();
      if (!question) { setStatus("idle"); return; }
      try {
        const r = await fetch(askEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, ...context })
        });
        const data = await r.json().catch(() => ({}));
        const answer = data.answer || data.message || "Sorry, I couldn't find an answer.";
        setLastAnswer(answer);
        onSent?.(question, answer);
        speak(answer);   // auto speak
      } catch (err) {
        speak("Sorry, there was a problem getting the answer.");
      }
    };

    rec.onerror = () => setStatus("idle");
    rec.onend = () => { /* idle set by speak/onresult */ };
    recognitionRef.current = rec;
    rec.start();
    setStatus("listening");
  };

  const stopAndSendOnRelease = () => {
    // tiny debounce to avoid early stop on accidental slip
    clearTimeout(stopTimeout.current);
    stopTimeout.current = setTimeout(() => {
      try { recognitionRef.current?.stop?.(); } catch {}
    }, 120);
  };

  // cleanup
  useEffect(() => () => stopAll(), []);

  const isListening = status === "listening";
  const isSpeaking = status === "speaking";
  const isPaused = status === "paused";

  return (
    <div className="flex items-center gap-2">
      {/* Push-to-talk: press/hold to talk, release to send */}
      <button
        onMouseDown={startListening}
        onMouseUp={stopAndSendOnRelease}
        onTouchStart={(e) => { e.preventDefault(); startListening(); }}
        onTouchEnd={(e) => { e.preventDefault(); stopAndSendOnRelease(); }}
        onKeyDown={(e) => { if (e.code === "Space" || e.key === "Enter") startListening(); }}
        onKeyUp={(e) => { if (e.code === "Space" || e.key === "Enter") stopAndSendOnRelease(); }}
        aria-pressed={isListening}
        aria-label="Hold to ask JohnnyCloud"
        className={`flex items-center gap-2 rounded-xl px-3 py-2 transition
          ${isListening ? "bg-sky-300 text-slate-900" : "bg-sky-400/90 text-slate-900 hover:bg-sky-300"}`}
        title="Hold to speak. Release to send."
      >
        <Mic className="h-4 w-4" />
        <span className="font-semibold">{isListening ? "Listening…" : "Ask JohnnyCloud"}</span>
      </button>

      {/* Pause/Resume speech */}
      <button
        onClick={isPaused ? resume : pause}
        disabled={!isSpeaking && !isPaused}
        className="rounded-lg border border-slate-600/60 px-2 py-2 text-slate-200 disabled:opacity-40"
        aria-label={isPaused ? "Resume speech" : "Pause speech"}
      >
        <Pause className="h-4 w-4" />
      </button>

      {/* Stop speaking/listening */}
      <button
        onClick={stopAll}
        disabled={status === "idle"}
        className="rounded-lg border border-slate-600/60 px-2 py-2 text-slate-200 disabled:opacity-40"
        aria-label="Stop"
      >
        <Square className="h-4 w-4" />
      </button>

      {/* Replay last answer */}
      <button
        onClick={() => lastAnswer && speak(lastAnswer)}
        disabled={!lastAnswer}
        className="rounded-lg border border-slate-600/60 px-2 py-2 text-slate-200 disabled:opacity-40"
        aria-label="Replay answer"
      >
        <Volume2 className="h-4 w-4" />
      </button>

      <span className="text-xs text-slate-400 ml-1">
        {isListening ? "release to send" : isSpeaking ? "speaking…" : isPaused ? "paused" : ""}
      </span>
    </div>
  );
}