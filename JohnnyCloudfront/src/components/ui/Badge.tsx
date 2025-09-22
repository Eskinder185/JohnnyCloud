interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '' 
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-white/10 text-white border-white/20',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    info: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full border font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}



