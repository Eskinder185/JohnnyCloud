import { useState, useEffect, Suspense, lazy } from "react";
import PageShell from "@/components/ui/PageShell";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/Skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getJwt, isLoggedIn } from "@/lib/auth";
import { formatCurrency } from "@/lib/metricsUtils";
import { MetricsFallback } from "@/components/FallbackContent";
import { cachedFetch } from "@/lib/apiCache";

// Lazy load chart components
const SpendTrendChart = lazy(() => import("@/components/charts/SpendTrendChart"));
const SecurityFindingsChart = lazy(() => import("@/components/charts/SecurityFindingsChart"));
const SavingsProgressTracker = lazy(() => import("@/components/SavingsProgressTracker"));
const AnomaliesList = lazy(() => import("@/components/AnomaliesList"));
const SecurityFindingsList = lazy(() => import("@/components/SecurityFindingsList"));

// Enhanced data types
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
    dailySpend7d: { date: string; usd: number; forecast?: number }[];
    topServicesMTD: { service: string; usd: number }[];
    securityFindings7d: { date: string; high: number; medium: number; low: number }[];
  };
  anomalies: Array<{
    id: string;
    service: string;
    resource?: string;
    region?: string;
    currentAmount: number;
    baselineAmount: number;
    timestamp: string;
    period: string;
    driverResource?: string;
    notes?: string;
  }>;
  securityFindings: Array<{
    id: string;
    title: string;
    provider: 'GuardDuty' | 'SecurityHub';
    severity: string | number;
    account: string;
    region: string;
    resourceId: string;
    status: 'Active' | 'Suppressed' | 'Resolved';
    firstSeen: string;
    lastSeen: string;
    link?: string;
  }>;
  savings: {
    totalSavings: number;
    optimizationCount: number;
    targetSavings?: number;
    topActions?: Array<{ action: string; savings: number }>;
  };
  meta: {
    costExplorerReady: boolean;
    securityHubEnabled: boolean;
    guardDutyEnabled: boolean;
  };
};

export default function Metrics() {
  const [data, setData] = useState<MetricsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'mtd' | 'qtd'>('7d');
  const [dataSource, setDataSource] = useState<'guardduty' | 'securityhub' | 'both'>('both');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getJwt();
      if (!token || !isLoggedIn()) {
        setError("not_authenticated");
        return;
      }

      const apiUrl = import.meta.env.VITE_METRICS_API || "https://4z2t2pj4r4.execute-api.us-east-1.amazonaws.com/metrics";
      
      console.log('Fetching metrics from:', apiUrl);
      console.log('Time range:', timeRange, 'Data source:', dataSource);
      
      const res = await cachedFetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        body: JSON.stringify({ timeRange, dataSource }),
      }, 2 * 60 * 1000); // Cache for 2 minutes

      console.log('Response status:', res.status, res.statusText);

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const e = await res.json();
          errorMessage = e.error || e.message || errorMessage;
        } catch {
          // If response is not JSON, use the status text
        }
        console.error('API Error:', errorMessage);
        setError(errorMessage);
        return;
      }
      const json = await res.json();
      console.log('Received data:', json);
      console.log('Anomalies structure:', json.anomalies);
      console.log('SecurityFindings structure:', json.securityFindings);
      console.log('Meta structure:', json.meta);
      console.log('Security Hub enabled:', json.meta?.securityHubEnabled);
      
      // Validate data structure
      if (!json || typeof json !== 'object') {
        throw new Error('Invalid data format received from API');
      }
      
      // Ensure required properties exist with defaults
      const validatedData = {
        cards: json.cards || {
          mtdSpendUSD: 0,
          forecastUSD: 0,
          anomalies30d: 0,
          guardDutyFindings7d: 0,
          secHubFailedControls7d: 0,
          iamUsersWithoutMFA: 0,
          iamKeysOver90d: 0,
          publicBuckets: 0,
          openSgRules: 0
        },
        charts: json.charts || {
          dailySpend7d: [],
          topServicesMTD: [],
          securityFindings7d: []
        },
        anomalies: Array.isArray(json.anomalies) ? json.anomalies : 
                   (Array.isArray(json.anomalies?.items) ? json.anomalies.items : 
                    (Array.isArray(json.anomalies?.data) ? json.anomalies.data : [])),
        securityFindings: Array.isArray(json.securityFindings) ? json.securityFindings : 
                         (Array.isArray(json.securityFindings?.items) ? json.securityFindings.items : 
                          (Array.isArray(json.securityFindings?.data) ? json.securityFindings.data : [])),
        savings: json.savings || {
          totalSavings: 0,
          optimizationCount: 0,
          targetSavings: 0,
          topActions: []
        },
        meta: json.meta || {
          costExplorerReady: false,
          securityHubEnabled: false,
          guardDutyEnabled: false
        }
      };
      
      // Temporary override for testing - remove this after fixing the backend
      // Uncomment the next line to force Security Hub as enabled for testing
      // validatedData.meta.securityHubEnabled = true;
      
      console.log('Validated anomalies:', validatedData.anomalies);
      console.log('Validated securityFindings:', validatedData.securityFindings);
      setData(validatedData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, dataSource]);

  const onRefresh = () => {
    fetchData();
  };

  // Show loading state
  if (loading) {
    return (
      <PageShell variant="none">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </PageShell>
    );
  }

  // Show error state with fallback
  if (error) {
    return (
      <PageShell variant="none">
        <MetricsFallback onRetry={onRefresh} />
      </PageShell>
    );
  }

  return (
    <PageShell variant="none">
      <div className="flex items-start gap-3 mb-6">
        <Heading className="text-3xl sm:text-4xl">Metrics</Heading>
        <div className="ml-auto flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-sm text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="mtd">Month to date</option>
            <option value="qtd">Quarter to date</option>
          </select>
          <Button onClick={onRefresh}>Refresh</Button>
        </div>
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
      
      {/* Error States */}
      {error === "not_authenticated" && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-amber-300 text-sm">
            Please log in to view your metrics.
          </p>
        </div>
      )}
      
      {error && error !== "not_authenticated" && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-300 text-sm">
            Error loading metrics: {error}
          </p>
          <button 
            onClick={onRefresh}
            className="mt-2 px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm hover:bg-red-500/30"
          >
            Retry
          </button>
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
            <Skeleton className="mt-4 h-48 w-full" />
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
          {/* Top Row: Spend Card + Trend Chart */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Month-to-date Spend</h3>
                <span className="text-[10px] text-slate-400">USD</span>
              </div>
              <div className="text-3xl font-semibold text-slate-100">
                {formatCurrency(data.cards.mtdSpendUSD)}
              </div>
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">
                Forecast: <span className="text-slate-200">{formatCurrency(data.cards.forecastUSD)}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Spend Trend</h3>
                <span className="text-[10px] text-slate-400">USD</span>
              </div>
              <ErrorBoundary>
                <Suspense fallback={<div className="h-64 bg-white/5 rounded animate-pulse"></div>}>
                  <SpendTrendChart 
                    data={data.charts?.dailySpend7d || []} 
                    loading={loading}
                    timeRange={timeRange}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          {/* Second Row: Savings Tracker + Security Chart */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Suspense fallback={<div className="h-64 bg-white/5 rounded animate-pulse"></div>}>
              <SavingsProgressTracker
                totalSavings={data.savings.totalSavings}
                optimizationCount={data.savings.optimizationCount}
                targetSavings={data.savings.targetSavings}
                topActions={data.savings.topActions}
                loading={loading}
              />
            </Suspense>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur md:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Security Findings Trend</h3>
                <div className="flex gap-1">
                  {(['guardduty', 'securityhub', 'both'] as const).map(source => (
                    <button
                      key={source}
                      onClick={() => setDataSource(source)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        dataSource === source
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {source === 'both' ? 'Both' : source === 'guardduty' ? 'GuardDuty' : 'Security Hub'}
                    </button>
                  ))}
                </div>
              </div>
              <Suspense fallback={<div className="h-64 bg-white/5 rounded animate-pulse"></div>}>
                <SecurityFindingsChart 
                  data={data.charts.securityFindings7d} 
                  loading={loading}
                  dataSource={dataSource}
                />
              </Suspense>
            </div>
          </div>

          {/* Third Row: Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Active Anomalies</h3>
                <span className="text-[10px] text-slate-400">Count</span>
              </div>
              <div className="text-2xl font-bold text-cyan-300">{data.cards.anomalies30d}</div>
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">anomalies detected</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">GuardDuty Findings</h3>
                <span className="text-[10px] text-slate-400">Count</span>
              </div>
              <div className="text-2xl font-bold text-cyan-300">{data.cards.guardDutyFindings7d}</div>
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">findings detected</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Security Hub Controls</h3>
                <span className="text-[10px] text-slate-400">Count</span>
              </div>
              <div className="text-2xl font-bold text-cyan-300">{data.cards.secHubFailedControls7d}</div>
              <div className="mt-4 jc-glow-line" />
              <p className="mt-3 text-xs text-slate-400">failed controls</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-300">Top Services (MTD)</h3>
                <span className="text-[10px] text-slate-400">USD</span>
              </div>
              <ul className="text-sm space-y-2">
                {data.charts.topServicesMTD.slice(0, 3).map((s) => (
                  <li key={s.service} className="flex items-center justify-between">
                    <span className="text-slate-200 truncate">{s.service}</span>
                    <span className="text-slate-400">{formatCurrency(s.usd)}</span>
                  </li>
                ))}
                {data.charts.topServicesMTD.length === 0 && (
                  <li className="text-slate-400">no data</li>
                )}
              </ul>
              <div className="mt-4 jc-glow-line" />
            </div>
          </div>

          {/* Fourth Row: Detailed Lists */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="h-96 bg-white/5 rounded animate-pulse"></div>}>
              <AnomaliesList 
                anomalies={data.anomalies} 
                loading={loading}
              />
            </Suspense>
            <Suspense fallback={<div className="h-96 bg-white/5 rounded animate-pulse"></div>}>
              <SecurityFindingsList 
                findings={data.securityFindings} 
                loading={loading}
              />
            </Suspense>
          </div>

          {/* Fifth Row: Additional Security Metrics */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
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