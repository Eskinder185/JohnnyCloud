import { json, options, corsHeaders } from "./utils/http.mjs";
import { run } from "./orchestrator.mjs";

export const handler = async (event) => {
  if (event?.requestContext?.http?.method === "OPTIONS") return options();

  // --- Safety toggles via env ---
  const SAFE_MODE = process.env.SAFE_MODE === "1";
  const SKIP_POLLY = process.env.SKIP_POLLY === "1";

  // Parse JSON body safely
  let body = {};
  try {
    body = event?.body ? JSON.parse(event.body) : {};
  } catch (e) {
    console.error("JSON parse error:", e);
  }

  const rawMessage = typeof body.message === "string" ? body.message : "";
  const userMessage = rawMessage.trim() ? rawMessage.trim() : "Give me a quick status.";

  if (SAFE_MODE) {
    return {
      statusCode: 200,
      headers: { "content-type": "application/json", ...corsHeaders() },
      body: JSON.stringify({ reply: `SAFE_MODE on. You said: ${userMessage}` })
    };
  }

  try {
    const result = await run(event, body, { userMessage, skipPolly: SKIP_POLLY });
    return json(200, result);
  } catch (e) {
    if (e?.code === "bedrock_failed") {
      console.error("Bedrock error:", e?.cause || e);
      return {
        statusCode: 502,
        headers: { "content-type": "application/json", ...corsHeaders() },
        body: JSON.stringify({ error: "bedrock_failed", detail: String(e?.cause?.message || e?.message || e) })
      };
    }

    console.error("JohnnyCloud chat error:", e);
    return json(500, { error: String(e?.message || e) });
  }
};
// src/guardrails-handler.mjs
const ORIGIN = process.env.CORS_ORIGIN || "https://d1zhi8uis2cnfs.cloudfront.net";

const cors = {
  "access-control-allow-origin": ORIGIN,
  "access-control-allow-headers": "content-type,authorization",
  "access-control-allow-methods": "GET,POST,OPTIONS",
};

function ok(body)    { return { statusCode: 200, headers: { "content-type":"application/json", ...cors }, body: JSON.stringify(body) }; }
function bad(code,msg){ return { statusCode: code, headers: { "content-type":"application/json", ...cors }, body: JSON.stringify({ error: msg }) }; }

export const handler = async (event) => {
  const method = event?.requestContext?.http?.method || "GET";
  const fullPath = event?.requestContext?.http?.path || "/";
  if (method === "OPTIONS") return { statusCode: 204, headers: cors, body: "" };

  // Expecting path like /guardrails/<action>
  const rel = fullPath.replace(/^\/guardrails\/?/, ""); // "summary" | "remediate" | "evidence"
  try {
    if (method === "GET" && rel.startsWith("summary")) {
      const framework = event.queryStringParameters?.framework || "CIS";
      // minimal, API-driven sample Ã¢â‚¬â€œ replace with real Security Hub aggregation when ready
      return ok({
        framework,
        score: 74,
        totals: { pass: 18, fail: 6, warn: 3 },
        controls: [
          {
            id: "CIS-1.1", title: "S3 Block Public Access", status: "FAIL",
            pass: 0, fail: 3, warn: 0,
            resources: [
              { arn: "arn:aws:s3:::demo-bucket", service: "s3", region: "us-east-1", note: "Public ACL" }
            ]
          },
          {
            id: "CIS-1.2", title: "CloudTrail enabled", status: "PASS",
            pass: 1, fail: 0, warn: 0, resources: []
          }
        ]
      });
    }

    if (method === "POST" && rel.startsWith("remediate")) {
      const body = event.body ? JSON.parse(event.body) : {};
      // later: call SSM Automation etc.
      return ok({ actionId: crypto.randomUUID?.() || String(Date.now()), status: body?.dryRun ? "SIMULATED" : "QUEUED" });
    }

    if (method === "GET" && rel.startsWith("evidence")) {
      const control = event.queryStringParameters?.control || "unknown";
      // later: pull from DynamoDB/S3
      return ok({ controlId: control, generatedAt: new Date().toISOString(), items: [] });
    }

    return bad(404, "Not found");
  } catch (e) {
    console.error("guardrails error", e);
    return bad(500, e?.message || "Server error");
  }
};
