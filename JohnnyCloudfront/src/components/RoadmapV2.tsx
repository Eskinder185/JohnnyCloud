import { useState, useEffect } from 'react';
import { Check, Circle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { RoadmapMilestone } from '@/data/roadmap';

interface MilestoneDetails {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  details: string[];
  lastUpdated: string;
  icon?: string;
}

const MILESTONE_DETAILS: MilestoneDetails[] = [
  {
    id: 'v1-foundations',
    title: 'V1 — Foundations',
    subtitle: 'Landing Zone, Metrics Dashboard',
    date: 'June 2025',
    status: 'completed',
    details: [
      'AWS Landing Zone setup with multi-account architecture',
      'Real-time metrics dashboard with cost and security insights',
      'Basic authentication and user management system'
    ],
    lastUpdated: 'June 15, 2025',
    icon: '🏗️'
  },
  {
    id: 'guardrails',
    title: 'Guardrails',
    subtitle: 'CIS/NIST controls + auto-remediation',
    date: 'July 2025',
    status: 'completed',
    details: [
      'Automated compliance monitoring for CIS and NIST frameworks',
      'One-click remediation for common security issues',
      'Custom guardrails for organization-specific policies'
    ],
    lastUpdated: 'July 20, 2025',
    icon: '🛡️'
  },
  {
    id: 'voice-assistant',
    title: 'Voice Assistant',
    subtitle: 'Ask Johnny-5, get spoken insights',
    date: 'September 2025',
    status: 'current',
    details: [
      'Natural language queries about AWS costs and security',
      'Voice responses using Amazon Polly integration',
      'Conversational interface for complex analysis requests'
    ],
    lastUpdated: 'September 10, 2025',
    icon: '🎤'
  },
  {
    id: 'next-phase',
    title: 'Next',
    subtitle: 'Optimization Hub, multi-account, Slack/Jira',
    date: 'October 2025',
    status: 'upcoming',
    details: [
      'Advanced optimization recommendations and automation',
      'Multi-account management and cross-account insights',
      'Slack and Jira integrations for team collaboration'
    ],
    lastUpdated: 'Planned for October 2025',
    icon: '🚀'
  }
];

export default function RoadmapV2() {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMilestoneClick = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  const getStatusPill = (status: RoadmapMilestone['status']) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-500/20 text-green-300 border border-green-500/30`}>
            <Check className="w-3 h-3" aria-hidden="true" />
            Completed
          </span>
        );
      case 'current':
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-300 border border-blue-500/30`}>
            <Circle className="w-3 h-3 fill-current" aria-hidden="true" />
            Current
          </span>
        );
      case 'upcoming':
        return (
          <span className={`${baseClasses} bg-gray-500/20 text-gray-300 border border-gray-500/30`}>
            <Clock className="w-3 h-3" aria-hidden="true" />
            Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const getNodeIcon = (status: RoadmapMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'current':
        return <Circle className="w-5 h-5 text-blue-400 fill-current" />;
      case 'upcoming':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getCurrentMilestoneIndex = () => {
    return MILESTONE_DETAILS.findIndex(m => m.status === 'current');
  };

  const currentIndex = getCurrentMilestoneIndex();
  const progressPercentage = currentIndex >= 0 ? ((currentIndex + 1) / MILESTONE_DETAILS.length) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-2 jc-title-gradient">
          Development Roadmap
        </h2>
        <p className="text-white/70">
          Clear milestones showing our progress and what's coming next
        </p>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/20">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Timeline Nodes */}
          <div className="relative flex justify-between items-start">
            {MILESTONE_DETAILS.map((milestone) => (
              <div key={milestone.id} className="flex-1 max-w-[320px] min-w-[280px]">
                {/* Milestone Card */}
                <div 
                  className={`relative bg-white/5 rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:bg-white/10 hover:border-white/20 ${
                    milestone.status === 'current' ? 'border-blue-400/50 bg-blue-500/10' : 'border-white/10'
                  }`}
                  onClick={() => handleMilestoneClick(milestone.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedMilestone === milestone.id}
                  aria-current={milestone.status === 'current' ? 'step' : undefined}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleMilestoneClick(milestone.id);
                    }
                  }}
                >
                  {/* Node */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      milestone.status === 'completed' 
                        ? 'bg-green-500 border-green-400' 
                        : milestone.status === 'current'
                        ? 'bg-blue-500 border-blue-400'
                        : 'bg-transparent border-gray-400'
                    } ${milestone.status === 'current' && !isReducedMotion ? 'animate-pulse' : ''}`}>
                      {getNodeIcon(milestone.status)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-white/70 truncate">
                      {milestone.subtitle}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">{milestone.date}</span>
                      {getStatusPill(milestone.status)}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedMilestone === milestone.id && (
                  <div 
                    className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10"
                    aria-live="polite"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {milestone.icon && (
                        <span className="text-2xl" aria-hidden="true">{milestone.icon}</span>
                      )}
                      <div>
                        <h4 className="font-medium text-white mb-2">What's included:</h4>
                        <ul className="space-y-1">
                          {milestone.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-white/60">
                      Last updated: {milestone.lastUpdated}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {MILESTONE_DETAILS.map((milestone) => (
          <div key={milestone.id} className="relative">
            {/* Progress Bar (only for current milestone) */}
            {milestone.status === 'current' && (
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-blue-400 rounded-full" />
            )}

            {/* Milestone Card */}
            <div 
              className={`bg-white/5 rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                milestone.status === 'current' ? 'border-blue-400/50 bg-blue-500/10' : 'border-white/10'
              }`}
              onClick={() => handleMilestoneClick(milestone.id)}
              role="button"
              tabIndex={0}
              aria-expanded={expandedMilestone === milestone.id}
              aria-current={milestone.status === 'current' ? 'step' : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMilestoneClick(milestone.id);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                    milestone.status === 'completed' 
                      ? 'bg-green-500 border-green-400' 
                      : milestone.status === 'current'
                      ? 'bg-blue-500 border-blue-400'
                      : 'bg-transparent border-gray-400'
                  } ${milestone.status === 'current' && !isReducedMotion ? 'animate-pulse' : ''}`}>
                    {getNodeIcon(milestone.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {milestone.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusPill(milestone.status)}
                  <span className="text-xs text-white/60">{milestone.date}</span>
                </div>
              </div>

              {/* Expand/Collapse Button */}
              <div className="flex items-center justify-center">
                {expandedMilestone === milestone.id ? (
                  <ChevronUp className="w-4 h-4 text-white/60" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/60" />
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedMilestone === milestone.id && (
              <div 
                className="mt-2 p-4 bg-white/5 rounded-lg border border-white/10"
                aria-live="polite"
              >
                <div className="flex items-start gap-3 mb-3">
                  {milestone.icon && (
                    <span className="text-2xl" aria-hidden="true">{milestone.icon}</span>
                  )}
                  <div>
                    <h4 className="font-medium text-white mb-2">What's included:</h4>
                    <ul className="space-y-1">
                      {milestone.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-white/60">
                  Last updated: {milestone.lastUpdated}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
