import { Suspense, lazy } from 'react';
import AWSChatBot from '@/components/AWSChatBot';
import Typewriter from '@/components/Typewriter';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load the feature grid
const FeatureGrid = lazy(() => import('@/components/FeatureGrid'));

export default function Home() {

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#9bbcf7' }}>
            Welcome back to JohnnyCloud
          </h1>
          <h2 className="text-hero jc-title-gradient">
            Your AWS Assistant
          </h2>
          <Typewriter
            className="text-subhead text-secondary mx-auto"
            text="Get optimization insights, security Guardrails with auto-remediation, and a clear business case for the cloud in one place."
          />
        </div>
      </div>

      {/* Meet Johnny-5 Section */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-section-title jc-title-gradient mb-4">Meet Johnny-5</h2>
          <p className="text-body text-secondary max-w-2xl mx-auto">
            Your intelligent AWS assistant. Ask questions about your cloud, get cost recommendations, 
            see compliance status, and trigger safe auto-remediations—all in one chat.
          </p>
        </div>

        {/* Two-column layout: Feature Grid + Chatbot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Feature Grid - Left Column */}
          <div className="flex flex-col">
            <Suspense fallback={<div className="h-64 bg-white/5 rounded-2xl border animate-pulse"></div>}>
              <FeatureGrid />
            </Suspense>
          </div>
          
          {/* Chatbot Card - Right Column */}
          <div className="flex flex-col">
            <div className="flex-1">
              <ErrorBoundary>
                <AWSChatBot />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}