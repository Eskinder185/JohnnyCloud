import { useState } from "react";
import { Mail, CheckCircle, AlertCircle, Clock, Send } from "lucide-react";

interface EmailAlertsProps {
  getIdToken: () => Promise<string | null>;
  apiBase?: string;
}

export default function EmailAlerts({ 
  getIdToken, 
  apiBase = import.meta.env.VITE_API_BASE 
}: EmailAlertsProps) {
  const [email, setEmail] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Simple email validation regex
  const isValidEmail = (email: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  const handleApiCall = async (path: string, body: any) => {
    setIsLoading(true);
    setError("");
    setStatus("Working…");

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in to continue.");
      }

      const response = await fetch(`${apiBase}${path}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      setStatus(data?.status || "Success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setStatus("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setStatus("Error");
      return;
    }
    handleApiCall("/alerts/subscribe-email", { email, enabled });
  };

  const handleSendTest = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setStatus("Error");
      return;
    }
    handleApiCall("/alerts/test-email", { email });
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <Clock className="w-4 h-4 animate-spin text-blue-400" />;
    }
    
    switch (status.toLowerCase()) {
      case "pending-confirmation":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "subscribed":
      case "published":
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "pending-confirmation":
        return "text-yellow-300";
      case "subscribed":
      case "published":
      case "success":
        return "text-green-300";
      case "error":
        return "text-red-300";
      default:
        return "text-white/70";
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Email Alerts</h3>
          <p className="text-sm text-white/70">Get notified when guardrails find violations</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email-input" className="block text-sm font-medium text-white/80 mb-2">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            className="w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Notification Toggle */}
        <div className="flex items-center gap-3">
          <input
            id="notifications-toggle"
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={isLoading}
            className="w-4 h-4 text-cyan-500 bg-black/30 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
          />
          <label htmlFor="notifications-toggle" className="text-sm text-white/80 cursor-pointer">
            Notify me on violations
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading || !email.trim()}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <CheckCircle className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={handleSendTest}
            disabled={isLoading || !email.trim()}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10 hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send Test
          </button>
        </div>

        {/* Status Display */}
        {(status || error) && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${error ? "text-red-300" : getStatusColor()}`}>
              {error || status}
            </span>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-white/60 space-y-1">
          <p>• If status shows "pending-confirmation," check your inbox to confirm your subscription</p>
          <p>• Test emails are sent immediately to verify your email address</p>
          <p>• You can unsubscribe at any time by clicking the link in the emails</p>
        </div>
      </div>
    </div>
  );
}
