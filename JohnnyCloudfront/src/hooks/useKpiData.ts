import { useState, useEffect } from 'react';
import { getJwt, isLoggedIn } from '@/lib/auth';

export interface KpiData {
  savings: {
    monthlyEstimate: number | null;
    loading: boolean;
    error: string | null;
  };
  security: {
    score: number | null;
    topFails: string[];
    loading: boolean;
    error: string | null;
  };
  reliability: {
    backupCoverage: number | null;
    multiAZCoverage: number | null;
    loading: boolean;
    error: string | null;
  };
  efficiency: {
    serverlessPct: number | null;
    managedPct: number | null;
    loading: boolean;
    error: string | null;
  };
}

export function useKpiData(): KpiData {
  const [data, setData] = useState<KpiData>({
    savings: { monthlyEstimate: null, loading: true, error: null },
    security: { score: null, topFails: [], loading: true, error: null },
    reliability: { backupCoverage: null, multiAZCoverage: null, loading: true, error: null },
    efficiency: { serverlessPct: null, managedPct: null, loading: true, error: null }
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = getJwt();
      if (!token || !isLoggedIn()) {
        setData(prev => ({
          savings: { ...prev.savings, loading: false, error: 'not_authenticated' },
          security: { ...prev.security, loading: false, error: 'not_authenticated' },
          reliability: { ...prev.reliability, loading: false, error: 'not_authenticated' },
          efficiency: { ...prev.efficiency, loading: false, error: 'not_authenticated' }
        }));
        return;
      }

      const metricsApi = import.meta.env.VITE_METRICS_API;
      const guardrailsApi = import.meta.env.VITE_GUARDRAILS_API;

      console.log('KPI: Fetching data from:', { metricsApi, guardrailsApi });

      // Fetch all data in parallel
      const promises = [];

      // 1. Fetch savings data from metrics API
      if (metricsApi) {
        promises.push(
          fetch(`${metricsApi}/summary`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(async r => {
            if (r.ok) {
              const data = await r.json();
              console.log('KPI: Metrics data:', data);
              
              // Calculate monthly savings from QTD savings
              let monthlyEstimate = null;
              if (data.savings?.totalSavings) {
                // If we have QTD savings, divide by months in quarter
                const currentMonth = new Date().getMonth();
                const monthsInQuarter = Math.floor(currentMonth / 3) + 1;
                monthlyEstimate = data.savings.totalSavings / monthsInQuarter;
              } else if (data.savings?.topActions) {
                // Sum up monthly estimates from top actions
                monthlyEstimate = data.savings.topActions.reduce((sum: number, action: any) => 
                  sum + (action.savings || 0), 0
                );
              }
              
              return { type: 'savings', data: monthlyEstimate, error: null };
            }
            return { type: 'savings', data: null, error: 'API error' };
          }).catch(err => {
            console.error('KPI: Metrics API error:', err);
            return { type: 'savings', data: null, error: 'Failed to fetch' };
          })
        );
      } else {
        promises.push(Promise.resolve({ type: 'savings', data: null, error: 'No API configured' }));
      }

      // 2. Fetch security data from guardrails API
      if (guardrailsApi) {
        promises.push(
          fetch(`${guardrailsApi}/summary?framework=CIS`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(async r => {
            if (r.ok) {
              const data = await r.json();
              console.log('KPI: Guardrails data:', data);
              
              const topFails = (data.controls || [])
                .filter((c: any) => c.status === 'FAIL')
                .slice(0, 2)
                .map((c: any) => c.id || c.title || 'Unknown control');
              
              return { 
                type: 'security', 
                data: { score: data.score, topFails }, 
                error: null 
              };
            }
            return { type: 'security', data: { score: null, topFails: [] }, error: 'API error' };
          }).catch(err => {
            console.error('KPI: Guardrails API error:', err);
            return { type: 'security', data: { score: null, topFails: [] }, error: 'Failed to fetch' };
          })
        );
      } else {
        promises.push(Promise.resolve({ type: 'security', data: { score: null, topFails: [] }, error: 'No API configured' }));
      }

      // 3. Fetch reliability data (backup coverage, Multi-AZ)
      if (metricsApi) {
        promises.push(
          fetch(`${metricsApi}/reliability`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(async r => {
            if (r.ok) {
              const data = await r.json();
              console.log('KPI: Reliability data:', data);
              
              return { 
                type: 'reliability', 
                data: { 
                  backupCoverage: data.backupCoverage || null,
                  multiAZCoverage: data.multiAZCoverage || null
                }, 
                error: null 
              };
            }
            return { type: 'reliability', data: { backupCoverage: null, multiAZCoverage: null }, error: 'API error' };
          }).catch(err => {
            console.error('KPI: Reliability API error:', err);
            return { type: 'reliability', data: { backupCoverage: null, multiAZCoverage: null }, error: 'Failed to fetch' };
          })
        );
      } else {
        promises.push(Promise.resolve({ type: 'reliability', data: { backupCoverage: null, multiAZCoverage: null }, error: 'No API configured' }));
      }

      // 4. Fetch efficiency data (serverless/managed services usage)
      if (metricsApi) {
        promises.push(
          fetch(`${metricsApi}/efficiency`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(async r => {
            if (r.ok) {
              const data = await r.json();
              console.log('KPI: Efficiency data:', data);
              
              return { 
                type: 'efficiency', 
                data: { 
                  serverlessPct: data.serverlessPct || null,
                  managedPct: data.managedPct || null
                }, 
                error: null 
              };
            }
            return { type: 'efficiency', data: { serverlessPct: null, managedPct: null }, error: 'API error' };
          }).catch(err => {
            console.error('KPI: Efficiency API error:', err);
            return { type: 'efficiency', data: { serverlessPct: null, managedPct: null }, error: 'Failed to fetch' };
          })
        );
      } else {
        promises.push(Promise.resolve({ type: 'efficiency', data: { serverlessPct: null, managedPct: null }, error: 'No API configured' }));
      }

      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      
      // Update state with results
      setData(prev => {
        const newData = { ...prev };
        
        results.forEach(result => {
          switch (result.type) {
            case 'savings':
              newData.savings = { 
                monthlyEstimate: result.data, 
                loading: false, 
                error: result.error 
              };
              break;
            case 'security':
              newData.security = { 
                score: result.data.score, 
                topFails: result.data.topFails, 
                loading: false, 
                error: result.error 
              };
              break;
            case 'reliability':
              newData.reliability = { 
                backupCoverage: result.data.backupCoverage, 
                multiAZCoverage: result.data.multiAZCoverage, 
                loading: false, 
                error: result.error 
              };
              break;
            case 'efficiency':
              newData.efficiency = { 
                serverlessPct: result.data.serverlessPct, 
                managedPct: result.data.managedPct, 
                loading: false, 
                error: result.error 
              };
              break;
          }
        });
        
        return newData;
      });
    };

    fetchData();
  }, []);

  return data;
}
