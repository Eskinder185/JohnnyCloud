// src/pages/About.tsx
import React, { Suspense, lazy } from "react";
import { useReveal } from "@/components/useReveal";
import { TEAM_MEMBERS } from "@/data/team";

// Lazy load heavy components
const TeamProfileCard = lazy(() => import("@/components/TeamProfileCard"));
const RoadmapV3 = lazy(() => import("@/components/RoadmapV3"));
const OriginStory = lazy(() => import("@/components/OriginStory"));
const SecurityTrust = lazy(() => import("@/components/SecurityTrust"));

const HERO =
  (import.meta.env.VITE_ABOUT_HERO_IMAGE as string) ||
  "/images/finsecop.jpg";

// Debug logging for image path
console.log('🖼️ About Page Image Path:', HERO);
console.log('🖼️ Environment Variable:', import.meta.env.VITE_ABOUT_HERO_IMAGE);

/* Small card wrapper matching your style */
const Card = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => (
    <div ref={ref} className={`rounded-2xl border bg-white/5 p-5 ${className}`}>{children}</div>
  )
);
Card.displayName = 'Card';

export default function AboutPage() {
  const heroRef   = useReveal<HTMLImageElement>("reveal-right", 80);
  const aboutRef  = useReveal<HTMLDivElement>("reveal", 0);
  const how1      = useReveal<HTMLDivElement>("reveal-left", 0);
  const how2      = useReveal<HTMLDivElement>("reveal", 120);
  const how3      = useReveal<HTMLDivElement>("reveal-right", 240);
  const teamRef   = useReveal<HTMLDivElement>("reveal", 0);

  return (
    <div className="p-6 space-y-12">
      {/* Page Header */}
      <header>
        <h1 className="text-4xl font-bold jc-title-gradient mb-2">About JohnnyCloud</h1>
        <p className="text-xl text-white/70">
          The team and story behind your AWS FinOps and SecOps companion
        </p>
      </header>

      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-8 items-start">
        <div ref={aboutRef}>
          <h2 className="text-3xl font-semibold jc-title-gradient mb-4">Our Mission</h2>
          <div className="space-y-4 text-white/80 leading-relaxed">
            <p>
              JohnnyCloud unifies FinOps and SecOps for AWS—continuous optimization insights,
              compliance Guardrails (CIS/NIST/PCI), and one-click auto-remediation for common risks,
              plus a clear <em>Why AWS</em> view to explain the value.
            </p>
            <p>
              Use the chat assistant for natural-language analysis, remediation plans, and voice summaries.
              Your data stays in your account; we operate with least-privilege roles and return results to your UI.
            </p>
          </div>
        </div>

        {/* Hero Image with Overlay */}
        <div className="relative isolate h-[320px] md:h-[400px] overflow-hidden rounded-2xl border">
          <img
            ref={heroRef}
            src={HERO}
            alt="JohnnyCloud team working on AWS solutions"
            className="absolute inset-0 h-full w-full object-cover brightness-110 contrast-110 float-slow"
          />
          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/5"></div>
          
          {/* Optional overlay content - uncomment if you want text on the image */}
          {/* <div className="absolute inset-0 flex items-end p-6">
            <div className="backdrop-blur-subtle bg-black/30 rounded-xl px-4 py-2 inline-block">
              <h3 className="text-xl font-semibold text-white text-shadow-sm">Team Collaboration</h3>
              <p className="text-sm text-white/95">Building AWS solutions together</p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Origin Story */}
      <Suspense fallback={<div className="h-64 bg-white/5 rounded-2xl border animate-pulse"></div>}>
        <OriginStory />
      </Suspense>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-semibold jc-title-gradient mb-4">How It Works</h2>
        <p className="text-white/70 mb-6">
          Connect your AWS account, let the AI analyze cost, security, and reliability, then act with safe automations.
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card ref={how1} className="card-lift">
            <div className="text-cyan-300 text-xs font-medium mb-2">01</div>
            <div className="text-white font-semibold text-lg mb-2">Connect</div>
            <p className="text-white/70 text-sm leading-relaxed">
              Link AWS with cross-account roles. Read-only by default; elevate only for approved automations.
            </p>
          </Card>

          <Card ref={how2} className="card-lift">
            <div className="text-cyan-300 text-xs font-medium mb-2">02</div>
            <div className="text-white font-semibold text-lg mb-2">Analyze</div>
            <p className="text-white/70 text-sm leading-relaxed">
              Pull CloudWatch, Cost Explorer, Security Hub & GuardDuty to compute savings, posture, and drift.
            </p>
          </Card>

          <Card ref={how3} className="card-lift">
            <div className="text-cyan-300 text-xs font-medium mb-2">03</div>
            <div className="text-white font-semibold text-lg mb-2">Act</div>
            <p className="text-white/70 text-sm leading-relaxed">
              Trigger auto-remediation (e.g., block S3 public access) and produce evidence for audits.
            </p>
          </Card>
        </div>
      </section>

      {/* Roadmap */}
      <Suspense fallback={<div className="h-80 bg-white/5 rounded-2xl border animate-pulse"></div>}>
        <RoadmapV3 />
      </Suspense>

      {/* Security Trust */}
      <Suspense fallback={<div className="h-64 bg-white/5 rounded-2xl border animate-pulse"></div>}>
        <SecurityTrust />
      </Suspense>

      {/* Team Section */}
      <section ref={teamRef}>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold jc-title-gradient mb-2">Our Team</h2>
          <p className="text-white/70">
            The people behind JohnnyCloud—cloud architecture, security, and product experts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <Suspense key={member.email} fallback={<div className="h-80 bg-white/5 rounded-2xl border animate-pulse"></div>}>
              <TeamProfileCard member={member} index={index} />
            </Suspense>
          ))}
        </div>
      </section>
    </div>
  );
}