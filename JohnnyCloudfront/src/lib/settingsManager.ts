/**
 * Optimized settings manager with debounced localStorage operations
 * Reduces performance issues with rapid toggle/voice changes
 */

export type VoiceId = "Joanna" | "Matthew" | "Ivy" | "Salli" | "Justin";

const KEY_SPEAK_ENABLED = "jc_speak_enabled";
const KEY_VOICE = "jc_voice";
const DEBOUNCE_DELAY = 100; // ms

class SettingsManager {
  private saveTimeout: number | null = null;
  private pendingUpdates: Map<string, any> = new Map();

  // Get speak enabled state
  getSpeakEnabled(): boolean {
    const stored = localStorage.getItem(KEY_SPEAK_ENABLED);
    return stored === "true";
  }

  // Get selected voice
  getSelectedVoice(): VoiceId {
    const stored = localStorage.getItem(KEY_VOICE) as VoiceId;
    const validVoices: VoiceId[] = ["Joanna", "Matthew", "Ivy", "Salli", "Justin"];
    return validVoices.includes(stored) ? stored : "Joanna";
  }

  // Set speak enabled with debouncing
  setSpeakEnabled(enabled: boolean) {
    this.pendingUpdates.set(KEY_SPEAK_ENABLED, enabled.toString());
    this.debouncedSave();
  }

  // Set selected voice with debouncing
  setSelectedVoice(voice: VoiceId) {
    this.pendingUpdates.set(KEY_VOICE, voice);
    this.debouncedSave();
  }

  // Batch update multiple settings
  updateSettings(updates: { speakEnabled?: boolean; selectedVoice?: VoiceId }) {
    if (updates.speakEnabled !== undefined) {
      this.pendingUpdates.set(KEY_SPEAK_ENABLED, updates.speakEnabled.toString());
    }
    if (updates.selectedVoice !== undefined) {
      this.pendingUpdates.set(KEY_VOICE, updates.selectedVoice);
    }
    this.debouncedSave();
  }

  // Debounced save to localStorage
  private debouncedSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = window.setTimeout(() => {
      try {
        // Apply all pending updates at once
        this.pendingUpdates.forEach((value, key) => {
          localStorage.setItem(key, value);
        });
        this.pendingUpdates.clear();
      } catch (error) {
        console.warn('Failed to save settings:', error);
      }
    }, DEBOUNCE_DELAY);
  }

  // Force immediate save (for critical updates)
  forceSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.debouncedSave();
  }
}

// Singleton instance
export const settingsManager = new SettingsManager();

// Legacy compatibility functions
export function getSpeakEnabled(): boolean {
  return settingsManager.getSpeakEnabled();
}

export function setSpeakEnabled(enabled: boolean) {
  settingsManager.setSpeakEnabled(enabled);
}

export function getSelectedVoice(): VoiceId {
  return settingsManager.getSelectedVoice();
}

export function setSelectedVoice(voice: VoiceId) {
  settingsManager.setSelectedVoice(voice);
}

