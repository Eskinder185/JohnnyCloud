import { useState } from 'react';
import { formatCurrency } from '@/lib/metricsUtils';
import { generateAnomaliesCSV } from '@/lib/metricsUtils';
import { formatDateTime } from '@/lib/dateUtils';
import AnomalyImpactSummary from './AnomalyImpactSummary';

interface AnomalyData {
  id: string;
  service: string;
  resource?: string;
  region?: string;
  currentAmount: number;
  baselineAmount: number;
  timestamp: string;
  period: string;
  driverResource?: string;
  notes?: string;
}

interface AnomaliesListProps {
  anomalies: AnomalyData[];
  loading?: boolean;
}

export default function AnomaliesList({ anomalies, loading = false }: AnomaliesListProps) {
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);

  // Ensure anomalies is always an array
  const safeAnomalies = Array.isArray(anomalies) ? anomalies : [];

  const handleExportCSV = () => {
    const exportData = safeAnomalies.map(anomaly => ({
      timestamp: anomaly.timestamp,
      period: anomaly.period,
      service: anomaly.service,
      resource: anomaly.resource || '',
      region: anomaly.region || '',
      baseline_amount: anomaly.baselineAmount,
      current_amount: anomaly.currentAmount,
      impact_percent: ((anomaly.currentAmount - anomaly.baselineAmount) / Math.max(1, anomaly.baselineAmount)) * 100,
      driver_resource: anomaly.driverResource || '',
      notes: anomaly.notes || ''
    }));
    generateAnomaliesCSV(exportData);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-48 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Cost Anomalies</h3>
        <button
          onClick={handleExportCSV}
          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors"
          disabled={safeAnomalies.length === 0}
        >
          Download CSV
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {safeAnomalies.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No anomalies detected
          </div>
        ) : (
          safeAnomalies.map(anomaly => {
            const impact = ((anomaly.currentAmount - anomaly.baselineAmount) / Math.max(1, anomaly.baselineAmount)) * 100;
            const isExpanded = expandedAnomaly === anomaly.id;
            
            return (
              <div key={anomaly.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedAnomaly(isExpanded ? null : anomaly.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-200">
                        {anomaly.service} {anomaly.resource && `• ${anomaly.resource}`}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{anomaly.period}</span>
                        {anomaly.region && (
                          <>
                            <span>•</span>
                            <span>{anomaly.region}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${
                        impact > 0 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {impact > 0 ? '+' : ''}{impact.toFixed(0)}%
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatCurrency(anomaly.currentAmount)} vs {formatCurrency(anomaly.baselineAmount)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-400">
                    Detected: {formatDateTime(anomaly.timestamp)}
                  </div>
                </div>

                {isExpanded && (
                  <AnomalyImpactSummary anomaly={anomaly} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
