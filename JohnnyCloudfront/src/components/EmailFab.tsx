import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type SectionKey = "hero" | "metrics" | "guardrails" | "whyAws" | "chatRecent";

export default function EmailFab({
  getIdToken,
  defaultEmail
}: {
  getIdToken: () => Promise<string | null>;
  defaultEmail?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail || "");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sel, setSel] = useState<Record<SectionKey, boolean>>({
    hero: true, 
    metrics: true, 
    guardrails: true, 
    whyAws: false, 
    chatRecent: false
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (k: SectionKey) => setSel(s => ({ ...s, [k]: !s[k] }));

  async function send() {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { 
      setStatus("Enter a valid email"); 
      return; 
    }
    
    setIsSending(true);
    setStatus("Sending…");
    
    try {
      const token = await getIdToken(); // string | null
      const body = await buildPayload(sel, note, email);
      
      // Debug logging
      console.log('📧 EmailFab Debug Info:');
      console.log('  - API Base:', import.meta.env.VITE_API_BASE);
      console.log('  - Token (first 50 chars):', token ? token.substring(0, 50) + '...' : 'null');
      console.log('  - Body:', JSON.stringify(body, null, 2));
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/alerts/send-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        mode: "cors",
      });
      
      const data = await res.json().catch(() => ({}));
      
      // Debug response
      console.log('📧 API Response:', {
        status: res.status,
        statusText: res.statusText,
        data: data
      });
      
      if (!res.ok) {
        const errorMsg = data?.detail || data?.error || data?.message || res.statusText;
        console.error('📧 API Error Details:', errorMsg);
        throw new Error(`send-summary failed (${res.status}): ${errorMsg}`);
      }
      
      setStatus(data?.status || "sent");
      
      // Close modal after successful send
      setTimeout(() => {
        setOpen(false);
        setStatus("");
        setNote("");
      }, 2000);
      
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <button
        aria-label="Email summary"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 p-4 text-white shadow-xl ring-1 ring-white/20 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 transition-all duration-200"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
        </svg>
      </button>

      {open && createPortal(
        <div 
          role="dialog" 
          aria-modal="true" 
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" 
          onClick={() => setOpen(false)}
        >
          <div 
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl backdrop-blur-xl" 
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-lg font-semibold">Email a summary</h3>
              <button 
                className="rounded-md p-1 text-white/70 hover:text-white transition-colors" 
                onClick={() => setOpen(false)} 
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-white/70 mb-4">Choose what to include. We'll send a concise summary.</p>

            <div className="grid gap-3 mb-4">
              <Check label="Intro card" checked={sel.hero} onChange={() => toggle("hero")} />
              <Check label="Metrics snapshot" checked={sel.metrics} onChange={() => toggle("metrics")} />
              <Check label="Guardrails summary" checked={sel.guardrails} onChange={() => toggle("guardrails")} />
              <Check label="Why AWS highlights" checked={sel.whyAws} onChange={() => toggle("whyAws")} />
              <Check label="Recent chat (last 5 msgs)" checked={sel.chatRecent} onChange={() => toggle("chatRecent")} />
            </div>

            <div className="grid gap-3 md:grid-cols-2 mb-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Send to</span>
                <input 
                  type="email" 
                  className="rounded-lg border border-white/10 bg-black/30 p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Optional note</span>
                <input 
                  className="rounded-lg border border-white/10 bg-black/30 p-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="e.g., share with team" 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={send} 
                disabled={isSending || !email}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
              >
                {isSending ? "Sending..." : "Send email"}
              </button>
              {status && (
                <span className={`text-sm ${status.includes('Error') ? 'text-red-400' : status === 'sent' ? 'text-green-400' : 'text-white/70'}`}>
                  {status}
                </span>
              )}
            </div>

            <p className="mt-3 text-xs text-white/60">
              If your email shows "pending confirmation", check your inbox to confirm SNS.
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        className="rounded border-white/20 bg-black/30 text-sky-500 focus:ring-2 focus:ring-sky-400"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

// Collects content from the page via data-* attributes
async function buildPayload(sel: Record<string, boolean>, note: string, email: string) {
  const payload: any = { email, selections: [], note };

  if (sel.hero) {
    const title = document.querySelector("h1")?.textContent?.trim() || "";
    const sub = document.querySelector(".hero-sub, .sub")?.textContent?.trim() || "";
    payload.hero = { title, sub };
    payload.selections.push("hero");
  }
  
  if (sel.metrics) {
    const el = document.querySelector("[data-metrics-snapshot]") as HTMLElement | null;
    payload.metrics = el?.dataset?.snapshot ? JSON.parse(el.dataset.snapshot) : null;
    payload.selections.push("metrics");
  }
  
  if (sel.guardrails) {
    const el = document.querySelector("[data-guardrails-summary]") as HTMLElement | null;
    payload.guardrails = el?.dataset?.summary ? JSON.parse(el.dataset.summary) : null;
    payload.selections.push("guardrails");
  }
  
  if (sel.whyAws) {
    const el = document.querySelector("[data-whyaws-highlights]") as HTMLElement | null;
    payload.whyAws = el?.dataset?.highlights ? JSON.parse(el.dataset.highlights) : null;
    payload.selections.push("whyAws");
  }
  
  if (sel.chatRecent) {
    const msgs = Array.from(document.querySelectorAll("[data-chat-msg]"))
      .slice(-5)
      .map(n => (n as HTMLElement).innerText.trim());
    payload.chatRecent = msgs;
    payload.selections.push("chatRecent");
  }
  
  return payload;
}
