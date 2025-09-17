import { useReveal } from '@/components/useReveal';
import Badge from '@/components/ui/Badge';
import { ROADMAP_MILESTONES, RoadmapMilestone } from '@/data/roadmap';

export default function RoadmapTimeline() {
  const headRef = useReveal<HTMLDivElement>("reveal", 0);

  const handleMilestoneClick = (milestone: RoadmapMilestone) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'about.roadmap.step.clicked', {
        milestone_id: milestone.id,
        milestone_title: milestone.title,
        milestone_status: milestone.status
      });
    }
  };

  const getStatusBadge = (status: RoadmapMilestone['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'current':
        return <Badge variant="info" size="sm">Current</Badge>;
      case 'upcoming':
        return <Badge variant="default" size="sm">Upcoming</Badge>;
      default:
        return null;
    }
  };

  return (
    <section>
      <div ref={headRef}>
        <h2 className="text-2xl font-semibold text-white mb-2">Our Roadmap</h2>
        <p className="text-white/70">
          JohnnyCloud's journey from foundation to comprehensive AWS management platform.
        </p>
      </div>

      <div className="mt-8">
        {/* Desktop Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50"></div>
            
            <div className="grid grid-cols-4 gap-8">
              {ROADMAP_MILESTONES.map((milestone, index) => {
                const ref = useReveal<HTMLDivElement>("reveal", index * 120);
                return (
                  <div key={milestone.id} ref={ref} className="relative">
                    {/* Timeline Dot */}
                    <div className={`
                      absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10
                      ${milestone.status === 'completed' ? 'bg-green-500 border-green-500' : 
                        milestone.status === 'current' ? 'bg-cyan-500 border-cyan-500' : 
                        'bg-white/20 border-white/40'}
                    `}></div>
                    
                    <div 
                      className="text-center cursor-pointer group"
                      onClick={() => handleMilestoneClick(milestone)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleMilestoneClick(milestone)}
                      aria-label={`Learn more about ${milestone.title}`}
                    >
                      <div className="pt-6">
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-white/70 mt-2 leading-relaxed">
                          {milestone.description}
                        </p>
                        {milestone.date && (
                          <p className="text-xs text-white/50 mt-2">{milestone.date}</p>
                        )}
                        <div className="mt-3">
                          {getStatusBadge(milestone.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {ROADMAP_MILESTONES.map((milestone, index) => {
            const ref = useReveal<HTMLDivElement>("reveal", index * 120);
            return (
              <div 
                key={milestone.id} 
                ref={ref}
                className="rounded-2xl border bg-white/5 p-6 card-lift cursor-pointer group"
                onClick={() => handleMilestoneClick(milestone)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleMilestoneClick(milestone)}
                aria-label={`Learn more about ${milestone.title}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-white/70 mt-2 leading-relaxed">
                      {milestone.description}
                    </p>
                    {milestone.date && (
                      <p className="text-xs text-white/50 mt-2">{milestone.date}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(milestone.status)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
