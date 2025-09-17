import { SecurityHubClient, GetFindingsCommand } from "@aws-sdk/client-securityhub";
import { REGION } from "../config.mjs";

const sh = new SecurityHubClient({ region: REGION });

export async function getSecurityFindings() {
  try {
    const r = await sh.send(new GetFindingsCommand({
      MaxResults: 20,
      Filters: {
        SeverityLabel: [
          { Value: "HIGH", Comparison: "EQUALS" },
          { Value: "CRITICAL", Comparison: "EQUALS" }
        ],
        RecordState: [{ Value: "ACTIVE", Comparison: "EQUALS" }]
      }
    }));
    return r.Findings ?? [];
  } catch (err) {
    if (err?.name === "InvalidAccessException") return [];
    throw err;
  }
}
