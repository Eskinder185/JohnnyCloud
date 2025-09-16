import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const qs = new URLSearchParams(window.location.search);
      const code = qs.get("code");
      const state = qs.get("state") || "/"; // default landing: Home

      // Must have the code and the PKCE verifier saved during handleLogin()
      const verifier = sessionStorage.getItem("pkce_verifier") || "";
      if (!code || !verifier) {
        nav("/login", { replace: true });
        return;
      }

      const domain   = (import.meta.env.VITE_COGNITO_DOMAIN as string) || "us-east-1csm5oddde.auth.us-east-1.amazoncognito.com";
      const clientId = (import.meta.env.VITE_COGNITO_CLIENT_ID as string) || "4oc76981p9te4uegc85r0mnjg7";
      const redirect = (import.meta.env.VITE_REDIRECT_URI as string) || "https://d1zhi8uis2cnfs.cloudfront.net/auth/callback";

      const tokenEndpoint = domain.startsWith("http")
        ? `${domain}/oauth2/token`
        : `https://${domain}/oauth2/token`;

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        code,
        code_verifier: verifier,
        redirect_uri: redirect,
      });

      try {
        const res = await fetch(tokenEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        if (!res.ok) {
          nav("/login", { replace: true });
          return;
        }

        const tokens = await res.json();
        if (tokens.id_token)     localStorage.setItem("id_token", tokens.id_token);
        if (tokens.access_token) localStorage.setItem("access_token", tokens.access_token);
        if (tokens.refresh_token) localStorage.setItem("refresh_token", tokens.refresh_token);

        sessionStorage.removeItem("pkce_verifier");
        nav(state, { replace: true }); // ✅ send to Home ("/") or wherever state points
      } catch {
        nav("/login", { replace: true });
      }
    })();
  }, [nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-jc-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-slate-300">Completing sign in...</p>
      </div>
    </div>
  );
}