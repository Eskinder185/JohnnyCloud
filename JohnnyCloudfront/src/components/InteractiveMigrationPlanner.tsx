import { useState, useEffect, useMemo } from 'react';
import { plannerStore, type PlannerInput } from '@/lib/plannerStore';

interface InteractiveMigrationPlannerProps {
  onAsk: (ctx: any) => void;
}

export default function InteractiveMigrationPlanner({ onAsk }: InteractiveMigrationPlannerProps) {
  const [input, setInput] = useState<PlannerInput>(plannerStore.getInput());
  const [isUpdating, setIsUpdating] = useState(false);

  const plan = useMemo(() => plannerStore.buildPlan(input), [input]);

  // Update store when input changes
  useEffect(() => {
    if (isUpdating) {
      plannerStore.setInput(input);
      setIsUpdating(false);
    }
  }, [input, isUpdating]);

  const handleInputChange = (updates: Partial<PlannerInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
    setIsUpdating(true);
  };

  const exportPlan = () => {
    const planData = {
      input,
      plan,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-plan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border bg-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold mb-2">Migration Planner</h2>
          <p className="opacity-80">Interactive migration planning with live timeline updates</p>
        </div>
        <div className="text-xs opacity-70">Educational • estimates only</div>
      </div>

      {/* Input Controls */}
      <div className="grid md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="rounded-xl border border-dashed bg-white/5 p-4">
          <label className="text-sm opacity-70 mb-2 block">Workloads</label>
          <input 
            type="number" 
            min={1} 
            max={100}
            value={input.workloads} 
            onChange={(e) => handleInputChange({ workloads: Math.max(1, Number(e.target.value)) })}
            className="w-full rounded border bg-transparent px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            aria-label="Number of workloads to migrate"
          />
        </div>

        <div className="rounded-xl border border-dashed bg-white/5 p-4">
          <label className="text-sm opacity-70 mb-2 block">Database</label>
          <select 
            value={input.dbType} 
            onChange={(e) => handleInputChange({ dbType: e.target.value as any })}
            className="w-full rounded border bg-transparent px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            aria-label="Database type"
          >
            <option value="none">None</option>
            <option value="mysql">MySQL</option>
            <option value="postgres">PostgreSQL</option>
            <option value="sqlserver">SQL Server</option>
            <option value="nosql">NoSQL</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div className="rounded-xl border border-dashed bg-white/5 p-4">
          <label className="text-sm opacity-70 mb-2 block">Criticality</label>
          <select 
            value={input.criticality} 
            onChange={(e) => handleInputChange({ criticality: e.target.value as any })}
            className="w-full rounded border bg-transparent px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            aria-label="Criticality level"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="rounded-xl border border-dashed bg-white/5 p-4">
          <label className="text-sm opacity-70 mb-2 block">Traffic Pattern</label>
          <select 
            value={input.traffic} 
            onChange={(e) => handleInputChange({ traffic: e.target.value as any })}
            className="w-full rounded border bg-transparent px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            aria-label="Traffic pattern"
          >
            <option value="steady">Steady</option>
            <option value="spiky">Spiky</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>

        <div className="rounded-xl border border-dashed bg-white/5 p-4">
          <label className="text-sm opacity-70 mb-2 block">Strategy</label>
          <select 
            value={input.goal} 
            onChange={(e) => handleInputChange({ goal: e.target.value as any })}
            className="w-full rounded border bg-transparent px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            aria-label="Migration strategy"
          >
            <option value="lift">Lift & Shift</option>
            <option value="replatform">Replatform</option>
            <option value="refactor">Refactor</option>
          </select>
        </div>

        <div className="rounded-xl border border-dashed bg-white/5 p-4">
          <label className="flex items-center gap-2 text-sm opacity-70 mb-2">
            <input 
              type="checkbox" 
              checked={input.multiRegion} 
              onChange={(e) => handleInputChange({ multiRegion: e.target.checked })}
              className="rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-500"
              aria-label="Multi-region deployment"
            />
            Multi-Region
          </label>
        </div>

        <div className="rounded-xl border border-dashed bg-white/5 p-4">
          <label className="flex items-center gap-2 text-sm opacity-70 mb-2">
            <input 
              type="checkbox" 
              checked={input.regulated} 
              onChange={(e) => handleInputChange({ regulated: e.target.checked })}
              className="rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-500"
              aria-label="Regulated environment"
            />
            Regulated
          </label>
        </div>
      </div>

      {/* Live Results */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="rounded-xl border bg-white/5 p-4">
          <div className="text-sm opacity-70 mb-2">Strategy (6Rs)</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {plan.strategy.map((s) => (
              <span key={s} className="px-2 py-1 rounded-full text-xs border bg-white/5 capitalize">
                {s}
              </span>
            ))}
          </div>
          <div className="text-sm opacity-70">Estimated effort</div>
          <div className="text-2xl font-semibold text-cyan-300">{plan.effortWeeks} weeks</div>
        </div>

        <div className="lg:col-span-2 rounded-xl border bg-white/5 p-4">
          <div className="text-sm opacity-70 mb-2">Prerequisites</div>
          <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
            {plan.prerequisites.map((prereq, i) => (
              <li key={i}>{prereq}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {plan.phases.map((phase) => (
          <div key={phase.title} className="rounded-xl border bg-white/5 p-4">
            <div className="text-xs opacity-60 mb-1">{phase.weeks}</div>
            <div className="font-medium mb-2">{phase.title}</div>
            <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
              {phase.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Recommended Services */}
      <div className="rounded-xl border bg-white/5 p-4 mb-6">
        <div className="text-sm opacity-70 mb-2">Recommended AWS Services</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {plan.recommended.map((service) => (
            <div key={service} className="text-sm opacity-90 px-2 py-1 bg-white/5 rounded border border-white/10">
              {service}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <a href="/guardrails" className="px-4 py-2 rounded border hover:bg-white/5 transition-colors">
          Open Guardrails
        </a>
        <a href="/metrics" className="px-4 py-2 rounded border hover:bg-white/5 transition-colors">
          Open Optimization Hub
        </a>
        <button
          onClick={exportPlan}
          className="px-4 py-2 rounded border hover:bg-white/5 transition-colors"
        >
          Export Plan (JSON)
        </button>
        <button
          onClick={() => onAsk({ migrationContext: { input, plan } })}
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Ask JohnnyCloud to refine this
        </button>
      </div>
    </div>
  );
}
