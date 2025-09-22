// Planner state management with localStorage persistence

export interface PlannerInput {
  workloads: number;
  dbType: "none" | "mysql" | "postgres" | "sqlserver" | "nosql" | "mixed";
  criticality: "low" | "medium" | "high";
  traffic: "steady" | "spiky" | "seasonal";
  goal: "lift" | "replatform" | "refactor";
  multiRegion: boolean;
  regulated: boolean;
}

export interface PlannerPlan {
  strategy: Array<"rehost" | "replatform" | "refactor">;
  recommended: string[];
  effortWeeks: number;
  phases: Array<{ title: string; weeks: string; bullets: string[] }>;
  prerequisites: string[];
}

export interface BusinessImpact {
  avoidedDowntimeCost: number;
  riskReduction: number;
  costOptimization: number;
  performanceEfficiency: string;
}

export interface ImpactAssumptions {
  downtimeCostPerHour: number;
  hoursAvoidedPerMonth: number;
  highSeverityExposures: number;
  latencyImprovement: number;
}

export interface SavingsCalculator {
  rightsizingAdoption: number; // 0-100%
  idleSchedulingHours: number; // 0-12 hours/day
  includeStorageTransitions: boolean;
  ec2MonthlyCost: number;
  s3MonthlyCost: number;
}

const STORAGE_KEY = 'whyaws_planner_v1';

export class PlannerStore {
  private state: {
    input: PlannerInput;
    assumptions: ImpactAssumptions;
    savings: SavingsCalculator;
  };

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          input: {
            workloads: 6,
            dbType: "postgres",
            criticality: "medium",
            traffic: "steady",
            goal: "replatform",
            multiRegion: false,
            regulated: false,
            ...parsed.input
          },
          assumptions: {
            downtimeCostPerHour: 5000,
            hoursAvoidedPerMonth: 3,
            highSeverityExposures: 12,
            latencyImprovement: 25,
            ...parsed.assumptions
          },
          savings: {
            rightsizingAdoption: 75,
            idleSchedulingHours: 8,
            includeStorageTransitions: true,
            ec2MonthlyCost: 2000,
            s3MonthlyCost: 500,
            ...parsed.savings
          }
        };
      }
    } catch (e) {
      console.error("Failed to load planner state from storage:", e);
    }

    // Default state
    return {
      input: {
        workloads: 6,
        dbType: "postgres",
        criticality: "medium",
        traffic: "steady",
        goal: "replatform",
        multiRegion: false,
        regulated: false
      },
      assumptions: {
        downtimeCostPerHour: 5000,
        hoursAvoidedPerMonth: 3,
        highSeverityExposures: 12,
        latencyImprovement: 25
      },
      savings: {
        rightsizingAdoption: 75,
        idleSchedulingHours: 8,
        includeStorageTransitions: true,
        ec2MonthlyCost: 2000,
        s3MonthlyCost: 500
      }
    };
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save planner state to storage:", e);
    }
  }

  getInput(): PlannerInput {
    return this.state.input;
  }

  setInput(input: Partial<PlannerInput>) {
    this.state.input = { ...this.state.input, ...input };
    this.saveToStorage();
  }

  getAssumptions(): ImpactAssumptions {
    return this.state.assumptions;
  }

  setAssumptions(assumptions: Partial<ImpactAssumptions>) {
    this.state.assumptions = { ...this.state.assumptions, ...assumptions };
    this.saveToStorage();
  }

  getSavings(): SavingsCalculator {
    return this.state.savings;
  }

  setSavings(savings: Partial<SavingsCalculator>) {
    this.state.savings = { ...this.state.savings, ...savings };
    this.saveToStorage();
  }

  // Build migration plan with enhanced logic
  buildPlan(input: PlannerInput): PlannerPlan {
    const strategy: PlannerPlan["strategy"] = [];
    if (input.goal === "lift") strategy.push("rehost");
    if (input.goal === "replatform") strategy.push("replatform");
    if (input.goal === "refactor") strategy.push("refactor");
    if ((input.dbType === "mixed" || input.criticality === "high") && !strategy.includes("replatform")) strategy.push("replatform");
    if (input.traffic === "spiky" && !strategy.includes("refactor")) strategy.push("refactor");

    const rec = new Set<string>([
      "VPC + Subnets + NAT", 
      "ALB / NLB", 
      "CloudWatch + X-Ray + Logs", 
      "AWS Backup", 
      "Security Hub + GuardDuty", 
      "IAM Identity Center (SSO)"
    ]);
    
    if (strategy.includes("rehost")) rec.add("EC2 + ASG");
    if (strategy.includes("replatform")) rec.add("ECS on Fargate");
    if (strategy.includes("refactor")) rec.add("Lambda + API Gateway + EventBridge");
    
    const dbMap: Record<string, string> = {
      none: "", 
      mysql: "Amazon RDS for MySQL (Multi-AZ)", 
      postgres: "Amazon RDS for PostgreSQL (Multi-AZ)",
      sqlserver: "Amazon RDS for SQL Server (Multi-AZ)", 
      nosql: "Amazon DynamoDB", 
      mixed: "RDS (engine-matched) + DynamoDB",
    };
    if (input.dbType !== "none") rec.add(dbMap[input.dbType]);

    // Enhanced duration calculation
    let baseDuration = 1; // Landing Zone base
    
    // Landing Zone adjustments
    if (input.multiRegion) baseDuration += 1;
    if (input.regulated) baseDuration += 1;
    
    // Per-workload effort
    const perWorkloadEffort = {
      rehost: 0.5,
      replatform: 0.75,
      refactor: 1.25
    };
    
    let workloadEffort = 0;
    strategy.forEach(s => {
      workloadEffort += perWorkloadEffort[s] * input.workloads;
    });
    
    // Multipliers
    const criticalityMultiplier = {
      high: 1.3,
      medium: 1.1,
      low: 1.0
    }[input.criticality];
    
    const trafficMultiplier = input.traffic === "spiky" || input.traffic === "seasonal" ? 1.1 : 1.0;
    const dbMultiplier = input.dbType !== "none" ? 0.5 : 0;
    
    const totalEffort = (baseDuration + workloadEffort + dbMultiplier) * criticalityMultiplier * trafficMultiplier;
    const effortWeeks = Math.max(3, Math.round(totalEffort * 2) / 2); // Round to nearest 0.5

    const phases = [
      { 
        title: "Discover & Assess", 
        weeks: "Weeks 1–2", 
        bullets: [
          "Inventory apps & dependencies", 
          "Landing zone guardrails (CIS)", 
          "Choose 6R strategy per workload",
          input.regulated ? "Compliance requirements mapping" : "",
          input.multiRegion ? "Multi-region architecture planning" : ""
        ].filter(Boolean)
      },
      { 
        title: "Landing Zone", 
        weeks: `Weeks 2–${2 + Math.ceil(baseDuration)}`, 
        bullets: [
          "VPC & routing setup", 
          "Observability + backups", 
          "Baseline security controls",
          input.multiRegion ? "Cross-region connectivity" : "",
          input.regulated ? "Compliance controls implementation" : ""
        ].filter(Boolean)
      },
      { 
        title: "Pilot Migration", 
        weeks: `Weeks ${2 + Math.ceil(baseDuration)}–${4 + Math.ceil(baseDuration)}`, 
        bullets: [
          strategy.includes("rehost") ? "Rehost pilot on EC2" : "Containerize pilot on ECS Fargate", 
          "Cutover plan + rollback", 
          "Performance & cost validation",
          "Security & compliance validation"
        ]
      },
      { 
        title: "Scale & Optimize", 
        weeks: `Weeks ${4 + Math.ceil(baseDuration)}–${effortWeeks}`, 
        bullets: [
          "Wave-based migrations", 
          "Automate guardrails & tags", 
          "FinOps cadence (rightsizing, SPs)",
          "Continuous optimization"
        ]
      },
    ];

    const prerequisites = [
      "Enable Security Hub",
      "CloudTrail multi-region",
      "AWS Backup configured",
      "IAM Identity Center setup",
      input.regulated ? "Compliance framework mapping" : "",
      input.multiRegion ? "Multi-region backup strategy" : ""
    ].filter(Boolean);

    return { 
      strategy, 
      recommended: Array.from(rec).filter(Boolean), 
      effortWeeks, 
      phases,
      prerequisites
    };
  }

  // Calculate business impact
  calculateBusinessImpact(input: PlannerInput, assumptions: ImpactAssumptions): BusinessImpact {
    const avoidedDowntimeCost = assumptions.downtimeCostPerHour * assumptions.hoursAvoidedPerMonth;
    const riskReduction = Math.min(assumptions.highSeverityExposures, Math.floor(assumptions.highSeverityExposures * 0.7));
    const costOptimization = input.workloads * 200; // Rough estimate
    const performanceEfficiency = `${assumptions.latencyImprovement}% faster response times`;

    return {
      avoidedDowntimeCost,
      riskReduction,
      costOptimization,
      performanceEfficiency
    };
  }

  // Calculate savings
  calculateSavings(savings: SavingsCalculator): { total: number; breakdown: any } {
    const rightsizingSavings = savings.ec2MonthlyCost * 0.25 * (savings.rightsizingAdoption / 100);
    const schedulingSavings = savings.ec2MonthlyCost * 0.5 * (savings.idleSchedulingHours / 24);
    const storageSavings = savings.includeStorageTransitions ? savings.s3MonthlyCost * 0.20 : 0;
    
    const total = rightsizingSavings + schedulingSavings + storageSavings;
    
    return {
      total,
      breakdown: {
        rightsizing: rightsizingSavings,
        scheduling: schedulingSavings,
        storage: storageSavings
      }
    };
  }
}

export const plannerStore = new PlannerStore();



