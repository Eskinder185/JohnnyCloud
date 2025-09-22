// Utility functions for Metrics page

export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value.toFixed(1)}%`;
}

export function startOfQuarter(date: Date = new Date()): Date {
  const quarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), quarter * 3, 1);
}

export function getQuarterProgress(): { current: number; total: number; percentage: number } {
  const now = new Date();
  const quarterStart = startOfQuarter(now);
  const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
  
  const totalDays = Math.ceil((quarterEnd.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24));
  const currentDays = Math.ceil((now.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    current: Math.max(0, currentDays),
    total: totalDays,
    percentage: Math.min(100, Math.max(0, (currentDays / totalDays) * 100))
  };
}

export function calculateImpactSummary(
  current: number,
  baseline: number,
  service: string,
  resource?: string,
  region?: string
): string {
  if (baseline === 0) return `${service} costs: new resource detected`;
  
  const impact = ((current - baseline) / baseline) * 100;
  const impactText = impact > 0 ? `+${impact.toFixed(0)}%` : `${impact.toFixed(0)}%`;
  
  let summary = `${service} costs ${impactText} vs baseline`;
  
  if (resource) {
    summary += `, largely from ${resource}`;
  }
  
  if (region) {
    summary += ` in ${region}`;
  }
  
  return summary;
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'text-red-400 bg-red-500/20';
    case 'medium':
      return 'text-amber-400 bg-amber-500/20';
    case 'low':
      return 'text-green-400 bg-green-500/20';
    default:
      return 'text-slate-400 bg-slate-500/20';
  }
}

export function mapGuardDutySeverity(score: number): string {
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  return 'Low';
}

export function mapSecurityHubSeverity(severity: string): string {
  const s = severity.toLowerCase();
  if (s.includes('high') || s.includes('critical')) return 'High';
  if (s.includes('medium') || s.includes('moderate')) return 'Medium';
  return 'Low';
}

// CSV Export functions
export function downloadCSV(data: any[], filename: string, columns: { key: string; label: string }[]) {
  const csvContent = [
    // Header row
    columns.map(col => col.label).join(','),
    // Data rows
    ...data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateAnomaliesCSV(anomalies: any[]): void {
  const columns = [
    { key: 'timestamp', label: 'Timestamp' },
    { key: 'period', label: 'Period' },
    { key: 'service', label: 'Service' },
    { key: 'resource', label: 'Resource' },
    { key: 'region', label: 'Region' },
    { key: 'baseline_amount', label: 'Baseline Amount' },
    { key: 'current_amount', label: 'Current Amount' },
    { key: 'impact_percent', label: 'Impact %' },
    { key: 'driver_resource', label: 'Driver Resource' },
    { key: 'notes', label: 'Notes' }
  ];

  const filename = `johnnycloud_anomalies_${new Date().toISOString().slice(0, 19).replace(/:/g, '')}.csv`;
  downloadCSV(anomalies, filename, columns);
}

export function generateFindingsCSV(findings: any[]): void {
  const columns = [
    { key: 'timestamp_first_seen', label: 'First Seen' },
    { key: 'timestamp_last_seen', label: 'Last Seen' },
    { key: 'provider', label: 'Provider' },
    { key: 'severity', label: 'Severity' },
    { key: 'title', label: 'Title' },
    { key: 'account', label: 'Account' },
    { key: 'region', label: 'Region' },
    { key: 'resource_id', label: 'Resource ID' },
    { key: 'status', label: 'Status' },
    { key: 'link', label: 'Link' }
  ];

  const filename = `johnnycloud_findings_${new Date().toISOString().slice(0, 19).replace(/:/g, '')}.csv`;
  downloadCSV(findings, filename, columns);
}



