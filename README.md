# JohnnyCloud • FinOps + SecOps Dashboard (AWS)

![Built with](https://img.shields.io/badge/Built%20with-React%20%2B%20Vite-blue)
![Auth](https://img.shields.io/badge/Auth-Cognito-1f6feb)
![AI](https://img.shields.io/badge/AI-Bedrock%20%2B%20Polly-8a2be2)
![Security](https://img.shields.io/badge/Security-GuardDuty%20%7C%20SecurityHub-success)
![Cost](https://img.shields.io/badge/Cost-Cost%20Explorer-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A lightweight **FinOps + SecOps** web app: view **GuardDuty/Security Hub** findings, **cost trends/anomalies**, and talk to an **AI helper** (Bedrock). Optional **voice** via Polly.  
Built to demo **least privilege**, clean UI, and fast setup.

> 🔎 **What it shows:** AWS best practices (read-only IAM), dashboard UX, serverless APIs, and AI-assisted summaries.

---

## ✨ Features

- **Security panel:** GuardDuty & Security Hub findings (severity filters, status chips, quick links).
- **Cost panel:** Cost Explorer trends, service breakdowns, anomaly highlights.
- **AI helper:** Bedrock-powered Q&A (“why is cost up?”, “summarize high severity findings”).
- **Voice (optional):** Polly reads an executive summary aloud.
- **Auth:** Cognito Hosted UI; user login gates all calls.
- **Deploy anywhere:** S3 + CloudFront (static), Lambda/API Gateway (serverless API).

---

## 🧩 High-Level Architecture

React (Vite SPA) ──> CloudFront ──> S3 (static site)
│
├── Cognito Hosted UI (User Pool + Identity Pool)
│ │
│ └─> Federated credentials (IAM roles w/ least-priv)
│
└── API Gateway ──> Lambda (Node/TS)
│
├─> Cost Explorer (read-only)
├─> GuardDuty / SecurityHub (read-only)
├─> CloudWatch (logs)
└─> Bedrock (chat) + Polly (voice, optional)

yaml
Copy code

---

## 🚀 Quick Start

### Prereqs
- Node 20+, AWS CLI configured, an AWS account with admin for **deployment** (app roles stay least-priv).
- (Optional) `jq` for nice CLI output.

### 1) Clone & run locally (mock mode)
```bash
git clone https://github.com/YOUR_USER/JohnnyCloud.git
cd JohnnyCloud
npm install
cp .env.example .env.local
# set VITE_MOCK=1 to use local JSON mocks (no AWS needed)
npm run dev
2) Deploy backend (serverless API)
If your repo has infra/ with CDK/SAM, run that. Example with SAM:

bash
Copy code
cd infra
sam build
sam deploy --guided
# note the outputs: ApiBaseUrl, UserPoolId, UserPoolClientId, IdentityPoolId, Region
3) Configure env for the frontend
Create .env (Vite style):

ini
Copy code
VITE_AWS_REGION=us-east-1
VITE_API_BASE_URL=https://XXXX.execute-api.us-east-1.amazonaws.com/prod
VITE_USER_POOL_ID=us-east-1_XXXX
VITE_USER_POOL_CLIENT_ID=YYYYYYYY
VITE_IDENTITY_POOL_ID=us-east-1:zzzz-zzzz
VITE_BEDROCK_REGION=us-east-1
VITE_ENABLE_POLLY=true
VITE_POLLY_VOICE_ID=Joanna
VITE_MOCK=0
4) Build & host (S3 + CloudFront)
bash
Copy code
npm run build
aws s3 sync dist/ s3://YOUR_BUCKET --delete
# (Optional) invalidate CloudFront
aws cloudfront create-invalidation --distribution-id DIST_ID --paths "/*"
🔐 Least-Privilege IAM (read-only)
Attach to the authenticated role used by your Identity Pool (tweak regions/resources as needed):

json
Copy code
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["ce:Get*", "ce:List*"], "Resource": "*" },
    { "Effect": "Allow", "Action": ["guardduty:Get*", "guardduty:List*"], "Resource": "*" },
    { "Effect": "Allow", "Action": ["securityhub:Get*", "securityhub:List*"], "Resource": "*" },
    { "Effect": "Allow", "Action": ["bedrock:InvokeModel", "bedrock:InvokeModelWithResponseStream"], "Resource": "*" },
    { "Effect": "Allow", "Action": ["polly:SynthesizeSpeech"], "Resource": "*" },
    { "Effect": "Allow", "Action": ["cloudwatch:Get*", "cloudwatch:List*"], "Resource": "*" }
  ]
}
Tip: if you proxy all AWS calls through Lambda, grant these to the Lambda role instead, and keep the client scoped to execute-api:Invoke only.

🛠️ Scripts
json
Copy code
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier -w .",
    "mock": "VITE_MOCK=1 vite"
  }
}
🗺️ API (examples)
Method	Path	Description
GET	/cost/summary	MTD/YTD spend + top services
GET	/cost/anomalies	recent anomalies (amount, services)
GET	/security/findings	merged GuardDuty + SecurityHub findings
POST	/ai/chat	Bedrock prompt → JSON summary
GET	/health	service health

curl

bash
Copy code
curl -sS "$API/cost/summary" | jq .
curl -sS "$API/security/findings?severity=HIGH" | jq .
curl -sS -X POST "$API/ai/chat" -H "content-type: application/json" \
  -d '{"q":"why did cost spike this week? keep it brief."}' | jq .
🧠 AI & Voice
Bedrock model is chosen server-side; you can map “fast/cheap/accurate” to different model IDs.

Polly voice is configurable (VITE_POLLY_VOICE_ID). The app builds a short summary and plays it.

🧪 Testing
UI: Vitest + React Testing Library (snapshot + behavior).

API: Jest (unit) + integ tests via aws-sdk-client-mock.

Lint/format gate on PRs.

bash
Copy code
npm run test
npm run lint
npm run format
📸 Screenshots / Demo
Put images/GIFs in docs/ and embed:

scss
Copy code
![Dashboard](docs/dashboard.png)
![Findings](docs/findings.png)
![Cost](docs/cost.png)
🔒 Privacy
Hosted in your AWS account.

End-user auth via Cognito; app uses read-only calls.

No third-party analytics by default.

🗺️ Roadmap
 Org-wide mode (multiple accounts via AWS Organizations)

 Saved views & weekly email/PDF summaries

 Auto-remediation suggestions + runbooks links (SSM)

 KPI widgets (S3 public buckets, IAM key age, EBS idle)

 Cost budgets & alerts wiring UI

 Dark/light theme polish + keyboard shortcuts

❓ FAQ
Q: Do I need Bedrock or Polly to use it?
A: No. Core security & cost views work without AI/voice.

Q: Can I run it 100% locally?
A: Yes—use VITE_MOCK=1 to develop without AWS.

Q: What permissions does the browser get?
A: If you call AWS directly, it uses the Cognito auth role above (read-only). If you route through Lambda, the browser only calls your API.

📄 License
MIT © YOUR_NAME

pgsql
Copy code

want me to tailor the IAM policy to **only** the regions/services you actually use, or add a ready-to-paste **SAM/CloudFormation** template for the `/cost`, `/security`, and `/ai` endpoints? I can drop those in next.

**summary for dummies:** paste the markdown above into `README.md`. run locally with `VITE_MOCK=1` (no AWS). to de
