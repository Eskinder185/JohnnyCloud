import React from "react";
import PageShell from "@/components/ui/PageShell";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";

const API = import.meta.env.VITE_METRICS_API?.replace(/\/$/, "") || "";

type CostSummary = {
  mtdUSD?: number;
  forecastUSD?: number|null;
  daily?: {date:string; usd:number}[];
  topServices?: {service:string; usd:number}[];
  error?: string;
}
type Anomaly = { start:string; end?:string; impactUSD:number; score:number; rootCauses:any[] }
type CostAnoms = { anomalies?: Anomaly[]; error?: string }

type GuardDuty = { enabled?: boolean; counts?: {low:number;medium:number;high:number}; latest?: {title:string;severity:number;lastSeen:string}[]; error?:string }
type SecHub = { enabled?: boolean; failedByStandard?: {standard:string;count:number}[]; error?: string }
type IAMHyg = { passwordPolicy?: "present"|"missing"; noMFA?: string[]; oldKeys?: {user:string; key:string}[]; error?:string }
type NetExpo = { openSecurityGroups?: {group:string;from?:number;to?:number}[]; publicBucketsCount?: number; error?:string }

function useGet<T>(path: string) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const fetcher = React.useCallback(async () => {
    if (!API) { setErr("VITE_METRICS_API not set"); setLoading(false); return; }
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(API + path, { method: "GET" });
      const j = await r.json();
      setData(j);
    } catch (e:any) {
      setErr(e?.message || "request failed");
    } finally { setLoading(false); }
  }, [path]);

  React.useEffect(() => { fetcher(); }, [fetcher]);

  return { data, loading, err, refetch: fetcher };
}

function Money({ v }:{v?: number|null}) {
  if (v === null || v === undefined || Number.isNaN(v)) return <span className="text-jc-dim">—</span>;
  return <span>${v.toFixed(2)}</span>;
}

export default function Metrics(){
  // COST
  const cost = useGet<CostSummary>("/cost/summary");
  const anom = useGet<CostAnoms>("/cost/anomalies");
  // SECURITY
  const gd   = useGet<GuardDuty>("/security/guardduty");
  const hub  = useGet<SecHub>("/security/hub");
  const iam  = useGet<IAMHyg>("/security/iam");
  const net  = useGet<NetExpo>("/network/exposure");

  const onRefresh = () => { cost.refetch(); anom.refetch(); gd.refetch(); hub.refetch(); iam.refetch(); net.refetch(); };

  return (
    <PageShell variant="none">
      <div className="flex items-start gap-3 mb-6">
        <Heading as="h1" className="text-3xl sm:text-4xl">Metrics</Heading>
        <div className="ml-auto"><Button onClick={onRefresh}>Refresh</Button></div>
      </div>

      {/* COST ROW */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-sm text-jc-dim mb-1">Month-to-date Spend</div>
          <div className="text-3xl font-extrabold"><Money v={cost.data?.mtdUSD} /></div>
          <div className="text-sm text-jc-dim mt-2">Forecast: <Money v={cost.data?.forecastUSD} /></div>
          {cost.loading && <div className="text-jc-dim text-sm mt-2">loading…</div>}
          {cost.err && <div className="text-rose-300 text-sm mt-2">{cost.err}</div>}
        </Card>

        <Card className="p-5 md:col-span-2">
          <div className="text-sm text-jc-dim mb-2">Daily Spend (last 7 days)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-jc-dim">
                <tr><th className="text-left py-1 pr-4">Date</th><th className="text-right py-1">USD</th></tr>
              </thead>
              <tbody>
                {(cost.data?.daily || []).slice(-7).map((d) => (
                  <tr key={d.date} className="border-t border-white/5">
                    <td className="py-1 pr-4">{d.date}</td>
                    <td className="py-1 text-right"><Money v={d.usd} /></td>
                  </tr>
                ))}
                {!cost.loading && (!cost.data?.daily || cost.data.daily.length===0) && (
                  <tr><td colSpan={2} className="py-2 text-jc-dim">no data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Card className="p-5">
          <div className="text-sm text-jc-dim mb-2">Active Cost Anomalies (30d)</div>
          {anom.loading && <div className="text-jc-dim text-sm">loading…</div>}
          {anom.err && <div className="text-rose-300 text-sm">{anom.err}</div>}
          <ul className="text-sm space-y-2">
            {(anom.data?.anomalies || []).slice(0,6).map((a, i) => (
              <li key={i} className="p-3 rounded-xl bg-white/3">
                <div className="font-semibold"><Money v={a.impactUSD} /> impact</div>
                <div className="text-jc-dim">score {Math.round(a.score)} • {a.start} → {a.end || "ongoing"}</div>
                {a.rootCauses?.length>0 && (
                  <div className="text-jc-dim mt-1">root cause: {a.rootCauses.map((r:any)=> r.Service || r.LinkedAccount).filter(Boolean).join(", ")}</div>
                )}
              </li>
            ))}
            {!anom.loading && (!anom.data?.anomalies || anom.data.anomalies.length===0) && (
              <li className="text-jc-dim">no anomalies</li>
            )}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-jc-dim mb-2">Top Services (MTD)</div>
          <ul className="text-sm space-y-2">
            {(cost.data?.topServices || []).map((s) => (
              <li key={s.service} className="flex items-center justify-between">
                <span>{s.service}</span><span className="text-jc-dim"><Money v={s.usd} /></span>
              </li>
            ))}
            {!cost.loading && (!cost.data?.topServices || cost.data.topServices.length===0) && (
              <li className="text-jc-dim">no data</li>
            )}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-jc-dim mb-2">GuardDuty Findings (7d)</div>
          {gd.data?.enabled === false && <div className="text-jc-dim">GuardDuty disabled</div>}
          {gd.data?.enabled && (
            <>
              <div className="flex gap-3 text-sm">
                <span>High: {gd.data?.counts?.high ?? 0}</span>
                <span>Med: {gd.data?.counts?.medium ?? 0}</span>
                <span>Low: {gd.data?.counts?.low ?? 0}</span>
              </div>
              <ul className="text-sm mt-2 space-y-1">
                {(gd.data?.latest || []).map((f,i)=>(
                  <li key={i} className="truncate"><span className="text-jc-dim">{f.lastSeen}</span> — {f.title}</li>
                ))}
              </ul>
            </>
          )}
          {gd.err && <div className="text-rose-300 text-sm">{gd.err}</div>}
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <Card className="p-5">
          <div className="text-sm text-jc-dim mb-2">Security Hub – Failed Controls (7d)</div>
          {hub.data?.enabled === false && <div className="text-jc-dim">Security Hub disabled</div>}
          {(hub.data?.failedByStandard || []).length > 0 && (
            <ul className="text-sm space-y-2">
              {hub.data!.failedByStandard!.map((x)=>(
                <li key={x.standard} className="flex justify-between"><span>{x.standard}</span><span className="text-jc-dim">{x.count}</span></li>
              ))}
            </ul>
          )}
          {hub.err && <div className="text-rose-300 text-sm">{hub.err}</div>}
        </Card>

        <Card className="p-5">
          <div className="text-sm text-jc-dim mb-2">IAM Hygiene</div>
          <div className="text-sm">Password policy: <span className={iam.data?.passwordPolicy === "missing" ? "text-rose-300" : "text-emerald-300"}>{iam.data?.passwordPolicy || "—"}</span></div>
          <div className="text-sm mt-2">Users without MFA: <span className="text-jc-dim">{iam.data?.noMFA?.length ?? 0}</span></div>
          <div className="text-sm mt-1">Keys &gt; 90 days: <span className="text-jc-dim">{iam.data?.oldKeys?.length ?? 0}</span></div>
          {!iam.loading && (!iam.data?.noMFA || iam.data.noMFA.length===0) && (!iam.data?.oldKeys || iam.data.oldKeys.length===0) && (
            <div className="text-jc-dim text-sm mt-2">no issues detected</div>
          )}
          {iam.err && <div className="text-rose-300 text-sm">{iam.err}</div>}
        </Card>

        <Card className="p-5">
          <div className="text-sm text-jc-dim mb-2">Network Exposure</div>
          <div className="text-sm">Public S3 buckets: <span className="text-jc-dim">{net.data?.publicBucketsCount ?? 0}</span></div>
          <div className="text-sm mt-2">Security groups open to 0.0.0.0/0 on 22/3389/80/443:</div>
          <ul className="text-sm mt-1 space-y-1 max-h-40 overflow-auto">
            {(net.data?.openSecurityGroups || []).slice(0,10).map((g,i)=>(
              <li key={i} className="truncate">{g.group} {g.from!==undefined ? `(${g.from}-${g.to ?? g.from})` : ""}</li>
            ))}
            {!net.loading && (!net.data?.openSecurityGroups || net.data.openSecurityGroups.length===0) && (
              <li className="text-jc-dim">none</li>
            )}
          </ul>
          {net.err && <div className="text-rose-300 text-sm">{net.err}</div>}
        </Card>
      </div>
    </PageShell>
  );
}