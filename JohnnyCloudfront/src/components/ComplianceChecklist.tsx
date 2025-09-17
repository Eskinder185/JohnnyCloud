import { SeverityLevel, calculateControlPriority, getExposureWeight } from '@/lib/severityUtils';
import SeverityBadge from '@/components/SeverityBadge';

interface Control {
  id: string;
  title: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'UNKNOWN';
  pass: number;
  fail: number;
  warn: number;
  resources: Array<{
    arn: string;
    service: string;
    region: string;
    findingId?: string;
    note?: string;
  }>;
}

interface ComplianceChecklistProps {
  controls: Control[];
  onFixControl: (controlId: string) => void;
  loading?: boolean;
}

export default function ComplianceChecklist({ 
  controls, 
  onFixControl, 
  loading = false 
}: ComplianceChecklistProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate priority scores for failed controls
  const prioritizedControls = controls
    .filter(control => control.status === 'FAIL')
    .map(control => {
      // Map severity based on control ID and title
      let severity: SeverityLevel = 'Medium';
      if (control.id.includes('1.1') || control.id.includes('1.2') || 
          control.id.includes('2.1') || control.id.includes('2.2') ||
          control.title.toLowerCase().includes('public') ||
          control.title.toLowerCase().includes('root') ||
          control.title.toLowerCase().includes('mfa')) {
        severity = 'High';
      } else if (control.id.includes('3.') || control.id.includes('4.') ||
                 control.title.toLowerCase().includes('logging') ||
                 control.title.toLowerCase().includes('monitoring')) {
        severity = 'Medium';
      } else {
        severity = 'Low';
      }

      const exposureWeight = getExposureWeight(control.id, control.title, control.resources);
      const priority = calculateControlPriority(severity, control.fail, exposureWeight);
      
      return {
        ...control,
        severity,
        priority,
        exposureWeight
      };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3); // Top 3 quick wins

  if (prioritizedControls.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
        <h3 className="font-semibold text-lg mb-4">Compliance Checklist — Quick Wins</h3>
        <div className="text-center py-8 text-jc-dim">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-sm">All critical controls are passing!</div>
          <div className="text-xs mt-1">Great job maintaining compliance.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur">
      <h3 className="font-semibold text-lg mb-4">Compliance Checklist — Quick Wins</h3>
      <p className="text-sm text-jc-dim mb-4">
        Prioritized fixes to improve your compliance score quickly
      </p>
      
      <div className="space-y-3">
        {prioritizedControls.map((control, index) => (
          <div key={control.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-cyan-300">#{index + 1}</span>
                <SeverityBadge severity={control.severity} />
              </div>
              <button
                onClick={() => onFixControl(control.id)}
                className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 rounded border border-cyan-500/30 transition-colors"
              >
                Fix now
              </button>
            </div>
            
            <div className="text-sm font-medium mb-1">
              {control.id} — {control.title}
            </div>
            
            <div className="text-xs text-jc-dim mb-2">
              {control.fail} resource{control.fail !== 1 ? 's' : ''} need{control.fail === 1 ? 's' : ''} attention
            </div>
            
            <div className="text-xs text-jc-dim">
              {getQuickWinRationale(control.id, control.title, control.fail, control.exposureWeight)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-xs text-jc-dim">
          💡 <strong>Tip:</strong> Fixing these {prioritizedControls.length} controls could improve your compliance score by up to{' '}
          {Math.round(prioritizedControls.reduce((sum, c) => sum + (c.fail * 2), 0))} points.
        </div>
      </div>
    </div>
  );
}

function getQuickWinRationale(controlId: string, title: string, failCount: number, exposureWeight: number): string {
  const titleLower = title.toLowerCase();
  
  if (controlId.includes('1.1') || titleLower.includes('s3 public access')) {
    return `Public S3 buckets pose high security risk. Blocking public access is a quick, safe fix that prevents data breaches.`;
  }
  
  if (controlId.includes('2.1') || controlId.includes('2.2') || titleLower.includes('root')) {
    return `Root user security is critical. Enabling MFA and removing access keys significantly reduces account compromise risk.`;
  }
  
  if (controlId.includes('4.1') || titleLower.includes('security group')) {
    return `Open security groups expose services to the internet. Restricting access to specific IPs improves network security.`;
  }
  
  if (controlId.includes('3.1') || titleLower.includes('cloudtrail')) {
    return `CloudTrail logging is essential for compliance. Enabling log validation ensures audit trail integrity.`;
  }
  
  if (titleLower.includes('mfa')) {
    return `Multi-factor authentication prevents unauthorized access. This is a low-effort, high-impact security improvement.`;
  }
  
  if (titleLower.includes('encryption')) {
    return `Encryption protects data at rest and in transit. Enabling encryption is a compliance requirement with minimal performance impact.`;
  }
  
  return `This control affects ${failCount} resource${failCount !== 1 ? 's' : ''} and has ${exposureWeight === 3 ? 'high' : exposureWeight === 2 ? 'medium' : 'low'} exposure risk.`;
}
