export const REGION = process.env.AWS_REGION || "us-east-1";
export const ORIGIN = process.env.CORS_ORIGIN || "https://d1zhi8uis2cnfs.cloudfront.net";

export const BEDROCK_MODEL_ID =
  process.env.BEDROCK_MODEL_ID || "us.anthropic.claude-3-5-sonnet-20241022-v2:0";

export const CHAT_TABLE = process.env.CHAT_TABLE || "JohnnyCloudChats";
export const MAX_TURNS = parseInt(process.env.MAX_TURNS || "18", 10);
export const TTL_DAYS = parseInt(process.env.TTL_DAYS || "14", 10);

export const TTS_ENABLED = (process.env.TTS_ENABLED || "true").toLowerCase() === "true";
export const DEFAULT_VOICE = process.env.POLLY_VOICE || "Joanna";

export const MAX_PROMPT_CHARS = 100_000;
