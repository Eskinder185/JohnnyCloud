import { useState, useMemo } from 'react';

interface SimplePlannerInput {
  workloads: number;
  approach: 'rehost' | 'replatform' | 'refactor';
  complexity: 'low' | 'medium' | 'high';
  multiRegion: boolean;
  regulated: boolean;
}

interface EstimationResult {
  duration: string;
  effort: string;
  prerequisites: string[];
  services: string[];
}

export default function SimpleMigrationPlanner() {
  const [input, setInput] = useState<SimplePlannerInput>({
    workloads: 3,
    approach: 'rehost',
    complexity: 'medium',
    multiRegion: false,
    regulated: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const estimation = useMemo((): EstimationResult => {
    const { workloads, approach, complexity, multiRegion, regulated } = input;
    
    // Base duration calculation
    let baseWeeks = 2;
    if (approach === 'rehost') baseWeeks = 1;
    else if (approach === 'replatform') baseWeeks = 3;
    else if (approach === 'refactor') baseWeeks = 6;
    
    // Complexity multiplier
    const complexityMultiplier = complexity === 'low' ? 0.7 : complexity === 'high' ? 1.5 : 1;
    
    // Workload scaling (logarithmic)
    const workloadMultiplier = Math.log(workloads + 1) / Math.log(2);
    
    // Additional factors
    const multiRegionBonus = multiRegion ? 2 : 0;
    const regulatedBonus = regulated ? 3 : 0;
    
    const totalWeeks = Math.ceil((baseWeeks * complexityMultiplier * workloadMultiplier) + multiRegionBonus + regulatedBonus);
    const minWeeks = Math.max(1, Math.floor(totalWeeks * 0.7));
    const maxWeeks = Math.ceil(totalWeeks * 1.3);
    
    // Effort calculation
    let effortLevel = 'Low';
    let effortDescription = '1 engineer part-time';
    
    if (totalWeeks > 8) {
      effortLevel = 'High';
      effortDescription = '2-3 engineers full-time';
    } else if (totalWeeks > 4) {
      effortLevel = 'Medium';
      effortDescription = '1-2 engineers part-time';
    }
    
    // Prerequisites
    const prerequisites = [
      'AWS account setup with appropriate permissions',
      'Network connectivity (VPN/Direct Connect)',
      'Application documentation and dependencies'
    ];
    
    if (regulated) {
      prerequisites.push('Compliance framework documentation (SOC2, HIPAA, etc.)');
    }
    
    if (multiRegion) {
      prerequisites.push('Multi-region architecture design');
    }
    
    // AWS Services
    const services = ['VPC', 'EC2', 'RDS', 'S3', 'CloudWatch'];
    
    if (approach === 'replatform') {
      services.push('ECS', 'Application Load Balancer', 'Route 53');
    } else if (approach === 'refactor') {
      services.push('Lambda', 'API Gateway', 'DynamoDB', 'SQS', 'SNS');
    }
    
    if (regulated) {
      services.push('AWS Config', 'CloudTrail', 'Security Hub', 'GuardDuty');
    }
    
    if (multiRegion) {
      services.push('CloudFront', 'WAF', 'AWS Backup');
    }
    
    return {
      duration: `${minWeeks}–${maxWeeks} weeks`,
      effort: `${effortLevel}: ${effortDescription}`,
      prerequisites,
      services
    };
  }, [input]);

  const handleInputChange = (updates: Partial<SimplePlannerInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
  };

  const workloadPresets = [1, 3, 6, 12];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Workloads */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Workloads
          </label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {workloadPresets.map(preset => (
                <button
                  key={preset}
                  onClick={() => handleInputChange({ workloads: preset })}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    input.workloads === preset
                      ? 'bg-cyan-500 border-cyan-500 text-white'
                      : 'border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              max="50"
              value={input.workloads}
              onChange={(e) => handleInputChange({ workloads: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
              aria-describedby="workloads-help"
            />
            <p id="workloads-help" className="text-xs text-white/50">
              Number of applications/systems to migrate
            </p>
          </div>
        </div>

        {/* Approach */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Migration Approach
          </label>
          <div className="space-y-2">
            {[
              { value: 'rehost', label: 'Rehost', description: 'Lift and shift' },
              { value: 'replatform', label: 'Replatform', description: 'Lift, tinker, and shift' },
              { value: 'refactor', label: 'Refactor', description: 'Cloud-native rebuild' }
            ].map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="approach"
                  value={option.value}
                  checked={input.approach === option.value}
                  onChange={(e) => handleInputChange({ approach: e.target.value as any })}
                  className="text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-sm text-white">{option.label}</span>
                  <p className="text-xs text-white/50">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Complexity */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Complexity
          </label>
          <select
            value={input.complexity}
            onChange={(e) => handleInputChange({ complexity: e.target.value as any })}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
          >
            <option value="low">Low - Simple applications</option>
            <option value="medium">Medium - Standard complexity</option>
            <option value="high">High - Complex integrations</option>
          </select>
        </div>

        {/* Advanced Options */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Advanced Options
          </label>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-cyan-400 hover:text-cyan-300 mb-2"
          >
            {showAdvanced ? 'Hide' : 'Show'} advanced options
          </button>
          
          {showAdvanced && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.multiRegion}
                  onChange={(e) => handleInputChange({ multiRegion: e.target.checked })}
                  className="text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-white">Multi-Region</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.regulated}
                  onChange={(e) => handleInputChange({ regulated: e.target.checked })}
                  className="text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-white">Regulated Industry</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeline & Effort */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Estimation</h3>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-white/70">Duration:</span>
                <p className="text-lg font-semibold text-cyan-400">{estimation.duration}</p>
              </div>
              <div>
                <span className="text-sm text-white/70">Effort:</span>
                <p className="text-lg font-semibold text-cyan-400">{estimation.effort}</p>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <h4 className="text-sm font-medium text-white mb-2">Prerequisites</h4>
            <ul className="space-y-1">
              {estimation.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-white/80">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AWS Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Suggested AWS Services</h3>
          <div className="flex flex-wrap gap-2">
            {estimation.services.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* How we estimate disclosure */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <details className="group">
          <summary className="cursor-pointer text-sm text-white/70 hover:text-white">
            How we estimate
          </summary>
          <div className="mt-3 text-xs text-white/60 space-y-2">
            <p>
              Our estimates are based on typical migration patterns and AWS best practices:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Rehost: 1-2 weeks per workload (lift and shift)</li>
              <li>Replatform: 2-4 weeks per workload (optimize for cloud)</li>
              <li>Refactor: 4-8 weeks per workload (cloud-native rebuild)</li>
              <li>Complexity affects timeline by 0.7x to 1.5x multiplier</li>
              <li>Multi-region adds 2+ weeks for architecture design</li>
              <li>Regulated industries add 3+ weeks for compliance</li>
            </ul>
            <p className="text-white/50">
              These are estimates only. Actual timelines may vary based on specific requirements, 
              team experience, and unforeseen complexities.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

