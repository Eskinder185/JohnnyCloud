const URL = import.meta.env.VITE_METRICS_API;

export interface MetricsData {
  cost: any;
  anomalies: any;
  guardduty: any;
  securityHub: any;
  iam: any;
  network: any;
  meta: {
    costExplorerReady: boolean;
    securityHubEnabled: boolean;
    guardDutyEnabled: boolean;
  };
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
    dailySpend7d: Array<{ date: string; usd: number }>;
    topServicesMTD: Array<{ service: string; usd: number }>;
  };
}

export async function fetchMetrics(): Promise<MetricsData> {
  const id = sessionStorage.getItem("ID_TOKEN");
  if (!id) throw new Error("not_authenticated");

  const r = await fetch(URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${id}`,
    },
    body: "{}",
  });
  
  if (r.status === 401) throw new Error("not_authenticated");
  if (!r.ok) throw new Error(await r.text());
  
  return r.json();
}
