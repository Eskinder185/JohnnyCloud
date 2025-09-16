export type AssistantMode = "bedrock" | "lex" | "lex+voice";

const KEY_MODE = "JC_ASSISTANT_MODE";

export function getAssistantMode(): AssistantMode {
  const v = (localStorage.getItem(KEY_MODE) || "").trim() as AssistantMode;
  return v === "bedrock" || v === "lex" || v === "lex+voice" ? v : "bedrock"; // default
}

export function setAssistantMode(mode: AssistantMode) {
  localStorage.setItem(KEY_MODE, mode);
}

export const CHAT_API =
  (import.meta.env.VITE_CHAT_API as string | undefined)?.replace(/\/$/, "") || "";

