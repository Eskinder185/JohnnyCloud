import { ChatMessage } from './chatService';

const STORAGE_KEY = 'johnnycloud_chat_v2';
const MAX_MESSAGES = 50;

export interface ChatState {
  messages: ChatMessage[];
  threadId: string;
  speakEnabled: boolean;
  selectedVoice: string;
}

export class ChatStore {
  private state: ChatState;
  private saveTimeout: number | null = null;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): ChatState {
    try {
      // Check if localStorage is available
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage not available, using default state');
        return this.getDefaultState();
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate schema version
        if (parsed.version === 'v2') {
          return {
            messages: (parsed.messages || []).map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp) // Convert string back to Date
            })),
            threadId: parsed.threadId || 'default',
            speakEnabled: parsed.speakEnabled || false,
            selectedVoice: parsed.selectedVoice || 'Joanna'
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load chat state from storage:', error);
    }

    return this.getDefaultState();
  }

  private getDefaultState(): ChatState {
    return {
      messages: [{
        id: '1',
        text: "Hello! I'm Johnny-5, your AWS assistant. I can analyze costs, security posture, and compliance Guardrails (CIS/NIST/PCI). Ask me for a remediation plan, a savings estimate, or a Why AWS summary.",
        sender: 'bot',
        timestamp: new Date()
      }],
      threadId: 'default',
      speakEnabled: false,
      selectedVoice: 'Joanna'
    };
  }

  private saveToStorage() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = window.setTimeout(() => {
      try {
        // Check if localStorage is available
        if (typeof localStorage === 'undefined') {
          console.warn('localStorage not available, skipping save');
          return;
        }

        const toSave = {
          version: 'v2',
          messages: this.state.messages.slice(-MAX_MESSAGES), // Keep only last 50 messages
          threadId: this.state.threadId,
          speakEnabled: this.state.speakEnabled,
          selectedVoice: this.state.selectedVoice
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (error) {
        console.warn('Failed to save chat state to storage:', error);
      }
    }, 300); // Debounce saves
  }

  getState(): ChatState {
    return { ...this.state };
  }

  setMessages(messages: ChatMessage[]) {
    this.state.messages = messages;
    this.saveToStorage();
  }

  addMessage(message: ChatMessage) {
    this.state.messages.push(message);
    this.saveToStorage();
  }

  setThreadId(threadId: string) {
    this.state.threadId = threadId;
    this.saveToStorage();
  }

  setSpeakEnabled(enabled: boolean) {
    this.state.speakEnabled = enabled;
    this.saveToStorage();
  }

  setSelectedVoice(voice: string) {
    this.state.selectedVoice = voice;
    this.saveToStorage();
  }

  // Batch update for settings to reduce localStorage operations
  updateSettings(updates: { speakEnabled?: boolean; selectedVoice?: string }) {
    if (updates.speakEnabled !== undefined) {
      this.state.speakEnabled = updates.speakEnabled;
    }
    if (updates.selectedVoice !== undefined) {
      this.state.selectedVoice = updates.selectedVoice;
    }
    this.saveToStorage();
  }

  clear() {
    this.state = {
      messages: [{
        id: '1',
        text: "Hello! I'm Johnny-5, your AWS assistant. I can analyze costs, security posture, and compliance Guardrails (CIS/NIST/PCI). Ask me for a remediation plan, a savings estimate, or a Why AWS summary.",
        sender: 'bot',
        timestamp: new Date()
      }],
      threadId: 'default',
      speakEnabled: false,
      selectedVoice: 'Joanna'
    };
    this.saveToStorage();
  }
}

// Singleton instance
export const chatStore = new ChatStore();
