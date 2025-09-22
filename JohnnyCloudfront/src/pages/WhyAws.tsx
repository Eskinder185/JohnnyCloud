// src/pages/WhyAws.tsx
import { useEffect, useState, Suspense, lazy } from "react";
import AskJohnnyCloudVoice from "@/components/AskJohnnyCloudVoice";

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

// Debug logging for image path
console.log('🖼️ Why AWS Image Path:', HERO_IMG);
console.log('🖼️ Environment Variable:', import.meta.env.VITE_WHY_AWS_IMAGE);


// ---------- page ----------
export default function WhyAwsPage() {
  const [plannerMode, setPlannerMode] = useState<'simple' | 'advanced'>(() => {
    // Check localStorage for persisted mode
    const saved = localStorage.getItem('whyaws_planner_mode_v1');
    return (saved === 'simple' || saved === 'advanced') ? saved : 'simple';
  });

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


  return (
    <div className="p-6 space-y-12">
      {/* Hero Section */}
      <section className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <h1 className="text-4xl font-bold jc-title-gradient mb-4">Why AWS</h1>
          <P className="text-lg">
            Plan your cloud migration with confidence. Get realistic timelines, effort estimates, 
            and AWS service recommendations tailored to your workload.
          </P>
          
          {/* Voice Assistant */}
          <div className="mt-6">
            <AskJohnnyCloudVoice
              askEndpoint={`${import.meta.env.VITE_API_BASE}/chat`}
              context={{ page: "why-aws" }}
              onSent={(q, a) => console.log("Why AWS Q/A:", q, a)}
            />
          </div>
        </div>

        {/* Hero Image with Overlay - 16:9 ratio, rounded corners, soft shadow */}
        <div className="lg:col-span-2">
          <div className="relative isolate aspect-video overflow-hidden rounded-2xl border shadow-lg">
            <img 
              src={HERO_IMG} 
              alt="Cloud migration illustration" 
              className="absolute inset-0 h-full w-full object-cover brightness-[0.7] contrast-110"
              loading="lazy"
            />
            {/* Gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
            
            {/* Optional overlay content - uncomment if you want text on the image */}
            {/* <div className="absolute inset-0 flex items-end p-6">
              <div className="text-white [text-shadow:_0_1px_3px_rgba(0,0,0,.55)]">
                <h3 className="text-xl font-semibold">Cloud Migration</h3>
                <p className="text-sm opacity-95">Plan your AWS journey with confidence</p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Migration Planner Section */}
      <section>
        <Card>
          {/* Planner Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-semibold mb-2 jc-title-gradient">
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

      {/* Scenario Carousel Section */}
      <section>
        <Card>
          <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl border animate-pulse"></div>}>
            <ScenarioCarousel />
          </Suspense>
        </Card>
      </section>

      {/* Savings Calculator Section */}
      <section>
        <Card>
          <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl border animate-pulse"></div>}>
            <FriendlySavingsCalculator />
          </Suspense>
        </Card>
      </section>

    </div>
  );
}