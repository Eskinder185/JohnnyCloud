import { motionStore } from '@/lib/motionStore';

interface MetricsOverlayProps {
  className?: string;
}

export default function MetricsOverlay({ className = '' }: MetricsOverlayProps) {
  const shouldAnimate = motionStore.shouldAnimateBackground();

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[-2] ${className}`}
      style={{
        background: `
          radial-gradient(ellipse 100% 50% at 20% 50%, rgba(124,255,178,0.08) 0%, transparent 50%),
          radial-gradient(ellipse 80% 40% at 80% 30%, rgba(0,230,255,0.06) 0%, transparent 50%),
          radial-gradient(ellipse 120% 60% at 50% 80%, rgba(236,93,254,0.05) 0%, transparent 50%)
        `,
        backgroundSize: '200% 200%, 150% 150%, 180% 180%',
        backgroundPosition: '0% 0%, 100% 100%, 50% 50%',
        animation: shouldAnimate ? 'cost-waves 35s ease-in-out infinite' : 'none',
      }}
    />
  );
}

// Add keyframes to global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes cost-waves {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%, 50% 50%; 
      }
      33% { 
        background-position: 100% 50%, 0% 50%, 25% 75%; 
      }
      66% { 
        background-position: 50% 100%, 50% 0%, 75% 25%; 
      }
    }
  `;
  document.head.appendChild(style);
}
