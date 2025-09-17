import { Outlet } from "react-router-dom";
import Header from "@/components/layout/Header";
import BackgroundManager from "@/components/background/BackgroundManager";

export default function RootLayout() {
  return (
    <div className="min-h-dvh relative">
      {/* Background System */}
      <BackgroundManager />

      {/* Smart Header with conditional login */}
      <Header />

      <main className="relative mx-auto max-w-6xl px-4 py-8 md:py-10 lg:py-12">
        <Outlet />
      </main>
    </div>
  );
}