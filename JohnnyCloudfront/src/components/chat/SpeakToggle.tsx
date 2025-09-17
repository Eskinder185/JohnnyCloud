import { setSpeakEnabled, setSelectedVoice, type VoiceId } from '@/lib/settings';

interface SpeakToggleProps {
  speakEnabled: boolean;
  onSpeakToggle: (enabled: boolean) => void;
  selectedVoice: VoiceId;
  onVoiceChange: (voice: VoiceId) => void;
}

export default function SpeakToggle({ 
  speakEnabled, 
  onSpeakToggle, 
  selectedVoice, 
  onVoiceChange 
}: SpeakToggleProps) {
  const voices: VoiceId[] = ["Joanna", "Matthew", "Ivy", "Salli", "Justin"];

  return (
    <div className="flex items-center gap-3">
      {/* Speak Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const newEnabled = !speakEnabled;
            onSpeakToggle(newEnabled);
            setSpeakEnabled(newEnabled);
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
            speakEnabled 
              ? 'bg-jc-cyan/20 text-jc-cyan hover:bg-jc-cyan/30' 
              : 'bg-white/10 text-jc-dim hover:bg-white/20'
          }`}
          title="Read answers aloud"
        >
          <span className="text-sm">🔊</span>
          Speak reply
        </button>
      </div>

      {/* Voice Selector */}
      {speakEnabled && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-jc-dim">Voice:</label>
          <select
            value={selectedVoice}
            onChange={(e) => {
              const voice = e.target.value as VoiceId;
              onVoiceChange(voice);
              setSelectedVoice(voice);
            }}
            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-jc-cyan"
          >
            {voices.map((voice) => (
              <option key={voice} value={voice} className="bg-black text-white">
                {voice}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
