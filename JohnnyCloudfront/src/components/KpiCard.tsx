import { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  emptyState?: {
    message: string;
    cta: {
      text: string;
      href: string;
      onClick?: () => void;
      analyticsEvent?: string;
    };
  };
  className?: string;
}

export default function KpiCard({ 
  title, 
  value, 
  subtitle, 
  loading = false, 
  error = null, 
  emptyState,
  className = "" 
}: KpiCardProps) {
  const showEmptyState = !loading && !error && (value === null || value === "—" || value === "");
  
  return (
    <div className={`rounded-2xl border bg-white/5 p-5 ${className}`}>
      <div className="text-sm opacity-70 mb-1">{title}</div>
      
      {loading ? (
        <div className="h-8 bg-white/10 rounded animate-pulse mb-2"></div>
      ) : error ? (
        <div className="text-red-400 text-sm mb-2">Error loading data</div>
      ) : showEmptyState && emptyState ? (
        <div className="mb-2">
          <div className="text-2xl font-semibold text-white/50 mb-2">
            {emptyState.message}
          </div>
          <a
            href={emptyState.cta.href}
            onClick={() => {
              if (emptyState.cta.analyticsEvent) {
                // Emit analytics event
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', emptyState.cta.analyticsEvent, {
                    kpi_title: title,
                    cta_text: emptyState.cta.text,
                    href: emptyState.cta.href
                  });
                }
              }
              if (emptyState.cta.onClick) {
                emptyState.cta.onClick();
              }
            }}
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {emptyState.cta.text} →
          </a>
        </div>
      ) : (
        <div className="text-2xl font-semibold text-white mb-2">
          {value}
        </div>
      )}
      
      {subtitle && !loading && !error && !showEmptyState && (
        <div className="text-xs opacity-70">{subtitle}</div>
      )}
    </div>
  );
}
