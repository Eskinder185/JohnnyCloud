import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';
import AWSChatBot from '@/components/AWSChatBot';
import { isLoggedIn } from '@/lib/auth';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated, redirect to login page
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <Heading className="text-4xl md:text-6xl">Welcome to JohnnyCloud</Heading>
        <p className="text-jc-dim text-xl max-w-3xl mx-auto">
          Your AI-powered AWS FinOps and SecOps companion. Get intelligent insights, 
          cost optimization, and security monitoring all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/metrics">
            <Button className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Metrics
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      {/* Chatbot Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <Heading className="text-3xl md:text-4xl">Meet Johnny-5</Heading>
          <p className="text-jc-dim text-lg leading-relaxed">
            Your intelligent AWS assistant is here to help. Ask questions about your cloud infrastructure, 
            get cost optimization recommendations, or learn about security best practices.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-jc-green rounded-full"></div>
              <span className="text-sm">Real-time AWS data analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-jc-cyan rounded-full"></div>
              <span className="text-sm">Cost optimization recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-jc-yellow rounded-full"></div>
              <span className="text-sm">Security posture insights</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-jc-pink rounded-full"></div>
              <span className="text-sm">24/7 monitoring and alerts</span>
            </div>
          </div>
        </div>

        {/* Chatbot Card */}
        <AWSChatBot />
      </div>

    </div>
  );
}