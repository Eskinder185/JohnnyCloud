import { useReveal } from '@/components/useReveal';

export default function SecurityTrust() {
  const ref = useReveal<HTMLDivElement>("reveal", 0);

  const handleWhitepaperClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'about.trust.whitepaper.clicked', {
        section: 'security_trust'
      });
    }
  };

  return (
    <div ref={ref} className="rounded-2xl border bg-gradient-to-br from-green-500/10 to-cyan-500/10 p-6 border-green-500/20">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-green-500/20 text-green-300">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-white mb-4">Security & Data Handling</h2>
          
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0"></div>
              <span className="text-white/80">
                <strong className="text-white">Your data stays in your AWS account.</strong> 
                We never store customer data outside your infrastructure.
              </span>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0"></div>
              <span className="text-white/80">
                <strong className="text-white">Least-privilege cross-account role;</strong> 
                no standing credentials or persistent access.
              </span>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0"></div>
              <span className="text-white/80">
                <strong className="text-white">Auto-remediation is opt-in and previewed</strong> 
                before any changes are made to your resources.
              </span>
            </li>
            
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0"></div>
              <span className="text-white/80">
                <strong className="text-white">All changes are logged for audit</strong> 
                with detailed who/what/when information.
              </span>
            </li>
          </ul>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <a
              href="#"
              onClick={handleWhitepaperClick}
              className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Security Whitepaper
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}



