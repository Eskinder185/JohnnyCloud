import { formatCurrency } from '@/lib/metricsUtils';

interface SavingsProgressTrackerProps {
  totalSavings: number;
  optimizationCount: number;
  targetSavings?: number;
  topActions?: Array<{ action: string; savings: number }>;
  loading?: boolean;
}

export default function SavingsProgressTracker({ 
  totalSavings, 
  optimizationCount, 
  targetSavings,
  topActions = [],
  loading = false 
}: SavingsProgressTrackerProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
          <div className="h-8 bg-white/10 rounded w-24 mb-4"></div>
          <div className="h-3 bg-white/10 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (totalSavings === 0 && optimizationCount === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">Savings Progress (QTD)</h3>
          <span className="text-[10px] text-slate-400">USD</span>
        </div>
        <div className="text-3xl font-semibold text-slate-100 mb-2">
          {formatCurrency(0)}
        </div>
        <div className="mt-4 jc-glow-line" />
        <p className="mt-3 text-xs text-slate-400">
          No savings recorded this quarter yet
        </p>
      </div>
    );
  }

  const progressPercentage = targetSavings ? Math.min(100, (totalSavings / targetSavings) * 100) : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Savings Progress (QTD)</h3>
        <span className="text-[10px] text-slate-400">USD</span>
      </div>
      
      <div className="text-3xl font-semibold text-green-400 mb-2">
        {formatCurrency(totalSavings)}
      </div>
      
      <p className="text-xs text-slate-400 mb-4">
        From {optimizationCount} optimization{optimizationCount !== 1 ? 's' : ''} 
        {targetSavings && ` (${progressPercentage.toFixed(0)}% of ${formatCurrency(targetSavings)} target)`}
      </p>

      {targetSavings && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 jc-glow-line" />
      
      {topActions.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-slate-400 mb-2">Top contributors:</p>
          <ul className="text-xs space-y-1">
            {topActions.slice(0, 3).map((action, index) => (
              <li key={index} className="flex justify-between">
                <span className="text-slate-200 truncate">{action.action}</span>
                <span className="text-green-400 ml-2">{formatCurrency(action.savings)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
