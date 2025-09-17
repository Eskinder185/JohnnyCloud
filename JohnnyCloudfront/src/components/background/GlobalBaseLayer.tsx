import { motionStore } from '@/lib/motionStore';

interface GlobalBaseLayerProps {
  className?: string;
}

export default function GlobalBaseLayer({ className = '' }: GlobalBaseLayerProps) {
  const shouldAnimate = motionStore.shouldAnimateBackground();

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[-3] ${className}`}
      style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(0,230,255,0.08) 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, rgba(236,93,254,0.06) 1px, transparent 1px),
          linear-gradient(180deg, #0B1220 0%, #0B1320 50%, #0B1020 100%)
        `,
        backgroundSize: '40px 40px, 60px 60px, 100% 100%',
        backgroundPosition: '0 0, 20px 20px, 0 0',
        animation: shouldAnimate ? 'parallax-drift 30s linear infinite' : 'none',
      }}
    />
  );
}

// Add the keyframe to global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes parallax-drift {
      0% { 
        background-position: 0 0, 20px 20px, 0 0; 
      }
      100% { 
        background-position: 40px 40px, 0 0, 0 0; 
      }
    }
  `;
  document.head.appendChild(style);
}
