import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { REGION, TTS_ENABLED, DEFAULT_VOICE } from "../config.mjs";

const polly = new PollyClient({ region: REGION });

function escapeForSSML(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Generate MP3 via Polly. Tries Neural first, falls back to Standard
 * if that voice/region doesn't support Neural.
 *
 * @param {{ speak: boolean, voice?: string, text: string }} params
 * @returns {Promise<null | { format: "mp3", base64: string, voice: string }>}
 */
export async function synthesizeIfRequested({ speak, voice, text }) {
  if (!TTS_ENABLED || !speak || !text) return null;

  const VoiceId = voice || DEFAULT_VOICE;
  const ssml = `<speak>${escapeForSSML(text)}</speak>`;

  async function trySynthesize(engine /* "neural" | undefined */) {
    return polly.send(
      new SynthesizeSpeechCommand({
        OutputFormat: "mp3",
        VoiceId,
        TextType: "ssml",
        Text: ssml,
        ...(engine ? { Engine: engine } : {}),
      })
    );
  }

  let resp;
  try {
    resp = await trySynthesize("neural");
  } catch (e) {
    console.warn(
      `Neural not available for ${VoiceId} in this region; falling back to standard.`,
      e?.name || e
    );
    resp = await trySynthesize(undefined);
  }

  const chunks = [];
  for await (const c of resp.AudioStream) chunks.push(Buffer.from(c));
  return {
    format: "mp3",
    base64: Buffer.concat(chunks).toString("base64"),
    voice: VoiceId,
  };
}
