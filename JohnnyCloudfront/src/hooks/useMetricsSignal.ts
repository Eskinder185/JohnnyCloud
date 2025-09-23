import { useEffect, useState } from "react";

type Level = "none" | "low" | "high";
type Signal = { costLevel: Level; securityLevel: Level; };

export function useMetricsSignal() {
  // Start with a visible signal for testing - this ensures background is always visible
  const [signal, setSignal] = useState<Signal>({ costLevel: "high", securityLevel: "low" });

      useEffect(() => {
        const API_BASE = import.meta.env.VITE_API_BASE as string;
        const METRICS_API = import.meta.env.VITE_METRICS_API || `${API_BASE}/metrics`;
        const GUARDRAILS_API = import.meta.env.VITE_GUARDRAILS_API || `${API_BASE}/guardrails`;

        console.log('🌊 useMetricsSignal: Starting with APIs:', { API_BASE, METRICS_API, GUARDRAILS_API });

    let stop = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let demoMode = false;

    const fetchAll = async () => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };

        const [mRes, gRes] = await Promise.allSettled([
          fetch(METRICS_API, { 
            headers, 
            cache: "no-store",
            mode: "cors",
            credentials: "omit"
          }),
          fetch(`${GUARDRAILS_API}/summary?framework=CIS`, { 
            headers, 
            cache: "no-store",
            mode: "cors",
            credentials: "omit"
          })
        ]);

        let anomalies = 0, findings = 0;

        // Handle metrics API response
        if (mRes.status === "fulfilled" && mRes.value.ok) {
          try {
            const m = await mRes.value.json();
            anomalies = Number(m?.anomalies?.length ?? 0);
            console.log('🌊 Metrics API success:', { anomalies });
          } catch (parseError) {
            console.log('🌊 Metrics API JSON parse error:', parseError);
            console.log('🌊 Metrics API response text:', await mRes.value.text());
          }
        } else if (mRes.status === "rejected") {
          console.log('🌊 Metrics API error:', mRes.reason);
        } else {
          console.log('🌊 Metrics API failed:', mRes.value?.status, mRes.value?.statusText);
          try {
            const errorText = await mRes.value.text();
            console.log('🌊 Metrics API error response:', errorText);
          } catch (e) {
            console.log('🌊 Could not read error response');
          }
        }

        // Handle guardrails API response
        if (gRes.status === "fulfilled" && gRes.value.ok) {
          try {
            const g = await gRes.value.json();
            findings = Number(g?.findings?.length ?? g?.securityFindings?.length ?? 0);
            console.log('🌊 Guardrails API success:', { findings });
          } catch (parseError) {
            console.log('🌊 Guardrails API JSON parse error:', parseError);
            console.log('🌊 Guardrails API response text:', await gRes.value.text());
          }
        } else if (gRes.status === "rejected") {
          console.log('🌊 Guardrails API error:', gRes.reason);
        } else {
          console.log('🌊 Guardrails API failed:', gRes.value?.status, gRes.value?.statusText);
          try {
            const errorText = await gRes.value.text();
            console.log('🌊 Guardrails API error response:', errorText);
          } catch (e) {
            console.log('🌊 Could not read error response');
          }
        }

        const costLevel: Level = anomalies > 5 ? "high" : anomalies > 0 ? "low" : "none";
        const securityLevel: Level = findings > 5 ? "high" : findings > 0 ? "low" : "none";

        console.log('🌊 useMetricsSignal: API data received:', { anomalies, findings, costLevel, securityLevel });
        if (!stop) setSignal({ costLevel, securityLevel });
      } catch (error) {
        console.log('🌊 useMetricsSignal: API error, entering demo mode:', error);
        demoMode = true;
        // Demo mode: cycle through different signals to show background animation
        const demoSignals: Signal[] = [
          { costLevel: "none", securityLevel: "none" },
          { costLevel: "low", securityLevel: "none" },
          { costLevel: "high", securityLevel: "low" },
          { costLevel: "none", securityLevel: "high" },
          { costLevel: "low", securityLevel: "low" },
          { costLevel: "high", securityLevel: "high" },
          { costLevel: "low", securityLevel: "high" },
          { costLevel: "high", securityLevel: "none" }
        ];
        const demoIndex = Math.floor(Date.now() / 8000) % demoSignals.length; // Change every 8 seconds
        if (!stop) setSignal(demoSignals[demoIndex]);
      }
    };

    fetchAll();
    intervalId = setInterval(fetchAll, 60_000);

    // Demo mode interval - cycle through signals every 8 seconds for visual testing
    const demoInterval = setInterval(() => {
      if (demoMode) {
        const demoSignals: Signal[] = [
          { costLevel: "none", securityLevel: "none" },
          { costLevel: "low", securityLevel: "none" },
          { costLevel: "high", securityLevel: "low" },
          { costLevel: "none", securityLevel: "high" },
          { costLevel: "low", securityLevel: "low" },
          { costLevel: "high", securityLevel: "high" },
          { costLevel: "low", securityLevel: "high" },
          { costLevel: "high", securityLevel: "none" }
        ];
        const demoIndex = Math.floor(Date.now() / 8000) % demoSignals.length;
        if (!stop) setSignal(demoSignals[demoIndex]);
      }
    }, 8000);

    return () => {
      stop = true;
      if (intervalId) clearInterval(intervalId);
      clearInterval(demoInterval);
    };
  }, []);

  return signal;
}