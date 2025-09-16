import { ShieldCheck, LockKeyhole, Cloud, ArrowRight } from "lucide-react";
import { handleLogin } from "@/lib/auth";

export default function Login() {
  const onSignIn = () => {
    handleLogin();
  };

  return (
    <main className="relative min-h-[calc(100vh-64px)] text-slate-100">
      <div className="jc-bg" />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 md:pt-20">
        {/* Heading + blurb */}
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs tracking-wide text-cyan-300">
              Secure access
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Sign in to{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                JohnnyCloud
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-slate-300/90">
              Access your <span className="text-cyan-300">Cost</span> &amp;{" "}
              <span className="text-fuchsia-300">Security Anomaly</span> dashboards, AI chat (Bedrock),
              and voice integrations—powered by Amazon Cognito.
            </p>

            {/* Features */}
            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                OAuth2 Authorization Code + PKCE (no passwords stored in app)
              </li>
              <li className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-cyan-300" />
                CloudFront-compatible HTTPS domain
              </li>
              <li className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-cyan-300" />
                Least-cost, serverless frontend
              </li>
            </ul>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onSignIn}
                className="group inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 font-medium text-cyan-100 shadow-[0_0_25px_rgba(0,255,255,0.08)] backdrop-blur transition hover:bg-cyan-400/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]"
              >
                <img
                  src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/amazonaws.svg"
                  className="h-5 w-5 invert"
                  alt=""
                />
                Sign in with Cognito
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>

              <a
                href="/"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-slate-200 hover:bg-white/10"
              >
                Back to Home
              </a>
            </div>

            {/* Legal */}
            <p className="mt-4 text-xs text-slate-400">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-cyan-300 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-cyan-300 hover:underline">
                Privacy
              </a>
              .
            </p>
          </div>

          {/* Johnny-5 art card */}
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-500/40 via-transparent to-fuchsia-500/40 blur md:blur-lg" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
              {/* Replace src with your Johnny-5 image path */}
              <img
                src="/johnny5_login.png"
                className="h-[460px] w-full object-cover"
                alt="Johnny-5, ready to help"
                onError={(e) => {
                  // show tasteful placeholder if no image present
                  const el = e.currentTarget;
                  el.style.display = "none";
                  const box = document.getElementById("img-fallback");
                  if (box) box.style.display = "flex";
                }}
              />
              <div id="img-fallback" className="hidden h-[460px] w-full rounded-xl border border-white/10
                  bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_8px)] 
                  text-center items-center justify-center p-6">
                <div>
                  <div className="text-lg font-semibold mb-1">Add your Johnny-5 image</div>
                  <div className="text-sm text-slate-400">
                    Place a file at <code className="px-1 rounded bg-white/5">/public/johnny5_login.png</code>.
                    Use your own render or a licensed photo.
                  </div>
                </div>
              </div>
              <div className="jc-glow-line" />
              <div className="flex items-center justify-between px-5 py-4">
                <div className="text-sm text-slate-300">
                  <div className="font-semibold text-slate-100">Johnny-5</div>
                  <div className="text-slate-400/80">Your AWS FinOps + SecOps assistant</div>
                </div>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                  Online
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}