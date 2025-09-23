// src/pages/Guardrails.tsx
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getSummary, remediate, getEvidence, type GuardrailsSummary, type Framework } from "../lib/guardrails";
import { SeverityLevel, mapCISControlSeverity } from "@/lib/severityUtils";
import { formatDateTime } from "@/lib/dateUtils";
import SeverityBadge from "@/components/SeverityBadge";
import BulkRemediationPreview from "@/components/BulkRemediationPreview";
import ComplianceTrendChart from "@/components/charts/ComplianceTrendChart";
import ComplianceChecklist from "@/components/ComplianceChecklist";

export default function GuardrailsPage() {
  const [framework, setFramework] = useState<Framework>("CIS");
  const [data, setData] = useState<GuardrailsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [remediating, setRemediating] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'30d' | '90d'>('30d');
  const [showBulkPreview, setShowBulkPreview] = useState(false);
  const [bulkControls, setBulkControls] = useState<any[]>([]);
  const [bulkTitle, setBulkTitle] = useState('');
  const [bulkDescription, setBulkDescription] = useState('');

  useEffect(() => {
    let on = true;
    setLoading(true); 
    setErr(null);
    setSelected(null);
    
    getSummary(framework)
      .then((d) => { 
        if (on) {
          setData(d); 
          // Safely check if controls exist before finding
          if (d && d.controls && Array.isArray(d.controls)) {
            const firstFail = d.controls.find(c => c.status === "FAIL");
            if (firstFail) {
              setSelected(firstFail.id);
            }
          }
        }
      })
      .catch((e) => {
        console.error('Error loading guardrails data:', e);
        setErr(String(e));
      })
      .finally(() => setLoading(false));
    
    return () => { on = false; };
  }, [framework]);

  const control = useMemo(
    () => (data?.controls && Array.isArray(data.controls)) ? data.controls.find(c => c.id === selected) || null : null,
    [selected, data]
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PASS": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "FAIL": return "text-red-600 bg-red-50 border-red-200";
      case "WARN": return "text-amber-600 bg-amber-50 border-amber-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Mock compliance trend data
  const complianceTrendData = useMemo(() => {
    const days = timeRange === '30d' ? 30 : 90;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate trend with some variation
      const baseScore = 74;
      const variation = Math.sin(i / 7) * 5 + Math.random() * 3;
      const score = Math.max(0, Math.min(100, Math.round(baseScore + variation)));
      
      const total = 27; // Total controls
      const passed = Math.round((score / 100) * total);
      const failed = total - passed;
      
      data.push({
        date: date.toISOString().split('T')[0],
        score,
        passed,
        failed,
        total,
        hasRemediation: Math.random() > 0.9, // 10% chance of remediation
        remediationType: Math.random() > 0.5 ? 'Bulk SG fix' : 'S3 access fix'
      });
    }
    
    return data;
  }, [timeRange]);

  async function onRemediate(resourceArn?: string) {
    if (!control) return;
    
    const resourceKey = resourceArn || 'all';
    setRemediating(resourceKey);
    
    try {
      const res = await remediate(control.id, resourceArn, true);
      
      const message = resourceArn 
        ? `Remediation queued for resource:\n${resourceArn}\n\nAction ID: ${res.actionId}\nStatus: ${res.status}`
        : `Remediation queued for control ${control.id}\n\nAction ID: ${res.actionId}\nStatus: ${res.status}`;
      
      alert(message);
    } catch (error) {
      console.error('Remediation error:', error);
      alert(`Failed to queue remediation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setRemediating(null);
    }
  }

  const handleBulkRemediate = (controlType: string) => {
    if (!data) return;
    
    let controls: any[] = [];
    let title = '';
    let description = '';
    
    // Safely check if data and controls exist
    if (!data || !data.controls || !Array.isArray(data.controls)) {
      return;
    }

    switch (controlType) {
      case 's3-public':
        controls = data.controls.filter(c => 
          c.id.includes('1.1') || c.title.toLowerCase().includes('s3 public access')
        );
        title = 'Fix All S3 Public Access Issues';
        description = 'Remediate all S3 buckets with public access enabled';
        break;
      case 'security-groups':
        controls = data.controls.filter(c => 
          c.id.includes('4.1') || c.title.toLowerCase().includes('security group')
        );
        title = 'Fix All Security Group Issues';
        description = 'Restrict open security group rules to improve network security';
        break;
      case 'cloudtrail':
        controls = data.controls.filter(c => 
          c.id.includes('3.1') || c.title.toLowerCase().includes('cloudtrail')
        );
        title = 'Fix All CloudTrail Issues';
        description = 'Enable CloudTrail log validation and multi-region trails';
        break;
      case 'selected':
        if (control) {
          controls = [control];
          title = `Fix All ${control.id} Issues`;
          description = `Remediate all resources for control ${control.id}`;
        }
        break;
    }
    
    if (controls.length > 0) {
      const controlsWithSeverity = controls.map(c => ({
        ...c,
        severity: mapCISControlSeverity(c.id, c.title) as SeverityLevel
      }));
      
      setBulkControls(controlsWithSeverity);
      setBulkTitle(title);
      setBulkDescription(description);
      setShowBulkPreview(true);
    }
  };

  const handleBulkExecute = async (selectedResources: string[], notifyWhenDone: boolean) => {
    // Simulate bulk remediation execution
    console.log('Executing bulk remediation:', {
      controls: bulkControls.map(c => c.id),
      resources: selectedResources,
      notifyWhenDone
    });
    
    // In a real implementation, this would call the bulk remediation API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`Bulk remediation completed for ${selectedResources.length} resources${notifyWhenDone ? '. You will be notified when done.' : '.'}`);
  };

  const handleFixControl = (controlId: string) => {
    if (data?.controls && Array.isArray(data.controls)) {
      const control = data.controls.find(c => c.id === controlId);
      if (control) {
        setSelected(controlId);
        handleBulkRemediate('selected');
      }
    }
  };


  return (
    <div className="space-y-6">
      <Card className="p-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg md:text-xl font-semibold mb-2 jc-title-gradient">Compliance & Guardrails</h1>
            <p className="text-sm md:text-base text-white/75 leading-relaxed">
              Monitor compliance across security frameworks and manage remediation actions
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Framework Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-jc-dim">Framework:</label>
              <select 
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-jc-cyan"
                value={framework} 
                onChange={e => setFramework(e.target.value as Framework)}
                disabled={loading}
              >
                <option value="CIS">CIS</option>
                <option value="NIST">NIST</option>
                <option value="PCI">PCI</option>
              </select>
            </div>
          </div>
        </header>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jc-cyan"></div>
            <span className="ml-3 text-jc-dim">Loading guardrails data...</span>
          </div>
        )}
        
        {err && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            Error loading guardrails data: {err}
          </div>
        )}
      </Card>

      {data && (
        <div data-guardrails-summary={JSON.stringify(data)}>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="text-sm text-jc-dim mb-1">Framework</div>
              <div className="text-xl font-semibold">{data.framework}</div>
            </Card>
            
            <Card className={`p-6 border-2 ${getScoreBgColor(data.score)}`}>
              <div className="text-sm text-jc-dim mb-1">Compliance Score</div>
              <div className={`text-3xl font-bold ${getScoreColor(data.score)}`}>
                {data.score}%
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-jc-dim mb-1">Controls Passed</div>
              <div className="text-2xl font-semibold text-emerald-600">{data.totals.pass}</div>
            </Card>
            
            <Card className="p-6">
              <div className="text-sm text-jc-dim mb-1">Failed / Warnings</div>
              <div className="text-xl">
                <span className="text-red-600 font-semibold">{data.totals.fail}</span>
                <span className="text-jc-dim mx-1">/</span>
                <span className="text-amber-600 font-semibold">{data.totals.warn}</span>
              </div>
            </Card>
          </div>

          {/* Compliance Trend and Checklist */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Compliance Trend ({data.framework})</h3>
                  <div className="flex gap-1">
                    {(['30d', '90d'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          timeRange === range
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                <ComplianceTrendChart 
                  data={complianceTrendData} 
                  loading={loading}
                  timeRange={timeRange}
                />
              </Card>
            </div>
            
            <div>
              <ComplianceChecklist 
                controls={data.controls}
                onFixControl={handleFixControl}
                loading={loading}
              />
            </div>
          </div>

          {/* Bulk Remediation Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Bulk Remediation Actions</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                onClick={() => handleBulkRemediate('s3-public')}
                className="p-4 h-auto flex flex-col items-center gap-2"
                disabled={!data?.controls || !Array.isArray(data.controls) || !data.controls.some(c => c.id.includes('1.1') || c.title.toLowerCase().includes('s3 public access'))}
              >
                <div className="text-2xl">🪣</div>
                <div className="text-sm">Fix S3 Public Access</div>
                <div className="text-xs opacity-70">Block public access on all buckets</div>
              </Button>
              
              <Button
                onClick={() => handleBulkRemediate('security-groups')}
                className="p-4 h-auto flex flex-col items-center gap-2"
                disabled={!data?.controls || !Array.isArray(data.controls) || !data.controls.some(c => c.id.includes('4.1') || c.title.toLowerCase().includes('security group'))}
              >
                <div className="text-2xl">🔒</div>
                <div className="text-sm">Fix Security Groups</div>
                <div className="text-xs opacity-70">Restrict open ingress rules</div>
              </Button>
              
              <Button
                onClick={() => handleBulkRemediate('cloudtrail')}
                className="p-4 h-auto flex flex-col items-center gap-2"
                disabled={!data?.controls || !Array.isArray(data.controls) || !data.controls.some(c => c.id.includes('3.1') || c.title.toLowerCase().includes('cloudtrail'))}
              >
                <div className="text-2xl">📊</div>
                <div className="text-sm">Fix CloudTrail</div>
                <div className="text-xs opacity-70">Enable log validation</div>
              </Button>
              
              <Button
                onClick={() => handleBulkRemediate('selected')}
                className="p-4 h-auto flex flex-col items-center gap-2"
                disabled={!control}
              >
                <div className="text-2xl">🎯</div>
                <div className="text-sm">Fix Selected Control</div>
                <div className="text-xs opacity-70">Remediate all resources</div>
              </Button>
            </div>
          </Card>

          {/* Controls by Status */}
          <div className="grid md:grid-cols-3 gap-6">
            {(["FAIL", "WARN", "PASS"] as const).map(status => {
              const items = (data?.controls && Array.isArray(data.controls)) ? data.controls.filter(c => c.status === status) : [];
              const statusInfo = {
                FAIL: { label: "Failed Controls", color: "border-red-500/30 bg-red-500/10" },
                WARN: { label: "Warnings", color: "border-amber-500/30 bg-amber-500/10" },
                PASS: { label: "Passed Controls", color: "border-emerald-500/30 bg-emerald-500/10" }
              }[status];

              return (
                <Card key={status} className={`p-6 border-2 ${statusInfo.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">{statusInfo.label}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                      {items.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map(control => {
                      const severity = mapCISControlSeverity(control.id, control.title);
                      return (
                        <button
                          key={control.id}
                          className={`w-full text-left p-4 rounded-lg border transition-all ${
                            selected === control.id 
                              ? "border-jc-cyan bg-jc-cyan/10" 
                              : "border-white/20 bg-white/5 hover:bg-white/10"
                          }`}
                          onClick={() => setSelected(control.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-medium text-sm">
                              {control.id} — {control.title}
                            </div>
                            {control.status === 'FAIL' && (
                              <SeverityBadge severity={severity} showIcon={false} />
                            )}
                          </div>
                          <div className="text-xs text-jc-dim">
                            Pass {control.pass} · Fail {control.fail} · Warn {control.warn}
                          </div>
                          {control.resources.length > 0 && (
                            <div className="text-xs text-jc-dim mt-1">
                              {control.resources.length} resource{control.resources.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </button>
                      );
                    })}
                    
                    {items.length === 0 && (
                      <div className="text-sm text-jc-dim text-center py-4">
                        No {status.toLowerCase()} controls
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Control Details */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Control Details</h2>
              {control && (
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={mapCISControlSeverity(control.id, control.title)} />
                  <div className="text-sm text-jc-dim">
                    {control.id} — {control.title}
                  </div>
                </div>
              )}
            </div>
            
            {!control && (
              <div className="text-center py-8 text-jc-dim">
                Select a control above to view resource details
              </div>
            )}
            
            {control && (
              <div className="space-y-4">
                {/* Control Summary */}
                <div className="grid md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-xs text-jc-dim">Status</div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(control.status)}`}>
                      {control.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-jc-dim">Resources</div>
                    <div className="font-medium">{control.resources.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-jc-dim">Failed</div>
                    <div className="font-medium text-red-400">{control.fail}</div>
                  </div>
                  <div>
                    <div className="text-xs text-jc-dim">Passed</div>
                    <div className="font-medium text-emerald-400">{control.pass}</div>
                  </div>
                </div>

                {/* Resources Table */}
                {control.resources.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-white/20">
                          <th className="py-3 pr-4 font-medium">Resource ARN</th>
                          <th className="py-3 pr-4 font-medium">Service</th>
                          <th className="py-3 pr-4 font-medium">Region</th>
                          <th className="py-3 pr-4 font-medium">Finding ID</th>
                          <th className="py-3 pr-4 font-medium">Note</th>
                          <th className="py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {control.resources.map((resource, index) => (
                          <tr key={index} className="border-b border-white/10 last:border-none">
                            <td className="py-3 pr-4 font-mono text-xs break-all">
                              {resource.arn}
                            </td>
                            <td className="py-3 pr-4">
                              <span className="inline-block px-2 py-1 bg-jc-cyan/20 text-jc-cyan rounded text-xs font-medium">
                                {resource.service.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-jc-dim">{resource.region}</td>
                            <td className="py-3 pr-4">
                              {resource.findingId ? (
                                <span className="text-xs font-mono text-jc-dim break-all">
                                  {resource.findingId}
                                </span>
                              ) : (
                                <span className="text-jc-dim">—</span>
                              )}
                            </td>
                            <td className="py-3 pr-4 text-jc-dim">{resource.note || "—"}</td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => onRemediate(resource.arn)}
                                  disabled={remediating === resource.arn}
                                  className="px-3 py-1 text-xs"
                                >
                                  {remediating === resource.arn ? (
                                    <div className="flex items-center gap-1">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                                      Remediating...
                                    </div>
                                  ) : (
                                    "Remediate"
                                  )}
                                </Button>
                                <EvidenceButton controlId={control.id} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-jc-dim">
                    No resources associated with this control
                  </div>
                )}

                {/* Bulk Actions */}
                {control.resources.length > 0 && (
                  <div className="flex gap-3 pt-4 border-t border-white/20">
                    <Button
                      onClick={() => onRemediate()}
                      disabled={remediating === 'all'}
                      className="px-4 py-2"
                    >
                      {remediating === 'all' ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Remediating All...
                        </div>
                      ) : (
                        "Remediate All Resources"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Bulk Remediation Preview Modal */}

      <BulkRemediationPreview
        isOpen={showBulkPreview}
        onClose={() => setShowBulkPreview(false)}
        onExecute={handleBulkExecute}
        controls={bulkControls}
        title={bulkTitle}
        description={bulkDescription}
      />
    </div>
  );
}

function EvidenceButton({ controlId }: { controlId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await getEvidence(controlId);
      setItems(result.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load evidence');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => { setOpen(true); load(); }}
        className="px-3 py-1 text-xs"
      >
        Evidence
      </Button>
      
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" 
          onClick={() => setOpen(false)}
        >
          <div 
            className="bg-black/90 border border-white/20 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Evidence for {controlId}</h3>
              <Button
                onClick={() => setOpen(false)}
                className="px-3 py-1"
              >
                Close
              </Button>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-jc-cyan"></div>
                  <span className="ml-3 text-jc-dim">Loading evidence...</span>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                  Error: {error}
                </div>
              ) : items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm capitalize">
                          {item.type?.replace('_', ' ') || 'Evidence Item'}
                        </span>
                        <span className="text-xs text-jc-dim">
                          {item.timestamp ? formatDateTime(item.timestamp) : 'Unknown date'}
                        </span>
                      </div>
                      <div className="text-sm text-jc-dim mb-2">{item.details}</div>
                      {item.findings && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-jc-dim">Findings:</div>
                          <ul className="list-disc list-inside space-y-1 text-xs text-jc-dim ml-2">
                            {item.findings.map((finding: string, idx: number) => (
                              <li key={idx}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.recommendations && (
                        <div className="space-y-1 mt-2">
                          <div className="text-xs font-medium text-jc-dim">Recommendations:</div>
                          <ul className="list-disc list-inside space-y-1 text-xs text-jc-dim ml-2">
                            {item.recommendations.map((rec: string, idx: number) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-jc-dim">
                  No evidence available for this control
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}