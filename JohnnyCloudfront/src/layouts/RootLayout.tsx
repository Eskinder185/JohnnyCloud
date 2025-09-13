import { Outlet, useLocation, Link } from "react-router-dom";
import { AnimatedBackground } from "@/components/ui/bg/AnimatedBackground";

export default function RootLayout() {
  const { pathname } = useLocation();
  const variant =
    pathname.startsWith("/faq") ? "secops" :
    pathname === "/metrics" ? "finops" : "robot";

  return (
    <div className="min-h-dvh relative">
      {/* Global animated background that changes based on route */}
      <AnimatedBackground variant={variant} />
      <div className="body-bg" />
      <div className="stars" />

      {/* Top nav */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/20 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-bold tracking-tight text-white">🪐 JohnnyCloud</Link>
          <div className="ml-auto flex gap-3 text-sm">
            <Link to="/" className="jc-chip">Home</Link>
            <Link to="/metrics" className="jc-chip">Metrics</Link>
            <Link to="/about" className="jc-chip">About</Link>
            <Link to="/faq" className="jc-chip">FAQ</Link>
            <Link to="/login" className="jc-chip">Login</Link>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-6xl px-4 py-8 md:py-10 lg:py-12">
        <Outlet />
      </main>
    </div>
  );
}