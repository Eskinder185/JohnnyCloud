// src/pages/WhyAws.tsx
import { useEffect, useState, Suspense, lazy, useCallback } from "react";
import { Link } from "react-router-dom";

// Lazy load heavy components
const InteractiveMigrationPlanner = lazy(() => import("@/components/InteractiveMigrationPlanner"));
const SimpleMigrationPlanner = lazy(() => import("@/components/SimpleMigrationPlanner"));
const ScenarioCarousel = lazy(() => import("@/components/ScenarioCarousel"));
const FriendlySavingsCalculator = lazy(() => import("@/components/FriendlySavingsCalculator"));

// ---------- shared UI (matches your sizing/colors) ----------
const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`opacity-80 ${className}`}>{children}</p>
);
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border bg-white/5 p-5 ${className}`}>{children}</div>
);

// ---------- env images (hero placeholder) ----------
const HERO_IMG =
  (import.meta.env.VITE_WHY_AWS_IMAGE as string | undefined) ||
  "/images/whyawss.jpg";

// ---------- 7 Rs Migration Strategies ----------
const MIGRATION_RS = [
  { id: 'rehost', label: 'Rehost', description: 'Lift & Shift', color: 'bg-blue-500/20 text-blue-300' },
  { id: 'replatform', label: 'Replatform', description: 'Lift, Tinker & Shift', color: 'bg-green-500/20 text-green-300' },
  { id: 'refactor', label: 'Refactor', description: 'Re-architect', color: 'bg-purple-500/20 text-purple-300' },
  { id: 'repurchase', label: 'Repurchase', description: 'Drop & Shop', color: 'bg-orange-500/20 text-orange-300' },
  { id: 'retire', label: 'Retire', description: 'Decommission', color: 'bg-red-500/20 text-red-300' },
  { id: 'retain', label: 'Retain', description: 'Keep On-Prem', color: 'bg-gray-500/20 text-gray-300' },
  { id: 'relocate', label: 'Relocate', description: 'Move to Cloud', color: 'bg-teal-500/20 text-teal-300' },
];

// ---------- Risk Categories ----------
const RISK_CATEGORIES = [
  { id: 'data', label: 'Data', icon: '🗄️' },
  { id: 'downtime', label: 'Downtime', icon: '⏱️' },
  { id: 'iam', label: 'IAM', icon: '🔐' },
  { id: 'cost', label: 'Cost', icon: '💰' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
  { id: 'compliance', label: 'Compliance', icon: '📋' },
];

// ---------- Migration Milestones ----------
const MIGRATION_MILESTONES = [
  { id: 'discovery', label: 'Discovery', duration: '2-4 weeks', description: 'Assess current state' },
  { id: 'landing-zone', label: 'Landing Zone', duration: '1-2 weeks', description: 'Set up AWS foundation' },
  { id: 'pilot', label: 'Pilot', duration: '2-6 weeks', description: 'Test migration approach' },
  { id: 'cutover', label: 'Cutover', duration: '1-3 days', description: 'Go live migration' },
  { id: 'hypercare', label: 'Hypercare', duration: '2-4 weeks', description: 'Post-migration support' },
];


// ---------- page ----------
export default function WhyAwsPage() {
  const [plannerMode, setPlannerMode] = useState<'simple' | 'advanced'>(() => {
    // Check localStorage for persisted mode
    const saved = localStorage.getItem('whyaws_planner_mode_v1');
    return (saved === 'simple' || saved === 'advanced') ? saved : 'simple';
  });
  
  // Enhanced state for new features
  const [selectedR, setSelectedR] = useState<string>('rehost');
  const [readinessScore, setReadinessScore] = useState<'low' | 'medium' | 'high'>('medium');
  const [riskLevels, setRiskLevels] = useState<Record<string, 'low' | 'medium' | 'high'>>({
    data: 'medium',
    downtime: 'low',
    iam: 'medium',
    cost: 'low',
    performance: 'medium',
    compliance: 'high'
  });
  const [dataSize, setDataSize] = useState<string>('1TB');
  const [downtimeTolerance, setDowntimeTolerance] = useState<string>('4 hours');
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [compareMode, setCompareMode] = useState<'rehost' | 'replatform'>('rehost');

  // Persist planner mode to localStorage
  useEffect(() => {
    localStorage.setItem('whyaws_planner_mode_v1', plannerMode);
  }, [plannerMode]);

  // Handle URL deep linking for planner mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'simple' || mode === 'advanced') {
      setPlannerMode(mode);
    }
  }, []);

  const handlePlannerModeChange = (mode: 'simple' | 'advanced') => {
    setPlannerMode(mode);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.replaceState({}, '', url.toString());
  };

  // Save plan to localStorage
  const savePlan = useCallback(() => {
    const plan = {
      mode: plannerMode,
      selectedR,
      readinessScore,
      riskLevels,
      dataSize,
      downtimeTolerance,
      timestamp: Date.now()
    };
    localStorage.setItem('whyaws_saved_plan', JSON.stringify(plan));
    alert('Plan saved successfully!');
  }, [plannerMode, selectedR, readinessScore, riskLevels, dataSize, downtimeTolerance]);

  // Copy share link
  const copyShareLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', plannerMode);
    url.searchParams.set('r', selectedR);
    url.searchParams.set('data', dataSize);
    url.searchParams.set('downtime', downtimeTolerance);
    navigator.clipboard.writeText(url.toString());
    alert('Share link copied to clipboard!');
  }, [plannerMode, selectedR, dataSize, downtimeTolerance]);

  // Download PDF (placeholder)
  const downloadPDF = useCallback(() => {
    // This would integrate with a PDF generation library
    alert('PDF download functionality would be implemented here');
  }, []);



  return (
    <div className="p-6 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to="/why-aws" className="hover:text-white transition-colors">Migration</Link>
        <span>/</span>
        <span className="text-white">Why AWS</span>
      </nav>

      {/* Hero Section */}
      <section className="grid lg:grid-cols-5 gap-8 items-start" data-whyaws-highlights={JSON.stringify({
        title: "Why AWS",
        description: "Built for first migrations and re-platforms—get timelines, TCO, and guardrails in minutes.",
        plannerMode,
        selectedR,
        dataSize,
        downtimeTolerance,
        readinessScore
      })}>
        <div className="lg:col-span-3">
          <h1 className="text-lg md:text-xl font-semibold mb-4 text-white">
            Why AWS
          </h1>
          <P className="text-sm md:text-base text-white/75 leading-relaxed mb-6">
            Built for first migrations and re-platforms—get timelines, TCO, and guardrails in minutes.
          </P>
          
          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => handlePlannerModeChange('simple')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Start Quick Estimate
            </button>
            <button
              onClick={() => handlePlannerModeChange('advanced')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors border border-white/20"
            >
              Open Advanced Planner
            </button>
          </div>

          {/* What You'll Get Checklist */}
          <div className="mb-6">
            <p className="text-sm text-slate-300 mb-2">You'll get:</p>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>✓ Timelines, TCO, guardrails, and risks</li>
            </ul>
          </div>
        </div>

        {/* Hero Image with Overlay */}
        <div className="lg:col-span-2">
          <div className="relative isolate aspect-video overflow-hidden rounded-2xl border shadow-lg">
            <img 
              src={HERO_IMG} 
              alt="Cloud migration illustration" 
              className="absolute inset-0 h-full w-full object-cover brightness-110 contrast-110"
              loading="lazy"
            />
            {/* Enhanced gradient mask for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Evidence Strip */}
      <section className="py-4 border-y border-white/10">
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Works with: <span className="text-white">Migration Hub</span> • <span className="text-white">DMS</span> • <span className="text-white">Config</span> (simulated)
          </p>
        </div>
      </section>

      {/* Migration Planner Section */}
      <section>
        <Card>
          {/* Planner Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-semibold mb-2 text-white">
                {plannerMode === 'simple' ? 'Quick Migration Estimator' : 'Advanced Migration Planner'}
              </h2>
              <p className="opacity-80">
                {plannerMode === 'simple' 
                  ? 'Get a quick estimate of your migration timeline and effort'
                  : 'Interactive migration planning with detailed timeline and resource allocation'
                }
              </p>
            </div>
            
            {/* Segmented Control */}
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => handlePlannerModeChange('simple')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  plannerMode === 'simple'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                aria-label="Switch to Simple mode"
              >
                Simple
              </button>
              <button
                onClick={() => handlePlannerModeChange('advanced')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  plannerMode === 'advanced'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                aria-label="Switch to Advanced mode"
              >
                Advanced
              </button>
            </div>
          </div>

          {/* 7 Rs Migration Strategies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Migration Strategy</h3>
            <div className="flex flex-wrap gap-2">
              {MIGRATION_RS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedR(r.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedR === r.id 
                      ? r.color + ' ring-2 ring-white/30' 
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {r.label}
                  <span className="block text-xs opacity-75">{r.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Readiness Score */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Readiness Score</h3>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setReadinessScore(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                      readinessScore === level
                        ? 'bg-green-500/20 text-green-300 ring-2 ring-green-500/30'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                Based on environment parity, data size, and downtime tolerance
              </div>
            </div>
          </div>

          {/* Risk Heatmap */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Risk Assessment</h3>
            <div className="grid grid-cols-3 gap-2 max-w-md">
              {RISK_CATEGORIES.map((risk) => (
                <div key={risk.id} className="text-center">
                  <div className="text-2xl mb-1">{risk.icon}</div>
                  <div className="text-xs text-slate-400 mb-2">{risk.label}</div>
                  <select
                    value={riskLevels[risk.id]}
                    onChange={(e) => setRiskLevels(prev => ({ ...prev, [risk.id]: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-white">Migration Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {MIGRATION_MILESTONES.map((milestone, index) => (
                <div key={milestone.id} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="text-sm font-medium text-white">{milestone.label}</div>
                  <div className="text-xs text-slate-400">{milestone.duration}</div>
                  <div className="text-xs text-slate-500">{milestone.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={savePlan}
              className="px-4 py-2 bg-green-600/20 text-green-300 rounded-lg text-sm font-medium hover:bg-green-600/30 transition-colors"
            >
              Save Plan
            </button>
            <button
              onClick={copyShareLink}
              className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-colors"
            >
              Copy Share Link
            </button>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-600/30 transition-colors"
            >
              Download PDF
            </button>
          </div>

          {/* Planner Content */}
          <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl border animate-pulse"></div>}>
            {plannerMode === 'simple' ? (
              <SimpleMigrationPlanner />
            ) : (
              <InteractiveMigrationPlanner onAsk={() => {}} />
            )}
          </Suspense>
        </Card>
      </section>

      {/* Enhanced Savings Calculator Section */}
      <section>
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Cost Calculator</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAssumptions(!showAssumptions)}
                className="px-3 py-1 bg-white/10 text-white rounded text-sm hover:bg-white/20 transition-colors"
              >
                Show Assumptions
              </button>
              <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                  onClick={() => setCompareMode('rehost')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    compareMode === 'rehost'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Rehost
                </button>
                <button
                  onClick={() => setCompareMode('replatform')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    compareMode === 'replatform'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Replatform
                </button>
              </div>
            </div>
          </div>

          {/* Assumptions Panel */}
          {showAssumptions && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-3 text-white">Assumptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="block text-slate-300 mb-1">Data Size</label>
                  <input
                    type="text"
                    value={dataSize}
                    onChange={(e) => setDataSize(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Downtime Tolerance</label>
                  <input
                    type="text"
                    value={downtimeTolerance}
                    onChange={(e) => setDowntimeTolerance(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Hourly Rate</label>
                  <input
                    type="text"
                    value="$150"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl border animate-pulse"></div>}>
            <FriendlySavingsCalculator />
          </Suspense>
        </Card>
      </section>

      {/* Scenario Carousel Section */}
      <section>
        <Card>
          <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl border animate-pulse"></div>}>
            <ScenarioCarousel />
          </Suspense>
        </Card>
      </section>

      {/* Footer Note */}
      <div className="text-center py-8">
        <p className="text-sm text-slate-500">
          Estimates are directional. Validate with discovery before cutover.
        </p>
      </div>
    </div>
  );
}