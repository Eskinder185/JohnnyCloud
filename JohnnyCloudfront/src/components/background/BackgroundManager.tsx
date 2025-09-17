import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GlobalBaseLayer from './GlobalBaseLayer';
import HomeOverlay from './overlays/HomeOverlay';
import MetricsOverlay from './overlays/MetricsOverlay';
import GuardrailsOverlay from './overlays/GuardrailsOverlay';
import WhyAwsOverlay from './overlays/WhyAwsOverlay';
import FaqAboutOverlay from './overlays/FaqAboutOverlay';

interface BackgroundManagerProps {
  isVoiceActive?: boolean;
  showShieldRipple?: boolean;
}

export default function BackgroundManager({ 
  isVoiceActive = false, 
  showShieldRipple = false 
}: BackgroundManagerProps) {
  const location = useLocation();
  const [currentOverlay, setCurrentOverlay] = useState<string>('');

  // Determine which overlay to show based on route
  useEffect(() => {
    const pathname = location.pathname;
    
    if (pathname === '/' || pathname.startsWith('/home')) {
      setCurrentOverlay('home');
    } else if (pathname.startsWith('/metrics')) {
      setCurrentOverlay('metrics');
    } else if (pathname.startsWith('/guardrails')) {
      setCurrentOverlay('guardrails');
    } else if (pathname.startsWith('/why-aws')) {
      setCurrentOverlay('whyaws');
    } else if (pathname.startsWith('/faq') || pathname.startsWith('/about')) {
      setCurrentOverlay('faq-about');
    } else {
      setCurrentOverlay('default');
    }
  }, [location.pathname]);

  // Pause animations when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause all animations by adding a class
        document.body.classList.add('animations-paused');
      } else {
        // Resume animations
        document.body.classList.remove('animations-paused');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <>
      {/* Global Base Layer - always present */}
      <GlobalBaseLayer />

      {/* Page-specific overlays */}
      {currentOverlay === 'home' && (
        <HomeOverlay isVoiceActive={isVoiceActive} />
      )}
      
      {currentOverlay === 'metrics' && (
        <MetricsOverlay />
      )}
      
      {currentOverlay === 'guardrails' && (
        <GuardrailsOverlay showShieldRipple={showShieldRipple} />
      )}
      
      {currentOverlay === 'whyaws' && (
        <WhyAwsOverlay />
      )}
      
      {currentOverlay === 'faq-about' && (
        <FaqAboutOverlay />
      )}
    </>
  );
}
