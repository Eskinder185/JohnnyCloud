import { useState, useEffect, useMemo } from 'react';
import { plannerStore, type PlannerInput, type ImpactAssumptions } from '@/lib/plannerStore';

interface BusinessImpactStatementsProps {
  input: PlannerInput;
}

export default function BusinessImpactStatements({ input }: BusinessImpactStatementsProps) {
  const [assumptions, setAssumptions] = useState<ImpactAssumptions>(plannerStore.getAssumptions());
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const impact = useMemo(() => plannerStore.calculateBusinessImpact(input, assumptions), [input, assumptions]);

  // Update store when assumptions change
  useEffect(() => {
    if (isUpdating) {
      plannerStore.setAssumptions(assumptions);
      setIsUpdating(false);
    }
  }, [assumptions, isUpdating]);

  const handleAssumptionChange = (updates: Partial<ImpactAssumptions>) => {
    setAssumptions(prev => ({ ...prev, ...updates }));
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

  return (
    <div className="rounded-2xl border bg-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Business Impact</h2>
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors"
        >
          {showAssumptions ? 'Hide' : 'Edit'} Assumptions
        </button>
      </div>

      {/* Assumptions Panel */}
      {showAssumptions && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-sm font-medium mb-3">Impact Assumptions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs opacity-70 block mb-1">Downtime Cost/Hour</label>
              <input
                type="number"
                value={assumptions.downtimeCostPerHour}
                onChange={(e) => handleAssumptionChange({ downtimeCostPerHour: Number(e.target.value) })}
                className="w-full rounded border bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-400"
                aria-label="Cost of downtime per hour"
              />
            </div>
            <div>
              <label className="text-xs opacity-70 block mb-1">Hours Avoided/Month</label>
              <input
                type="number"
                step="0.5"
                value={assumptions.hoursAvoidedPerMonth}
                onChange={(e) => handleAssumptionChange({ hoursAvoidedPerMonth: Number(e.target.value) })}
                className="w-full rounded border bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-400"
                aria-label="Hours of downtime avoided per month"
              />
            </div>
            <div>
              <label className="text-xs opacity-70 block mb-1">High Severity Exposures</label>
              <input
                type="number"
                value={assumptions.highSeverityExposures}
                onChange={(e) => handleAssumptionChange({ highSeverityExposures: Number(e.target.value) })}
                className="w-full rounded border bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-400"
                aria-label="Current high severity security exposures"
              />
            </div>
            <div>
              <label className="text-xs opacity-70 block mb-1">Latency Improvement %</label>
              <input
                type="number"
                value={assumptions.latencyImprovement}
                onChange={(e) => handleAssumptionChange({ latencyImprovement: Number(e.target.value) })}
                className="w-full rounded border bg-transparent px-2 py-1 text-sm text-white focus:outline-none focus:border-cyan-400"
                aria-label="Expected latency improvement percentage"
              />
            </div>
          </div>
        </div>
      )}

      {/* Impact Statements */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⏱️</span>
              <h3 className="font-medium">Improved Uptime</h3>
            </div>
            <div className="text-2xl font-semibold text-green-400 mb-1">
              {formatCurrency(impact.avoidedDowntimeCost)}/mo
            </div>
            <div className="text-sm opacity-70">
              Avoided downtime costs through improved reliability
            </div>
            <div className="text-xs opacity-60 mt-1">
              Formula: {formatCurrency(assumptions.downtimeCostPerHour)}/hr × {assumptions.hoursAvoidedPerMonth} hrs/mo
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🛡️</span>
              <h3 className="font-medium">Risk Reduction</h3>
            </div>
            <div className="text-2xl font-semibold text-amber-400 mb-1">
              {impact.riskReduction} fewer
            </div>
            <div className="text-sm opacity-70">
              High-severity security exposures eliminated
            </div>
            <div className="text-xs opacity-60 mt-1">
              From {assumptions.highSeverityExposures} current exposures
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💰</span>
              <h3 className="font-medium">Cost Optimization</h3>
            </div>
            <div className="text-2xl font-semibold text-cyan-400 mb-1">
              ~{formatCurrency(impact.costOptimization)}/mo
            </div>
            <div className="text-sm opacity-70">
              Potential savings from rightsizing & scheduling
            </div>
            <div className="text-xs opacity-60 mt-1">
              Based on {input.workloads} workloads × $200 avg savings
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚡</span>
              <h3 className="font-medium">Performance Efficiency</h3>
            </div>
            <div className="text-2xl font-semibold text-blue-400 mb-1">
              {impact.performanceEfficiency}
            </div>
            <div className="text-sm opacity-70">
              Through optimized architecture & managed services
            </div>
            <div className="text-xs opacity-60 mt-1">
              Based on AWS best practices & auto-scaling
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/20">
        <div className="text-sm font-medium mb-2">Total Monthly Value</div>
        <div className="text-3xl font-bold text-green-400 mb-1">
          {formatCurrency(impact.avoidedDowntimeCost + impact.costOptimization)}
        </div>
        <div className="text-sm opacity-70">
          Combined uptime savings + cost optimization potential
        </div>
      </div>
    </div>
  );
}
