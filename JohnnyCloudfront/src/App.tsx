import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import Metrics from "@/pages/Metrics";
import Guardrails from "@/pages/Guardrails";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import WhyAwsPage from "@/pages/WhyAws";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/guardrails" element={<Guardrails />} />
          <Route path="/why-aws" element={<WhyAwsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
