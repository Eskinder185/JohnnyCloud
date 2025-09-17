import { motionStore } from '@/lib/motionStore';

interface HomeOverlayProps {
  className?: string;
  isVoiceActive?: boolean;
}

export default function HomeOverlay({ className = '', isVoiceActive = false }: HomeOverlayProps) {
  const shouldAnimate = motionStore.shouldAnimateBackground();

  return (
    <>
      {/* Aurora Ribbons */}
      <div 
        className={`fixed inset-0 pointer-events-none z-[-2] ${className}`}
        style={{
          background: `
            linear-gradient(45deg, transparent 30%, rgba(0,230,255,0.08) 50%, transparent 70%),
            linear-gradient(-45deg, transparent 20%, rgba(236,93,254,0.06) 40%, transparent 60%)
          `,
          backgroundSize: '200% 200%, 300% 300%',
          backgroundPosition: '0% 0%, 100% 100%',
          animation: shouldAnimate ? 'aurora-drift 25s ease-in-out infinite' : 'none',
        }}
      />

      {/* Voice Halo - only when voice is active */}
      {isVoiceActive && (
        <div 
          className="fixed inset-0 pointer-events-none z-[-1]"
          style={{
            background: `
              radial-gradient(circle at 50% 40%, rgba(0,230,255,0.12) 0%, transparent 50%),
              radial-gradient(circle at 50% 40%, rgba(236,93,254,0.08) 0%, transparent 40%)
            `,
            animation: shouldAnimate ? 'voice-halo 3s ease-in-out infinite' : 'none',
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
    @keyframes aurora-drift {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%; 
      }
      50% { 
        background-position: 100% 100%, 0% 0%; 
      }
    }
    
    @keyframes voice-halo {
      0%, 100% { 
        opacity: 0.6; 
        transform: scale(1);
      }
      50% { 
        opacity: 1; 
        transform: scale(1.05);
      }
    }
  `;
  document.head.appendChild(style);
}
