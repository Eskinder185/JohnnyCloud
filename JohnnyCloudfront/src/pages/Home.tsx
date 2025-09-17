import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AWSChatBot from '@/components/AWSChatBot';
import Typewriter from '@/components/Typewriter';
import Reveal from '@/components/Reveal';
import ErrorBoundary from '@/components/ErrorBoundary';
import { isLoggedIn, getUserInfo } from '@/lib/auth';
import { useSummaryData } from '@/hooks/useSummaryData';

export default function Home() {
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const summaryData = useSummaryData();

  useEffect(() => {
    // If user is not authenticated, redirect to login page
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return "—";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getComplianceColor = (score: number | null) => {
    if (score === null) return "text-jc-dim";
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-amber-400";
    return "text-red-400";
  };

  const getComplianceLabel = (score: number | null) => {
    if (score === null) return "—";
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Attention";
  };
  return (
    <div className="space-y-8">
      {/* User Greeting */}
      <div className="text-left">
        <h1 className="text-2xl font-semibold text-white">
          {userInfo.name ? `Welcome back, ${userInfo.name}!` : 'Welcome to JohnnyCloud!'}
        </h1>
      </div>

      {/* Error State */}
      {summaryData.error && summaryData.error !== 'not_authenticated' && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-300 text-sm">
            Error loading summary data: {summaryData.error}
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Month-to-Date Spend */}
        <div 
          className="rounded-2xl border bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => navigate('/metrics')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/metrics')}
          aria-label="View detailed metrics"
        >
          <div className="text-sm opacity-70 mb-1">Month-to-Date Spend</div>
          <div className="text-2xl font-semibold text-white">
            {summaryData.loading ? (
              <div className="h-8 bg-white/10 rounded animate-pulse"></div>
            ) : (
              formatCurrency(summaryData.mtdSpend)
            )}
          </div>
          <div className="text-xs opacity-70 mt-1">Click to view details</div>
        </div>

        {/* Compliance Score */}
        <div 
          className="rounded-2xl border bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => navigate('/guardrails')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/guardrails')}
          aria-label="View compliance details"
        >
          <div className="text-sm opacity-70 mb-1">Compliance Score</div>
          <div className={`text-2xl font-semibold ${getComplianceColor(summaryData.complianceScore)}`}>
            {summaryData.loading ? (
              <div className="h-8 bg-white/10 rounded animate-pulse"></div>
            ) : (
              summaryData.complianceScore ? `${summaryData.complianceScore}%` : "—"
            )}
          </div>
          <div className="text-xs opacity-70 mt-1">
            {summaryData.loading ? "" : getComplianceLabel(summaryData.complianceScore)}
          </div>
        </div>

        {/* Security Issues */}
        <div 
          className="rounded-2xl border bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => navigate('/metrics')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/metrics')}
          aria-label="View security issues"
        >
          <div className="text-sm opacity-70 mb-1">Open Security Issues</div>
          <div className="text-2xl font-semibold text-white">
            {summaryData.loading ? (
              <div className="h-8 bg-white/10 rounded animate-pulse"></div>
            ) : (
              summaryData.securityIssues ?? "—"
            )}
          </div>
          <div className="text-xs opacity-70 mt-1">GuardDuty + Public Resources</div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h2 className="text-[clamp(24px,3vw,40px)] font-semibold text-white text-glow">
          Your AWS Assistant
        </h2>
        <Typewriter
          className="mt-2 block max-w-3xl text-white/70"
          text="Get optimization insights, security Guardrails with auto-remediation, and a clear business case for the cloud in one place."
        />
        <div className="mt-4 flex items-center gap-3 justify-center">
          <a href="/metrics" className="px-4 py-2 rounded border hover:bg-white/5">View Metrics</a>
          <a href="/guardrails" className="px-4 py-2 rounded border hover:bg-white/5">Open Guardrails</a>
          <a href="/why-aws" className="px-4 py-2 rounded bg-black text-white">Why AWS</a>
        </div>
      </div>

      {/* Chatbot Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Meet Johnny-5</h2>
          <p className="mt-2 opacity-80 max-w-xl">
            Your intelligent AWS assistant. Ask questions about your cloud,
            get cost recommendations, see compliance status, and trigger safe
            auto-remediations—all in one chat. Enable <span className="relative after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent font-medium">Speak reply</span> for voice.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              "Real-time AWS data analysis (Cost Explorer, Security Hub, GuardDuty)",
              "Cost optimization & estimated savings (rightsizing, idle, schedules)",
              "Compliance Guardrails (CIS/NIST/PCI) with one-click auto-remediation",
              "Security posture insights & Change-Impact Timeline",
              "Voice replies via Amazon Polly (toggle \"Speak reply\")",
            ].map((line, i) => (
              <Reveal key={line} delay={i * 120}>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-white/80">{line}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Chatbot Card */}
        <ErrorBoundary>
          <AWSChatBot />
        </ErrorBoundary>
      </div>

    </div>
  );
}