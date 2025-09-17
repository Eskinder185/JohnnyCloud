import { useNavigate } from 'react-router-dom';

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
  filter?: string;
  analyticsEvent: string;
}

export default function ClickableBenefits() {
  const navigate = useNavigate();

  const benefits: Benefit[] = [
    {
      id: 'cost',
      icon: '💰',
      title: 'Cost',
      description: 'Pay for what you use; save with rightsizing, schedules, and Savings Plans.',
      route: '/metrics',
      filter: 'cost',
      analyticsEvent: 'whyaws.benefit.cost.clicked'
    },
    {
      id: 'security',
      icon: '🛡️',
      title: 'Security',
      description: 'Guardrails mapped to CIS/NIST/PCI with one-click auto-remediation.',
      route: '/guardrails',
      filter: 'high-severity',
      analyticsEvent: 'whyaws.benefit.security.clicked'
    },
    {
      id: 'reliability',
      icon: '🔁',
      title: 'Reliability',
      description: 'Multi-AZ & backups are first-class; better SLOs by design.',
      route: '/guardrails',
      filter: 'reliability',
      analyticsEvent: 'whyaws.benefit.reliability.clicked'
    },
    {
      id: 'efficiency',
      icon: '⚡',
      title: 'Efficiency',
      description: 'Serverless & managed services reduce ops toil so you ship faster.',
      route: '/metrics',
      filter: 'compute',
      analyticsEvent: 'whyaws.benefit.efficiency.clicked'
    }
  ];

  const handleBenefitClick = (benefit: Benefit) => {
    // Emit analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', benefit.analyticsEvent, {
        benefit_id: benefit.id,
        benefit_title: benefit.title,
        route: benefit.route,
        filter: benefit.filter
      });
    }

    // Navigate with optional filter
    if (benefit.filter) {
      navigate(benefit.route, { state: { filter: benefit.filter } });
    } else {
      navigate(benefit.route);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {benefits.map((benefit) => (
        <button
          key={benefit.id}
          onClick={() => handleBenefitClick(benefit)}
          className="group min-w-[280px] h-full rounded-2xl border bg-white/5 hover:bg-white/10 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label={`Open ${benefit.title} deep dive`}
        >
          <div className="flex flex-col h-full p-6">
            {/* Header with icon and title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                {benefit.icon}
              </div>
              <h3 className="font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                {benefit.title}
              </h3>
            </div>
            
            {/* Description */}
            <div className="flex-1 mb-4">
              <p className="text-sm opacity-80 group-hover:opacity-100 transition-opacity leading-relaxed">
                {benefit.description}
              </p>
            </div>
            
            {/* Footer with CTA */}
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-0 group-hover:opacity-70 transition-opacity">
                Click to explore {benefit.title.toLowerCase()} →
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
