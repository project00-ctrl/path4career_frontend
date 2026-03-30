// ── Shared Types for AI Career Modules ─────────────────────────────

export type RiskRating = 'low' | 'medium' | 'high';

export interface RiskDimension {
  level: RiskRating;
  score: number; // 0-10
  factors: string[];
  description: string;
}

export interface RiskAnalysis {
  automationRisk: RiskDimension;
  industryDecline: RiskDimension;
  skillRedundancy: RiskDimension;
  geographicRisk: RiskDimension;
  overallRisk: RiskRating;
  overallScore: number;
}

export interface SimulationResult {
  targetRole: string;
  learningTimeMonths: number;
  salaryRange: { min: number; max: number; median: number };
  demandTrend: 'rising' | 'stable' | 'declining';
  demandScore: number; // 0-10
  gapSkills: string[];
  matchedSkills: string[];
  matchPercent: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
}

export interface CareerOption {
  name: string;
  salary: number;      // 1-10
  growth: number;       // 1-10
  stability: number;    // 1-10
  demand: number;       // 1-10
  total: number;
}

export interface CareerComparison {
  options: CareerOption[];
  bestChoice: string;
  reasoning: string;
  verdictDetails: { category: string; winner: string }[];
}

export interface ReputationResult {
  score: number;  // 0-100
  level: 'beginner' | 'professional' | 'expert' | 'elite';
  breakdown: {
    skills: number;
    projects: number;
    certifications: number;
    experience: number;
  };
  nextLevel: string;
  nextLevelAt: number;
  progressToNext: number; // 0-100
  badges: string[];
}

export interface SkillGrowthItem {
  name: string;
  current: number;   // 0-100
  projected: number;  // 0-100
  trend: 'rising' | 'stable' | 'declining';
}

export interface DigitalTwinProfile {
  currentRole: string;
  experienceYears: number;
  topStrengths: string[];
  skillGrowth: SkillGrowthItem[];
  futureOpportunities: string[];
  careerTrajectory: string;
  predictedRoles: { role: string; probability: number; timeframe: string }[];
  marketAlignment: number; // 0-100
}

export interface CareerShieldAlert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

export interface SkillProtectionPlan {
  urgentSkills: { name: string; reason: string; priority: 'critical' | 'high' | 'medium' }[];
  timeline: { phase: string; duration: string; skills: string[] }[];
  estimatedTimeMonths: number;
}

export interface CareerShieldResult {
  safetyScore: number; // 0-10
  alerts: CareerShieldAlert[];
  protectionPlan: SkillProtectionPlan;
  riskSummary: string;
}

// ── Available roles for simulation ──────────────────

export const SIMULATION_ROLES = [
  'AI/ML Engineer',
  'Cloud Architect',
  'DevOps Engineer',
  'Data Engineer',
  'Full-Stack Developer',
  'Cybersecurity Analyst',
  'Product Manager',
  'Site Reliability Engineer',
  'Blockchain Developer',
  'Mobile App Developer',
  'Solutions Architect',
  'Data Scientist',
] as const;

export type SimulationRole = typeof SIMULATION_ROLES[number];

// ── Available career options for decision engine ────

export const CAREER_OPTIONS_LIST = [
  'AI/ML Engineer',
  'Cloud Architect',
  'DevOps Engineer',
  'Data Engineer',
  'Full-Stack Developer',
  'Cybersecurity Analyst',
  'Product Manager',
  'SRE',
  'Blockchain Developer',
  'Mobile Developer',
  'Solutions Architect',
  'Data Scientist',
  'Tech Lead',
  'Engineering Manager',
] as const;

export type DashboardTab =
  | 'shield'
  | 'risk'
  | 'simulation'
  | 'decision'
  | 'reputation'
  | 'twin';
