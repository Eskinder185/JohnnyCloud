import { useState, useEffect } from 'react';
import { motionStore, MotionPreference } from '@/lib/motionStore';

interface MotionSettingsProps {
  className?: string;
}

export default function MotionSettings({ className = '' }: MotionSettingsProps) {
  const [settings, setSettings] = useState(motionStore.getSettings());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for settings changes
    const interval = setInterval(() => {
      setSettings(motionStore.getSettings());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBackgroundChange = (preference: MotionPreference) => {
    motionStore.setBackgroundPreference(preference);
    setSettings(motionStore.getSettings());
  };

  const handleStaticBackgroundToggle = () => {
    motionStore.setStaticBackground(!settings.staticBackground);
    setSettings(motionStore.getSettings());
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        aria-label="Motion settings"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-jc-surface border border-white/10 rounded-xl shadow-lg z-50">
          <h3 className="text-h3 text-primary mb-3">Motion Settings</h3>
          
          <div className="space-y-4">
            {/* Background Animation */}
            <div>
              <label className="block text-small text-secondary mb-2">
                Background Animation
              </label>
              <div className="space-y-2">
                {[
                  { value: 'auto', label: 'Auto (respect system)' },
                  { value: 'on', label: 'Always on' },
                  { value: 'off', label: 'Always off' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="background"
                      value={option.value}
                      checked={settings.background === option.value}
                      onChange={() => handleBackgroundChange(option.value as MotionPreference)}
                      className="text-jc-cyan focus:ring-jc-cyan"
                    />
                    <span className="text-small text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Static Background Toggle */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.staticBackground}
                  onChange={handleStaticBackgroundToggle}
                  className="text-jc-cyan focus:ring-jc-cyan"
                />
                <span className="text-small text-primary">Static background</span>
              </label>
              <p className="text-meta text-muted mt-1">
                Override all animations with a static background
              </p>
            </div>

            {/* System Status */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-meta text-muted">
                System reduced motion: {settings.reducedMotion ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
