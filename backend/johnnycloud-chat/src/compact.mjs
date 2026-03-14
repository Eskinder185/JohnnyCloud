export function compactCost(resultsByTime, topN = 10) {
    const totals = {};
    for (const day of resultsByTime || []) {
      for (const g of day.Groups || []) {
        const svc = (g.Keys && g.Keys[0]) || "Other";
        const amt = parseFloat(g.Metrics?.UnblendedCost?.Amount || "0");
        totals[svc] = (totals[svc] || 0) + amt;
      }
    }
    const entries = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(([service, amount]) => ({ service, amount: +amount.toFixed(2) }));
    const totalUSD = +Object.values(totals).reduce((a, b) => a + b, 0).toFixed(2);
    return { totalUSD, topServices: entries };
  }
  
  export function compactAnomalies(anoms, topN = 5) {
    return (anoms || []).slice(0, topN).map(a => ({
      anomalyId: a.AnomalyId,
      start: a.AnomalyStartDate,
      end: a.AnomalyEndDate,
      totalImpactUSD: +(a.TotalImpact?.TotalImpactAmount?.Amount || "0")
    }));
  }
  
  export function compactSecHub(findings, topN = 10) {
    return (findings || []).slice(0, topN).map(f => ({
      title: f.Title,
      severity: f.Severity?.Label,
      product: f.ProductName,
      resource: f.Resources?.[0]?.Id,
      createdAt: f.CreatedAt
    }));
  }
  
  export function compactGuardDuty(findings, topN = 10) {
    return (findings || []).slice(0, topN).map(f => ({
      title: f.Title,
      type: f.Type,
      severity: f.Severity,
      instanceId: f.Resource?.InstanceDetails?.InstanceId || undefined,
      createdAt: f.CreatedAt
    }));
  }
  