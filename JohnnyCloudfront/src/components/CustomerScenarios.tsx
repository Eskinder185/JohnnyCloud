import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Scenario {
  id: string;
  title: string;
  type: string;
  problem: string;
  actions: string[];
  outcome: string;
  metrics: string;
  cta: {
    primary: { text: string; action: () => void };
    secondary: { text: string; action: () => void };
  };
  recommended?: boolean;
}

export default function CustomerScenarios() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const scenarios: Scenario[] = [
    {
      id: 'startup',
      title: 'Tech Startup',
      type: 'Cost Optimization',
      problem: 'Rapid growth led to uncontrolled cloud spending with unused resources and inefficient storage classes.',
      actions: [
        'Implemented S3 lifecycle policies',
        'Enabled Intelligent Tiering',
        'Set up automated rightsizing alerts',
        'Configured Savings Plans for predictable workloads'
      ],
      outcome: 'Reduced storage costs by 30% while maintaining performance and accessibility.',
      metrics: '30% cost reduction',
      cta: {
        primary: { 
          text: 'View Cost Steps', 
          action: () => navigate('/metrics', { state: { tab: 'cost' } })
        },
        secondary: { 
          text: 'Try Cost Guardrails', 
          action: () => navigate('/guardrails', { state: { filter: 'cost' } })
        }
      }
    },
    {
      id: 'saas',
      title: 'SaaS Company',
      type: 'Compute Optimization',
      problem: 'High EC2 bills from over-provisioned instances and lack of scheduling for non-production environments.',
      actions: [
        'Right-sized EC2 instances based on actual usage',
        'Implemented automated start/stop schedules',
        'Migrated to Reserved Instances for production',
        'Set up Spot Instances for batch processing'
      ],
      outcome: 'Achieved 22% reduction in compute costs while improving resource utilization.',
      metrics: '22% cost reduction',
      cta: {
        primary: { 
          text: 'View Compute Steps', 
          action: () => navigate('/metrics', { state: { tab: 'compute' } })
        },
        secondary: { 
          text: 'Try Compute Guardrails', 
          action: () => navigate('/guardrails', { state: { filter: 'compute' } })
        }
      }
    },
    {
      id: 'regulated',
      title: 'Regulated Organization',
      type: 'Security & Compliance',
      problem: 'Compliance audit revealed multiple security gaps and failed CIS controls across the infrastructure.',
      actions: [
        'Enabled Security Hub and GuardDuty',
        'Implemented CIS benchmark controls',
        'Set up automated remediation for common issues',
        'Established compliance monitoring dashboard'
      ],
      outcome: 'Reached 90% CIS compliance score in just 3 weeks with automated guardrails.',
      metrics: '90% compliance in 3 weeks',
      cta: {
        primary: { 
          text: 'View Security Steps', 
          action: () => navigate('/guardrails', { state: { filter: 'security' } })
        },
        secondary: { 
          text: 'Try Security Guardrails', 
          action: () => navigate('/guardrails', { state: { filter: 'high-severity' } })
        }
      },
      recommended: true
    }
  ];

  const currentScenario = scenarios[currentIndex];

  const nextScenario = () => {
    setCurrentIndex((prev) => (prev + 1) % scenarios.length);
  };

  const prevScenario = () => {
    setCurrentIndex((prev) => (prev - 1 + scenarios.length) % scenarios.length);
  };

  const goToScenario = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="rounded-2xl border bg-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">How teams use JohnnyCloud + AWS</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevScenario}
            className="p-2 rounded border border-white/20 hover:bg-white/10 transition-colors"
            aria-label="Previous scenario"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextScenario}
            className="p-2 rounded border border-white/20 hover:bg-white/10 transition-colors"
            aria-label="Next scenario"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scenario Indicators */}
      <div className="flex justify-center gap-2 mb-6">
        {scenarios.map((_, index) => (
          <button
            key={index}
            onClick={() => goToScenario(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-cyan-400' : 'bg-white/30'
            }`}
            aria-label={`Go to scenario ${index + 1}`}
          />
        ))}
      </div>

      {/* Current Scenario Card */}
      <div className="relative">
        {currentScenario.recommended && (
          <div className="absolute -top-2 -right-2 z-10">
            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
              Recommended for you
            </span>
          </div>
        )}
        
        <div className="rounded-xl border bg-white/5 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{currentScenario.title}</h3>
              <span className="inline-block px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                {currentScenario.type}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{currentScenario.metrics}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-red-300 mb-2">Problem</h4>
              <p className="text-sm opacity-80">{currentScenario.problem}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-amber-300 mb-2">Actions Taken</h4>
              <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
                {currentScenario.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-green-300 mb-2">Outcome</h4>
              <p className="text-sm opacity-80">{currentScenario.outcome}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={currentScenario.cta.primary.action}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              {currentScenario.cta.primary.text}
            </button>
            <button
              onClick={currentScenario.cta.secondary.action}
              className="px-4 py-2 rounded border border-white/20 hover:bg-white/10 transition-colors"
            >
              {currentScenario.cta.secondary.text}
            </button>
          </div>
        </div>
      </div>

      {/* All Scenarios Grid (Desktop) */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4 mt-6">
        {scenarios.map((scenario, index) => (
          <div
            key={scenario.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              index === currentIndex
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => goToScenario(index)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{scenario.title}</h4>
              {scenario.recommended && (
                <span className="text-xs text-green-300">★</span>
              )}
            </div>
            <div className="text-xs opacity-70 mb-2">{scenario.type}</div>
            <div className="text-sm font-semibold text-green-400">{scenario.metrics}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
