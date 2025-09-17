import { calculateImpactSummary } from '@/lib/metricsUtils';

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

interface AnomalyImpactSummaryProps {
  anomaly: AnomalyData;
}

export default function AnomalyImpactSummary({ anomaly }: AnomalyImpactSummaryProps) {
  const impactSummary = calculateImpactSummary(
    anomaly.currentAmount,
    anomaly.baselineAmount,
    anomaly.service,
    anomaly.driverResource || anomaly.resource,
    anomaly.region
  );

  return (
    <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="text-sm text-slate-300">
        {impactSummary}
      </div>
      {anomaly.notes && (
        <div className="text-xs text-slate-400 mt-1">
          {anomaly.notes}
        </div>
      )}
    </div>
  );
}
