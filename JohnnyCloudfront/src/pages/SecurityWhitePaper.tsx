import { Shield, Lock, Eye, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function SecurityWhitePaper() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-sm text-green-300">
          <Shield className="w-4 h-4" />
          Security & Compliance
        </div>
        
        <h1 className="text-4xl font-bold jc-title-gradient">
          Security White Paper
        </h1>
        
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Comprehensive security practices, data handling policies, and compliance measures for JohnnyCloud
        </p>
      </header>

      {/* Executive Summary */}
      <section className="rounded-2xl border bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
          <FileText className="w-6 h-6 text-cyan-300" />
          Executive Summary
        </h2>
        
        <div className="space-y-4 text-white/80 leading-relaxed">
          <p>
            JohnnyCloud is designed with security-first principles, ensuring that your AWS data remains 
            within your infrastructure while providing powerful FinOps and SecOps capabilities. This document 
            outlines our comprehensive security framework, data handling practices, and compliance measures.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Key Security Principles</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>Zero data retention outside your AWS account</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>Least-privilege access controls</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>Audit logging for all operations</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Compliance Standards</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>SOC 2 Type II compliant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>GDPR compliant data handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>HIPAA-ready architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span>ISO 27001 aligned</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Handling */}
      <section className="rounded-2xl border bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
          <Lock className="w-6 h-6 text-cyan-300" />
          Data Handling & Privacy
        </h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Data Residency</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">All data remains in your AWS account</strong> - 
                    JohnnyCloud never stores customer data outside your infrastructure
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Regional compliance</strong> - 
                    Data processing occurs within your specified AWS regions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">No data aggregation</strong> - 
                    Your data is never combined with other customers' information
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Data Processing</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Read-only by default</strong> - 
                    Analysis operations use read-only permissions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Temporary processing</strong> - 
                    Data is processed in memory and discarded immediately
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Encrypted in transit</strong> - 
                    All API communications use TLS 1.3 encryption
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Access Controls */}
      <section className="rounded-2xl border bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
          <Eye className="w-6 h-6 text-cyan-300" />
          Access Controls & Authentication
        </h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Cross-Account Access</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Least-privilege IAM roles</strong> - 
                    Minimal permissions required for specific operations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Temporary credentials</strong> - 
                    No persistent access keys or long-term tokens
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Role assumption only</strong> - 
                    Access granted through AWS STS role assumption
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">User Authentication</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">AWS Cognito integration</strong> - 
                    Enterprise-grade authentication and authorization
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">OAuth2 + PKCE</strong> - 
                    Secure authorization code flow with proof key
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Multi-factor authentication</strong> - 
                    Supported through AWS Cognito MFA
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Remediation Security */}
      <section className="rounded-2xl border bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-cyan-300" />
          Auto-Remediation Security
        </h2>
        
        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-200 mb-2">Opt-in Only</h3>
                <p className="text-yellow-100/80">
                  Auto-remediation features are completely optional and must be explicitly enabled by your organization.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Safety Measures</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Preview before execution</strong> - 
                    All changes are previewed and require approval
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Rollback capabilities</strong> - 
                    Automatic rollback for failed remediation attempts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Resource tagging</strong> - 
                    All remediated resources are tagged for tracking
                  </span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Comprehensive logging</strong> - 
                    All remediation actions logged to CloudTrail
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Change attribution</strong> - 
                    Who, what, when, and why for every change
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0"></div>
                  <span className="text-white/80">
                    <strong className="text-white">Compliance reporting</strong> - 
                    Detailed reports for audit and compliance needs
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="rounded-2xl border bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Security Contact & Support</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Security Questions</h3>
            <p className="text-white/80">
              For security-related questions, concerns, or to report potential security issues, 
              please contact our security team.
            </p>
            <div className="space-y-2">
              <p className="text-white/80">
                <strong className="text-white">Email:</strong> security@johnnycloud.com
              </p>
              <p className="text-white/80">
                <strong className="text-white">Response Time:</strong> Within 24 hours
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Documentation</h3>
            <p className="text-white/80">
              Additional security documentation and compliance reports are available upon request 
              for enterprise customers.
            </p>
            <div className="space-y-2">
              <p className="text-white/80">
                <strong className="text-white">SOC 2 Reports:</strong> Available for enterprise customers
              </p>
              <p className="text-white/80">
                <strong className="text-white">Penetration Testing:</strong> Annual third-party assessments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-white/60 text-sm border-t border-white/10 pt-6">
        <p>
          This document is updated regularly to reflect our current security practices. 
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}


