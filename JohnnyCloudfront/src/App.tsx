import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import RootLayout from "@/layouts/RootLayout";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/Home"));
const Metrics = lazy(() => import("@/pages/Metrics"));
const Guardrails = lazy(() => import("@/pages/Guardrails"));
const About = lazy(() => import("@/pages/About"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const WhyAwsPage = lazy(() => import("@/pages/WhyAws"));

export default function App() {
  return (
    <div className="app-shell">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <Home />
            </Suspense>
          } />
          <Route path="/metrics" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <Metrics />
            </Suspense>
          } />
          <Route path="/guardrails" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <Guardrails />
            </Suspense>
          } />
          <Route path="/why-aws" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <WhyAwsPage />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <About />
            </Suspense>
          } />
          <Route path="/faq" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <FAQ />
            </Suspense>
          } />
        </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
