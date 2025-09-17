// Severity mapping utilities for Guardrails

export type SeverityLevel = 'High' | 'Medium' | 'Low' | 'Informational';

export interface SeverityInfo {
  level: SeverityLevel;
  color: string;
  bgColor: string;
  borderColor: string;
  icon?: string;
  description: string;
}

export function mapSecurityHubSeverity(severityLabel: string): SeverityLevel {
  const label = severityLabel.toLowerCase();
  if (label.includes('critical') || label.includes('high')) return 'High';
  if (label.includes('medium')) return 'Medium';
  if (label.includes('low')) return 'Low';
  return 'Informational';
}

export function mapGuardDutySeverity(score: number): SeverityLevel {
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  return 'Low';
}

export function mapCISControlSeverity(controlId: string, title: string): SeverityLevel {
  // CIS control severity mapping based on control ID and title
  const id = controlId.toLowerCase();
  const titleLower = title.toLowerCase();
  
  // High severity controls
  if (id.includes('1.1') || id.includes('1.2') || // S3 public access
      id.includes('2.1') || id.includes('2.2') || // Root user access
      id.includes('3.1') || id.includes('3.2') || // CloudTrail
      id.includes('4.1') || id.includes('4.2') || // Security Groups
      titleLower.includes('public') || 
      titleLower.includes('root') ||
      titleLower.includes('mfa') ||
      titleLower.includes('encryption')) {
    return 'High';
  }
  
  // Medium severity controls
  if (id.includes('5.') || id.includes('6.') || // Logging and monitoring
      id.includes('7.') || id.includes('8.') || // Network and compute
      titleLower.includes('logging') ||
      titleLower.includes('monitoring') ||
      titleLower.includes('network')) {
    return 'Medium';
  }
  
  return 'Low';
}

export function getSeverityInfo(severity: SeverityLevel): SeverityInfo {
  const severityMap: Record<SeverityLevel, SeverityInfo> = {
    High: {
      level: 'High',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30',
      icon: '🔴',
      description: 'Critical security risk requiring immediate attention'
    },
    Medium: {
      level: 'Medium',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/30',
      icon: '🟡',
      description: 'Moderate security risk that should be addressed soon'
    },
    Low: {
      level: 'Low',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      icon: '🟢',
      description: 'Low security risk with minimal immediate impact'
    },
    Informational: {
      level: 'Informational',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      icon: 'ℹ️',
      description: 'Informational finding for awareness'
    }
  };
  
  return severityMap[severity];
}

export function calculateControlPriority(
  severity: SeverityLevel,
  affectedResources: number,
  exposureWeight: number = 1
): number {
  const severityWeights = {
    High: 3,
    Medium: 2,
    Low: 1,
    Informational: 0.5
  };
  
  return severityWeights[severity] * affectedResources * exposureWeight;
}

export function getExposureWeight(_controlId: string, title: string, resources: any[]): number {
  const titleLower = title.toLowerCase();
  const hasPublicExposure = resources.some(r => 
    r.note?.toLowerCase().includes('public') ||
    r.note?.toLowerCase().includes('0.0.0.0/0')
  );
  
  // High exposure weight for public-facing issues
  if (hasPublicExposure || titleLower.includes('public')) return 3;
  
  // Medium exposure for network/access issues
  if (titleLower.includes('security group') || 
      titleLower.includes('access') ||
      titleLower.includes('network')) return 2;
  
  // Default weight
  return 1;
}
