import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';

interface Scenario {
  id: string;
  problem: string;
  solutions: string[];
  result: string;
  savings: string;
  category: 'cost' | 'compute' | 'compliance';
  recommended?: boolean;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'storage-waste',
    problem: 'Storage spend kept growing due to unused snapshots.',
    solutions: [
      'Turned on lifecycle policies',
      'Right-sized EC2 instances',
      'Added Savings Plans'
    ],
    result: '30% lower costs',
    savings: '~$2,300/mo',
    category: 'cost',
    recommended: true
  },
  {
    id: 'compute-optimization',
    problem: 'Servers were running 24/7 but only used during business hours.',
    solutions: [
      'Set up auto-scaling groups',
      'Implemented scheduled scaling',
      'Optimized instance types'
    ],
    result: '45% compute savings',
    savings: '~$1,800/mo',
    category: 'compute'
  },
  {
    id: 'security-compliance',
    problem: 'Security findings were piling up without clear remediation steps.',
    solutions: [
      'Enabled automated remediation',
      'Set up compliance monitoring',
      'Implemented guardrails'
    ],
    result: '95% compliance score',
    savings: '~$500/mo in risk reduction',
    category: 'compliance'
  }
];

const CATEGORY_LABELS = {
  cost: 'Cost',
  compute: 'Compute', 
  compliance: 'Compliance'
};

export default function ScenarioCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const currentScenario = SCENARIOS[currentIndex];

  const nextScenario = () => {
    setCurrentIndex((prev) => (prev + 1) % SCENARIOS.length);
    setExpandedCard(null);
  };

  const prevScenario = () => {
    setCurrentIndex((prev) => (prev - 1 + SCENARIOS.length) % SCENARIOS.length);
    setExpandedCard(null);
  };

  const goToScenario = (index: number) => {
    setCurrentIndex(index);
    setExpandedCard(null);
  };

  const toggleExpanded = (scenarioId: string) => {
    setExpandedCard(expandedCard === scenarioId ? null : scenarioId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-2 jc-title-gradient">
          How teams like yours improved
        </h2>
        <p className="text-white/70">
          Real scenarios from companies that reduced costs and improved security
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Scenario Card */}
        <div className="bg-white/5 rounded-2xl border p-6 min-h-[400px]">
          {currentScenario.recommended && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full mb-4">
              <span>⭐</span>
              Recommended for you
            </div>
          )}
          
          {/* Problem */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">The Challenge</h3>
            <p className="text-white/80 leading-relaxed">{currentScenario.problem}</p>
          </div>

          {/* What We Did */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3">What we did</h3>
            <div className="space-y-2">
              {currentScenario.solutions.map((solution, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-white/80">{solution}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">The Result</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-400">{currentScenario.result}</span>
              <span className="text-lg text-white/70">({currentScenario.savings})</span>
            </div>
          </div>

          {/* Expandable Steps */}
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={() => toggleExpanded(currentScenario.id)}
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              <span>Show the steps we took</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${
                expandedCard === currentScenario.id ? 'rotate-90' : ''
              }`} />
            </button>
            
            {expandedCard === currentScenario.id && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="space-y-3">
                  {currentScenario.solutions.map((solution, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-sm font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white/90 font-medium">{solution}</p>
                        <p className="text-white/60 text-sm mt-1">
                          {getStepDescription(currentScenario.id, index)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {/* Previous Button */}
          <button
            onClick={prevScenario}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Previous scenario"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Previous</span>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {SCENARIOS.map((scenario, index) => (
              <button
                key={scenario.id}
                onClick={() => goToScenario(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-cyan-400 scale-125'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to ${CATEGORY_LABELS[scenario.category]} scenario`}
                title={CATEGORY_LABELS[scenario.category]}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextScenario}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Next scenario"
          >
            <span className="text-sm">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getStepDescription(scenarioId: string, stepIndex: number): string {
  const descriptions: Record<string, string[]> = {
    'storage-waste': [
      'Automatically delete old snapshots and move unused data to cheaper storage tiers',
      'Analyzed instance usage patterns and switched to appropriately sized instances',
      'Purchased reserved capacity for predictable workloads to get significant discounts'
    ],
    'compute-optimization': [
      'Configured auto-scaling to add/remove instances based on demand',
      'Set up scheduled actions to stop non-critical instances during off-hours',
      'Analyzed performance metrics and switched to more cost-effective instance families'
    ],
    'security-compliance': [
      'Enabled automated fixes for common security issues like open S3 buckets',
      'Set up continuous monitoring for compliance frameworks like CIS and NIST',
      'Implemented policies that prevent non-compliant resources from being created'
    ]
  };

  return descriptions[scenarioId]?.[stepIndex] || 'Detailed implementation step';
}

