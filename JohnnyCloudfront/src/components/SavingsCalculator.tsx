import { useState, useEffect, useMemo } from 'react';
import { plannerStore, type SavingsCalculator } from '@/lib/plannerStore';

export default function SavingsCalculator() {
  const [savings, setSavings] = useState<SavingsCalculator>(plannerStore.getSavings());
  const [isUpdating, setIsUpdating] = useState(false);

  const calculatedSavings = useMemo(() => plannerStore.calculateSavings(savings), [savings]);

  // Update store when savings change
  useEffect(() => {
    if (isUpdating) {
      plannerStore.setSavings(savings);
      setIsUpdating(false);
    }
  }, [savings, isUpdating]);

  const handleSavingsChange = (updates: Partial<SavingsCalculator>) => {
    setSavings(prev => ({ ...prev, ...updates }));
    setIsUpdating(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  const getTotalMonthlyCost = () => {
    return savings.ec2MonthlyCost + savings.s3MonthlyCost;
  };

  const getSavingsPercentage = () => {
    const total = getTotalMonthlyCost();
    return total > 0 ? Math.round((calculatedSavings.total / total) * 100) : 0;
  };

  return (
    <div className="rounded-2xl border bg-white/5 p-6">
      <h2 className="text-2xl font-semibold mb-6">Your potential monthly savings</h2>

      {/* Main Savings Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-green-400 mb-2">
          {formatCurrency(calculatedSavings.total)}
        </div>
        <div className="text-sm opacity-70">
          {getSavingsPercentage()}% of your total monthly bill
        </div>
      </div>

      {/* Calculator Controls */}
      <div className="space-y-6">
        {/* Rightsizing Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Rightsizing Adoption</label>
            <span className="text-sm text-cyan-300">{formatPercent(savings.rightsizingAdoption)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={savings.rightsizingAdoption}
            onChange={(e) => handleSavingsChange({ rightsizingAdoption: Number(e.target.value) })}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Rightsizing adoption percentage"
          />
          <div className="flex justify-between text-xs opacity-60 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="text-xs opacity-70 mt-1">
            Estimated savings: {formatCurrency(calculatedSavings.breakdown.rightsizing)}/mo
            <span className="ml-2 opacity-60">(25% waste × adoption%)</span>
          </div>
        </div>

        {/* Idle Scheduling Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Idle Scheduling</label>
            <span className="text-sm text-cyan-300">{savings.idleSchedulingHours} hrs/day off</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={savings.idleSchedulingHours}
            onChange={(e) => handleSavingsChange({ idleSchedulingHours: Number(e.target.value) })}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Hours per day to schedule idle resources"
          />
          <div className="flex justify-between text-xs opacity-60 mt-1">
            <span>0 hrs</span>
            <span>12 hrs</span>
          </div>
          <div className="text-xs opacity-70 mt-1">
            Estimated savings: {formatCurrency(calculatedSavings.breakdown.scheduling)}/mo
            <span className="ml-2 opacity-60">(50% schedulable × off-hours/24)</span>
          </div>
        </div>

        {/* Storage Transitions Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={savings.includeStorageTransitions}
              onChange={(e) => handleSavingsChange({ includeStorageTransitions: e.target.checked })}
              className="rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-500"
            />
            <div>
              <div className="text-sm font-medium">Include Storage Class Transitions</div>
              <div className="text-xs opacity-70">
                Move objects to IA/Glacier for 20% savings
                {savings.includeStorageTransitions && (
                  <span className="ml-2 text-green-400">
                    (+{formatCurrency(calculatedSavings.breakdown.storage)}/mo)
                  </span>
                )}
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-sm font-medium mb-3">Savings Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="opacity-70">Rightsizing (25% waste)</span>
            <span className="text-green-400">{formatCurrency(calculatedSavings.breakdown.rightsizing)}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Idle Scheduling (50% schedulable)</span>
            <span className="text-green-400">{formatCurrency(calculatedSavings.breakdown.scheduling)}</span>
          </div>
          {savings.includeStorageTransitions && (
            <div className="flex justify-between">
              <span className="opacity-70">Storage Transitions (20% savings)</span>
              <span className="text-green-400">{formatCurrency(calculatedSavings.breakdown.storage)}</span>
            </div>
          )}
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Total Monthly Savings</span>
              <span className="text-green-400">{formatCurrency(calculatedSavings.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
        <details className="group">
          <summary className="text-xs opacity-70 cursor-pointer hover:opacity-100">
            View Assumptions
          </summary>
          <div className="mt-2 text-xs opacity-60 space-y-1">
            <div>• EC2 Monthly Cost: {formatCurrency(savings.ec2MonthlyCost)} (estimated)</div>
            <div>• S3 Monthly Cost: {formatCurrency(savings.s3MonthlyCost)} (estimated)</div>
            <div>• Average waste in over-provisioned instances: 25%</div>
            <div>• Percentage of EC2 that can be scheduled: 50%</div>
            <div>• Storage transition savings: 20% (IA/Glacier)</div>
          </div>
        </details>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <a
          href="/metrics"
          className="block w-full px-4 py-3 bg-black text-white text-center rounded hover:bg-gray-800 transition-colors"
        >
          Open Optimization Hub
        </a>
      </div>
    </div>
  );
}
