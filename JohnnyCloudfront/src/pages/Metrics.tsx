import React from 'react';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Metric } from '@/components/ui/Metric';
import { Button } from '@/components/ui/Button';
import CostSpikes from '@/components/animation/CostSpikes';
import { useAWSData } from '@/hooks/useAWSData';

export default function Metrics() {
  const { 
    costSummary, 
    costAnomalies, 
    guardDuty, 
    securityHub, 
    iamHygiene, 
    networkExposure, 
    loading, 
    error, 
    refetch 
  } = useAWSData();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Heading className="text-4xl md:text-5xl">AWS Metrics Dashboard</Heading>
          <p className="text-jc-dim text-lg max-w-2xl mx-auto">
            Loading real-time AWS data...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jc-cyan"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Heading className="text-4xl md:text-5xl">AWS Metrics Dashboard</Heading>
          <p className="text-jc-dim text-lg max-w-2xl mx-auto">
            Error loading AWS data: {error}
          </p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Heading className="text-4xl md:text-5xl">AWS Metrics Dashboard</Heading>
        <p className="text-jc-dim text-lg max-w-2xl mx-auto">
          Real-time monitoring of your AWS infrastructure costs and security posture
        </p>
        <Button onClick={refetch} variant="outline" className="mt-4">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </Button>
      </div>

      {/* Cost Anomaly Detection */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-jc-yellow/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-jc-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Cost Anomaly Detection</h3>
            <p className="text-jc-dim text-sm">Real-time cost spike monitoring</p>
          </div>
        </div>
        
        <div className="h-64 mb-4">
          <CostSpikes className="w-full h-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-jc-yellow">
              ${costSummary?.mtdUSD?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-jc-dim">Month-to-date spend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-jc-pink">
              ${costSummary?.forecastUSD?.toFixed(2) || 'N/A'}
            </div>
            <div className="text-sm text-jc-dim">Forecasted monthly</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-jc-green">
              {costAnomalies?.anomalies?.length || 0}
            </div>
            <div className="text-sm text-jc-dim">Anomalies detected</div>
          </div>
        </div>
      </Card>

      {/* AWS Service Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Top AWS Services by Cost</h3>
          <div className="space-y-4">
            {costSummary?.topServices?.length ? (
              costSummary.topServices.map((service, index) => {
                const totalCost = costSummary.topServices.reduce((sum, s) => sum + s.usd, 0);
                const percentage = ((service.usd / totalCost) * 100).toFixed(0);
                const serviceIcons: { [key: string]: { bg: string; text: string; label: string } } = {
                  'Amazon Elastic Compute Cloud - Compute': { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'EC2' },
                  'Amazon Simple Storage Service': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'S3' },
                  'Amazon Relational Database Service': { bg: 'bg-green-500/20', text: 'text-green-400', label: 'RDS' },
                  'Amazon Elastic Load Balancing': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'ELB' },
                  'Amazon CloudWatch': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'CW' }
                };
                const icon = serviceIcons[service.service] || { bg: 'bg-gray-500/20', text: 'text-gray-400', label: service.service.split(' ')[1]?.substring(0, 3) || 'AWS' };
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${icon.bg} rounded flex items-center justify-center`}>
                        <span className={`${icon.text} text-xs font-bold`}>{icon.label}</span>
                      </div>
                      <span className="font-medium">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${service.usd.toFixed(2)}</div>
                      <div className="text-xs text-jc-dim">{percentage}% of total</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-jc-dim py-8">
                No cost data available
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Cost Optimization Opportunities</h3>
          <div className="space-y-4">
            <div className="p-4 bg-jc-yellow/10 border border-jc-yellow/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-jc-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium text-jc-yellow">Unused EC2 Instances</span>
              </div>
              <p className="text-sm text-jc-dim mb-2">3 instances running but no CPU activity</p>
              <div className="text-sm font-semibold text-jc-yellow">Potential savings: $180/month</div>
            </div>
            <div className="p-4 bg-jc-cyan/10 border border-jc-cyan/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-jc-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium text-jc-cyan">Reserved Instance Opportunity</span>
              </div>
              <p className="text-sm text-jc-dim mb-2">5 instances eligible for Reserved pricing</p>
              <div className="text-sm font-semibold text-jc-cyan">Potential savings: $320/month</div>
            </div>
            <div className="p-4 bg-jc-green/10 border border-jc-green/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-jc-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-jc-green">Storage Optimization</span>
              </div>
              <p className="text-sm text-jc-dim mb-2">S3 objects can be moved to cheaper storage class</p>
              <div className="text-sm font-semibold text-jc-green">Potential savings: $45/month</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Metrics */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-jc-green/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-jc-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Security Posture</h3>
            <p className="text-jc-dim text-sm">AWS security findings and compliance status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-jc-green mb-2">
              {guardDuty?.enabled ? 
                Math.max(0, 100 - ((guardDuty.counts?.high || 0) * 10 + (guardDuty.counts?.medium || 0) * 5)) : 
                'N/A'
              }%
            </div>
            <div className="text-sm text-jc-dim">Security Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-jc-yellow mb-2">
              {guardDuty?.counts?.medium || 0}
            </div>
            <div className="text-sm text-jc-dim">Medium Issues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-jc-pink mb-2">
              {guardDuty?.counts?.high || 0}
            </div>
            <div className="text-sm text-jc-dim">High Issues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-jc-cyan mb-2">
              {(guardDuty?.counts?.low || 0) + (guardDuty?.counts?.medium || 0) + (guardDuty?.counts?.high || 0)}
            </div>
            <div className="text-sm text-jc-dim">Total Findings</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4">Recent Security Findings</h4>
            <div className="space-y-3">
              {guardDuty?.enabled && guardDuty.latest?.length ? (
                guardDuty.latest.map((finding, index) => {
                  const severity = finding.severity >= 7 ? 'high' : finding.severity >= 4 ? 'medium' : 'low';
                  const colorClass = severity === 'high' ? 'jc-pink' : severity === 'medium' ? 'jc-yellow' : 'jc-green';
                  
                  return (
                    <div key={index} className={`flex items-center gap-3 p-3 bg-${colorClass}/10 border border-${colorClass}/20 rounded-lg`}>
                      <div className={`w-2 h-2 bg-${colorClass} rounded-full`}></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{finding.title}</div>
                        <div className="text-xs text-jc-dim">
                          Last seen: {new Date(finding.lastSeen).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`text-xs bg-${colorClass}/20 text-${colorClass} px-2 py-1 rounded capitalize`}>
                        {severity}
                      </span>
                    </div>
                  );
                })
              ) : guardDuty?.enabled === false ? (
                <div className="text-center text-jc-dim py-4">
                  GuardDuty is not enabled
                </div>
              ) : (
                <div className="text-center text-jc-dim py-4">
                  No recent security findings
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Compliance Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${iamHygiene?.passwordPolicy === 'present' ? 'bg-jc-green/20' : 'bg-jc-yellow/20'} rounded flex items-center justify-center`}>
                    <svg className={`w-4 h-4 ${iamHygiene?.passwordPolicy === 'present' ? 'text-jc-green' : 'text-jc-yellow'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Password Policy</span>
                </div>
                <span className={`text-sm ${iamHygiene?.passwordPolicy === 'present' ? 'text-jc-green' : 'text-jc-yellow'}`}>
                  {iamHygiene?.passwordPolicy === 'present' ? 'Configured' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${iamHygiene?.noMFA?.length === 0 ? 'bg-jc-green/20' : 'bg-jc-yellow/20'} rounded flex items-center justify-center`}>
                    <svg className={`w-4 h-4 ${iamHygiene?.noMFA?.length === 0 ? 'text-jc-green' : 'text-jc-yellow'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">MFA Users</span>
                </div>
                <span className={`text-sm ${iamHygiene?.noMFA?.length === 0 ? 'text-jc-green' : 'text-jc-yellow'}`}>
                  {iamHygiene?.noMFA?.length === 0 ? 'All enabled' : `${iamHygiene?.noMFA?.length} without MFA`}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${networkExposure?.publicBucketsCount === 0 ? 'bg-jc-green/20' : 'bg-jc-pink/20'} rounded flex items-center justify-center`}>
                    <svg className={`w-4 h-4 ${networkExposure?.publicBucketsCount === 0 ? 'text-jc-green' : 'text-jc-pink'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium">Public S3 Buckets</span>
                </div>
                <span className={`text-sm ${networkExposure?.publicBucketsCount === 0 ? 'text-jc-green' : 'text-jc-pink'}`}>
                  {networkExposure?.publicBucketsCount || 0} public
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}