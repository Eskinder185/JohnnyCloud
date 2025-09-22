import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  onClear: () => void;              // parent clears messages state
  threadKey?: string;               // optional: localStorage key for this thread
};

export default function ClearChatButton({ onClear, threadKey }: Props) {
  const [confirm, setConfirm] = useState(false);

  const doClear = () => {
    try {
      if (threadKey) localStorage.removeItem(threadKey);
    } catch {}
    onClear();                      // e.g., setMessages([])
    setConfirm(false);
  };

  // Keyboard shortcut: Ctrl+K to open clear dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setConfirm(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setConfirm(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 px-3 py-2 text-slate-200 hover:bg-slate-700/40 transition-colors"
        title="Clear conversation (Ctrl+K)"
        aria-haspopup="dialog"
      >
        <Trash2 className="h-4 w-4" />
        <span className="text-sm">Clear</span>
      </button>

      {/* Confirm dialog */}
      {confirm && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-5 shadow-xl ring-1 ring-white/10">
            <h2 className="text-lg font-semibold text-white">Delete all messages?</h2>
            <p className="mt-1 text-sm text-slate-300">
              This will remove the current conversation from this device. This action can't be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button 
                onClick={() => setConfirm(false)} 
                className="rounded-lg px-3 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doClear}
                className="rounded-lg bg-rose-600 px-3 py-2 text-white hover:bg-rose-500 transition-colors"
                autoFocus
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
