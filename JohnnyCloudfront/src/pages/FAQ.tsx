import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Heading } from '../components/ui/Heading'
import { Button } from '../components/ui/Button'
import HoloRadar from '../components/animation/HoloRadar'

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    id: 'general',
    name: 'General',
    icon: '?',
    count: 4,
    items: [
      {
        question: 'What is JohnnyCloud?',
        answer: 'JohnnyCloud is a comprehensive AWS FinOps and SecOps platform that helps you monitor, optimize, and secure your cloud infrastructure with intelligent automation and real-time insights.'
      },
      {
        question: 'How does JohnnyCloud work?',
        answer: 'JohnnyCloud connects to your AWS accounts using secure cross-account roles, analyzes your infrastructure and costs in real-time, and provides actionable insights and automated recommendations.'
      },
      {
        question: 'What AWS services does JohnnyCloud support?',
        answer: 'JohnnyCloud supports all major AWS services including EC2, S3, RDS, Lambda, CloudFormation, and more. We continuously add support for new AWS services as they become available.'
      },
      {
        question: 'How long does it take to set up?',
        answer: 'Setup typically takes 5-10 minutes. You\'ll need to create cross-account roles in your AWS accounts and connect them to JohnnyCloud. Our setup wizard guides you through each step.'
      }
    ]
  },
  {
    id: 'costs',
    name: 'Costs',
    icon: '$',
    count: 4,
    items: [
      {
        question: 'How much can I save with JohnnyCloud?',
        answer: 'Our customers typically save 15-30% on their AWS costs within the first 3 months by identifying unused resources, optimizing instance types, and implementing cost-effective architectures.'
      },
      {
        question: 'How does cost anomaly detection work?',
        answer: 'Our AI engine analyzes your historical spending patterns and identifies unusual spikes or trends. You\'ll receive real-time alerts when costs deviate from normal patterns.'
      },
      {
        question: 'Can I set custom cost budgets and alerts?',
        answer: 'Yes! You can set monthly, quarterly, or annual budgets with custom alert thresholds. Get notified via email, Slack, or webhook when you approach or exceed your limits.'
      },
      {
        question: 'Does JohnnyCloud help with Reserved Instance planning?',
        answer: 'Absolutely! We analyze your usage patterns and recommend optimal Reserved Instance purchases, including instance types, terms, and payment options to maximize your savings.'
      }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    icon: '🛡️',
    count: 4,
    items: [
      {
        question: 'How does JohnnyCloud access my AWS accounts?',
        answer: 'JohnnyCloud uses secure cross-account IAM roles with minimal read-only permissions. We never store your AWS credentials and only access the data necessary for analysis.'
      },
      {
        question: 'What security compliance frameworks do you support?',
        answer: 'We support SOC 2 Type II, ISO 27001, GDPR, and HIPAA compliance requirements. Our infrastructure is regularly audited by third-party security firms.'
      },
      {
        question: 'How does GuardDuty integration work?',
        answer: 'JohnnyCloud integrates with AWS GuardDuty to correlate security findings with cost and infrastructure data, providing comprehensive security posture insights.'
      },
      {
        question: 'Is my data secure with JohnnyCloud?',
        answer: 'Yes! All data is encrypted in transit and at rest using AES-256 encryption. We use read-only access and never store sensitive information like passwords or API keys.'
      }
    ]
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    icon: '⚠️',
    count: 4,
    items: [
      {
        question: 'Why am I not seeing data for some of my AWS accounts?',
        answer: 'This usually means the cross-account role isn\'t properly configured or the account hasn\'t been connected yet. Check your IAM role permissions and ensure the account is added to JohnnyCloud.'
      },
      {
        question: 'How often is data updated?',
        answer: 'Cost and usage data is updated every 4-6 hours. Security findings and infrastructure changes are updated in real-time as they occur in your AWS accounts.'
      },
      {
        question: 'Why are some of my resources not showing up?',
        answer: 'Some resources might not appear if they\'re in regions we don\'t monitor, have very low costs, or are part of services we don\'t yet support. Contact support if you notice missing resources.'
      },
      {
        question: 'Can I export data from JohnnyCloud?',
        answer: 'Yes! You can export cost reports, security findings, and infrastructure data in CSV, JSON, or PDF formats. API access is also available for programmatic data retrieval.'
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredItems = faqData
    .find(cat => cat.id === activeCategory)
    ?.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <>
      {/* Security Radar Hero */}
      <div className="relative h-56 rounded-2xl overflow-hidden jc-card mb-8">
        <HoloRadar className="absolute inset-0" />
        <div className="relative p-6">
          <Heading className="text-3xl">Security FAQs</Heading>
          <p className="text-jc-dim">Scanning… live radar effect.</p>
        </div>
      </div>

      <header className="mb-8">
        <Heading className="text-4xl md:text-5xl">Frequently Asked Questions</Heading>
        <p className="text-jc-dim text-lg mt-4 max-w-3xl">
          Find answers to common questions about JohnnyCloud. Can't find what you're looking for? 
          Contact our support team.
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 focus-glow"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-jc-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {faqData.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              activeCategory === category.id
                ? 'bg-jc-cyan/20 border-jc-cyan text-jc-cyan'
                : 'bg-white/5 border-white/10 text-jc-dim hover:bg-white/10'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4 mb-12">
        {filteredItems.map((item, index) => {
          const itemId = `${activeCategory}-${index}`;
          const isExpanded = expandedItems.has(itemId);
          
          return (
            <Card key={itemId} className="p-0 overflow-hidden">
              <button
                onClick={() => toggleExpanded(itemId)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-lg">{item.question}</span>
                <svg 
                  className={`w-5 h-5 text-jc-dim transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-6 pb-6">
                  <p className="text-jc-dim leading-relaxed">{item.answer}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Still Need Help Section */}
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-jc-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-jc-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <Heading className="text-3xl md:text-4xl mb-4">Still Need Help?</Heading>
        <p className="text-jc-dim text-lg mb-8 max-w-2xl mx-auto">
          Our support team is here to help you get the most out of JohnnyCloud.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
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
            Join Our Slack
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-semibold text-jc-cyan mb-1">Email</div>
            <div className="text-jc-dim">eskewabe185@gmail.com</div>
          </div>
          <div>
            <div className="font-semibold text-jc-cyan mb-1">Response Time</div>
            <div className="text-jc-dim">Within 24 hours</div>
          </div>
          <div>
            <div className="font-semibold text-jc-cyan mb-1">Documentation</div>
            <div className="text-jc-dim">docs.johnnycloud.io</div>
          </div>
        </div>
      </Card>
    </>
  )
}
