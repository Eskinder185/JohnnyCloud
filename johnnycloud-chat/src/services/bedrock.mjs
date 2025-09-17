import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { REGION, BEDROCK_MODEL_ID } from "../config.mjs";
import { SYSTEM_PROMPT } from "../utils/prompt.mjs";

const bedrock = new BedrockRuntimeClient({ region: REGION });

export async function askBedrock(messages) {
  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    system: SYSTEM_PROMPT,
    max_tokens: 700,
    temperature: 0.6,
    top_p: 0.95,
    messages: messages.map(m => ({
      role: m.role,
      content: [{ type: "text", text: m.content }]
    }))
  });

  const res = await bedrock.send(new InvokeModelCommand({
    modelId: BEDROCK_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body
  }));

  const decoded = JSON.parse(new TextDecoder().decode(res.body));
  return decoded?.content?.[0]?.text?.trim() || "…";
}
