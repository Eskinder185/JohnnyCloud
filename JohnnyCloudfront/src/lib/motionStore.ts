/**
 * Motion preferences store for background animations and user preferences
 */

export type MotionPreference = 'auto' | 'on' | 'off';

export interface MotionSettings {
  background: MotionPreference;
  reducedMotion: boolean;
  staticBackground: boolean;
}

const STORAGE_KEY = 'jc_ui_motion_v1';

class MotionStore {
  private settings: MotionSettings;

  constructor() {
    this.settings = this.loadFromStorage();
    this.updateReducedMotion();
    
    // Listen for system preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', () => this.updateReducedMotion());
    }
  }

  private loadFromStorage(): MotionSettings {
    try {
      if (typeof localStorage === 'undefined') {
        return this.getDefaultSettings();
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          background: parsed.background || 'auto',
          reducedMotion: false, // Will be updated by updateReducedMotion()
          staticBackground: parsed.staticBackground || false,
        };
      }
    } catch (error) {
      console.warn('Failed to load motion settings from storage:', error);
    }

    return this.getDefaultSettings();
  }

  private getDefaultSettings(): MotionSettings {
    return {
      background: 'auto',
      reducedMotion: false,
      staticBackground: false,
    };
  }

  private updateReducedMotion(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.settings.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }

      const toSave = {
        background: this.settings.background,
        staticBackground: this.settings.staticBackground,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.warn('Failed to save motion settings to storage:', error);
    }
  }

  public getSettings(): MotionSettings {
    return { ...this.settings };
  }

  public setBackgroundPreference(preference: MotionPreference): void {
    this.settings.background = preference;
    this.saveToStorage();
  }

  public setStaticBackground(isStatic: boolean): void {
    this.settings.staticBackground = isStatic;
    this.saveToStorage();
  }

  public shouldAnimate(): boolean {
    // Don't animate if user explicitly disabled animations
    if (this.settings.staticBackground) {
      return false;
    }

    // Don't animate if system prefers reduced motion and user chose 'auto'
    if (this.settings.background === 'auto' && this.settings.reducedMotion) {
      return false;
    }

    // Don't animate if user explicitly chose 'off'
    if (this.settings.background === 'off') {
      return false;
    }

    // Animate if user chose 'on' or 'auto' with no system preference
    return true;
  }

  public shouldAnimateBackground(): boolean {
    return this.shouldAnimate();
  }
}

export const motionStore = new MotionStore();
