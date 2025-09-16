import { Outlet, useLocation } from "react-router-dom";
import { AnimatedBackground } from "@/components/ui/bg/AnimatedBackground";
import Header from "@/components/layout/Header";

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

      {/* Smart Header with conditional login */}
      <Header />

      <main className="relative mx-auto max-w-6xl px-4 py-8 md:py-10 lg:py-12">
        <Outlet />
      </main>
    </div>
  );
}