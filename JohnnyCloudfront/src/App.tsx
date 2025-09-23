import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import RootLayout from "@/layouts/RootLayout";
import { GlobalChatbotProvider, useGlobalChatbot } from "@/contexts/GlobalChatbotContext";
import WakeWordListener from "@/components/WakeWordListener";
import GlobalChatbotPanel from "@/components/GlobalChatbotPanel";
import Johnny5AssistantIcon from "@/components/Johnny5AssistantIcon";

// Lazy load pages for better performance
const Home = lazy(() => import("@/pages/Home"));
const Metrics = lazy(() => import("@/pages/Metrics"));
const Guardrails = lazy(() => import("@/pages/Guardrails"));
const About = lazy(() => import("@/pages/About"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const WhyAwsPage = lazy(() => import("@/pages/WhyAws"));
const Login = lazy(() => import("@/pages/Login"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const SecurityWhitePaper = lazy(() => import("@/pages/SecurityWhitePaper"));

// Component that connects wake word listener to global chatbot
function AppWithVoiceSystem() {
  const { openChatbot } = useGlobalChatbot();

  return (
    <>
      {/* Global Voice System */}
      <WakeWordListener 
        onWakeWordDetected={() => {
          console.log("🎯 Wake word detected - activating chatbot");
        }}
        onChatbotActivated={() => {
          console.log("🤖 Chatbot activated globally");
          openChatbot();
        }}
      />
      
      {/* Global Chatbot Panel */}
      <GlobalChatbotPanel />
    </>
  );
}

export default function App() {
  return (
    <GlobalChatbotProvider>
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
            <Route path="/security-whitepaper" element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
                <SecurityWhitePaper />
              </Suspense>
            } />
          </Route>
          
          {/* Auth routes - outside RootLayout to avoid header/navigation */}
          <Route path="/login" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <Login />
            </Suspense>
          } />
          <Route path="/auth/callback" element={
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>}>
              <AuthCallback />
            </Suspense>
          } />
          </Routes>
          
      {/* Global Voice System - Now inside BrowserRouter */}
      <AppWithVoiceSystem />
      
      {/* Johnny 5 Assistant Icon - Always visible */}
      <Johnny5AssistantIcon />
        </BrowserRouter>
      </div>
    </GlobalChatbotProvider>
  );
}
