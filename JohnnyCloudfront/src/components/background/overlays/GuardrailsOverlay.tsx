import { motionStore } from '@/lib/motionStore';

interface GuardrailsOverlayProps {
  className?: string;
  showShieldRipple?: boolean;
}

export default function GuardrailsOverlay({ className = '', showShieldRipple = false }: GuardrailsOverlayProps) {
  const shouldAnimate = motionStore.shouldAnimateBackground();

  return (
    <>
      {/* Radar Sweep */}
      <div 
        className={`fixed inset-0 pointer-events-none z-[-2] ${className}`}
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,230,255,0.06) 45%, transparent 50%),
            radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,230,255,0.04) 35%, transparent 40%),
            radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,230,255,0.03) 25%, transparent 30%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%',
          backgroundPosition: '0 0, 0 0, 0 0',
          animation: shouldAnimate ? 'radar-sweep 28s linear infinite' : 'none',
        }}
      />

      {/* Shield Ripple - triggered after successful remediation */}
      {showShieldRipple && (
        <div 
          className="fixed inset-0 pointer-events-none z-[-1]"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)
            `,
            animation: shouldAnimate ? 'shield-ripple 2s ease-out forwards' : 'none',
          }}
        />
      )}
    </>
  );
}

// Add keyframes to global CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes radar-sweep {
      0% { 
        background: 
          radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,230,255,0.06) 45%, transparent 50%),
          radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,230,255,0.04) 35%, transparent 40%),
          radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,230,255,0.03) 25%, transparent 30%);
      }
      100% { 
        background: 
          radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,230,255,0.06) 45%, transparent 50%),
          radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,230,255,0.04) 35%, transparent 40%),
          radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,230,255,0.03) 25%, transparent 30%);
      }
    }
    
    @keyframes shield-ripple {
      0% { 
        opacity: 0; 
        transform: scale(0.8);
      }
      50% { 
        opacity: 1; 
        transform: scale(1.2);
      }
      100% { 
        opacity: 0; 
        transform: scale(1.5);
      }
    }
  `;
  document.head.appendChild(style);
}
