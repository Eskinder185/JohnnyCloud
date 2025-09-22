import { useState, useEffect } from 'react';
import { audioManager, type AudioSource } from '@/lib/audio/AudioManager';
import { type AssistantAudio } from '@/lib/chatService';

interface AudioControlsProps {
  audio: AssistantAudio;
  onError?: (error: string) => void;
}

export default function AudioControls({ audio, onError }: AudioControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTapToPlay, setShowTapToPlay] = useState(false);

  useEffect(() => {
    // Check if this audio is currently playing
    const checkPlaying = () => {
      const currentSource = audioManager.getCurrentSource();
      const isCurrentAudio = currentSource && 
        ((audio.base64 && currentSource.base64 === audio.base64) ||
         (audio.url && currentSource.url === audio.url));
      
      setIsPlaying(!!(audioManager.isPlaying() && isCurrentAudio));
    };

    // Initial check
    checkPlaying();
    
    // Use event-driven updates instead of polling
    const handleAudioStateChange = () => {
      checkPlaying();
    };

    // Listen for audio events instead of polling
    const audioElement = audioManager.getAudioElement();
    if (audioElement) {
      audioElement.addEventListener('play', handleAudioStateChange);
      audioElement.addEventListener('pause', handleAudioStateChange);
      audioElement.addEventListener('ended', handleAudioStateChange);
      
      return () => {
        audioElement.removeEventListener('play', handleAudioStateChange);
        audioElement.removeEventListener('pause', handleAudioStateChange);
        audioElement.removeEventListener('ended', handleAudioStateChange);
      };
    }
  }, [audio]);

  const handlePlay = async () => {
    try {
      setShowTapToPlay(false);
      const audioSource: AudioSource = {
        format: audio.format,
        base64: audio.base64,
        url: audio.url,
        voice: audio.voice
      };
      
      await audioManager.play(audioSource);
    } catch (error) {
      console.error('Audio playback error:', error);
      if (error instanceof Error && error.message === 'AUTOPLAY_BLOCKED') {
        setShowTapToPlay(true);
      } else {
        onError?.('Couldn\'t play audio');
      }
    }
  };

  const handlePause = () => {
    audioManager.pause();
  };

  const handleReplay = () => {
    audioManager.replay();
  };

  if (showTapToPlay) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={handlePlay}
          className="flex items-center gap-1 px-2 py-1 bg-jc-cyan/20 text-jc-cyan rounded text-xs hover:bg-jc-cyan/30 transition-colors"
          title="Tap to play"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Tap to play
        </button>
        {audio.voice && (
          <span className="text-xs text-jc-dim">{audio.voice}</span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex items-center gap-1">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="flex items-center gap-1 px-2 py-1 bg-jc-cyan/20 text-jc-cyan rounded text-xs hover:bg-jc-cyan/30 transition-colors"
            title="Pause"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
            Pause
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="flex items-center gap-1 px-2 py-1 bg-jc-cyan/20 text-jc-cyan rounded text-xs hover:bg-jc-cyan/30 transition-colors"
            title="Play answer"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </button>
        )}
        
        <button
          onClick={handleReplay}
          className="flex items-center gap-1 px-2 py-1 bg-jc-cyan/20 text-jc-cyan rounded text-xs hover:bg-jc-cyan/30 transition-colors"
          title="Replay from start"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          Replay
        </button>
      </div>
      
      {audio.voice && (
        <span className="text-xs text-jc-dim">Voice: {audio.voice}</span>
      )}
    </div>
  );
}
