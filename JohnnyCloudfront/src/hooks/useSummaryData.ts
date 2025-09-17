import { useState, useEffect } from 'react';
import { getJwt, isLoggedIn } from '@/lib/auth';

export interface SummaryData {
  mtdSpend: number | null;
  complianceScore: number | null;
  securityIssues: number | null;
  loading: boolean;
  error: string | null;
}

export function useSummaryData(): SummaryData {
  const [data, setData] = useState<SummaryData>({
    mtdSpend: null,
    complianceScore: null,
    securityIssues: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const token = getJwt();
        if (!token || !isLoggedIn()) {
          console.log('Home: Not authenticated, skipping data fetch');
          setData(prev => ({ ...prev, loading: false, error: 'not_authenticated' }));
          return;
        }

        const metricsApi = import.meta.env.VITE_METRICS_API;
        const guardrailsApi = import.meta.env.VITE_GUARDRAILS_API;

        console.log('Home: Fetching summary data from:', { metricsApi, guardrailsApi });

        // Fetch data from multiple APIs in parallel
        const promises = [];

        // Fetch metrics data
        if (metricsApi) {
          promises.push(
            fetch(`${metricsApi}/summary`, {
              headers: { Authorization: `Bearer ${token}` }
            }).then(async r => {
              console.log('Home: Metrics API response:', r.status, r.statusText);
              if (r.ok) {
                const data = await r.json();
                console.log('Home: Metrics data:', data);
                return data;
              }
              return null;
            }).catch(err => {
              console.error('Home: Metrics API error:', err);
              return null;
            })
          );
        } else {
          console.log('Home: No metrics API configured');
          promises.push(Promise.resolve(null));
        }

        // Fetch guardrails data
        if (guardrailsApi) {
          promises.push(
            fetch(`${guardrailsApi}/summary?framework=CIS`, {
              headers: { Authorization: `Bearer ${token}` }
            }).then(async r => {
              console.log('Home: Guardrails API response:', r.status, r.statusText);
              if (r.ok) {
                const data = await r.json();
                console.log('Home: Guardrails data:', data);
                return data;
              }
              return null;
            }).catch(err => {
              console.error('Home: Guardrails API error:', err);
              return null;
            })
          );
        } else {
          console.log('Home: No guardrails API configured');
          promises.push(Promise.resolve(null));
        }

        const [metricsData, guardrailsData] = await Promise.all(promises);

        const summaryData = {
          mtdSpend: metricsData?.cards?.mtdSpendUSD || null,
          complianceScore: guardrailsData?.score || null,
          securityIssues: metricsData?.cards ? 
            (metricsData.cards.guardDutyFindings7d + metricsData.cards.publicBuckets + metricsData.cards.openSgRules) : null,
          loading: false,
          error: null
        };

        console.log('Home: Final summary data:', summaryData);
        setData(summaryData);

      } catch (error) {
        console.error('Home: Error fetching summary data:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load data' 
        }));
      }
    };

    fetchData();
  }, []);

  return data;
}
