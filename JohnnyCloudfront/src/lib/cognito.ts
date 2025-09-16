// Minimal Hosted UI + PKCE helpers for Cognito (SPA)
const domain = import.meta.env.VITE_COGNITO_DOMAIN!;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID!;
const redirectUri = import.meta.env.VITE_REDIRECT_URI!;
const signoutUri = import.meta.env.VITE_SIGNOUT_URI!;
const scopes = ["openid","email","profile"].join(" ");

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function pkceChallenge(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return b64url(digest);
}

export async function login() {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const verifier = b64url(randomBytes.buffer);
  sessionStorage.setItem("PKCE_VERIFIER", verifier);
  const challenge = await pkceChallenge(verifier);

  const url = new URL(`${domain}/oauth2/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scopes);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", challenge);

  window.location.href = url.toString();
}

export function logout() {
  const url = new URL(`${domain}/logout`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("logout_uri", signoutUri);
  window.location.href = url.toString();
}

export function isAuthed() { return !!sessionStorage.getItem("ID_TOKEN"); }
