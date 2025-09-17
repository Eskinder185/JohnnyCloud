import { motionStore } from '@/lib/motionStore';

interface WhyAwsOverlayProps {
  className?: string;
}

export default function WhyAwsOverlay({ className = '' }: WhyAwsOverlayProps) {
  const shouldAnimate = motionStore.shouldAnimateBackground();

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[-2] ${className}`}
      style={{
        background: `
          linear-gradient(90deg, transparent 0%, rgba(0,230,255,0.06) 20%, transparent 40%),
          linear-gradient(0deg, transparent 0%, rgba(236,93,254,0.05) 30%, transparent 60%),
          linear-gradient(45deg, transparent 0%, rgba(124,255,178,0.04) 25%, transparent 50%)
        `,
        backgroundSize: '200% 200%, 150% 150%, 180% 180%',
        backgroundPosition: '0% 0%, 100% 100%, 50% 50%',
        animation: shouldAnimate ? 'isobar-morph 32s ease-in-out infinite' : 'none',
      }}
    />
  );
}

// Add keyframes to global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes isobar-morph {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%, 50% 50%; 
        opacity: 0.8;
      }
      25% { 
        background-position: 25% 25%, 75% 75%, 25% 75%; 
        opacity: 1;
      }
      50% { 
        background-position: 50% 50%, 50% 50%, 50% 50%; 
        opacity: 0.9;
      }
      75% { 
        background-position: 75% 75%, 25% 25%, 75% 25%; 
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
