import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundManager from "@/components/background/BackgroundManager";

export default function AuthCallback() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      console.log("🔄 AuthCallback: Starting authentication process");
      const qs = new URLSearchParams(window.location.search);
      const code = qs.get("code");
      const state = qs.get("state") || "/"; // default landing: Home

      console.log("🔄 AuthCallback: Code received:", !!code);
      console.log("🔄 AuthCallback: State:", state);

      // Must have the code and the PKCE verifier saved during handleLogin()
      const verifier = sessionStorage.getItem("pkce_verifier") || "";
      console.log("🔄 AuthCallback: Verifier found:", !!verifier);
      
      if (!code || !verifier) {
        console.log("❌ AuthCallback: Missing code or verifier, redirecting to login");
        nav("/login", { replace: true });
        return;
      }

      const domain   = (import.meta.env.VITE_COGNITO_DOMAIN as string) || "us-east-1csm5oddde.auth.us-east-1.amazoncognito.com";
      const clientId = (import.meta.env.VITE_COGNITO_CLIENT_ID as string) || "4oc76981p9te4uegc85r0mnjg7";
      // Use localhost for local development, CloudFront for production
      const redirect = (import.meta.env.VITE_REDIRECT_URI as string) || 
        (window.location.hostname === 'localhost' 
          ? `${window.location.origin}/auth/callback`
          : "https://d1zhi8uis2cnfs.cloudfront.net/auth/callback");

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
        console.log("🔄 AuthCallback: Making token request to:", tokenEndpoint);
        const res = await fetch(tokenEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        
        console.log("🔄 AuthCallback: Token response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log("❌ AuthCallback: Token request failed:", errorText);
          nav("/login", { replace: true });
          return;
        }

        const tokens = await res.json();
        console.log("✅ AuthCallback: Tokens received successfully");
        
        if (tokens.id_token)     localStorage.setItem("id_token", tokens.id_token);
        if (tokens.access_token) localStorage.setItem("access_token", tokens.access_token);
        if (tokens.refresh_token) localStorage.setItem("refresh_token", tokens.refresh_token);

        sessionStorage.removeItem("pkce_verifier");
        console.log("✅ AuthCallback: Redirecting to:", state);
        nav(state, { replace: true }); // ✅ send to Home ("/") or wherever state points
      } catch (error) {
        console.log("❌ AuthCallback: Token request error:", error);
        nav("/login", { replace: true });
      }
    })();
  }, [nav]);

  return (
    <div className="min-h-dvh relative">
      {/* Background System */}
      <BackgroundManager />
      
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Completing sign in...</p>
        </div>
      </div>
    </div>
  );
}