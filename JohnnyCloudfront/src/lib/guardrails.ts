// src/lib/guardrails.ts
export type Framework = "CIS" | "NIST" | "PCI";
export type ControlStatus = "PASS" | "FAIL" | "WARN" | "UNKNOWN";

export interface GuardrailsSummary {
  framework: Framework;
  score: number; // 0-100
  totals: { pass: number; fail: number; warn: number };
  controls: Array<{
    id: string;            // e.g., "CIS-1.1"
    title: string;
    status: ControlStatus;
    pass: number;
    fail: number;
    warn: number;
    resources: Array<{
      arn: string;
      service: string;     // e.g., "s3", "ec2"
      region: string;
      findingId?: string;  // Security Hub finding id
      note?: string;
    }>;
  }>;
}

export interface RemediationResponse {
  actionId: string;
  status: string;
  message: string;
}

export interface EvidenceResponse {
  controlId: string;
  generatedAt: string;
  items: any[];
}

const API_BASE = import.meta.env.VITE_API_BASE;
const API = import.meta.env.VITE_GUARDRAILS_API || `${API_BASE}/guardrails`;

const mock: GuardrailsSummary = {
  framework: "CIS",
  score: 74,
  totals: { pass: 18, fail: 6, warn: 3 },
  controls: [
    { 
      id: "CIS-1.1", 
      title: "S3 Block Public Access", 
      status: "FAIL", 
      pass: 0, 
      fail: 3, 
      warn: 0,
      resources: [
        { 
          arn: "arn:aws:s3:::demo-bucket", 
          service: "s3", 
          region: "us-east-1", 
          note: "Public ACL",
          findingId: "arn:aws:securityhub:us-east-1:123456789012:finding/12345678-1234-1234-1234-123456789012"
        },
        { 
          arn: "arn:aws:s3:::public-data-bucket", 
          service: "s3", 
          region: "us-west-2", 
          note: "Public read policy",
          findingId: "arn:aws:securityhub:us-west-2:123456789012:finding/87654321-4321-4321-4321-210987654321"
        },
        { 
          arn: "arn:aws:s3:::test-bucket", 
          service: "s3", 
          region: "eu-west-1", 
          note: "Bucket policy allows public access"
        }
      ]
    },
    { 
      id: "CIS-1.2", 
      title: "CloudTrail enabled", 
      status: "PASS", 
      pass: 1, 
      fail: 0, 
      warn: 0, 
      resources: [
        { 
          arn: "arn:aws:cloudtrail:us-east-1:123456789012:trail/main-trail", 
          service: "cloudtrail", 
          region: "us-east-1"
        }
      ]
    },
    { 
      id: "CIS-2.1", 
      title: "IAM Root User Access Keys", 
      status: "WARN", 
      pass: 0, 
      fail: 0, 
      warn: 1, 
      resources: [
        { 
          arn: "arn:aws:iam::123456789012:root", 
          service: "iam", 
          region: "global", 
          note: "Root access key exists but not recently used"
        }
      ]
    },
    { 
      id: "CIS-2.2", 
      title: "MFA Enabled for Root User", 
      status: "PASS", 
      pass: 1, 
      fail: 0, 
      warn: 0, 
      resources: []
    },
    { 
      id: "CIS-3.1", 
      title: "CloudTrail Log File Validation", 
      status: "FAIL", 
      pass: 0, 
      fail: 1, 
      warn: 0, 
      resources: [
        { 
          arn: "arn:aws:cloudtrail:us-east-1:123456789012:trail/main-trail", 
          service: "cloudtrail", 
          region: "us-east-1", 
          note: "Log file validation disabled"
        }
      ]
    },
    { 
      id: "CIS-3.2", 
      title: "CloudTrail Multi-Region", 
      status: "PASS", 
      pass: 1, 
      fail: 0, 
      warn: 0, 
      resources: []
    },
    { 
      id: "CIS-4.1", 
      title: "Security Groups - SSH Access", 
      status: "FAIL", 
      pass: 0, 
      fail: 2, 
      warn: 1, 
      resources: [
        { 
          arn: "arn:aws:ec2:us-east-1:123456789012:security-group/sg-12345678", 
          service: "ec2", 
          region: "us-east-1", 
          note: "SSH open to 0.0.0.0/0"
        },
        { 
          arn: "arn:aws:ec2:us-west-2:123456789012:security-group/sg-87654321", 
          service: "ec2", 
          region: "us-west-2", 
          note: "SSH open to 0.0.0.0/0"
        }
      ]
    },
    { 
      id: "CIS-4.2", 
      title: "Security Groups - RDP Access", 
      status: "PASS", 
      pass: 3, 
      fail: 0, 
      warn: 0, 
      resources: []
    }
  ]
};

const mockNIST: GuardrailsSummary = {
  framework: "NIST",
  score: 68,
  totals: { pass: 12, fail: 8, warn: 4 },
  controls: [
    { 
      id: "NIST-AC-1", 
      title: "Access Control Policy and Procedures", 
      status: "PASS", 
      pass: 1, 
      fail: 0, 
      warn: 0, 
      resources: []
    },
    { 
      id: "NIST-AC-2", 
      title: "Account Management", 
      status: "FAIL", 
      pass: 0, 
      fail: 2, 
      warn: 1, 
      resources: [
        { 
          arn: "arn:aws:iam::123456789012:user/admin-user", 
          service: "iam", 
          region: "global", 
          note: "No MFA enabled"
        }
      ]
    }
  ]
};

const mockPCI: GuardrailsSummary = {
  framework: "PCI",
  score: 82,
  totals: { pass: 15, fail: 3, warn: 2 },
  controls: [
    { 
      id: "PCI-1.1", 
      title: "Firewall Configuration", 
      status: "PASS", 
      pass: 1, 
      fail: 0, 
      warn: 0, 
      resources: []
    },
    { 
      id: "PCI-2.1", 
      title: "Default Password Policy", 
      status: "FAIL", 
      pass: 0, 
      fail: 1, 
      warn: 0, 
      resources: [
        { 
          arn: "arn:aws:iam::123456789012:account", 
          service: "iam", 
          region: "global", 
          note: "Weak password policy"
        }
      ]
    }
  ]
};

export async function getSummary(framework: Framework = "CIS"): Promise<GuardrailsSummary> {
  if (!API) {
    // Return mock data based on framework
    switch (framework) {
      case "NIST":
        return Promise.resolve(mockNIST);
      case "PCI":
        return Promise.resolve(mockPCI);
      default:
        return Promise.resolve(mock);
    }
  }
  
  try {
    const r = await fetch(`${API}/summary?framework=${framework}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });
    
    if (!r.ok) {
      const errorText = await r.text();
      console.error('Guardrails API error:', r.status, r.statusText, errorText);
      throw new Error(`Guardrails API failed: ${r.status} ${r.statusText} - ${errorText}`);
    }
    
    // Check if response is HTML (error page)
    const contentType = r.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const htmlText = await r.text();
      console.error('Guardrails API returned HTML instead of JSON:', htmlText.substring(0, 200));
      throw new Error('API returned HTML error page instead of JSON');
    }
    
    return await r.json();
  } catch (error) {
    console.error('Guardrails API error:', error);
    // Fallback to mock data on API error
    switch (framework) {
      case "NIST":
        return mockNIST;
      case "PCI":
        return mockPCI;
      default:
        return mock;
    }
  }
}

export async function remediate(controlId: string, resourceArn?: string, dryRun = true): Promise<RemediationResponse> {
  if (!API) {
    return { 
      actionId: crypto.randomUUID(), 
      status: dryRun ? "SIMULATED" : "QUEUED", 
      message: dryRun ? "Dry run simulation - no actual changes made" : "Mock remediation queued"
    };
  }
  
  try {
    const r = await fetch(`${API}/remediate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ controlId, resourceArn, dryRun })
    });
    if (!r.ok) throw new Error(`remediate ${r.status}`);
    return r.json();
  } catch (error) {
    console.error('Remediation API error:', error);
    return { 
      actionId: crypto.randomUUID(), 
      status: "ERROR", 
      message: `Failed to queue remediation: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function getEvidence(controlId: string): Promise<EvidenceResponse> {
  if (!API) {
    // Mock evidence data
    const mockEvidence = {
      controlId, 
      generatedAt: new Date().toISOString(), 
      items: [
        {
          type: "scan_result",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          details: `Compliance scan for ${controlId} completed`,
          findings: [
            "Resource configuration checked",
            "Security policies reviewed",
            "Access patterns analyzed"
          ]
        },
        {
          type: "policy_check",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          details: `Policy compliance check for ${controlId}`,
          result: "Non-compliant",
          recommendations: [
            "Update resource configuration",
            "Apply security best practices",
            "Review access permissions"
          ]
        }
      ]
    };
    return mockEvidence;
  }
  
  try {
    const r = await fetch(`${API}/evidence?control=${encodeURIComponent(controlId)}`);
    if (!r.ok) throw new Error(`evidence ${r.status}`);
    return r.json();
  } catch (error) {
    console.error('Evidence API error:', error);
    return { 
      controlId, 
      generatedAt: new Date().toISOString(), 
      items: []
    };
  }
}




