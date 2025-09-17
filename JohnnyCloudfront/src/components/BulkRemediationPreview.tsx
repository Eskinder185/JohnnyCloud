import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import SeverityBadge from '@/components/SeverityBadge';
import { SeverityLevel } from '@/lib/severityUtils';

interface Resource {
  arn: string;
  service: string;
  region: string;
  findingId?: string;
  note?: string;
}

interface Control {
  id: string;
  title: string;
  severity: SeverityLevel;
  resources: Resource[];
}

interface BulkRemediationPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: (selectedResources: string[], notifyWhenDone: boolean) => Promise<void>;
  controls: Control[];
  title: string;
  description: string;
}

export default function BulkRemediationPreview({
  isOpen,
  onClose,
  onExecute,
  controls,
  title,
  description
}: BulkRemediationPreviewProps) {
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [notifyWhenDone, setNotifyWhenDone] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen) return null;

  const totalResources = controls.reduce((sum, control) => sum + control.resources.length, 0);
  const selectedCount = selectedResources.size;

  const handleResourceToggle = (arn: string) => {
    const newSelected = new Set(selectedResources);
    if (newSelected.has(arn)) {
      newSelected.delete(arn);
    } else {
      newSelected.add(arn);
    }
    setSelectedResources(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedResources.size === totalResources) {
      setSelectedResources(new Set());
    } else {
      const allArns = controls.flatMap(control => control.resources.map(r => r.arn));
      setSelectedResources(new Set(allArns));
    }
  };

  const handleExecute = async () => {
    if (selectedCount === 0) return;
    
    setIsExecuting(true);
    try {
      await onExecute(Array.from(selectedResources), notifyWhenDone);
      onClose();
    } catch (error) {
      console.error('Bulk remediation failed:', error);
      alert(`Failed to execute bulk remediation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const getRequiredPermissions = () => {
    const services = new Set(controls.flatMap(control => control.resources.map(r => r.service)));
    const permissions: string[] = [];
    
    if (services.has('s3')) {
      permissions.push('s3:PutBucketPublicAccessBlock', 's3:PutBucketPolicy', 's3:PutBucketAcl');
    }
    if (services.has('ec2')) {
      permissions.push('ec2:AuthorizeSecurityGroupIngress', 'ec2:RevokeSecurityGroupIngress', 'ec2:ModifySecurityGroupRules');
    }
    if (services.has('cloudtrail')) {
      permissions.push('cloudtrail:UpdateTrail', 'cloudtrail:PutEventSelectors');
    }
    if (services.has('iam')) {
      permissions.push('iam:UpdateAccountPasswordPolicy', 'iam:CreateVirtualMFADevice', 'iam:EnableMFADevice');
    }
    
    return permissions;
  };

  const getRisksAndRollback = () => {
    const risks: string[] = [];
    const rollbacks: string[] = [];
    
    controls.forEach(control => {
      if (control.id.includes('1.1') || control.title.toLowerCase().includes('s3 public access')) {
        risks.push('S3 buckets may become temporarily inaccessible during remediation');
        rollbacks.push('Disable S3 Block Public Access via AWS Console or CLI');
      }
      if (control.id.includes('4.1') || control.title.toLowerCase().includes('security group')) {
        risks.push('Network access may be restricted, potentially blocking legitimate traffic');
        rollbacks.push('Restore original security group rules from backup or AWS Config');
      }
      if (control.id.includes('3.1') || control.title.toLowerCase().includes('cloudtrail')) {
        risks.push('Logging configuration changes may affect compliance monitoring');
        rollbacks.push('Revert CloudTrail settings to previous configuration');
      }
    });
    
    return { risks: [...new Set(risks)], rollbacks: [...new Set(rollbacks)] };
  };

  const { risks, rollbacks } = getRisksAndRollback();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-black/90 border border-white/20 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-jc-dim text-sm">{description}</p>
            </div>
            <Button onClick={onClose} className="px-3 py-1">
              Close
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Summary */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-3">Remediation Summary</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-jc-dim">Controls</div>
                <div className="font-medium">{controls.length}</div>
              </div>
              <div>
                <div className="text-jc-dim">Total Resources</div>
                <div className="font-medium">{totalResources}</div>
              </div>
              <div>
                <div className="text-jc-dim">Selected</div>
                <div className="font-medium text-cyan-300">{selectedCount}</div>
              </div>
            </div>
          </Card>

          {/* Controls and Resources */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Resources to Remediate</h3>
              <Button
                onClick={handleSelectAll}
                className="px-3 py-1 text-xs"
                variant="outline"
              >
                {selectedResources.size === totalResources ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {controls.map(control => (
              <Card key={control.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <SeverityBadge severity={control.severity} />
                  <div>
                    <div className="font-medium text-sm">{control.id} — {control.title}</div>
                    <div className="text-xs text-jc-dim">{control.resources.length} resource{control.resources.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {control.resources.map((resource, index) => (
                    <label key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded border border-white/10 hover:bg-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedResources.has(resource.arn)}
                        onChange={() => handleResourceToggle(resource.arn)}
                        className="rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-xs break-all">{resource.arn}</div>
                        <div className="text-xs text-jc-dim">
                          {resource.service.toUpperCase()} • {resource.region}
                          {resource.note && ` • ${resource.note}`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Required Permissions */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-3">Required Permissions</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {getRequiredPermissions().map((permission, index) => (
                <div key={index} className="font-mono text-xs bg-white/5 p-2 rounded border border-white/10">
                  {permission}
                </div>
              ))}
            </div>
          </Card>

          {/* Risks and Rollback */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold mb-3">Risks & Rollback</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Potential Risks</h4>
                <ul className="text-xs text-jc-dim space-y-1">
                  {risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-amber-400 mb-2">Rollback Steps</h4>
                <ul className="text-xs text-jc-dim space-y-1">
                  {rollbacks.map((rollback, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      {rollback}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Notification Option */}
          <Card className="p-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyWhenDone}
                onChange={(e) => setNotifyWhenDone(e.target.checked)}
                className="rounded border-white/20 bg-transparent text-cyan-500 focus:ring-cyan-500"
              />
              <div>
                <div className="text-sm font-medium">Notify when remediation is complete</div>
                <div className="text-xs text-jc-dim">Receive email/Slack notification when all selected resources have been remediated</div>
              </div>
            </label>
          </Card>
        </div>

        <div className="p-6 border-t border-white/20 flex items-center justify-between">
          <div className="text-sm text-jc-dim">
            {selectedCount > 0 ? `${selectedCount} resource${selectedCount !== 1 ? 's' : ''} selected` : 'No resources selected'}
          </div>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" disabled={isExecuting}>
              Cancel
            </Button>
            <Button
              onClick={handleExecute}
              disabled={selectedCount === 0 || isExecuting}
              className="px-6"
            >
              {isExecuting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Executing...
                </div>
              ) : (
                `Run Remediation (${selectedCount})`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
