import { ORIGIN } from "../config.mjs";

export function corsHeaders() {
  return {
    "access-control-allow-origin": ORIGIN,
    "access-control-allow-headers": "content-type,authorization",
    "access-control-allow-methods": "POST,OPTIONS"
  };
}

export function json(statusCode, bodyObj) {
  return {
    statusCode,
    headers: { "content-type": "application/json", ...corsHeaders() },
    body: JSON.stringify(bodyObj)
  };
}

export function options() {
  return { statusCode: 204, headers: corsHeaders(), body: "" };
}
