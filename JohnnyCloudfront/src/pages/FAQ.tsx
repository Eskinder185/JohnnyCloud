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

// FAQ content (categorised). If your component expects a different shape,
// adapt keys: id, category, q, a, tags are all safe to keep.

const FAQS = [
  /* =======================
     General
  ========================*/
  {
    id: "what-is-johnnycloud",
    category: "General",
    q: "What is JohnnyCloud?",
    a: `JohnnyCloud is an AI-powered FinOps + SecOps companion for AWS. It
analyzes your accounts for savings opportunities, surfaces compliance Guardrails
(CIS/NIST/PCI), and can trigger safe auto-remediation for common risks like
S3 public access. You can also ask the assistant (with optional voice replies)
for summaries, next steps, or a Why AWS business case.`,
    tags: ["overview", "finops", "secops", "guardrails"],
  },
  {
    id: "how-it-works",
    category: "General",
    q: "How does JohnnyCloud work?",
    a: `You connect your AWS account via least-privilege roles. We read metrics
(Cost Explorer/CloudWatch) and posture signals (Security Hub/GuardDuty) to
compute savings and compliance scores. From the Guardrails page you can run
prebuilt SSM Automation runbooks (e.g., block S3 public access) and download
evidence for audits.`,
    tags: ["onboarding", "permissions"],
  },
  {
    id: "why-aws",
    category: "General",
    q: "What is the \"Why AWS\" page?",
    a: `It's a value dashboard. We combine cost savings estimates, security score,
reliability readiness (backups/Multi-AZ/RTO/RPO) and efficiency (managed &
serverless adoption) so you can explain the business case clearly. See the value dashboard on the Why AWS page.`,
    tags: ["value", "roi", "modernization"],
  },
  {
    id: "voice",
    category: "General",
    q: "Can the assistant speak responses?",
    a: `Yes. Toggle "Speak reply" above the chat and pick a voice. The app uses
Amazon Polly to synthesize answers. No microphone is required unless you enable
voice input (optional Transcribe integration).`,
    tags: ["voice", "polly"],
  },
  {
    id: "setup-time",
    category: "General",
    q: "How long does it take to set up?",
    a: `Most teams see the dashboard within 10–20 minutes after connecting an
account. Guardrails and auto-remediation can be enabled progressively.`,
    tags: ["onboarding", "time"],
  },

  /* =======================
     Costs
  ========================*/
  {
    id: "cost-sources",
    category: "Costs",
    q: "Where do savings estimates come from?",
    a: `From a combination of Cost Explorer data and best-practice checks:
rightsizing, idle resources, scheduling, and Savings Plans/CUDOs coverage. The
total shown is a directional estimate until you apply changes.`,
    tags: ["estimates", "rightsizing", "scheduling"],
  },
  {
    id: "real-time",
    category: "Costs",
    q: "Is the metrics data real-time?",
    a: `AWS cost data is near-real-time and can lag a few hours depending on the
service. We show the latest available window and date-stamp the snapshot.`,
    tags: ["freshness", "lag"],
  },

  /* =======================
     Security
  ========================*/
  {
    id: "frameworks",
    category: "Security",
    q: "Which compliance frameworks are supported?",
    a: `CIS AWS Foundations Benchmark by default, plus NIST and PCI where
enabled in Security Hub. You can switch frameworks from the Guardrails page.`,
    tags: ["cis", "nist", "pci", "security hub"],
  },
  {
    id: "guardrails",
    category: "Security",
    q: "What are Guardrails?",
    a: `Guardrails are continuous checks mapped to standards (e.g., CIS-1.1 "S3
Block Public Access"). The page shows PASS/FAIL/WARN by control with affected
resources. You can click Remediate to run an SSM Automation (e.g., block public
ACL/policy) and view/download evidence. Open Guardrails to see them in action.`,
    tags: ["controls", "remediation", "evidence"],
  },
  {
    id: "remediation-safety",
    category: "Security",
    q: "Is auto-remediation safe?",
    a: `Yes—remediation is explicit and scoped. Each runbook shows what it does,
supports dry-run where possible, and executes via a role you control. Evidence
(records and execution IDs) is saved for audit trails.`,
    tags: ["ssm", "least-privilege", "audit"],
  },
  {
    id: "data-security",
    category: "Security",
    q: "What data do you store?",
    a: `By default, we read from your account and return results to the UI. We do
not store sensitive data outside your account. Remediation evidence and chat
threads can be saved in your own DynamoDB tables if you enable that option.`,
    tags: ["privacy", "storage"],
  },

  /* =======================
     Troubleshooting
  ========================*/
  {
    id: "faq-404-guardrails",
    category: "Troubleshooting",
    q: "I get 404 for /guardrails/summary.",
    a: `Add an API Gateway route: ANY /guardrails/{proxy+} → your guardrails
Lambda. Deploy the stage. If you prefer explicit routes, add:
GET /guardrails/summary, POST /guardrails/remediate, GET /guardrails/evidence.`,
    tags: ["api-gateway", "routes"],
  },
  {
    id: "faq-cors",
    category: "Troubleshooting",
    q: "The browser shows a CORS error.",
    a: `Return CORS headers from Lambda (and/or enable CORS on the API):
access-control-allow-origin: your CloudFront URL,
access-control-allow-headers: content-type,authorization,
access-control-allow-methods: GET,POST,OPTIONS. Also handle OPTIONS with 204.`,
    tags: ["cors", "options"],
  },
  {
    id: "faq-500-chat",
    category: "Troubleshooting",
    q: "Ask JohnnyCloud fails with 500.",
    a: `Check CloudWatch logs for your /chat Lambda. Common causes:
1) bedrock:InvokeModel not allowed or wrong model ID (use claude-3-5-sonnet or haiku),
2) polly:SynthesizeSpeech missing (if Speak reply is on),
3) DynamoDB table missing/denied for chat threads,
4) Malformed JSON body—add a safe body parser.`,
    tags: ["bedrock", "polly", "dynamodb"],
  },
  {
    id: "faq-env",
    category: "Troubleshooting",
    q: "Which frontend environment variables are required?",
    a: `Minimum: VITE_CHAT_API, VITE_GUARDRAILS_API, VITE_METRICS_API (or an
optimize endpoint). Optional: VITE_WHY_AWS_IMAGE (hero), VITE_ABOUT_HERO_IMAGE.
Always restart Vite after editing .env.`,
    tags: ["env", "vite"],
  },
  {
    id: "faq-permissions",
    category: "Troubleshooting",
    q: "What AWS permissions are needed?",
    a: `Read paths: Cost Explorer (ce:Get*), Security Hub (GetFindings), GuardDuty
(List/GetFindings). Remediation: ssm:StartAutomationExecution plus the actions
inside each runbook (e.g., s3:PutPublicAccessBlock). Chat: bedrock:InvokeModel;
voice: polly:SynthesizeSpeech; evidence: dynamodb:PutItem/Query on your tables.`,
    tags: ["iam", "roles"],
  },
];

// Convert to the existing format with enhanced answers
const faqData: FAQCategory[] = [
  {
    id: 'general',
    name: 'General',
    icon: '?',
    count: FAQS.filter(f => f.category === 'General').length,
    items: FAQS.filter(f => f.category === 'General').map(f => ({
      question: f.q,
      answer: f.id === 'why-aws' 
        ? `It's a value dashboard. We combine cost savings estimates, security score, reliability readiness (backups/Multi-AZ/RTO/RPO) and efficiency (managed & serverless adoption) so you can explain the business case clearly. See the value dashboard on the Why AWS page.`
        : f.a
    }))
  },
  {
    id: 'costs',
    name: 'Costs',
    icon: '$',
    count: FAQS.filter(f => f.category === 'Costs').length,
    items: FAQS.filter(f => f.category === 'Costs').map(f => ({
      question: f.q,
      answer: f.a
    }))
  },
  {
    id: 'security',
    name: 'Security',
    icon: '🛡️',
    count: FAQS.filter(f => f.category === 'Security').length,
    items: FAQS.filter(f => f.category === 'Security').map(f => ({
      question: f.q,
      answer: f.id === 'guardrails'
        ? `Guardrails are continuous checks mapped to standards (e.g., CIS-1.1 "S3 Block Public Access"). The page shows PASS/FAIL/WARN by control with affected resources. You can click Remediate to run an SSM Automation (e.g., block public ACL/policy) and view/download evidence. Open Guardrails to see them in action.`
        : f.a
    }))
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    icon: '⚠️',
    count: FAQS.filter(f => f.category === 'Troubleshooting').length,
    items: FAQS.filter(f => f.category === 'Troubleshooting').map(f => ({
      question: f.q,
      answer: f.a
    }))
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
    ?.items.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      const faqItem = FAQS.find(f => f.q === item.question);
      return (
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower) ||
        (faqItem && faqItem.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }) || [];

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
          Find answers about cost insights, Guardrails, auto-remediation, voice replies, and setup.
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search FAQs…"
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
                  <p className="text-jc-dim leading-relaxed">
                    {item.answer.split(' ').map((word, index) => {
                      if (word === 'Why' && item.answer.split(' ')[index + 1] === 'AWS') {
                        return (
                          <span key={index}>
                            <a href="/why-aws" className="underline hover:text-jc-cyan transition-colors">Why AWS</a>{' '}
                          </span>
                        );
                      }
                      if (word === 'Guardrails' && item.answer.split(' ')[index - 1] === 'Open') {
                        return (
                          <span key={index}>
                            <a href="/guardrails" className="underline hover:text-jc-cyan transition-colors">Guardrails</a>{' '}
                          </span>
                        );
                      }
                      return word + ' ';
                    })}
                  </p>
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
