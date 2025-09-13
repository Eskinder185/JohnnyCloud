import { useState, useEffect } from 'react';

interface CostSummary {
  mtdUSD: number;
  forecastUSD?: number;
  daily: Array<{ date: string; usd: number }>;
  topServices: Array<{ service: string; usd: number }>;
  error?: string;
}

interface CostAnomaly {
  start: string;
  end?: string;
  impactUSD: number;
  score: number;
  rootCauses: string[];
}

interface CostAnomalies {
  anomalies: CostAnomaly[];
  error?: string;
}

interface GuardDutySummary {
  enabled: boolean;
  counts?: {
    low: number;
    medium: number;
    high: number;
  };
  latest?: Array<{
    title: string;
    severity: number;
    lastSeen: string;
  }>;
  error?: string;
}

interface SecurityHubSummary {
  enabled: boolean;
  failedByStandard?: Array<{
    standard: string;
    count: number;
  }>;
  error?: string;
}

interface IAMHygiene {
  passwordPolicy: 'present' | 'missing';
  noMFA: string[];
  oldKeys: Array<{
    user: string;
    key: string;
  }>;
  error?: string;
}

interface NetworkExposure {
  openSecurityGroups: Array<{
    group: string;
    from?: number;
    to?: number;
  }>;
  publicBucketsCount: number;
  error?: string;
}

const API_BASE = import.meta.env.VITE_AWS_API_URL;

export function useAWSData() {
  const [costSummary, setCostSummary] = useState<CostSummary | null>(null);
  const [costAnomalies, setCostAnomalies] = useState<CostAnomalies | null>(null);
  const [guardDuty, setGuardDuty] = useState<GuardDutySummary | null>(null);
  const [securityHub, setSecurityHub] = useState<SecurityHubSummary | null>(null);
  const [iamHygiene, setIamHygiene] = useState<IAMHygiene | null>(null);
  const [networkExposure, setNetworkExposure] = useState<NetworkExposure | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!API_BASE) {
      setError('AWS API URL not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [costSummaryRes, costAnomaliesRes, guardDutyRes, securityHubRes, iamRes, networkRes] = await Promise.allSettled([
        fetch(`${API_BASE}/cost/summary`),
        fetch(`${API_BASE}/cost/anomalies`),
        fetch(`${API_BASE}/security/guardduty`),
        fetch(`${API_BASE}/security/hub`),
        fetch(`${API_BASE}/security/iam`),
        fetch(`${API_BASE}/network/exposure`)
      ]);

      if (costSummaryRes.status === 'fulfilled') {
        const data = await costSummaryRes.value.json();
        setCostSummary(data);
      }

      if (costAnomaliesRes.status === 'fulfilled') {
        const data = await costAnomaliesRes.value.json();
        setCostAnomalies(data);
      }

      if (guardDutyRes.status === 'fulfilled') {
        const data = await guardDutyRes.value.json();
        setGuardDuty(data);
      }

      if (securityHubRes.status === 'fulfilled') {
        const data = await securityHubRes.value.json();
        setSecurityHub(data);
      }

      if (iamRes.status === 'fulfilled') {
        const data = await iamRes.value.json();
        setIamHygiene(data);
      }

      if (networkRes.status === 'fulfilled') {
        const data = await networkRes.value.json();
        setNetworkExposure(data);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AWS data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    costSummary,
    costAnomalies,
    guardDuty,
    securityHub,
    iamHygiene,
    networkExposure,
    loading,
    error,
    refetch: fetchData
  };
}