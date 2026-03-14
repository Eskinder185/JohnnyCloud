import { CostExplorerClient, GetCostAndUsageCommand, GetAnomaliesCommand } from "@aws-sdk/client-cost-explorer";
import { REGION } from "../config.mjs";
import { ymd } from "../utils/time.mjs";

const ce = new CostExplorerClient({ region: REGION });

export async function getCostSummary() {
  const r = await ce.send(new GetCostAndUsageCommand({
    TimePeriod: { Start: ymd(-3), End: ymd(0) }, // last 3 days
    Granularity: "DAILY",
    Metrics: ["UnblendedCost"],
    GroupBy: [{ Type: "DIMENSION", Key: "SERVICE" }]
  }));
  return r.ResultsByTime ?? [];
}

export async function getCostAnomalies() {
  try {
    const r = await ce.send(new GetAnomaliesCommand({
      DateInterval: { StartDate: ymd(-14), EndDate: ymd(0) },
      MaxResults: 10
    }));
    return r.Anomalies ?? [];
  } catch {
    return [];
  }
}
