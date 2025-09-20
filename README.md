JohnnyCloud

AI-powered FinOps and SecOps copilot for AWS.
JohnnyCloud helps you see cloud spend, spot risks, and fix them safely with one click. It can also explain changes in plain English and speak them aloud if enabled.

Highlights

Chat Copilot (Johnny-5): ask about cost, security, compliance, or migration. Optional voice replies.

Metrics Hub: trends for spend, anomalies, and security findings. CSV export.

Guardrails: CIS, NIST, and PCI checks with auto-remediation and a preview step.

Why AWS Planner: interactive migration timeline, business impact notes, scenario cards, and a savings slider.

Reports: compliance snapshots for auditors and executives.

Built for Safety: least-privilege access, opt-in changes, full audit trail.

Screenshots

Home: docs/screenshots/home.png

Metrics: docs/screenshots/metrics.png

Guardrails: docs/screenshots/guardrails.png

Why AWS: docs/screenshots/why-aws.png

(Add images to the path above or update these filenames.)

Key Pages

Home

Greeting with account or user name

Three mini summary cards for Spend MTD, Compliance percent, and Open Issues

Chat with optional voice and persistent history

Metrics

Line chart for spend with time range controls

Stacked bar chart for security findings by severity

Impact summaries on anomalies

Quarter-to-date savings tracker

Severity filters and Download CSV

Guardrails

Color-coded severity tags with text labels

Bulk auto-remediate with preview

30 and 90 day compliance trend

Quick win checklist with top three fixes

Why AWS

Interactive migration planner with live timeline updates

Business impact statements and assumptions

Customer-style scenarios

Savings slider for rightsizing and scheduling

Clickable benefits that link to deeper views

About

Profile cards with LinkedIn and GitHub links

Origin story

Mini roadmap

Security and data handling trust box

FAQ

Searchable answers

Short setup tips

Links to support

Architecture

Frontend: React single page app with route-aware backgrounds and accessibility features

APIs: Amazon API Gateway and AWS Lambda for chat, metrics, guardrails, and actions

Data

DynamoDB for actions and activity logs

Cost Explorer and CloudWatch for spend and anomalies

Security Hub and GuardDuty for findings

S3 for optional exports

Identity: Amazon Cognito with hosted UI and OAuth

Voice: Amazon Polly for spoken summaries

Auditability: every change is recorded with who, what, when, and result

(Adjust to match this repository if your stack differs.)

Security and Data Handling

Data stays in your AWS account

Cross-account role with least-privilege permissions

Auto-remediation is opt-in and always shows a preview

All actions are logged for audit with identifiers and timestamps

Getting Started

Enable AWS services

Cost Explorer

Security Hub recommended

Deploy backend

Provision API Gateway, Lambda, and DynamoDB

Connect to Cost Explorer, CloudWatch, Security Hub, and GuardDuty

Configure application

Set environment values for region, API endpoints, and Cognito

Set OAuth redirect and logout URIs to match your host

Build and host the frontend

Use S3 and CloudFront or your preferred host

Sign in and verify

Log in through Cognito

Open Metrics and Guardrails to confirm data

Run a remediation preview to test permissions and logging

Configuration

AWS region

Chat API URL

Metrics API or function URL if used

Cognito domain, client ID, redirect URI, sign out URI

Feature flags for voice, bulk remediation, and CSV export

(Document the exact variable names used in this repository.)

Roadmap

V1 Foundations: landing zone, metrics, basic chat

Guardrails and auto-remediation with preview

Voice assistant for spoken summaries

Optimization Hub for rightsizing and scheduling

Multi-account views and Slack or Jira flows

Azure and GCP adapters

(Mark items complete or planned as you progress.)

Contributing

Open an issue for bugs or feature requests

Keep pull requests small and focused with a short testing note

Include screenshots for user interface changes

Follow accessibility and security guidelines

Respect reduced motion settings

Do not introduce long-lived secrets

License

Add a license file such as MIT or Apache 2.0

Place the full text in LICENSE

Acknowledgements

AWS documentation and reference architectures

Early testers and reviewers

Community feedback

Contact

Project lead: add name, LinkedIn, and GitHub

Issues: open a GitHub issue in this repository

Checklists
Before a demo

Cost Explorer is enabled

Security Hub is enabled in at least one region

Cognito redirect and logout URIs match the deployed host

Metrics and Guardrails show data or helpful empty states

-------------------------------------------------------


Actions are stored in DynamoDB with timestamps and actor identifiers

