// Roadmap milestones for JohnnyCloud development
export interface RoadmapMilestone {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
}

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: 'v1-foundations',
    title: 'V1 — Foundations',
    subtitle: 'Landing Zone, Metrics Dashboard',
    date: 'June 2025',
    status: 'completed'
  },
  {
    id: 'guardrails',
    title: 'Guardrails',
    subtitle: 'CIS/NIST controls + auto-remediation',
    date: 'July 2025',
    status: 'completed'
  },
  {
    id: 'voice-assistant',
    title: 'Voice Assistant',
    subtitle: 'Ask Johnny-5, get spoken insights',
    date: 'September 2025',
    status: 'current'
  },
  {
    id: 'next-phase',
    title: 'Next',
    subtitle: 'Optimization Hub, multi-account, Slack/Jira',
    date: 'October 2025',
    status: 'upcoming'
  }
];


