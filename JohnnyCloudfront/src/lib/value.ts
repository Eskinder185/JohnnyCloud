// src/lib/value.ts
export type GuardrailsSummary = {
  framework: "CIS" | "NIST" | "PCI" | string;
  score: number;
  totals: { pass: number; fail: number; warn: number };
  controls: Array<{ id: string; title: string; status: "PASS"|"FAIL"|"WARN"|"UNKNOWN" }>;
};

export type OptimizeSnapshot = {
  rightsizing?: Array<{ estMonthlySavings: number }>;
  idle?: Array<{ estMonthlySavings: number }>;
  schedules?: Array<{ estMonthlySavings: number }>;
  efficiency?: { serverlessPct?: number; managedPct?: number };
  reliability?: { backupsPct?: number; multiAZPct?: number; rto?: string; rpo?: string };
};

// ---- envs
const GUARD_API = import.meta.env.VITE_GUARDRAILS_API?.trim();
const OPT_API    = import.meta.env.VITE_OPTIMIZE_API?.trim();
const METRICS_API= import.meta.env.VITE_METRICS_API?.trim();

// ---- utils
async function fetchJson(url: string, init?: RequestInit, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...init, signal: ctrl.signal });
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  } finally { clearTimeout(t); }
}

function sum(arr?: Array<{ estMonthlySavings?: number }>) {
  return (arr || []).reduce((a, b) => a + (b.estMonthlySavings || 0), 0);
}

// ---- public API
export async function getGuardrailsCis(): Promise<GuardrailsSummary | null> {
  if (!GUARD_API) return null;
  try {
    return await fetchJson(`${GUARD_API}/summary?framework=CIS`);
  } catch {
    return null;
  }
}

export async function getOptimizeSnapshot(): Promise<OptimizeSnapshot | null> {
  const base = OPT_API || (METRICS_API ? `${METRICS_API}/optimize` : "");
  if (!base) return null;
  try {
    return await fetchJson(`${base}/snapshot`);
  } catch {
    return null;
  }
}

export async function getValueSummary() {
  const [cis, opt] = await Promise.all([getGuardrailsCis(), getOptimizeSnapshot()]);

  // Savings estimate (best-effort)
  const monthlySavings =
    (sum(opt?.rightsizing) + sum(opt?.idle) + sum(opt?.schedules)) || 0;

  const topFails =
    (cis?.controls || [])
      .filter(c => c.status === "FAIL")
      .slice(0, 3)
      .map(c => c.id);

  return {
    savings: { monthlyEstimate: Math.round(monthlySavings) },
    security: { framework: cis?.framework || "CIS", score: cis?.score ?? null, topFails },
    reliability: {
      backupsPct: opt?.reliability?.backupsPct ?? null,
      multiAZPct: opt?.reliability?.multiAZPct ?? null,
      rto: opt?.reliability?.rto ?? null,
      rpo: opt?.reliability?.rpo ?? null
    },
    efficiency: {
      serverlessPct: opt?.efficiency?.serverlessPct ?? null,
      managedPct: opt?.efficiency?.managedPct ?? null
    },
    _raw: { cis, opt }
  };
}
