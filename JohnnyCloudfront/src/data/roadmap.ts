// Roadmap milestones for JohnnyCloud development
export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: 'v1-foundations',
    title: 'V1 — Foundations',
    description: 'Landing Zone, Metrics Dashboard',
    status: 'completed',
    date: 'Q4 2023'
  },
  {
    id: 'guardrails',
    title: 'Guardrails',
    description: 'CIS/NIST controls + auto-remediation',
    status: 'completed',
    date: 'Q1 2024'
  },
  {
    id: 'voice-assistant',
    title: 'Voice Assistant',
    description: 'Ask Johnny-5, get spoken insights',
    status: 'current',
    date: 'Q2 2024'
  },
  {
    id: 'next-phase',
    title: 'Next',
    description: 'Optimization Hub, multi-account, Slack/Jira',
    status: 'upcoming',
    date: 'Q3 2024'
  }
];
