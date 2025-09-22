import { BarChart3, DollarSign, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  route: string;
  ariaLabel: string;
  tileClass: string;
}

const FEATURES: Feature[] = [
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Real-time Metrics",
    description: "Live signals from Cost Explorer, Security Hub, and GuardDuty.",
    route: "/metrics",
    ariaLabel: "Open Real-time Metrics",
    tileClass: "tile-metrics"
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Security GuardRails",
    description: "Safe remediations mapped to CIS/NIST/PCI.",
    route: "/guardrails",
    ariaLabel: "Open Security GuardRails",
    tileClass: "tile-guardrails"
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: "Cost Optimization",
    description: "Rightsizing, idle schedules, and Savings Plans with $ estimates.",
    route: "/optimization",
    ariaLabel: "Open Cost Optimization",
    tileClass: "tile-cost"
  }
];

export default function FeatureGrid() {
  return (
    <div className="flex flex-col gap-5 h-full">
      {FEATURES.map((feature, index) => (
        <Link
          key={index}
          to={feature.route}
          aria-label={feature.ariaLabel}
          className={`${feature.tileClass} group block w-full min-h-[120px] rounded-2xl border p-5 transition-all duration-200 ease-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.995] motion-reduce:transform-none`}
          style={{
            backgroundColor: 'var(--tile-bg)',
            borderColor: 'var(--tile-border)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
          }}
          onMouseEnter={(e) => {
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
            }
            e.currentTarget.style.boxShadow = `0 10px 25px -3px var(--tile-glow), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px var(--tile-glow), 0 10px 25px -3px var(--tile-glow), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--tile-bg)';
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.filter = '';
          }}
        >
          {/* Icon Badge */}
          <div 
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 transition-colors duration-200"
            style={{
              backgroundColor: 'var(--tile-bg)',
              color: 'var(--tile-accent)'
            }}
          >
            {feature.icon}
          </div>
          
          {/* Content */}
          <h3 
            className="text-lg font-semibold mb-2 transition-colors duration-200"
            style={{ color: 'var(--tile-accent)' }}
          >
            {feature.title}
          </h3>
          <p className="text-sm text-secondary leading-relaxed">
            {feature.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
