// src/pages/WhyAws.tsx
import { useEffect, useState, Suspense, lazy } from "react";
import { plannerStore } from "@/lib/plannerStore";
import { useKpiData } from "@/hooks/useKpiData";
import KpiCard from "@/components/KpiCard";

// Lazy load heavy components
const InteractiveMigrationPlanner = lazy(() => import("@/components/InteractiveMigrationPlanner"));
const BusinessImpactStatements = lazy(() => import("@/components/BusinessImpactStatements"));
const CustomerScenarios = lazy(() => import("@/components/CustomerScenarios"));
const SavingsCalculator = lazy(() => import("@/components/SavingsCalculator"));
const ClickableBenefits = lazy(() => import("@/components/ClickableBenefits"));

// ---------- shared UI (matches your sizing/colors) ----------
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-semibold mb-2">{children}</h2>
);
const P = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`opacity-80 ${className}`}>{children}</p>
);
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border bg-white/5 p-5 ${className}`}>{children}</div>
);

// ---------- env images (hero placeholder) ----------
const HERO_IMG =
  (import.meta.env.VITE_WHY_AWS_IMAGE as string | undefined) ||
  (import.meta.env.VITE_JC_IMAGE as string | undefined) ||
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200";

// ---------- existing value summary helper (optional) ----------
type ValueSummary = {
  savings?: { monthlyEstimate?: number };
  security?: { framework?: string; score?: number | null; topFails?: string[] };
  reliability?: { backupsPct?: number | null; multiAZPct?: number | null; rto?: string | null; rpo?: string | null };
  efficiency?: { serverlessPct?: number | null; managedPct?: number | null };
};

async function getValueSummary(): Promise<ValueSummary | null> {
  try {
    const url = import.meta.env.VITE_GUARDRAILS_API
      ? `${import.meta.env.VITE_GUARDRAILS_API}/summary?framework=CIS`
      : "";
    const cis = url ? await (await fetch(url)).json() : null;
    return {
      savings: { monthlyEstimate: undefined }, // keep empty unless you have optimize API wired
      security: {
        framework: cis?.framework || "CIS",
        score: cis?.score ?? null,
        topFails: (cis?.controls || []).filter((c: any) => c.status === "FAIL").slice(0, 3).map((c: any) => c.id),
      },
      reliability: { backupsPct: null, multiAZPct: null, rto: null, rpo: null },
      efficiency: { serverlessPct: null, managedPct: null },
    };
  } catch {
    return null;
  }
}

// ---------- page ----------
export default function WhyAwsPage() {
  const [value, setValue] = useState<ValueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [plannerInput] = useState(plannerStore.getInput());
  const chatApi = import.meta.env.VITE_CHAT_API as string | undefined;
  const kpiData = useKpiData();

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      const v = await getValueSummary();
      if (on) setValue(v);
      setLoading(false);
    })();
    return () => { on = false; };
  }, []);

  async function ask(payload: any) {
    if (!chatApi) return alert("VITE_CHAT_API not set");
    const body = {
      threadId: "whyaws::default",
      message: "Summarize business value and refine the migration plan.",
      speak: true, voice: "Joanna",
      valueContext: value ?? {},
      ...payload
    };
    const r = await fetch(chatApi, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    alert(j.reply ?? "Sent.");
  }


  return (
    <div className="p-6 space-y-12">
      {/* Hero row */}
      <section className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <H2>Why AWS</H2>
          <P>See cost savings, security posture, reliability readiness, and efficiency—calculated from your account.</P>
          
          {/* Clickable Benefits */}
          <div className="mt-6">
            <Suspense fallback={<div className="h-32 bg-white/5 rounded-2xl border animate-pulse"></div>}>
              <ClickableBenefits />
            </Suspense>
          </div>
          
          <div className="mt-6 flex gap-2">
            <a href="/metrics" className="px-4 py-2 rounded bg-black text-white">Open Optimization Hub</a>
            <a href="/guardrails" className="px-4 py-2 rounded border hover:bg-white/5">Open Guardrails</a>
            <button onClick={() => ask({})} className="px-4 py-2 rounded border hover:bg-white/5">Ask JohnnyCloud</button>
          </div>
        </div>

        {/* hero image placeholder */}
        <img src={HERO_IMG} alt="JohnnyCloud" className="w-full h-[320px] object-cover rounded-2xl border" />
      </section>

      {/* KPI Cards */}
      <section className="grid md:grid-cols-4 gap-4">
        <KpiCard
          title="Estimated Savings / mo"
          value={kpiData.savings.monthlyEstimate ? 
            kpiData.savings.monthlyEstimate.toLocaleString(undefined, {
              style: "currency", 
              currency: "USD", 
              maximumFractionDigits: 0
            }) : null}
          subtitle="Rightsizing + idle + storage transitions"
          loading={kpiData.savings.loading}
          error={kpiData.savings.error}
          emptyState={{
            message: "No savings recorded yet",
            cta: {
              text: "Open Optimization Hub",
              href: "/metrics",
              analyticsEvent: "whyaws.kpi.savings.cta.clicked"
            }
          }}
        />
        
        <KpiCard
          title="Security Posture (CIS)"
          value={kpiData.security.score ? `${kpiData.security.score}%` : null}
          subtitle={kpiData.security.topFails.length > 0 ? 
            `Top fails: ${kpiData.security.topFails.join(", ")}` : 
            "All controls passing"}
          loading={kpiData.security.loading}
          error={kpiData.security.error}
          emptyState={{
            message: "Enable Security Hub in us-east-1",
            cta: {
              text: "View setup guide",
              href: "/guardrails",
              analyticsEvent: "whyaws.kpi.security.cta.clicked"
            }
          }}
        />
        
        <KpiCard
          title="Reliability"
          value={kpiData.reliability.backupCoverage ? 
            `${kpiData.reliability.backupCoverage}% backups` : null}
          subtitle={kpiData.reliability.multiAZCoverage ? 
            `Multi-AZ: ${kpiData.reliability.multiAZCoverage}%` : 
            "Multi-AZ coverage"}
          loading={kpiData.reliability.loading}
          error={kpiData.reliability.error}
          emptyState={{
            message: "No backup telemetry found",
            cta: {
              text: "Open Guardrails",
              href: "/guardrails?filter=reliability",
              analyticsEvent: "whyaws.kpi.reliability.cta.clicked"
            }
          }}
        />
        
        <KpiCard
          title="Efficiency"
          value={kpiData.efficiency.serverlessPct ? 
            `${kpiData.efficiency.serverlessPct}% serverless` : null}
          subtitle={kpiData.efficiency.managedPct ? 
            `Managed services: ${kpiData.efficiency.managedPct}% of compute` : 
            "Managed services usage"}
          loading={kpiData.efficiency.loading}
          error={kpiData.efficiency.error}
          emptyState={{
            message: "We couldn't detect managed usage yet",
            cta: {
              text: "Open Optimization Hub",
              href: "/metrics?filter=compute",
              analyticsEvent: "whyaws.kpi.efficiency.cta.clicked"
            }
          }}
        />
      </section>

      {/* Interactive Migration Planner */}
      <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl border animate-pulse"></div>}>
        <InteractiveMigrationPlanner onAsk={ask} />
      </Suspense>

      {/* Business Impact Statements */}
      <Suspense fallback={<div className="h-64 bg-white/5 rounded-2xl border animate-pulse"></div>}>
        <BusinessImpactStatements input={plannerInput} />
      </Suspense>

      {/* Customer Scenarios */}
      <Suspense fallback={<div className="h-80 bg-white/5 rounded-2xl border animate-pulse"></div>}>
        <CustomerScenarios />
      </Suspense>

      {/* Savings Calculator */}
      <Suspense fallback={<div className="h-96 bg-white/5 rounded-2xl border animate-pulse"></div>}>
        <SavingsCalculator />
      </Suspense>

      {/* Narrative */}
      <Card>
        <H2>What this means</H2>
        <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
          <li>Costs: estimated savings if you act on current recommendations.</li>
          <li>Security: CIS score—focus on your top failing controls.</li>
          <li>Reliability: target RTO/RPO; ensure backups & multi-AZ.</li>
          <li>Efficiency: increase serverless & managed services to reduce ops toil.</li>
        </ul>
      </Card>

      {!loading && !value && (
        <div className="rounded-2xl border p-5 text-sm opacity-80">
          No account context yet. Set <code>VITE_GUARDRAILS_API</code> (and metrics/optimize if available).
        </div>
      )}
    </div>
  );
}