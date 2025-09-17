import { Link, useLocation } from "react-router-dom";
import { isLoggedIn, signOut, startLogin } from "@/lib/auth";
import MotionSettings from "@/components/settings/MotionSettings";

export default function Header() {
  const authed = isLoggedIn();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/" className="font-bold text-lg">JohnnyCloud</Link>

        <nav className="ml-4 hidden md:flex items-center gap-3 text-sm">
          <Link to="/" className="jc-chip">Home</Link>
          <Link to="/metrics" className="jc-chip">Metrics</Link>
          <Link to="/guardrails" className="jc-chip">Guardrails</Link>
          <Link to="/why-aws" className="jc-chip">Why AWS</Link>
          <Link to="/about" className="jc-chip">About</Link>
          <Link to="/faq" className="jc-chip">FAQ</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <MotionSettings />
          {authed ? (
            <>
              <span className="px-2 py-1 rounded-xl bg-white/10 text-xs">Signed in</span>
              <button onClick={signOut} className="jc-btn-outline">Sign out</button>
            </>
          ) : (
            !authed && pathname !== "/login" && (
              <button onClick={startLogin} className="jc-chip">Login</button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
