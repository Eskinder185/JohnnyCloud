const CHAT_API = (import.meta.env.VITE_CHAT_API || "").replace(/\/$/, "");

export type ChatMode = "bedrock" | "lex" | "lex+voice";
export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function sendChatOnce(opts: {
  message: string;
  mode?: ChatMode;             // defaults to "bedrock"
  sessionId?: string;          // optional, for server-side sessioning
  history?: ChatMessage[];     // optional short history
}) {
  if (!CHAT_API) throw new Error("VITE_CHAT_API not set");
  
  const requestBody = {
    message: opts.message,
    mode: opts.mode || "bedrock",
    sessionId: opts.sessionId,
    history: opts.history
  };
  
  console.log("Chat API Request:", {
    url: CHAT_API,
    body: requestBody
  });
  
  const res = await fetch(CHAT_API, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      // If/when you enable the authorizer:
      // authorization: `Bearer ${sessionStorage.getItem("ID_TOKEN") ?? ""}`
    },
    body: JSON.stringify(requestBody)
  });
  
  console.log("Chat API Response:", {
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries())
  });
  
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("Chat API Error:", { status: res.status, text: errText });
    throw new Error(`API ${res.status}: ${errText}`);
  }
  
  // Handle multiple response formats and content types
  let payload: any;
  const ct = res.headers.get("content-type") || "";
  payload = ct.includes("application/json") ? await res.json() : await res.text();
  
  console.log("Chat API Data:", payload);
  console.log("Payload type:", typeof payload);
  console.log("Payload keys:", typeof payload === "object" ? Object.keys(payload) : "N/A");
  
  // IMPORTANT: API returns { response: string }
  const text = (
    typeof payload === "string"
      ? payload
      : payload.response ?? payload.reply ?? payload.message ?? payload.output ?? ""
  ).toString().trim();
  
  console.log("Extracted text:", text);
  console.log("Text length:", text.length);
  
  if (!text) {
    console.warn("Empty API payload:", payload);
    console.warn("Available keys:", typeof payload === "object" ? Object.keys(payload) : "N/A");
    // Return a friendly fallback so you can see it worked
    return "[no content returned]";
  }
  
  console.log("Chat API Final Response:", text);
  return text;
}

/**
 * Optional: streaming support if your API returns text/event-stream with "data: ..."
 * Falls back to non-streaming if server doesn't support it.
 */
export async function* sendChatStream(opts: {
  message: string; mode?: ChatMode; sessionId?: string; history?: ChatMessage[];
}) {
  if (!CHAT_API) throw new Error("VITE_CHAT_API not set");
  
  const requestBody = {
    message: opts.message,
    mode: opts.mode || "bedrock",
    sessionId: opts.sessionId,
    stream: true,
    history: opts.history
  };
  
  console.log("Chat API Stream Request:", {
    url: CHAT_API,
    body: requestBody
  });
  
  const res = await fetch(CHAT_API, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "text/event-stream"
    },
    body: JSON.stringify(requestBody)
  });

  console.log("Chat API Stream Response:", {
    status: res.status,
    statusText: res.statusText,
    contentType: res.headers.get("content-type"),
    headers: Object.fromEntries(res.headers.entries())
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Chat API Stream Error:", { status: res.status, text });
    throw new Error(`chat api ${res.status}: ${text || res.statusText}`);
  }

  if (res.headers.get("content-type")?.includes("text/event-stream")) {
    console.log("Processing streaming response...");
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";
      for (const p of parts) {
        const line = p.trim();
        if (line.startsWith("data:")) {
          const chunk = line.slice(5).trim();
          if (chunk === "[DONE]") {
            console.log("Stream completed with [DONE]");
            return;
          }
          console.log("Stream chunk:", chunk);
          yield chunk;
        }
      }
    }
    console.log("Stream completed naturally");
    return;
  }

  // fallback: non-streaming
  console.log("Falling back to non-streaming response");
  let payload: any;
  const ct = res.headers.get("content-type") || "";
  payload = ct.includes("application/json") ? await res.json() : await res.text();
  
  console.log("Fallback data:", payload);
  
  // IMPORTANT: API returns { response: string }
  const text = (
    typeof payload === "string"
      ? payload
      : payload.response ?? payload.reply ?? payload.message ?? payload.output ?? ""
  ).toString().trim();
  
  if (!text) {
    console.warn("Empty fallback payload:", payload);
    // Return a friendly fallback so you can see it worked
    yield "[no content returned]";
  } else {
    console.log("Fallback response:", text);
    yield text;
  }
}
