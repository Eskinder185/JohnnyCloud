import { audioManager } from '@/lib/audio/AudioManager';

interface StopVoiceButtonProps {
  className?: string;
}

export default function StopVoiceButton({ className = "" }: StopVoiceButtonProps) {
  const handleStopVoice = () => {
    audioManager.stop();
  };

  return (
    <button
      onClick={handleStopVoice}
      className={`px-3 py-2 rounded-lg transition-colors bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 ${className}`}
      title="Stop voice playback"
      aria-label="Stop voice playback"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    </button>
  );
}
