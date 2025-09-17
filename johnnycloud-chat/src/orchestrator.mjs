import { compactCost, compactAnomalies, compactSecHub, compactGuardDuty } from "./compact.mjs";
import { askBedrock } from "./services/bedrock.mjs";
import { fetchHistory, saveTurn } from "./services/memory.mjs";
import { synthesizeIfRequested } from "./services/tts.mjs";
import { getCostSummary, getCostAnomalies } from "./services/cost.mjs";
import { getSecurityFindings } from "./services/securityhub.mjs";
import { getGuardDutyFindings } from "./services/guardduty.mjs";


export async function run(event, body, opts = {}) {
  const providedMessage = typeof opts.userMessage === "string" ? opts.userMessage : undefined;
  const trimmedOption = providedMessage?.trim?.() || "";
  const fallbackMessage = (body?.message || "").trim();
  const userMessage = trimmedOption || fallbackMessage || "Give me a quick status.";
  const sub = event?.requestContext?.authorizer?.jwt?.claims?.sub || "anon";
  const threadId = String(body?.threadId || `${sub}::default`);
  const speak = !!body?.speak;
  const voice = body?.voice;
  const skipPolly = !!opts.skipPolly;

  // 1) Short history
  const history = await fetchHistory(threadId);

  // 2) Live snapshot (parallel)
  const [costRaw, anomaliesRaw, secRaw, gdRaw] = await Promise.all([
    getCostSummary(),
    getCostAnomalies(),
    getSecurityFindings(),
    getGuardDutyFindings()
  ]);

  const snapshot = {
    cost: compactCost(costRaw, 10),
    anomalies: compactAnomalies(anomaliesRaw, 5),
    securityHub: compactSecHub(secRaw, 10),
    guardDuty: compactGuardDuty(gdRaw, 10)
  };

  // 3) Build Bedrock messages: history + snapshot + new question
  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: "user", content: `Here is the latest AWS snapshot (cost, security, guardduty). Use it if relevant:\n${JSON.stringify(snapshot)}` },
    { role: "user", content: userMessage }
  ];

  let reply = "No response.";
  try {
    reply = await askBedrock(messages);
  } catch (err) {
    const wrapped = new Error(err?.message || "Bedrock invocation failed");
    wrapped.code = "bedrock_failed";
    wrapped.cause = err;
    throw wrapped;
  }

  // 4) Save turns
  await saveTurn(threadId, { role: "user", content: userMessage });
  await saveTurn(threadId, { role: "assistant", content: reply });

  // 5) Optional TTS
  let audio = null;
  if (speak && !skipPolly) {
    try {
      audio = await synthesizeIfRequested({ speak: true, voice: voice || "Joanna", text: reply });
    } catch (err) {
      console.warn("Polly failed, returning text only:", err?.message || err);
    }
  }

  return { reply, audio };
}
