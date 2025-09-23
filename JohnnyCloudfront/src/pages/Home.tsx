import { Suspense, lazy, useState, useEffect } from 'react';
import AWSChatBot from '@/components/AWSChatBot';
import ErrorBoundary from '@/components/ErrorBoundary';
import HeroIntro from '@/components/HeroIntro';
import { getUserInfo, isLoggedIn } from '@/lib/auth';
import { getIdToken } from '@/lib/auth/getIdToken';
import { getDisplayName } from '@/lib/auth/getDisplayName';
import { decodeJwt } from '@/lib/auth/decodeJwt';
import EmailFab from '@/components/EmailFab';
// import { useGlobalChatbot } from '@/contexts/GlobalChatbotContext'; // Removed since we removed the voice assistant button

// Lazy load the feature grid
const FeatureGrid = lazy(() => import('@/components/FeatureGrid'));

export default function Home() {
  const userInfo = getUserInfo();
  const loggedIn = isLoggedIn();
  const [displayName, setDisplayName] = useState<string>("Explorer");
  // const { openChatbot } = useGlobalChatbot(); // Removed since we removed the voice assistant button
  
  // Get display name from ID token when user is logged in
  useEffect(() => {
    const fetchDisplayName = async () => {
      if (loggedIn) {
        try {
          const idToken = await getIdToken();
          if (idToken) {
            const claims = decodeJwt(idToken);
            const name = getDisplayName(claims);
            setDisplayName(name);
            
            // Debug logging to help verify token claims
            console.log('🔍 ID Token Debug Info:');
            console.log('  - Display Name:', name);
            console.log('  - Token (first 50 chars):', idToken.substring(0, 50) + '...');
          } else {
            // Fallback to existing logic if no token
            const fallbackName = userInfo.name || userInfo.email?.split('@')[0] || 'User';
            setDisplayName(fallbackName);
          }
        } catch (error) {
          console.error('Failed to get display name from token:', error);
          // Fallback to existing logic
          const fallbackName = userInfo.name || userInfo.email?.split('@')[0] || 'User';
          setDisplayName(fallbackName);
        }
      } else {
        setDisplayName("Explorer");
      }
    };

    fetchDisplayName();
  }, [loggedIn, userInfo]);

  return (
    <div className="space-y-8">
      {/* Hero Section - New Animated HeroIntro */}
      <HeroIntro username={displayName} className="mt-6" />

      {/* Welcome Message with Decoded Name */}
      {loggedIn && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Welcome, {displayName}</span>
          </div>
        </div>
      )}

      {/* Spacer between introduction and content */}
      <div className="h-16"></div>

      {/* Main Content Section */}
      <div className="space-y-12">

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

      {/* Email Summary FAB */}
      <EmailFab getIdToken={getIdToken} />
    </div>
  );
}