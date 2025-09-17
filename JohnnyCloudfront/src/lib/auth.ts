// src/lib/auth.ts

// --- helpers ---
function base64Url(u8: Uint8Array) {
  return btoa(String.fromCharCode(...u8))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64Url(new Uint8Array(hash));
}

function randomVerifier(len = 64) {
  // 43–128 chars recommended; URL-safe
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  // map to URL-safe chars
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

// --- public API ---
export async function startLogin() {
  // always land on /login
  window.location.href = "/login";
}

export async function handleLogin() {
  const domain   = (import.meta.env.VITE_COGNITO_DOMAIN as string) || "us-east-1csm5oddde.auth.us-east-1.amazoncognito.com";
  const clientId = (import.meta.env.VITE_COGNITO_CLIENT_ID as string) || "4oc76981p9te4uegc85r0mnjg7";
  const scopes   = ((import.meta.env.VITE_SCOPES as string) || "openid email").split(/\s+/).join("+");
  const redirect = (import.meta.env.VITE_REDIRECT_URI as string) || "https://d1zhi8uis2cnfs.cloudfront.net/auth/callback";

  // --- PKCE ---
  const verifier = randomVerifier(64);
  const challenge = await sha256(verifier);
  sessionStorage.setItem("pkce_verifier", verifier); // needed during token exchange

  const url =
    `https://${domain}/login` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&response_type=code` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirect)}` +
    `&code_challenge=${encodeURIComponent(challenge)}` +
    `&code_challenge_method=S256`;

  window.location.href = url;
}

export function signOut() {
  const domain     = (import.meta.env.VITE_COGNITO_DOMAIN as string) || "us-east-1csm5oddde.auth.us-east-1.amazoncognito.com";
  const clientId   = (import.meta.env.VITE_COGNITO_CLIENT_ID as string) || "4oc76981p9te4uegc85r0mnjg7";
  const signoutUri = (import.meta.env.VITE_SIGNOUT_URI as string) || "https://d1zhi8uis2cnfs.cloudfront.net/";

  // clear local tokens
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");

  // Hosted UI logout endpoint requires full https://
  const logoutUrl =
    `https://${domain}/logout?client_id=${encodeURIComponent(clientId)}` +
    `&logout_uri=${encodeURIComponent(signoutUri)}`;

  window.location.href = logoutUrl;
}

export function getJwt() {
  return localStorage.getItem("id_token") || localStorage.getItem("access_token") || "";
}

export function isLoggedIn(): boolean {
  const token = getJwt();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() / 1000 < payload.exp;
  } catch {
    return false;
  }
}

export function getUserInfo(): { name?: string; email?: string; account?: string } {
  const token = getJwt();
  if (!token) return {};
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name || payload.given_name || payload.preferred_username,
      email: payload.email,
      account: payload['cognito:username'] || payload.sub
    };
  } catch {
    return {};
  }
}
