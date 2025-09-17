import { motionStore } from '@/lib/motionStore';

interface FaqAboutOverlayProps {
  className?: string;
}

export default function FaqAboutOverlay({ className = '' }: FaqAboutOverlayProps) {
  const shouldAnimate = motionStore.shouldAnimateBackground();

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-[-2] ${className}`}
      style={{
        background: `
          linear-gradient(90deg, transparent 0%, rgba(0,230,255,0.04) 1px, transparent 2px),
          linear-gradient(0deg, transparent 0%, rgba(236,93,254,0.03) 1px, transparent 2px)
        `,
        backgroundSize: '20px 20px, 30px 30px',
        backgroundPosition: '0 0, 10px 10px',
        animation: shouldAnimate ? 'digital-rain 40s linear infinite' : 'none',
      }}
    />
  );
}

// Add keyframes to global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes digital-rain {
      0% { 
        background-position: 0 0, 10px 10px; 
      }
      100% { 
        background-position: 20px 20px, 30px 30px; 
      }
    }
  `;
  document.head.appendChild(style);
}
