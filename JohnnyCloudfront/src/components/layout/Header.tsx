import { Link } from "react-router-dom";
import { getUserInfo, isLoggedIn, signOut } from "@/lib/auth";

export default function Header() {
  const userInfo = getUserInfo();
  const loggedIn = isLoggedIn();
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30 dark:supports-[backdrop-filter]:bg-black/30 light:supports-[backdrop-filter]:bg-white/30 border-b border-primary">
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
              {/* Voice Hint */}
              <div className="hidden md:block px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs text-blue-300">
                  Say "Johnny 5" to activate
                </span>
              </div>
          
          {loggedIn ? (
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded-xl bg-blue-500/20 text-blue-300 text-xs">
                Signed in as {userInfo.name || userInfo.email?.split('@')[0] || 'User'}
              </span>
              <button 
                onClick={handleSignOut}
                className="px-3 py-1 rounded-xl bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30 transition-colors"
              >
                Sign In
              </Link>
              <span className="px-2 py-1 rounded-xl bg-green-500/20 text-green-300 text-xs">
                Local Development
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
