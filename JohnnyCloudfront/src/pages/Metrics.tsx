import { useState, useEffect } from "react";
import PageShell from "@/components/ui/PageShell";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";
import { getJwt, isLoggedIn } from "@/lib/auth";

function Money({ v }:{v?: number|null}) {
  if (v === null || v === undefined || Number.isNaN(v)) return <span className="text-jc-dim">—</span>;
  return <span>${v.toFixed(2)}</span>;
}

type MetricsPayload = {
  cards: {
    mtdSpendUSD: number;
    forecastUSD: number;
    anomalies30d: number;
    guardDutyFindings7d: number;
    secHubFailedControls7d: number;
    iamUsersWithoutMFA: number;
    iamKeysOver90d: number;
    publicBuckets: number;
    openSgRules: number;
  };
  charts: {
    dailySpend7d: { date: string; usd: number }[];
    topServicesMTD: { service: string; usd: number }[];
  };
  meta: {
    costExplorerReady: boolean;
    securityHubEnabled: boolean;
    guardDutyEnabled: boolean;
  };
};

export default function Metrics(){
  const [data, setData] = useState<MetricsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getJwt();
      if (!token || !isLoggedIn()) {
        setError("not_authenticated");
        return;
      }

      // For development, you might need to use the production URL to avoid CORS issues
      const apiUrl = import.meta.env.VITE_METRICS_API || "https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/metrics";
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: "{}",
      });

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const e = await res.json();
          errorMessage = e.error || e.message || errorMessage;
        } catch {
          // If response is not JSON, use the status text
        }
        setError(errorMessage);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    fetchData();
  };

  return (
    <PageShell variant="none">
      <div className="flex items-start gap-3 mb-6">
        <Heading className="text-3xl sm:text-4xl">Metrics</Heading>
        <div className="ml-auto"><Button onClick={onRefresh}>Refresh</Button></div>
      </div>

      {/* Conditional Banners */}
      {data && !data.meta.costExplorerReady && (
        <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <div className="text-yellow-200 text-sm">
            Cost Explorer is still backfilling. Values may be zero for ~24h.
          </div>
        </div>
      )}
      {data && !data.meta.securityHubEnabled && (
        <div className="mb-4 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
          <div className="text-orange-200 text-sm">
            Security Hub is disabled. Enable it in us-east-1 to see failed controls.
          </div>
        </div>
      )}
      {data && !data.meta.guardDutyEnabled && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="text-red-200 text-sm">
            Enable GuardDuty in us-east-1.
          </div>
        </div>
      )}

      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-8 w-24" />
            <Skeleton className="mt-4 h-4 w-32" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur md:col-span-2">
            <Skeleton className="h-5 w-32" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="text-red-200 text-sm">Error: {error}</div>
        </div>
      )}

      {data && (
        <>
          {/* COST ROW */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              {/* title row */}
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Month-to-date Spend</h3>
                <span className="text-[10px] text-slate-400">USD</span>
              </div>

              {/* value / content */}
              <div className="text-3xl font-semibold text-slate-100">
                <Money v={data.cards.mtdSpendUSD} />
              </div>

              {/* foot */}
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">
                Forecast: <span className="text-slate-200"><Money v={data.cards.forecastUSD} /></span>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Daily Spend (last 7 days)</h3>
                <span className="text-[10px] text-slate-400">USD</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-slate-400">
                    <tr><th className="text-left py-1 pr-4">Date</th><th className="text-right py-1">USD</th></tr>
                  </thead>
                  <tbody>
                    {data.charts.dailySpend7d.map((d) => (
                      <tr key={d.date} className="border-t border-white/5">
                        <td className="py-1 pr-4 text-slate-200">{d.date}</td>
                        <td className="py-1 text-right text-slate-100"><Money v={d.usd} /></td>
                      </tr>
                    ))}
                    {data.charts.dailySpend7d.length === 0 && (
                      <tr><td colSpan={2} className="py-2 text-slate-400">no data</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 jc-glow-line" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Active Cost Anomalies (30d)</h3>
                <span className="text-[10px] text-slate-400">Count</span>
              </div>
              <div className="text-2xl font-bold text-cyan-300">{data.cards.anomalies30d}</div>
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">anomalies detected</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Top Services (MTD)</h3>
                <span className="text-[10px] text-slate-400">USD</span>
              </div>
              <ul className="text-sm space-y-2">
                {data.charts.topServicesMTD.map((s) => (
                  <li key={s.service} className="flex items-center justify-between">
                    <span className="text-slate-200">{s.service}</span><span className="text-slate-400"><Money v={s.usd} /></span>
                  </li>
                ))}
                {data.charts.topServicesMTD.length === 0 && (
                  <li className="text-slate-400">no data</li>
                )}
              </ul>
              <div className="mt-4 jc-glow-line" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">GuardDuty Findings (7d)</h3>
                <span className="text-[10px] text-slate-400">Count</span>
              </div>
              <div className="text-2xl font-bold text-cyan-300">{data.cards.guardDutyFindings7d}</div>
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">findings detected</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Security Hub – Failed Controls (7d)</h3>
                <span className="text-[10px] text-slate-400">Count</span>
              </div>
              <div className="text-2xl font-bold text-cyan-300">{data.cards.secHubFailedControls7d}</div>
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">failed controls</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">IAM Hygiene</h3>
                <span className="text-[10px] text-slate-400">Issues</span>
              </div>
              <div className="text-sm mb-2">Users without MFA: <span className="text-cyan-300 font-semibold">{data.cards.iamUsersWithoutMFA}</span></div>
              <div className="text-sm">Keys &gt; 90 days: <span className="text-cyan-300 font-semibold">{data.cards.iamKeysOver90d}</span></div>
              <div className="mt-4 jc-glow-line" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Network Exposure</h3>
                <span className="text-[10px] text-slate-400">Issues</span>
              </div>
              <div className="text-sm mb-2">Public S3 buckets: <span className="text-cyan-300 font-semibold">{data.cards.publicBuckets}</span></div>
              <div className="text-sm">Open SG rules: <span className="text-cyan-300 font-semibold">{data.cards.openSgRules}</span></div>
              <div className="mt-4 jc-glow-line" />
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}