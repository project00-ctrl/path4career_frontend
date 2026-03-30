/**
 * Centralized Career Prediction Engine
 * Powers all predictive features across the platform
 */

import {
  SKILLS,
  EDUCATION_MULTIPLIERS,
  LEARNING_PACE_MULTIPLIERS,
  CAREERS,
  DECISION_ENGINE_CAREERS,
  CURRENT_ROLES,
  EXPERIENCE_LEVELS,
  CAREER_SCENARIOS,
  GOAL_SCENARIO_IMPACT,
} from './careerData';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface CareerScenario {
  name: string;
  path: string[];
  salary: string;
  salaryRange: string;
  risk: 'Low' | 'Medium' | 'High';
  riskColor: string;
  probability: number;
  timeline: string;
  highlights: string[];
}

export interface SimulationResult {
  scenarios: CareerScenario[];
  recommendation: string;
  primaryScenarioIndex: number;
}

export interface SalaryPrediction {
  baseSalary: number;
  predictedSalary: number;
  salaryRange: string;
  year: number;
  growthPercent: number;
  careerMoves: Array<{ year: number; role: string; company: string }>;
  skillImpact: Array<{ skill: string; salaryBoost: string; demandBoost: string }>;
  industryShifts: string[];
  recommendation: string;
}

export interface CareerComparison {
  name: string;
  salaryGrowth: number;
  demand: number;
  skillMatch: number;
  totalScore: number;
  pros: string[];
  cons: string[];
  timeToLearn: string;
}

export interface RiskAnalysis {
  career: string;
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  score: number;
  saturation: number;
  automation: number;
  layoffRisk: number;
  demandTrend: 'Rising' | 'Stable' | 'Declining';
  recommendation: string;
  factors: string[];
}

export interface CareerTimeline {
  year: number;
  role: string;
  company: string;
  salary: number;
}

// ============================================
// CORE ENGINE FUNCTIONS
// ============================================

/**
 * Simulate career paths based on user inputs
 */
export function simulateCareer(inputs: {
  skills: string[];
  education: string;
  goal: string;
  speed: string;
}): SimulationResult {
  const { skills, education, goal, speed } = inputs;

  // Calculate skill match score (0-100)
  const skillMatchScore = Math.min((skills.length / 10) * 100, 100);

  // Apply education multiplier
  const educationMultiplier = EDUCATION_MULTIPLIERS[education] || 1.0;

  // Apply learning pace multiplier
  const speedData = LEARNING_PACE_MULTIPLIERS[speed] || { timeMultiplier: 1.0, completionBonus: 0.1 };
  const completionBoost = speedData.completionBonus;

  // Determine primary scenario based on goal
  const scenarioKey = GOAL_SCENARIO_IMPACT[goal] || 'traditional';

  // Generate three scenarios
  const scenarios: CareerScenario[] = [
    generateScenario('traditional', skillMatchScore, educationMultiplier, completionBoost),
    generateScenario('aiMl', skillMatchScore, educationMultiplier, completionBoost),
    generateScenario('startup', skillMatchScore, educationMultiplier, completionBoost),
  ];

  // Reorder so primary scenario is first
  const primaryIndex = Object.keys(CAREER_SCENARIOS).indexOf(scenarioKey);
  if (primaryIndex > 0) {
    [scenarios[0], scenarios[primaryIndex]] = [scenarios[primaryIndex], scenarios[0]];
  }

  // Generate recommendation
  const recommendation = generateSimulationRecommendation(goal, skills);

  return {
    scenarios,
    recommendation,
    primaryScenarioIndex: 0,
  };
}

/**
 * Predict salary for target year based on inputs
 */
export function predictSalary(inputs: {
  currentRole: string;
  experience: string;
  skills: string[];
  targetYear: number;
}): SalaryPrediction {
  const { currentRole, experience, skills, targetYear } = inputs;
  const currentYear = 2026;
  const yearsToProject = targetYear - currentYear;

  // Get base salary from current role
  const roleData = CURRENT_ROLES[currentRole];
  if (!roleData) {
    throw new Error(`Role ${currentRole} not found`);
  }

  const baseSalary = roleData.baseSalary * roleData.experienceMultiplier;

  // Calculate skill multiplier
  const skillMultiplier = skills.reduce((acc, skill) => {
    const skillData = SKILLS[skill];
    return acc + (skillData ? skillData.salaryBoost : 0);
  }, 1);

  // Get experience years
  const experienceYears = EXPERIENCE_LEVELS[experience] || 2;

  // Experience growth factor (2% per year)
  const experienceGrowthFactor = 1 + experienceYears * 0.02;

  // Calculate projected salary
  const predictedSalary = Math.round(baseSalary * skillMultiplier * experienceGrowthFactor * (1 + yearsToProject * 0.15));

  // Salary range (±₹15L variance)
  const salaryRange = `₹${Math.max(predictedSalary - 15, 0)}L - ₹${predictedSalary + 15}L`;

  // Growth percentage
  const growthPercent = Math.round(((predictedSalary - baseSalary) / baseSalary) * 100);

  // Generate career timeline
  const careerMoves = generateCareerTimeline(currentRole, experience, skills, targetYear);

  // Skill impact analysis
  const skillImpact = skills.slice(0, 4).map(skill => {
    const skillData = SKILLS[skill];
    if (!skillData) return null;
    return {
      skill,
      salaryBoost: `+${Math.round(skillData.salaryBoost * 100)}%`,
      demandBoost: `+${Math.round(skillData.demandBoost * 100)}%`,
    };
  }).filter(Boolean) as Array<{ skill: string; salaryBoost: string; demandBoost: string }>;

  // Industry shifts
  const industryShifts = [
    'AI-first companies will dominate by 2028',
    'Remote work enabling global talent access',
    'Green tech creating new career verticals',
    'No-code reducing entry-level dev demand',
  ];

  // Recommendation
  const aiSelected = skills.some(s => s.includes('Artificial') || s.includes('Machine'));
  const cloudSelected = skills.some(s => s.includes('Cloud'));

  let recommendation = '';
  if (aiSelected && cloudSelected) {
    recommendation = `Your combination of AI + Cloud skills positions you in the top 5% of tech talent. Expected salary: ₹${predictedSalary - 15}L - ₹${predictedSalary + 15}L by ${targetYear}.`;
  } else if (aiSelected) {
    recommendation = 'AI skills alone will drive significant growth. Adding cloud computing would maximize your trajectory.';
  } else if (cloudSelected) {
    recommendation = 'Cloud expertise is solid. Consider adding AI/ML skills to unlock the highest salary brackets.';
  } else {
    recommendation = 'Consider adding AI and Cloud Computing skills to significantly boost your career trajectory.';
  }

  return {
    baseSalary,
    predictedSalary,
    salaryRange,
    year: targetYear,
    growthPercent,
    careerMoves,
    skillImpact,
    industryShifts,
    recommendation,
  };
}

/**
 * Compare and rank multiple careers
 */
export function compareCareers(careerNames: string[]): CareerComparison[] {
  const comparisons: CareerComparison[] = [];

  for (const name of careerNames) {
    const careerData = DECISION_ENGINE_CAREERS[name];
    if (!careerData) continue;

    // Weighted scoring formula
    const salaryGrowth = careerData.growthRate * 100;
    const demandScore = careerData.demandScore;
    const skillMatch = Math.round(100 - careerData.automationRisk);
    const riskInverse = 100 - careerData.automationRisk;

    const totalScore = (salaryGrowth * 0.35) + (demandScore * 0.30) + (skillMatch * 0.25) + (riskInverse * 0.1);

    // Generate pros and cons
    const pros = generateCareerPros(careerData);
    const cons = generateCareerCons(careerData);

    // Estimate time to learn
    const timeToLearn = estimateTimeToLearn(name);

    comparisons.push({
      name,
      salaryGrowth: Math.round(salaryGrowth),
      demand: demandScore,
      skillMatch: Math.round(skillMatch),
      totalScore: Math.round(totalScore),
      pros,
      cons,
      timeToLearn,
    });
  }

  comparisons.sort((a, b) => b.totalScore - a.totalScore);
  return comparisons;
}

/**
 * Analyze risk for a specific career
 */
export function analyzeRisk(careerName: string): RiskAnalysis {
  const careerData = CAREERS[careerName];
  if (!careerData) {
    throw new Error(`Career ${careerName} not found`);
  }

  // Risk score calculation
  const riskScore =
    (careerData.jobSaturation * 0.4) +
    (careerData.automationRisk * 0.35) +
    (careerData.layoffRisk * 0.25);

  // Map to risk level
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  if (riskScore <= 25) riskLevel = 'Low';
  else if (riskScore <= 50) riskLevel = 'Medium';
  else if (riskScore <= 75) riskLevel = 'High';
  else riskLevel = 'Critical';

  // Generate factors
  const factors = generateRiskFactors(careerData);

  // Generate recommendation
  const recommendation = generateRiskRecommendation(careerName, riskLevel);

  return {
    career: careerName,
    overallRisk: riskLevel,
    score: Math.round(riskScore),
    saturation: careerData.jobSaturation,
    automation: careerData.automationRisk,
    layoffRisk: careerData.layoffRisk,
    demandTrend: careerData.demandTrend,
    recommendation,
    factors,
  };
}

/**
 * Generate career timeline based on inputs
 */
export function generateCareerTimeline(
  currentRole: string,
  _experience: string,
  skills: string[],
  targetYear: number
): CareerTimeline[] {
  const currentYear = 2026;
  const years = targetYear - currentYear;
  const timeline: CareerTimeline[] = [];

  // Determine career progression path
  const aiSelected = skills.some(s => s.includes('Artificial') || s.includes('Machine'));
  const cloudSelected = skills.some(s => s.includes('Cloud'));

  const roleData = CURRENT_ROLES[currentRole];
  if (!roleData) return [];

  let baseSalary = roleData.baseSalary * roleData.experienceMultiplier;
  const skillMultiplier = skills.length * 0.05;
  const salaryGrowthPerYear = Math.max(0.08, 0.08 + skillMultiplier);

  // Current year
  timeline.push({
    year: currentYear,
    role: currentRole,
    company: 'Current',
    salary: Math.round(baseSalary),
  });

  // Project forward in 2-3 year intervals
  const interval = Math.ceil(years / 3);
  for (let i = 1; i <= 3 && currentYear + i * interval <= targetYear; i++) {
    const projectedYear = currentYear + i * interval;
    let role = currentRole;
    let company = 'Growth Company';

    if (i === 1) {
      role = aiSelected ? 'AI Engineer' : 'Senior Developer';
    } else if (i === 2) {
      role = aiSelected ? 'AI Architect' : cloudSelected ? 'Cloud Architect' : 'Tech Lead';
      company = 'Tech Giant';
    } else {
      role = aiSelected && cloudSelected ? 'VP Engineering' : 'Director';
      company = 'FAANG / Startup';
    }

    baseSalary *= 1 + salaryGrowthPerYear;

    timeline.push({
      year: projectedYear,
      role,
      company,
      salary: Math.round(baseSalary),
    });
  }

  // Add target year if not already included
  if (timeline[timeline.length - 1].year !== targetYear) {
    baseSalary *= 1 + salaryGrowthPerYear;
    timeline.push({
      year: targetYear,
      role: timeline[timeline.length - 1].role,
      company: timeline[timeline.length - 1].company,
      salary: Math.round(baseSalary),
    });
  }

  return timeline;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateScenario(
  scenarioKey: keyof typeof CAREER_SCENARIOS,
  skillMatchScore: number,
  educationMultiplier: number,
  completionBoost: number
): CareerScenario {
  const scenario = CAREER_SCENARIOS[scenarioKey];

  // Adjust probability based on skill match and education
  const adjustedProbability = Math.round(
    scenario.probabilityBase * (1 + skillMatchScore / 200) * educationMultiplier * (1 + completionBoost)
  );

  // Calculate salary range
  const baseSalaryMap = {
    traditional: '₹45L - ₹65L',
    aiMl: '₹75L - ₹1.2Cr',
    startup: '₹1Cr - ₹10Cr+',
  };

  // Calculate timeline
  const baseTimelineMap = {
    traditional: '8-10 years',
    aiMl: '7-9 years',
    startup: '5-10 years',
  };

  const highlights = [
    scenarioKey === 'traditional' ? 'Stable career growth' : scenarioKey === 'aiMl' ? 'Cutting-edge technology' : 'Unlimited upside',
    scenarioKey === 'traditional' ? 'Strong demand' : scenarioKey === 'aiMl' ? 'High demand globally' : 'High failure rate',
    scenarioKey === 'traditional' ? 'Good work-life balance' : scenarioKey === 'aiMl' ? 'Requires continuous learning' : 'Requires diverse skills',
  ];

  return {
    name: scenario.name,
    path: scenario.roles,
    salary: baseSalaryMap[scenarioKey],
    salaryRange: baseSalaryMap[scenarioKey],
    risk: scenario.riskLevel,
    riskColor: scenario.riskColor,
    probability: Math.min(adjustedProbability, 100),
    timeline: baseTimelineMap[scenarioKey],
    highlights,
  };
}

function generateSimulationRecommendation(goal: string, _skills: string[]): string {
  if (goal.includes('AI') || goal.includes('ML')) {
    return 'The AI/ML path offers excellent growth potential. Focus on Python, cloud computing, and deep learning frameworks.';
  } else if (goal.includes('Manager') || goal.includes('Lead')) {
    return 'Leadership roles require both technical depth and soft skills. Consider management certifications alongside technical skills.';
  } else if (goal.includes('Startup')) {
    return 'Startup founders need diverse skills. Build a strong technical foundation while developing business acumen.';
  }
  return 'Based on your profile, the traditional path offers stable growth. Continue building your technical skills.';
}

function generateCareerPros(careerData: any): string[] {
  const pros: string[] = [];

  if (careerData.growthRate > 0.18) pros.push('Strong salary growth potential');
  if (careerData.demandScore > 80) pros.push('High market demand');
  if (careerData.automationRisk < 30) pros.push('Protected from automation');
  if (careerData.demandTrend === 'Rising') pros.push('Growing industry');

  if (pros.length === 0) {
    pros.push('Diverse opportunities in the field');
  }

  return pros.slice(0, 3);
}

function generateCareerCons(careerData: any): string[] {
  const cons: string[] = [];

  if (careerData.jobSaturation > 60) cons.push('High market saturation');
  if (careerData.automationRisk > 40) cons.push('Subject to automation');
  if (careerData.layoffRisk > 35) cons.push('Moderate layoff risk');
  if (careerData.demandTrend === 'Declining') cons.push('Declining industry trends');

  if (cons.length === 0) {
    cons.push('Requires continuous learning to stay relevant');
  }

  return cons.slice(0, 3);
}

function estimateTimeToLearn(careerName: string): string {
  const timeMap: Record<string, string> = {
    'MBA': '2 years',
    'Data Science': '8 months',
    'Software Development': '6 months',
    'AI/ML Engineering': '12 months',
    'Product Management': '6 months',
    'Cloud Computing': '5 months',
    'Cybersecurity': '10 months',
    'UX Design': '4 months',
    'Blockchain': '8 months',
    'Digital Marketing': '3 months',
    'DevOps': '7 months',
    'Full Stack Development': '8 months',
  };

  return timeMap[careerName] || '6 months';
}

function generateRiskFactors(careerData: any): string[] {
  const factors: string[] = [];

  if (careerData.demandTrend === 'Rising') {
    factors.push('Massive industry demand');
  } else if (careerData.demandTrend === 'Declining') {
    factors.push('Declining market demand');
  } else {
    factors.push('Stable market conditions');
  }

  if (careerData.automationRisk < 20) {
    factors.push('Low supply of talent');
  } else if (careerData.automationRisk > 60) {
    factors.push('AI tools impact growing');
  }

  if (careerData.jobSaturation < 30) {
    factors.push('Niche specialization');
  } else if (careerData.jobSaturation > 70) {
    factors.push('Over-saturated market');
  }

  return factors.slice(0, 3);
}

function generateRiskRecommendation(_careerName: string, riskLevel: string): string {
  if (riskLevel === 'Low') {
    return `Excellent career choice. Focus on specialization and continuous learning to maintain competitiveness.`;
  } else if (riskLevel === 'Medium') {
    return `Good path with some risk. Diversify skills and stay updated with industry trends.`;
  } else if (riskLevel === 'High') {
    return `Consider upskilling in emerging areas or combining with complementary skills.`;
  }
  return `High risk field. Strongly consider pivoting or pivoting to avoid disruption.`;
}
