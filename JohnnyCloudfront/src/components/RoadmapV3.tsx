import { useState, useEffect } from 'react';
import { Check, Circle, Clock } from 'lucide-react';
import { ROADMAP_MILESTONES, RoadmapMilestone } from '@/data/roadmap';

export default function RoadmapV3() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Derive counts and current index
  const completedCount = ROADMAP_MILESTONES.filter(m => m.status === 'completed').length;
  const currentCount = ROADMAP_MILESTONES.filter(m => m.status === 'current').length;
  const upcomingCount = ROADMAP_MILESTONES.filter(m => m.status === 'upcoming').length;
  
  const currentIndex = ROADMAP_MILESTONES.findIndex(m => m.status === 'current');
  const progressPercentage = currentIndex >= 0 ? ((currentIndex + 1) / ROADMAP_MILESTONES.length) * 100 : 
    (completedCount / ROADMAP_MILESTONES.length) * 100;

  const handleCardClick = (milestoneId: string) => {
    setExpandedCard(expandedCard === milestoneId ? null : milestoneId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, milestoneId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(milestoneId);
    }
  };

  const getStatusPill = (status: RoadmapMilestone['status']) => {
    const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold";
    
    switch (status) {
      case 'completed':
        return (
          <span 
            className={baseClasses}
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              color: 'var(--roadmap-rail-progress)'
            }}
          >
            Completed
          </span>
        );
      case 'current':
        return (
          <span 
            className={baseClasses}
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: 'var(--roadmap-node-current)'
            }}
          >
            Current
          </span>
        );
      case 'upcoming':
        return (
          <span 
            className={baseClasses}
            style={{
              backgroundColor: 'rgba(148, 163, 184, 0.12)',
              color: 'var(--roadmap-legend-muted)'
            }}
          >
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
        return <Check className="w-5 h-5 text-white" />;
      case 'current':
        return <Circle className="w-6 h-6 text-white fill-current" />;
      case 'upcoming':
        return <Clock className="w-5 h-5 text-muted opacity-60" />;
      default:
        return null;
    }
  };

  const getNodeClasses = (status: RoadmapMilestone['status']) => {
    const baseClasses = "rounded-full flex items-center justify-center border-2 transition-all duration-300";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} w-11 h-11 roadmap-node-completed border-transparent`;
      case 'current':
        return `${baseClasses} w-14 h-14 roadmap-node-current border-transparent ${
          !isReducedMotion ? 'shadow-lg' : ''
        }`;
      case 'upcoming':
        return `${baseClasses} w-11 h-11 bg-transparent roadmap-node-upcoming`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 bg-surface rounded-2xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-3">
          Development Roadmap
        </h1>
        <p className="text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
          Clear milestones showing our progress and what's coming next.
        </p>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden lg:block">
        {/* Timeline Rail */}
        <div className="relative mb-8">
          {/* Base Rail */}
          <div className="absolute top-7 left-0 right-0 h-1 roadmap-rail rounded-full">
            {/* Progress Fill */}
            <div 
              className="h-full roadmap-rail-progress rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Timeline Nodes */}
          <div className="relative flex justify-between">
            {ROADMAP_MILESTONES.map((milestone) => (
              <div key={milestone.id} className="flex flex-col items-center">
                {/* Node */}
                <div className={getNodeClasses(milestone.status)}>
                  {getNodeIcon(milestone.status)}
                </div>
                
                {/* Milestone Card */}
                <div className="mt-8 w-72">
                  <div 
                    className={`roadmap-card rounded-2xl border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      milestone.status === 'current' 
                        ? 'border-blue-400 shadow-md' 
                        : 'border-border hover:border-border-hover'
                    }`}
                    style={{
                      boxShadow: milestone.status === 'current' 
                        ? '0 10px 24px rgba(59, 130, 246, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
                        : '0 10px 24px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={() => handleCardClick(milestone.id)}
                    onKeyDown={(e) => handleKeyDown(e, milestone.id)}
                    role="button"
                    tabIndex={0}
                    aria-current={milestone.status === 'current' ? 'step' : undefined}
                    aria-expanded={expandedCard === milestone.id}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold roadmap-card-foreground">
                        {milestone.title}
                      </h3>
                      {getStatusPill(milestone.status)}
                    </div>

                    {/* Subtitle */}
                    <p className="text-sm roadmap-legend-muted mb-4 line-clamp-1">
                      {milestone.subtitle}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm roadmap-legend-muted">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span>{milestone.date}</span>
                    </div>

                    {/* Expanded Details */}
                    {expandedCard === milestone.id && (
                      <div className="mt-4 pt-4 border-t border-border" aria-live="polite">
                        <h4 className="font-medium roadmap-card-foreground mb-2">What's included:</h4>
                        <ul className="space-y-1">
                          <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                            Core infrastructure setup
                          </li>
                          <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                            Key feature implementation
                          </li>
                          <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                            Testing and validation
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet Layout (2x2) */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-2 gap-6">
          {ROADMAP_MILESTONES.map((milestone) => (
            <div key={milestone.id} className="relative">
              {/* Progress indicator for current milestone */}
              {milestone.status === 'current' && (
                <div className="absolute -left-3 top-0 bottom-0 w-1 roadmap-rail-progress rounded-full" />
              )}

              <div 
                className={`roadmap-card rounded-2xl border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  milestone.status === 'current' 
                    ? 'border-blue-400 shadow-md' 
                    : 'border-border hover:border-border-hover'
                }`}
                style={{
                  boxShadow: milestone.status === 'current' 
                    ? '0 10px 24px rgba(59, 130, 246, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
                    : '0 10px 24px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => handleCardClick(milestone.id)}
                onKeyDown={(e) => handleKeyDown(e, milestone.id)}
                role="button"
                tabIndex={0}
                aria-current={milestone.status === 'current' ? 'step' : undefined}
                aria-expanded={expandedCard === milestone.id}
              >
                {/* Node */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={getNodeClasses(milestone.status)}>
                    {getNodeIcon(milestone.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold roadmap-card-foreground">
                      {milestone.title}
                    </h3>
                    <p className="text-sm roadmap-legend-muted">
                      {milestone.subtitle}
                    </p>
                  </div>
                  {getStatusPill(milestone.status)}
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm roadmap-legend-muted">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>{milestone.date}</span>
                </div>

                {/* Expanded Details */}
                {expandedCard === milestone.id && (
                  <div className="mt-4 pt-4 border-t border-border" aria-live="polite">
                    <h4 className="font-medium roadmap-card-foreground mb-2">What's included:</h4>
                    <ul className="space-y-1">
                      <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                        Core infrastructure setup
                      </li>
                      <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                        Key feature implementation
                      </li>
                      <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                        Testing and validation
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout (Stack) */}
      <div className="md:hidden space-y-4">
        {ROADMAP_MILESTONES.map((milestone) => (
          <div key={milestone.id} className="relative">
            {/* Progress indicator for current milestone */}
            {milestone.status === 'current' && (
              <div className="absolute -left-3 top-0 bottom-0 w-1 roadmap-rail-progress rounded-full" />
            )}

            <div 
              className={`roadmap-card rounded-2xl border p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                milestone.status === 'current' 
                  ? 'border-blue-400 shadow-md' 
                  : 'border-border hover:border-border-hover'
              }`}
              style={{
                boxShadow: milestone.status === 'current' 
                  ? '0 10px 24px rgba(59, 130, 246, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
                  : '0 10px 24px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onClick={() => handleCardClick(milestone.id)}
              onKeyDown={(e) => handleKeyDown(e, milestone.id)}
              role="button"
              tabIndex={0}
              aria-current={milestone.status === 'current' ? 'step' : undefined}
              aria-expanded={expandedCard === milestone.id}
            >
              {/* Node and Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`${getNodeClasses(milestone.status)} scale-90`}>
                  {getNodeIcon(milestone.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold roadmap-card-foreground">
                    {milestone.title}
                  </h3>
                  <p className="text-sm roadmap-legend-muted">
                    {milestone.subtitle}
                  </p>
                </div>
                {getStatusPill(milestone.status)}
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm roadmap-legend-muted">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{milestone.date}</span>
              </div>

              {/* Expanded Details */}
              {expandedCard === milestone.id && (
                <div className="mt-4 pt-4 border-t border-border" aria-live="polite">
                  <h4 className="font-medium roadmap-card-foreground mb-2">What's included:</h4>
                  <ul className="space-y-1">
                    <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                      Core infrastructure setup
                    </li>
                    <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                      Key feature implementation
                    </li>
                    <li className="text-sm roadmap-legend-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full roadmap-node-current mt-2 flex-shrink-0" />
                      Testing and validation
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center gap-6 mt-12 pt-8 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full roadmap-node-completed"></div>
          <span className="text-sm roadmap-legend-muted">{completedCount} Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full roadmap-node-current"></div>
          <span className="text-sm roadmap-legend-muted">{currentCount} In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border roadmap-node-upcoming"></div>
          <span className="text-sm roadmap-legend-muted">{upcomingCount} Upcoming</span>
        </div>
      </div>
    </div>
  );
}
