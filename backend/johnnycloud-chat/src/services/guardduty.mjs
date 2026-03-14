import { GuardDutyClient, ListDetectorsCommand, ListFindingsCommand, GetFindingsCommand as GDGetFindingsCommand } from "@aws-sdk/client-guardduty";
import { REGION } from "../config.mjs";

const gd = new GuardDutyClient({ region: REGION });

export async function getGuardDutyFindings() {
  try {
    const d = await gd.send(new ListDetectorsCommand({}));
    if (!d.DetectorIds?.length) return [];
    const DetectorId = d.DetectorIds[0];

    const lf = await gd.send(new ListFindingsCommand({ DetectorId, MaxResults: 20 }));
    if (!lf.FindingIds?.length) return [];

    const gf = await gd.send(new GDGetFindingsCommand({
      DetectorId,
      FindingIds: lf.FindingIds.slice(0, 20)
    }));
    return gf.Findings ?? [];
  } catch {
    return [];
  }
}
