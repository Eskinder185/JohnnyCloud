import { LexRuntimeV2Client, RecognizeUtteranceCommand } from "@aws-sdk/client-lex-runtime-v2";

const region = import.meta.env.VITE_AWS_REGION;
const botId = import.meta.env.VITE_LEX_BOT_ID;
const aliasId = import.meta.env.VITE_LEX_BOT_ALIAS_ID;
const localeId = import.meta.env.VITE_LEX_LOCALE_ID || "en_US";

function base64ToText(b64?: string) {
  if (!b64) return "";
  return decodeURIComponent(escape(window.atob(b64))); // RFC7230 headers (X-Amz-Lex-*)
}

export async function sendUtterance(blob: Blob, sessionId: string) {
  const client = new LexRuntimeV2Client({ region });

  const cmd = new RecognizeUtteranceCommand({
    botId, botAliasId: aliasId, localeId, sessionId,
    requestContentType: blob.type || "audio/webm;codecs=opus",
    responseContentType: "audio/mpeg" // ask Lex for TTS audio (Polly) if configured
    // inputStream set below
  } as any);
  // SDK v3 expects inputStream assigned post-construction:
  (cmd as any).inputStream = await blob.arrayBuffer();

  const r: any = await client.send(cmd);

  // Lex returns metadata in base64 headers
  const transcript = base64ToText(r["x-amz-lex-input-transcript"]);
  const messages = base64ToText(r["x-amz-lex-messages"]);
  const text = messages || transcript || "(no response)";

  // audio stream (if voice configured)
  const audioArrayBuffer = r.audioStream ? await r.audioStream.transformToByteArray() : undefined;
  const audioBlob = audioArrayBuffer ? new Blob([audioArrayBuffer], { type: "audio/mpeg" }) : undefined;

  return { text, audioBlob };
}

