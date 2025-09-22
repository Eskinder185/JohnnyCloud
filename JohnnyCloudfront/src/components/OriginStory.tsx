import { useReveal } from '@/components/useReveal';

export default function OriginStory() {
  const leftRef = useReveal<HTMLDivElement>("reveal-left", 0);
  const rightRef = useReveal<HTMLDivElement>("reveal-right", 120);

  return (
    <section className="grid lg:grid-cols-2 gap-8 items-start">
      <div ref={leftRef}>
        <h2 className="text-2xl font-semibold text-white mb-4">Our Origin</h2>
        <div className="space-y-4 text-white/80 leading-relaxed">
          <p>
            We built JohnnyCloud after seeing teams overwhelmed by cloud alerts, cost spikes, 
            and compliance checklists. Most tools tell you what's wrong—we wanted one that 
            also helps you fix it, safely.
          </p>
          <p>
            JohnnyCloud blends guardrails, cost insights, and an AI assistant so engineers 
            can move faster with confidence. From alerts to actions, we're making AWS 
            management intuitive for everyone.
          </p>
        </div>
      </div>

      <div ref={rightRef} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-green-500/20 text-green-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-white">From alerts to actions</h3>
            <p className="text-sm text-white/70">One-click fixes for common issues</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-white">Explainability</h3>
            <p className="text-sm text-white/70">Plain-English summaries for leaders</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-white">Security-first principles</h3>
            <p className="text-sm text-white/70">Built with enterprise-grade security</p>
          </div>
        </div>
      </div>
    </section>
  );
}



