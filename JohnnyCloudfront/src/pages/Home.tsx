import React from 'react';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/Button';
import AWSChatBot from '@/components/AWSChatBot';

export default function Home() {
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
          <Button className="flex items-center gap-2">
            Get Started
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </Button>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-jc-cyan mb-2">$2.4M</div>
          <div className="text-jc-dim">Saved by customers</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-jc-green mb-2">99.9%</div>
          <div className="text-jc-dim">Uptime guarantee</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-jc-yellow mb-2">500+</div>
          <div className="text-jc-dim">Companies trust us</div>
        </Card>
      </div>
    </div>
  );
}