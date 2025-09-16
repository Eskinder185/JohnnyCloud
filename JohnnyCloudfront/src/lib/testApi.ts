// Simple test function to debug API connection
export async function testChatApi() {
  const CHAT_API = (import.meta.env.VITE_CHAT_API || "").replace(/\/$/, "");
  
  console.log("Testing Chat API Connection...");
  console.log("API URL:", CHAT_API);
  
  if (!CHAT_API) {
    console.error("VITE_CHAT_API not set in environment variables");
    return;
  }
  
  try {
    const testMessage = "Hello, this is a test message";
    const requestBody = {
      message: testMessage,
      mode: "bedrock"
    };
    
    console.log("Sending test request:", requestBody);
    
    const response = await fetch(CHAT_API, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return;
    }
    
    // Handle multiple response formats and content types
    let payload: any;
    const ct = response.headers.get("content-type") || "";
    payload = ct.includes("application/json") ? await response.json() : await response.text();
    
    console.log("Response data:", payload);
    
    // IMPORTANT: API returns { response: string }
    const text = (
      typeof payload === "string"
        ? payload
        : payload.response ?? payload.reply ?? payload.message ?? payload.output ?? ""
    ).toString().trim();
    
    console.log("Extracted text:", text);
    
    if (!text) {
      console.warn("Empty response received from API");
    } else {
      console.log("✅ API test successful!");
    }
    
  } catch (error) {
    console.error("API test failed:", error);
  }
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testChatApi = testChatApi;
  
  // Add a simple direct API test
  (window as any).testDirectApi = async () => {
    const API_URL = import.meta.env.VITE_CHAT_API;
    console.log("Testing direct API call to:", API_URL);
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Hello test" })
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      const text = await response.text();
      console.log("Raw response text:", text);
      
      try {
        const json = JSON.parse(text);
        console.log("Parsed JSON:", json);
        console.log("JSON keys:", Object.keys(json));
      } catch (e) {
        console.log("Response is not JSON");
      }
      
    } catch (error) {
      console.error("Direct API test failed:", error);
    }
  };
}
