export interface AudioSource {
  base64?: string;
  url?: string;
  format: string;
  voice?: string;
}

export class AudioManager {
  private audio: HTMLAudioElement;
  private isCurrentlyPlaying: boolean = false;
  private currentSource: AudioSource | null = null;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.audio.addEventListener('ended', () => {
      this.isCurrentlyPlaying = false;
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.isCurrentlyPlaying = false;
    });

    this.audio.addEventListener('pause', () => {
      this.isCurrentlyPlaying = false;
    });

    this.audio.addEventListener('play', () => {
      this.isCurrentlyPlaying = true;
    });
  }

  async play(source: AudioSource): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stop();

      this.currentSource = source;
      
      // Set the audio source
      if (source.base64) {
        this.audio.src = `data:audio/${source.format};base64,${source.base64}`;
      } else if (source.url) {
        this.audio.src = source.url;
      } else {
        throw new Error('No audio source provided');
      }

      // Load and play
      this.audio.load();
      await this.audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      this.isCurrentlyPlaying = false;
      
      // Handle autoplay policy restrictions
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('AUTOPLAY_BLOCKED');
      }
      throw error;
    }
  }

  pause(): void {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isCurrentlyPlaying = false;
    }
  }

  isPlaying(): boolean {
    return this.isCurrentlyPlaying && !this.audio.paused;
  }

  getCurrentSource(): AudioSource | null {
    return this.currentSource;
  }

  // Reset to beginning of current audio
  replay(): void {
    if (this.audio && this.currentSource) {
      this.audio.currentTime = 0;
      if (!this.isCurrentlyPlaying) {
        this.play(this.currentSource);
      }
    }
  }
}

// Singleton instance
export const audioManager = new AudioManager();

