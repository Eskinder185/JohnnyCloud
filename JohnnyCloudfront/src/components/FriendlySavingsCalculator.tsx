import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info, DollarSign } from 'lucide-react';

interface SavingsBreakdown {
  rightSizing: number;
  offHours: number;
  storage: number;
  total: number;
}

const PRESETS = {
  starter: { rightSizing: 20, offHours: 0, storage: true },
  focused: { rightSizing: 40, offHours: 4, storage: true },
  aggressive: { rightSizing: 60, offHours: 8, storage: true }
};

export default function FriendlySavingsCalculator() {
  const [rightSizing, setRightSizing] = useState(20);
  const [offHours, setOffHours] = useState(4);
  const [storageEnabled, setStorageEnabled] = useState(true);
  const [monthlySpend, setMonthlySpend] = useState(2500);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [savings, setSavings] = useState<SavingsBreakdown>({
    rightSizing: 0,
    offHours: 0,
    storage: 0,
    total: 0
  });

  // Calculate savings whenever inputs change
  useEffect(() => {
    const rightSizingSavings = Math.round((monthlySpend * rightSizing / 100) * 0.25);
    const offHoursSavings = Math.round((monthlySpend * 0.5) * (offHours / 24) * 0.7);
    const storageSavings = storageEnabled ? Math.round(monthlySpend * 0.1) : 0;
    const total = rightSizingSavings + offHoursSavings + storageSavings;

    setSavings({
      rightSizing: rightSizingSavings,
      offHours: offHoursSavings,
      storage: storageSavings,
      total
    });
  }, [rightSizing, offHours, storageEnabled, monthlySpend]);

  const applyPreset = (preset: keyof typeof PRESETS) => {
    const { rightSizing: rs, offHours: oh, storage: st } = PRESETS[preset];
    setRightSizing(rs);
    setOffHours(oh);
    setStorageEnabled(st);
  };

  const getSavingsPercentage = () => {
    return Math.round((savings.total / monthlySpend) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-2 jc-title-gradient">
          See your potential monthly savings
        </h2>
        <p className="text-white/70">
          Adjust a few dials to preview savings. You can change assumptions anytime.
        </p>
      </div>

      {/* Total Savings Card */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30 p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <span className="text-sm text-green-300">Monthly Savings</span>
        </div>
        <div className="text-4xl font-bold text-green-400 mb-1">
          ${savings.total.toLocaleString()}
        </div>
        <div className="text-sm text-white/70">
          ≈ {getSavingsPercentage()}% of your monthly bill
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full mt-2">
          <span>📊</span>
          Estimate
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Quick presets</h3>
        <div className="flex gap-3 flex-wrap">
          {Object.entries(PRESETS).map(([key]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors capitalize"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Right-sizing Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-white">Right-sizing coverage</span>
            <div className="text-sm text-green-400">
              + ${savings.rightSizing}/mo
            </div>
          </div>
          <p className="text-white/70 text-sm">
            How much of your compute would you right-size?
          </p>
          <p className="text-white/60 text-xs">
            Typical waste ~25% • We'll start at 20%.
          </p>
          
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="80"
              step="10"
              value={rightSizing}
              onChange={(e) => setRightSizing(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>0%</span>
              <span>20%</span>
              <span>40%</span>
              <span>60%</span>
              <span>80%</span>
            </div>
          </div>
        </div>

        {/* Off-hours Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-white">Daily off-hours</span>
            <div className="text-sm text-green-400">
              + ${savings.offHours}/mo
            </div>
          </div>
          <p className="text-white/70 text-sm">
            Turn servers off each day for…
          </p>
          <p className="text-white/60 text-xs">
            About half of servers are schedulable in most teams.
          </p>
          
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="12"
              step="2"
              value={offHours}
              onChange={(e) => setOffHours(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>0h</span>
              <span>4h</span>
              <span>8h</span>
              <span>12h</span>
            </div>
          </div>
        </div>

        {/* Storage Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-white">Move colder data</span>
            <div className="text-sm text-green-400">
              + ${savings.storage}/mo
            </div>
          </div>
          <p className="text-white/70 text-sm">
            Move colder files to cheaper storage (S3 IA/Glacier)
          </p>
          <p className="text-white/60 text-xs">
            We'll assume ~20% savings on 30% of data.
          </p>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={storageEnabled}
              onChange={(e) => setStorageEnabled(e.target.checked)}
              className="w-4 h-4 text-cyan-400 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
            />
            <span className="text-white/80">Enable storage optimization</span>
          </label>
        </div>
      </div>

      {/* Assumptions Panel */}
      <div className="border-t border-white/10 pt-6">
        <button
          onClick={() => setShowAssumptions(!showAssumptions)}
          className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          <span>Adjust assumptions</span>
          {showAssumptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showAssumptions && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Monthly EC2 spend</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="number"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                  placeholder="2500"
                />
              </div>
            </div>
            
            <div className="text-xs text-white/60 space-y-1">
              <p>• Schedulable share: 50% (default)</p>
              <p>• Right-size potential: 25% (default)</p>
              <p>• Storage optimization: 20% savings on 30% of data</p>
            </div>
            
            <button className="flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200">
              <Info className="w-3 h-3" />
              How we calculate this
            </button>
          </div>
        )}
      </div>

      {/* Breakdown */}
      <div className="bg-white/5 rounded-lg border border-white/10 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Savings breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-white/80">Right-sizing</span>
            </div>
            <span className="text-white font-medium">${savings.rightSizing}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <span className="text-white/80">Off-hours</span>
            </div>
            <span className="text-white font-medium">${savings.offHours}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400"></div>
              <span className="text-white/80">Storage</span>
            </div>
            <span className="text-white font-medium">${savings.storage}</span>
          </div>
          
          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Total monthly savings</span>
              <span className="text-green-400 font-bold text-lg">${savings.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Note */}
      {monthlySpend === 2500 && (
        <div className="text-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            We used defaults for now—add your monthly spend to tighten the estimate.
          </p>
        </div>
      )}
    </div>
  );
}
