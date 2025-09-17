import { useState } from 'react';
import { getSeverityColor, mapGuardDutySeverity, mapSecurityHubSeverity } from '@/lib/metricsUtils';
import { generateFindingsCSV } from '@/lib/metricsUtils';

interface SecurityFinding {
  id: string;
  title: string;
  provider: 'GuardDuty' | 'SecurityHub';
  severity: string | number;
  account: string;
  region: string;
  resourceId: string;
  status: 'Active' | 'Suppressed' | 'Resolved';
  firstSeen: string;
  lastSeen: string;
  link?: string;
}

interface SecurityFindingsListProps {
  findings: SecurityFinding[];
  loading?: boolean;
}

export default function SecurityFindingsList({ findings, loading = false }: SecurityFindingsListProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Suppressed' | 'Resolved'>('All');

  // Ensure findings is always an array
  const safeFindings = Array.isArray(findings) ? findings : [];

  const getSeverity = (finding: SecurityFinding): string => {
    if (finding.provider === 'GuardDuty' && typeof finding.severity === 'number') {
      return mapGuardDutySeverity(finding.severity);
    }
    return mapSecurityHubSeverity(finding.severity.toString());
  };

  const filteredFindings = safeFindings.filter(finding => {
    const severity = getSeverity(finding);
    const severityMatch = selectedSeverity === 'All' || severity === selectedSeverity;
    const statusMatch = selectedStatus === 'All' || finding.status === selectedStatus;
    return severityMatch && statusMatch;
  });

  const severityCounts = {
    All: safeFindings.length,
    High: safeFindings.filter(f => getSeverity(f) === 'High').length,
    Medium: safeFindings.filter(f => getSeverity(f) === 'Medium').length,
    Low: safeFindings.filter(f => getSeverity(f) === 'Low').length,
  };

  const statusCounts = {
    All: safeFindings.length,
    Active: safeFindings.filter(f => f.status === 'Active').length,
    Suppressed: safeFindings.filter(f => f.status === 'Suppressed').length,
    Resolved: safeFindings.filter(f => f.status === 'Resolved').length,
  };

  const handleExportCSV = () => {
    const exportData = filteredFindings.map(finding => ({
      timestamp_first_seen: finding.firstSeen,
      timestamp_last_seen: finding.lastSeen,
      provider: finding.provider,
      severity: getSeverity(finding),
      title: finding.title,
      account: finding.account,
      region: finding.region,
      resource_id: finding.resourceId,
      status: finding.status,
      link: finding.link || ''
    }));
    generateFindingsCSV(exportData);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-48 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Security Findings</h3>
        <button
          onClick={handleExportCSV}
          className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded border border-white/20 transition-colors"
          disabled={filteredFindings.length === 0}
        >
          Download CSV
        </button>
      </div>

      {/* Severity Filter */}
      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          {(['All', 'High', 'Medium', 'Low'] as const).map(severity => (
            <button
              key={severity}
              onClick={() => setSelectedSeverity(severity)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                selectedSeverity === severity
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {severity} ({severityCounts[severity]})
            </button>
          ))}
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-1">
          {(['All', 'Active', 'Suppressed', 'Resolved'] as const).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                selectedStatus === status
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
              }`}
            >
              {status} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredFindings.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No findings match the selected filters
          </div>
        ) : (
          filteredFindings.map(finding => {
            const severity = getSeverity(finding);
            return (
              <div key={finding.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-200 mb-1">
                      {finding.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{finding.provider}</span>
                      <span>•</span>
                      <span>{finding.account}</span>
                      <span>•</span>
                      <span>{finding.region}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(severity)}`}>
                      {severity}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      finding.status === 'Active' ? 'bg-red-500/20 text-red-300' :
                      finding.status === 'Suppressed' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {finding.status}
                    </span>
                  </div>
                </div>
                
                <div className="text-xs text-slate-400 mb-2">
                  Resource: <span className="text-slate-200">{finding.resourceId}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>First seen: {new Date(finding.firstSeen).toLocaleDateString()}</span>
                  <span>Last seen: {new Date(finding.lastSeen).toLocaleDateString()}</span>
                </div>
                
                {finding.link && (
                  <div className="mt-2">
                    <a 
                      href={finding.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-300 hover:text-cyan-200 underline"
                    >
                      View in AWS Console
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
