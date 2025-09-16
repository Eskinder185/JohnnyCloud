import React from 'react';
import { Card } from '../components/ui/Card'
import { Heading } from '../components/ui/Heading'
import { Button } from '../components/ui/Button'

type TeamMember = { name: string; email: string; role?: string };

export default function About() {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([]);
  
  React.useEffect(() => { 
    fetch("/team.json")
      .then(r => r.json())
      .then(setTeamMembers)
      .catch(() => setTeamMembers([])); 
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="space-y-6">
          <Heading className="text-4xl md:text-5xl">About JohnnyCloud</Heading>
          <p className="text-jc-dim text-lg leading-relaxed">
            Unified FinOps + SecOps insights for AWS. Transform your cloud operations with 
            intelligent monitoring, cost optimization, and security posture management.
          </p>
        </div>
        
        {/* About Hero Image */}
        <Card className="p-0 overflow-hidden">
          <img
            src="/about-hero.jpg"
            alt="About JohnnyCloud - AWS FinOps and SecOps Platform"
            className="w-full h-auto block rounded-lg"
            loading="eager"
          />
        </Card>
      </div>

      {/* How It Works Section */}
      <div className="mb-16">
        <Heading className="text-3xl md:text-4xl mb-4">How It Works</Heading>
        <p className="text-jc-dim text-lg mb-12 max-w-3xl">
          Getting started with JohnnyCloud is simple. Connect your AWS accounts, let our AI analyze 
          your infrastructure, and start taking action on insights.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-jc-cyan rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              01
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect AWS</h3>
            <p className="text-jc-dim">
              Securely connect your AWS accounts using cross-account roles with minimal permissions.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-jc-cyan rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              02
            </div>
            <h3 className="text-xl font-semibold mb-3">Analyze</h3>
            <p className="text-jc-dim">
              Our AI engine analyzes your infrastructure, costs, and security posture in real-time.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-jc-cyan rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              03
            </div>
            <h3 className="text-xl font-semibold mb-3">Act</h3>
            <p className="text-jc-dim">
              Get actionable insights, automated recommendations, and remediation options.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-jc-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <Heading className="text-3xl md:text-4xl">Privacy & Security</Heading>
        </div>
        <p className="text-jc-dim text-lg mb-8">Your data security is our top priority</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-4">Enterprise-Grade Security</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-jc-green/20 text-jc-green rounded-full text-sm font-medium">SOC2</span>
                <span className="text-jc-dim">Type II compliant infrastructure</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-jc-cyan/20 text-jc-cyan rounded-full text-sm font-medium">256-bit</span>
                <span className="text-jc-dim">End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-jc-pink/20 text-jc-pink rounded-full text-sm font-medium">GDPR</span>
                <span className="text-jc-dim">Compliant data handling</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Data Protection</h4>
            <ul className="space-y-2 text-jc-dim">
              <li>• Read-only access to your AWS accounts</li>
              <li>• No sensitive data stored or processed</li>
              <li>• Regular third-party security audits</li>
              <li>• 24/7 security monitoring</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ready to Get Started Section */}
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-jc-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-jc-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <Heading className="text-3xl md:text-4xl mb-4">Ready to Get Started?</Heading>
        <p className="text-jc-dim text-lg mb-8 max-w-2xl mx-auto">
          Join hundreds of companies already optimizing their AWS costs and security with JohnnyCloud.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Sales
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.12h2.52v2.522a2.528 2.528 0 0 1-2.52 2.523zm0-6.048H2.522A2.528 2.528 0 0 0 0 11.64a2.528 2.528 0 0 0 2.522 2.523h2.52v-2.523a2.528 2.528 0 0 0-2.52-2.523zm6.048 0H8.562v2.522a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523V9.117H.98a2.528 2.528 0 0 0-2.52 2.523 2.528 2.528 0 0 0 2.52 2.523h2.52v2.522a2.528 2.528 0 0 0 2.522 2.523 2.528 2.528 0 0 0 2.52-2.523v-2.522h2.52a2.528 2.528 0 0 0 2.52-2.523 2.528 2.528 0 0 0-2.52-2.523z"/>
            </svg>
            Join our Slack
          </Button>
        </div>
        <p className="text-jc-dim text-sm">
          Questions? Reach out to our team at <span className="text-jc-cyan">eskewabe185@gmail.com</span>
        </p>
      </Card>

      {/* Team Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-jc-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <Heading className="text-3xl md:text-4xl">Our Team</Heading>
        </div>
        <p className="text-jc-dim text-lg mb-8">Meet the people behind JohnnyCloud</p>
        
        <Card className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              className="flex items-center gap-2"
              onClick={() => window.open('mailto:eskewabe185@gmail.com?subject=JohnnyCloud Support Request', '_blank')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.open('mailto:eskewabe185@gmail.com?subject=JohnnyCloud Slack Invite Request', '_blank')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.12h2.52v2.522a2.528 2.528 0 0 1-2.52 2.523zm0-6.048H2.522A2.528 2.528 0 0 0 0 11.64a2.528 2.528 0 0 0 2.522 2.523h2.52v-2.523a2.528 2.528 0 0 0-2.52-2.523zm6.048 0H8.562v2.522a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523V9.117H.98a2.528 2.528 0 0 0-2.52 2.523 2.528 2.528 0 0 0 2.52 2.523h2.52v2.522a2.528 2.528 0 0 0 2.522 2.523 2.528 2.528 0 0 0 2.52-2.523v-2.522h2.52a2.528 2.528 0 0 0 2.52-2.523 2.528 2.528 0 0 0-2.52-2.523z"/>
              </svg>
              Join our Slack
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-jc-dim">
                <tr>
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">Email</th>
                  <th className="text-left py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(member => (
                  <tr key={member.email} className="border-t border-white/5">
                    <td className="py-2 pr-4">{member.name}</td>
                    <td className="py-2 pr-4">
                      <a className="underline decoration-dotted hover:text-jc-cyan transition-colors" href={`mailto:${member.email}`}>
                        {member.email}
                      </a>
                    </td>
                    <td className="py-2 text-jc-dim">{member.role || "Member"}</td>
                  </tr>
                ))}
                {teamMembers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-3 text-jc-dim">Loading team members...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
