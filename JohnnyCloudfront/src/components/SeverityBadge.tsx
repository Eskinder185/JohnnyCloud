import { SeverityLevel, getSeverityInfo } from '@/lib/severityUtils';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  className?: string;
  showIcon?: boolean;
  tooltip?: boolean;
}

export default function SeverityBadge({ 
  severity, 
  className = "", 
  showIcon = true,
  tooltip = true 
}: SeverityBadgeProps) {
  const severityInfo = getSeverityInfo(severity);
  
  const badge = (
    <span 
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${severityInfo.bgColor} ${severityInfo.borderColor} ${severityInfo.color} ${className}`}
      role="img"
      aria-label={`${severity} severity`}
    >
      {showIcon && <span aria-hidden="true">{severityInfo.icon}</span>}
      <span>{severityInfo.level}</span>
    </span>
  );

  if (tooltip) {
    return (
      <div className="group relative inline-block">
        {badge}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {severityInfo.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
        </div>
      </div>
    );
  }

  return badge;
}



