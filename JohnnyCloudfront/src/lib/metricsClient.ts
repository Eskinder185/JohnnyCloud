const API_BASE = import.meta.env.VITE_API_BASE;
const URL = `${API_BASE}/metrics`;

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
  const r = await fetch(URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: "{}",
  });
  
  if (!r.ok) {
    const errorText = await r.text();
    console.error('Metrics API error:', r.status, r.statusText, errorText);
    throw new Error(`Metrics API failed: ${r.status} ${r.statusText} - ${errorText}`);
  }
  
  try {
    return await r.json();
  } catch (parseError) {
    console.error('Metrics API JSON parse error:', parseError);
    const responseText = await r.text();
    console.error('Response text:', responseText);
    throw new Error(`Failed to parse metrics response: ${parseError}`);
  }
}
