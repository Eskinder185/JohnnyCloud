
interface FallbackContentProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export default function FallbackContent({ 
  title = "Content Unavailable", 
  message = "Unable to load content at this time.",
  showRetry = true,
  onRetry 
}: FallbackContentProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        <svg 
          className="w-16 h-16 text-white/30 mx-auto" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-white/60 mb-6 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Specific fallback components for different scenarios
export function MetricsFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <FallbackContent
      title="Metrics Unavailable"
      message="Unable to load metrics data. This might be due to API configuration or network issues."
      onRetry={onRetry}
    />
  );
}

export function KPIFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <FallbackContent
      title="KPI Data Unavailable"
      message="Unable to load KPI data. Please check your API configuration."
      onRetry={onRetry}
    />
  );
}

export function GuardrailsFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <FallbackContent
      title="Guardrails Unavailable"
      message="Unable to load compliance data. Please ensure your Guardrails API is configured."
      onRetry={onRetry}
    />
  );
}
