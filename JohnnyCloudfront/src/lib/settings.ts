export type VoiceId = "Joanna" | "Matthew" | "Ivy" | "Salli" | "Justin";

const KEY_SPEAK_ENABLED = "jc_speak_enabled";
const KEY_VOICE = "jc_voice";

export function getSpeakEnabled(): boolean {
  const stored = localStorage.getItem(KEY_SPEAK_ENABLED);
  return stored === "true";
}

export function setSpeakEnabled(enabled: boolean) {
  localStorage.setItem(KEY_SPEAK_ENABLED, enabled.toString());
}

export function getSelectedVoice(): VoiceId {
  const stored = localStorage.getItem(KEY_VOICE) as VoiceId;
  const validVoices: VoiceId[] = ["Joanna", "Matthew", "Ivy", "Salli", "Justin"];
  return validVoices.includes(stored) ? stored : "Joanna";
}

export function setSelectedVoice(voice: VoiceId) {
  localStorage.setItem(KEY_VOICE, voice);
}

export const CHAT_API =
  (import.meta.env.VITE_CHAT_API as string | undefined)?.replace(/\/$/, "") || "";

