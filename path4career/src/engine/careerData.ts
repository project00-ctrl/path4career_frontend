/**
 * Centralized Career Data Models
 * All datasets used across the platform for predictions
 */

export interface SkillData {
  salaryBoost: number; // percentage as decimal (0.25 = 25%)
  demandBoost: number;
}

export interface CareerData {
  baseSalary: number; // in lakhs
  growthRate: number; // annual growth rate
  demandScore: number; // 0-100
  automationRisk: number; // 0-100
  jobSaturation: number; // 0-100
  layoffRisk: number; // 0-100
  demandTrend: 'Rising' | 'Stable' | 'Declining';
}

export interface RoleData {
  baseSalary: number; // in lakhs
  experienceMultiplier: number;
}

// All skills and their impact multipliers
export const SKILLS: Record<string, SkillData> = {
  'Artificial Intelligence': { salaryBoost: 0.25, demandBoost: 0.30 },
  'Cloud Computing (AWS/GCP)': { salaryBoost: 0.18, demandBoost: 0.25 },
  'Blockchain & Web3': { salaryBoost: 0.16, demandBoost: 0.20 },
  'Cybersecurity': { salaryBoost: 0.22, demandBoost: 0.28 },
  'Data Engineering': { salaryBoost: 0.20, demandBoost: 0.26 },
  'DevOps & SRE': { salaryBoost: 0.19, demandBoost: 0.27 },
  'Machine Learning Ops': { salaryBoost: 0.24, demandBoost: 0.29 },
  'Quantum Computing': { salaryBoost: 0.26, demandBoost: 0.15 },
  'AR/VR Development': { salaryBoost: 0.17, demandBoost: 0.18 },
  'System Design': { salaryBoost: 0.21, demandBoost: 0.24 },
  'Leadership & Management': { salaryBoost: 0.23, demandBoost: 0.22 },
  'Product Strategy': { salaryBoost: 0.20, demandBoost: 0.21 },
  'JavaScript': { salaryBoost: 0.12, demandBoost: 0.20 },
  'Python': { salaryBoost: 0.14, demandBoost: 0.22 },
  'React': { salaryBoost: 0.13, demandBoost: 0.21 },
  'Machine Learning': { salaryBoost: 0.24, demandBoost: 0.28 },
  'Data Science': { salaryBoost: 0.22, demandBoost: 0.26 },
  'DevOps': { salaryBoost: 0.19, demandBoost: 0.27 },
  'Blockchain': { salaryBoost: 0.16, demandBoost: 0.18 },
  'Mobile Dev': { salaryBoost: 0.14, demandBoost: 0.20 },
};

// Current roles and their base salaries
export const CURRENT_ROLES: Record<string, RoleData> = {
  'Junior Developer': { baseSalary: 12, experienceMultiplier: 1.0 },
  'Mid Developer': { baseSalary: 18, experienceMultiplier: 1.2 },
  'Senior Developer': { baseSalary: 25, experienceMultiplier: 1.4 },
  'Tech Lead': { baseSalary: 32, experienceMultiplier: 1.6 },
  'Manager': { baseSalary: 35, experienceMultiplier: 1.7 },
  'Architect': { baseSalary: 40, experienceMultiplier: 1.9 },
  'Student': { baseSalary: 0, experienceMultiplier: 0.8 },
};

// Education multipliers on base salary
export const EDUCATION_MULTIPLIERS: Record<string, number> = {
  'High School': 0.8,
  "Bachelor's Degree": 1.0,
  "Master's Degree": 1.15,
  'PhD': 1.25,
  'Self-Taught': 0.9,
  'Bootcamp': 0.95,
};

// Learning pace multipliers (affects timeline)
export const LEARNING_PACE_MULTIPLIERS: Record<string, { timeMultiplier: number; completionBonus: number }> = {
  'Slow (Part-time)': { timeMultiplier: 1.5, completionBonus: 0.05 },
  'Moderate': { timeMultiplier: 1.0, completionBonus: 0.1 },
  'Fast (Full-time)': { timeMultiplier: 0.75, completionBonus: 0.15 },
  'Intensive': { timeMultiplier: 0.5, completionBonus: 0.2 },
};

// Career path data with all metrics
export const CAREERS: Record<string, CareerData> = {
  'AI/ML Engineer': {
    baseSalary: 60,
    growthRate: 0.22,
    demandScore: 95,
    automationRisk: 5,
    jobSaturation: 20,
    layoffRisk: 10,
    demandTrend: 'Rising',
  },
  'Data Scientist': {
    baseSalary: 50,
    growthRate: 0.20,
    demandScore: 88,
    automationRisk: 15,
    jobSaturation: 35,
    layoffRisk: 15,
    demandTrend: 'Rising',
  },
  'Software Developer': {
    baseSalary: 45,
    growthRate: 0.15,
    demandScore: 82,
    automationRisk: 45,
    jobSaturation: 70,
    layoffRisk: 35,
    demandTrend: 'Stable',
  },
  'DevOps Engineer': {
    baseSalary: 55,
    growthRate: 0.18,
    demandScore: 87,
    automationRisk: 20,
    jobSaturation: 25,
    layoffRisk: 12,
    demandTrend: 'Rising',
  },
  'Cybersecurity Analyst': {
    baseSalary: 52,
    growthRate: 0.19,
    demandScore: 92,
    automationRisk: 10,
    jobSaturation: 15,
    layoffRisk: 5,
    demandTrend: 'Rising',
  },
  'Product Manager': {
    baseSalary: 48,
    growthRate: 0.17,
    demandScore: 78,
    automationRisk: 25,
    jobSaturation: 60,
    layoffRisk: 40,
    demandTrend: 'Stable',
  },
  'Cloud Architect': {
    baseSalary: 65,
    growthRate: 0.20,
    demandScore: 90,
    automationRisk: 15,
    jobSaturation: 30,
    layoffRisk: 20,
    demandTrend: 'Rising',
  },
  'Full Stack Developer': {
    baseSalary: 42,
    growthRate: 0.14,
    demandScore: 80,
    automationRisk: 50,
    jobSaturation: 65,
    layoffRisk: 38,
    demandTrend: 'Stable',
  },
  'Graphic Designer': {
    baseSalary: 28,
    growthRate: 0.08,
    demandScore: 65,
    automationRisk: 70,
    jobSaturation: 75,
    layoffRisk: 50,
    demandTrend: 'Declining',
  },
  'Content Writer': {
    baseSalary: 20,
    growthRate: 0.06,
    demandScore: 50,
    automationRisk: 85,
    jobSaturation: 80,
    layoffRisk: 60,
    demandTrend: 'Declining',
  },
  'Mobile App Developer': {
    baseSalary: 40,
    growthRate: 0.13,
    demandScore: 75,
    automationRisk: 35,
    jobSaturation: 50,
    layoffRisk: 30,
    demandTrend: 'Stable',
  },
  'UX/UI Designer': {
    baseSalary: 35,
    growthRate: 0.12,
    demandScore: 72,
    automationRisk: 40,
    jobSaturation: 55,
    layoffRisk: 35,
    demandTrend: 'Stable',
  },
  'MBA': {
    baseSalary: 48,
    growthRate: 0.16,
    demandScore: 60,
    automationRisk: 20,
    jobSaturation: 60,
    layoffRisk: 45,
    demandTrend: 'Stable',
  },
  'Blockchain Developer': {
    baseSalary: 52,
    growthRate: 0.18,
    demandScore: 45,
    automationRisk: 25,
    jobSaturation: 40,
    layoffRisk: 55,
    demandTrend: 'Declining',
  },
  'Data Engineer': {
    baseSalary: 55,
    growthRate: 0.19,
    demandScore: 85,
    automationRisk: 18,
    jobSaturation: 33,
    layoffRisk: 18,
    demandTrend: 'Rising',
  },
};

// Career comparison options for decision engine
export const DECISION_ENGINE_CAREERS: Record<string, CareerData> = {
  MBA: CAREERS['MBA'],
  'Data Science': CAREERS['Data Scientist'],
  'Software Development': CAREERS['Software Developer'],
  'AI/ML Engineering': CAREERS['AI/ML Engineer'],
  'Product Management': CAREERS['Product Manager'],
  'Cloud Computing': CAREERS['Cloud Architect'],
  'Cybersecurity': CAREERS['Cybersecurity Analyst'],
  'UX Design': CAREERS['UX/UI Designer'],
  'Blockchain': CAREERS['Blockchain Developer'],
  'Digital Marketing': {
    baseSalary: 22,
    growthRate: 0.08,
    demandScore: 70,
    automationRisk: 65,
    jobSaturation: 70,
    layoffRisk: 55,
    demandTrend: 'Stable',
  },
  'DevOps': CAREERS['DevOps Engineer'],
  'Full Stack Development': CAREERS['Full Stack Developer'],
};

// Experience level to years mapping
export const EXPERIENCE_LEVELS: Record<string, number> = {
  '0-1 years': 0.5,
  '1-3 years': 2,
  '3-5 years': 4,
  '5-8 years': 6.5,
  '8-12 years': 10,
  '12+ years': 15,
};

// Career scenarios for simulation
export const CAREER_SCENARIOS = {
  traditional: {
    name: 'Traditional Path',
    roles: ['Junior Developer', 'Mid Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'],
    riskLevel: 'Low' as const,
    riskColor: 'text-emerald-500',
    probabilityBase: 0.70,
  },
  aiMl: {
    name: 'AI/ML Path',
    roles: ['AI Engineer', 'Senior AI Engineer', 'AI Architect', 'VP of AI'],
    riskLevel: 'Medium' as const,
    riskColor: 'text-amber-500',
    probabilityBase: 0.45,
  },
  startup: {
    name: 'Startup Path',
    roles: ['Developer', 'Co-Founder', 'Startup CEO'],
    riskLevel: 'High' as const,
    riskColor: 'text-rose-500',
    probabilityBase: 0.15,
  },
};

// Goal impact on scenarios
export const GOAL_SCENARIO_IMPACT: Record<string, keyof typeof CAREER_SCENARIOS> = {
  'Software Engineer': 'traditional',
  'AI/ML Engineer': 'aiMl',
  'Data Scientist': 'aiMl',
  'Product Manager': 'traditional',
  'Tech Lead': 'traditional',
  'CTO': 'startup',
  'Startup Founder': 'startup',
  'Freelancer': 'startup',
};
