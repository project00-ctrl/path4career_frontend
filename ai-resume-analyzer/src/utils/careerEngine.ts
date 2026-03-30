import {
  type RiskAnalysis,
  type RiskDimension,
  type RiskRating,
  type SimulationResult,
  type SimulationRole,
  type CareerComparison,
  type CareerOption,
  type ReputationResult,
  type DigitalTwinProfile,
  type SkillGrowthItem,
  type CareerShieldResult,
  type CareerShieldAlert,
  type SkillProtectionPlan,
} from './types';

import {
  AI_RESISTANT_SKILLS,
  AI_VULNERABLE_SKILLS,
  FUTURE_PROOF_SKILLS,
  GENERAL_TECH_SKILLS,
} from './analyzer';

// ── Helpers ──────────────────────────────────────────────────────────

function matchCount(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw)).length;
}

function matchedKeywords(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw));
}

function toRating(score: number): RiskRating {
  if (score <= 3.3) return 'low';
  if (score <= 6.6) return 'medium';
  return 'high';
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// ── Role Database (Heuristic Data) ──────────────────────────────────

interface RoleData {
  salary: { min: number; max: number; median: number };
  demandTrend: 'rising' | 'stable' | 'declining';
  demandScore: number;
  growthScore: number;
  stabilityScore: number;
  requiredSkills: string[];
  learningBase: number; // base months for a beginner
  difficulty: 'easy' | 'moderate' | 'challenging';
}

const ROLE_DATABASE: Record<string, RoleData> = {
  'AI/ML Engineer': {
    salary: { min: 110000, max: 220000, median: 160000 },
    demandTrend: 'rising', demandScore: 9.5, growthScore: 9, stabilityScore: 7,
    requiredSkills: ['machine learning', 'deep learning', 'python', 'tensorflow', 'pytorch', 'nlp', 'neural network', 'artificial intelligence', 'data', 'statistics', 'linear algebra'],
    learningBase: 18, difficulty: 'challenging',
  },
  'Cloud Architect': {
    salary: { min: 130000, max: 200000, median: 165000 },
    demandTrend: 'rising', demandScore: 9, growthScore: 8, stabilityScore: 8,
    requiredSkills: ['aws', 'azure', 'gcp', 'cloud', 'terraform', 'kubernetes', 'docker', 'serverless', 'networking', 'security', 'architecture'],
    learningBase: 14, difficulty: 'moderate',
  },
  'DevOps Engineer': {
    salary: { min: 100000, max: 175000, median: 135000 },
    demandTrend: 'rising', demandScore: 8.5, growthScore: 8, stabilityScore: 8,
    requiredSkills: ['docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform', 'aws', 'linux', 'monitoring', 'automation', 'git'],
    learningBase: 10, difficulty: 'moderate',
  },
  'Data Engineer': {
    salary: { min: 105000, max: 180000, median: 140000 },
    demandTrend: 'rising', demandScore: 8.5, growthScore: 8, stabilityScore: 8,
    requiredSkills: ['python', 'sql', 'apache spark', 'kafka', 'airflow', 'etl', 'data pipeline', 'data warehouse', 'data lake', 'cloud'],
    learningBase: 12, difficulty: 'moderate',
  },
  'Full-Stack Developer': {
    salary: { min: 85000, max: 160000, median: 115000 },
    demandTrend: 'stable', demandScore: 7, growthScore: 6, stabilityScore: 7,
    requiredSkills: ['react', 'node.js', 'javascript', 'typescript', 'html', 'css', 'api', 'database', 'git', 'rest'],
    learningBase: 8, difficulty: 'easy',
  },
  'Cybersecurity Analyst': {
    salary: { min: 90000, max: 165000, median: 120000 },
    demandTrend: 'rising', demandScore: 9, growthScore: 8.5, stabilityScore: 9,
    requiredSkills: ['cybersecurity', 'security', 'penetration testing', 'siem', 'firewall', 'compliance', 'networking', 'linux', 'threat', 'vulnerability'],
    learningBase: 12, difficulty: 'moderate',
  },
  'Product Manager': {
    salary: { min: 100000, max: 190000, median: 140000 },
    demandTrend: 'stable', demandScore: 7, growthScore: 7, stabilityScore: 8,
    requiredSkills: ['product management', 'roadmap', 'stakeholder', 'agile', 'user research', 'analytics', 'strategy', 'requirements', 'business'],
    learningBase: 10, difficulty: 'moderate',
  },
  'Site Reliability Engineer': {
    salary: { min: 120000, max: 200000, median: 155000 },
    demandTrend: 'rising', demandScore: 8, growthScore: 8, stabilityScore: 8,
    requiredSkills: ['sre', 'monitoring', 'kubernetes', 'docker', 'linux', 'automation', 'python', 'prometheus', 'grafana', 'incident'],
    learningBase: 12, difficulty: 'moderate',
  },
  'Blockchain Developer': {
    salary: { min: 100000, max: 200000, median: 145000 },
    demandTrend: 'stable', demandScore: 5, growthScore: 6, stabilityScore: 5,
    requiredSkills: ['blockchain', 'solidity', 'ethereum', 'smart contracts', 'web3', 'cryptography', 'javascript', 'defi'],
    learningBase: 14, difficulty: 'challenging',
  },
  'Mobile App Developer': {
    salary: { min: 85000, max: 160000, median: 115000 },
    demandTrend: 'stable', demandScore: 6.5, growthScore: 6, stabilityScore: 7,
    requiredSkills: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'mobile', 'javascript', 'api'],
    learningBase: 8, difficulty: 'easy',
  },
  'Solutions Architect': {
    salary: { min: 130000, max: 210000, median: 170000 },
    demandTrend: 'rising', demandScore: 8, growthScore: 8, stabilityScore: 9,
    requiredSkills: ['architecture', 'cloud', 'aws', 'design patterns', 'microservices', 'system design', 'api', 'security', 'stakeholder'],
    learningBase: 16, difficulty: 'challenging',
  },
  'Data Scientist': {
    salary: { min: 100000, max: 185000, median: 140000 },
    demandTrend: 'rising', demandScore: 8, growthScore: 7.5, stabilityScore: 7,
    requiredSkills: ['python', 'machine learning', 'statistics', 'sql', 'data visualization', 'r', 'pandas', 'scikit-learn', 'deep learning'],
    learningBase: 14, difficulty: 'challenging',
  },
  'Tech Lead': {
    salary: { min: 130000, max: 200000, median: 165000 },
    demandTrend: 'stable', demandScore: 7.5, growthScore: 7, stabilityScore: 8,
    requiredSkills: ['leadership', 'mentoring', 'system design', 'architecture', 'code review', 'agile', 'cross-functional', 'backend', 'frontend'],
    learningBase: 12, difficulty: 'moderate',
  },
  'Engineering Manager': {
    salary: { min: 140000, max: 220000, median: 175000 },
    demandTrend: 'stable', demandScore: 7, growthScore: 7, stabilityScore: 9,
    requiredSkills: ['engineering manager', 'leadership', 'mentoring', 'hiring', 'agile', 'stakeholder management', 'strategy', 'team building'],
    learningBase: 14, difficulty: 'moderate',
  },
  'SRE': {
    salary: { min: 120000, max: 200000, median: 155000 },
    demandTrend: 'rising', demandScore: 8, growthScore: 8, stabilityScore: 8,
    requiredSkills: ['sre', 'monitoring', 'kubernetes', 'docker', 'linux', 'automation', 'python', 'prometheus', 'grafana', 'incident'],
    learningBase: 12, difficulty: 'moderate',
  },
};

// ── 1. Career Shield ────────────────────────────────────────────────

export function computeCareerShield(text: string, overallScore: number): CareerShieldResult {
  const lower = text.toLowerCase();
  const alerts: CareerShieldAlert[] = [];
  let id = 0;
  const now = new Date().toLocaleTimeString();

  // Detect automation risk alerts
  const vulnCategories = Object.entries(AI_VULNERABLE_SKILLS);
  for (const [cat, keywords] of vulnCategories) {
    const found = matchedKeywords(text, keywords);
    if (found.length > 0) {
      alerts.push({
        id: `alert-${id++}`,
        type: 'warning',
        title: `Automation Risk: ${cat}`,
        message: `Skills like "${found.slice(0, 2).join(', ')}" are increasingly automated by AI tools.`,
        timestamp: now,
      });
    }
  }

  // Check for missing future-proof skills
  const futureCategories = Object.keys(FUTURE_PROOF_SKILLS);
  const missingFuture: string[] = [];
  for (const cat of futureCategories) {
    const keywords = FUTURE_PROOF_SKILLS[cat];
    if (matchCount(text, keywords) === 0) {
      missingFuture.push(cat);
    }
  }
  if (missingFuture.length > 3) {
    alerts.push({
      id: `alert-${id++}`,
      type: 'danger',
      title: 'Skill Gap Alert',
      message: `You're missing ${missingFuture.length} future-proof skill areas: ${missingFuture.slice(0, 3).join(', ')}...`,
      timestamp: now,
    });
  }

  // Low score alert
  if (overallScore < 4) {
    alerts.push({
      id: `alert-${id++}`,
      type: 'danger',
      title: 'High Career Risk',
      message: 'Your career safety score is critically low. Immediate reskilling is recommended.',
      timestamp: now,
    });
  } else if (overallScore < 7) {
    alerts.push({
      id: `alert-${id++}`,
      type: 'info',
      title: 'Moderate Career Risk',
      message: 'Your profile has room for improvement. Consider adding AI and cloud skills to strengthen your position.',
      timestamp: now,
    });
  } else {
    alerts.push({
      id: `alert-${id++}`,
      type: 'success',
      title: 'Career Shield Active',
      message: 'Your profile shows strong AI resilience. Keep upgrading to stay ahead!',
      timestamp: now,
    });
  }

  // Layoff risk
  if (!lower.includes('leadership') && !lower.includes('architect') && !lower.includes('manager') && !lower.includes('lead')) {
    alerts.push({
      id: `alert-${id++}`,
      type: 'info',
      title: 'Layoff Resilience',
      message: 'Adding leadership or architecture skills increases your layoff resilience significantly.',
      timestamp: now,
    });
  }

  // Build protection plan
  const urgentSkills: SkillProtectionPlan['urgentSkills'] = [];
  if (missingFuture.includes('AI / ML')) {
    urgentSkills.push({ name: 'AI & Machine Learning', reason: 'Core future-proof skill with highest market demand', priority: 'critical' });
  }
  if (missingFuture.includes('Cloud')) {
    urgentSkills.push({ name: 'Cloud Computing (AWS/Azure/GCP)', reason: 'Essential infrastructure skill for modern roles', priority: 'critical' });
  }
  if (missingFuture.includes('DevOps')) {
    urgentSkills.push({ name: 'DevOps & CI/CD', reason: 'Automation and deployment are standard expectations', priority: 'high' });
  }
  if (missingFuture.includes('Cybersecurity')) {
    urgentSkills.push({ name: 'Cybersecurity Basics', reason: 'Growing threat landscape drives demand', priority: 'high' });
  }
  if (missingFuture.includes('Data Engineering')) {
    urgentSkills.push({ name: 'Data Engineering', reason: 'Data-driven decision making is everywhere', priority: 'medium' });
  }

  const resistantCats = Object.keys(AI_RESISTANT_SKILLS);
  for (const cat of resistantCats) {
    if (matchCount(text, AI_RESISTANT_SKILLS[cat]) === 0) {
      urgentSkills.push({ name: cat, reason: `AI-resistant skill gap — ${cat} provides strong job security`, priority: 'medium' });
    }
  }

  const timeline: SkillProtectionPlan['timeline'] = [];
  const critical = urgentSkills.filter((s) => s.priority === 'critical');
  const high = urgentSkills.filter((s) => s.priority === 'high');
  const medium = urgentSkills.filter((s) => s.priority === 'medium');

  if (critical.length > 0) {
    timeline.push({ phase: 'Phase 1: Immediate (0-3 months)', duration: '3 months', skills: critical.map((s) => s.name) });
  }
  if (high.length > 0) {
    timeline.push({ phase: 'Phase 2: Short-term (3-6 months)', duration: '3 months', skills: high.map((s) => s.name) });
  }
  if (medium.length > 0) {
    timeline.push({ phase: 'Phase 3: Medium-term (6-12 months)', duration: '6 months', skills: medium.map((s) => s.name).slice(0, 4) });
  }

  const protectionPlan: SkillProtectionPlan = {
    urgentSkills: urgentSkills.slice(0, 8),
    timeline,
    estimatedTimeMonths: critical.length * 3 + high.length * 2 + medium.length * 1,
  };

  return {
    safetyScore: overallScore,
    alerts,
    protectionPlan,
    riskSummary: overallScore >= 7
      ? 'Your career is well-shielded against AI disruption.'
      : overallScore >= 4
      ? 'Moderate protection — targeted upskilling recommended.'
      : 'Critical exposure — immediate action required to protect your career.',
  };
}

// ── 2. Risk Analyzer ────────────────────────────────────────────────

export function computeRiskAnalysis(text: string): RiskAnalysis {
  const lower = text.toLowerCase();

  // Automation Risk
  let autoScore = 0;
  const autoFactors: string[] = [];
  const vulnTotal = Object.values(AI_VULNERABLE_SKILLS).flat();
  const vulnMatched = matchedKeywords(text, vulnTotal);
  autoScore = clamp((vulnMatched.length / 5) * 10, 0, 10);
  if (vulnMatched.length > 0) autoFactors.push(`${vulnMatched.length} automatable skills detected`);
  if (!lower.includes('ai') && !lower.includes('machine learning')) {
    autoScore = clamp(autoScore + 2, 0, 10);
    autoFactors.push('No AI/ML skills to leverage automation tools');
  }
  if (lower.includes('data entry') || lower.includes('manual')) {
    autoFactors.push('Manual/repetitive tasks are prime automation targets');
  }
  if (autoFactors.length === 0) autoFactors.push('Low exposure to automatable tasks');

  const automationRisk: RiskDimension = {
    level: toRating(autoScore),
    score: Math.round(autoScore * 10) / 10,
    factors: autoFactors,
    description: autoScore > 6.6
      ? 'High automation exposure — many of your current skills can be replaced by AI tools.'
      : autoScore > 3.3
      ? 'Moderate automation risk — some tasks may become automated.'
      : 'Low automation risk — your skill set is resilient to automation.',
  };

  // Industry Decline
  let indScore = 5; // neutral baseline
  const indFactors: string[] = [];
  const risingIndustries = ['cloud', 'ai', 'machine learning', 'cybersecurity', 'data', 'devops', 'sre'];
  const decliningSignals = ['wordpress', 'legacy', 'cobol', 'flash', 'basic html', 'jquery'];
  const risingCount = matchCount(text, risingIndustries);
  const decliningCount = matchCount(text, decliningSignals);
  indScore = clamp(5 - risingCount * 1.5 + decliningCount * 2.5, 0, 10);
  if (risingCount > 0) indFactors.push(`${risingCount} growth-industry skills detected`);
  if (decliningCount > 0) indFactors.push(`${decliningCount} declining-technology signals`);
  if (indFactors.length === 0) indFactors.push('Industry alignment appears neutral');

  const industryDecline: RiskDimension = {
    level: toRating(indScore),
    score: Math.round(indScore * 10) / 10,
    factors: indFactors,
    description: indScore > 6.6
      ? 'Your skills align with declining or saturated markets.'
      : indScore > 3.3
      ? 'Mixed industry signals — some skills are in growing sectors.'
      : 'Strong alignment with high-growth industries.',
  };

  // Skill Redundancy
  let redScore = 0;
  const redFactors: string[] = [];
  const allSkillSets = { ...GENERAL_TECH_SKILLS, ...FUTURE_PROOF_SKILLS };
  const categoryMatches = Object.entries(allSkillSets).filter(
    ([, kws]) => matchCount(text, kws) > 0
  ).length;
  const totalCategories = Object.keys(allSkillSets).length;
  const diversity = categoryMatches / totalCategories;
  redScore = clamp((1 - diversity) * 10, 0, 10);
  if (diversity < 0.3) redFactors.push('Narrow skill focus — high redundancy risk');
  else if (diversity < 0.5) redFactors.push('Moderate skill diversity');
  else redFactors.push('Good skill diversity across categories');
  redFactors.push(`${categoryMatches}/${totalCategories} skill categories covered`);

  const skillRedundancy: RiskDimension = {
    level: toRating(redScore),
    score: Math.round(redScore * 10) / 10,
    factors: redFactors,
    description: redScore > 6.6
      ? 'High skill concentration — diversify to reduce risk.'
      : redScore > 3.3
      ? 'Moderate diversity — consider broadening your skills.'
      : 'Well-diversified skill portfolio.',
  };

  // Geographic / Job Opportunity Risk
  let geoScore = 5;
  const geoFactors: string[] = [];
  const remoteSkills = ['cloud', 'devops', 'react', 'python', 'node.js', 'docker', 'kubernetes', 'remote'];
  const localOnlySkills = ['hardware', 'on-site', 'physical', 'manufacturing', 'retail'];
  const remoteCount = matchCount(text, remoteSkills);
  const localCount = matchCount(text, localOnlySkills);
  geoScore = clamp(5 - remoteCount * 1.2 + localCount * 2, 0, 10);
  if (remoteCount > 3) geoFactors.push('Strong remote-friendly skill set');
  else if (remoteCount > 0) geoFactors.push('Some remote-compatible skills');
  if (localCount > 0) geoFactors.push('Some skills tied to physical locations');
  if (geoFactors.length === 0) geoFactors.push('Average geographic flexibility');

  const geographicRisk: RiskDimension = {
    level: toRating(geoScore),
    score: Math.round(geoScore * 10) / 10,
    factors: geoFactors,
    description: geoScore > 6.6
      ? 'Skills are geographically constrained — limited remote opportunities.'
      : geoScore > 3.3
      ? 'Moderate flexibility — some opportunities are location-dependent.'
      : 'Excellent geographic flexibility — strong remote job potential.',
  };

  const avgScore = (automationRisk.score + industryDecline.score + skillRedundancy.score + geographicRisk.score) / 4;

  return {
    automationRisk,
    industryDecline,
    skillRedundancy,
    geographicRisk,
    overallRisk: toRating(avgScore),
    overallScore: Math.round(avgScore * 10) / 10,
  };
}

// ── 3. Career Simulation ────────────────────────────────────────────

export function computeCareerSimulation(text: string, targetRole: SimulationRole): SimulationResult {
  const roleData = ROLE_DATABASE[targetRole] || ROLE_DATABASE['Full-Stack Developer'];

  const matched = matchedKeywords(text, roleData.requiredSkills);
  const gap = roleData.requiredSkills.filter((sk) => !matched.includes(sk));
  const matchPercent = Math.round((matched.length / roleData.requiredSkills.length) * 100);

  // Learning time decreases with skill match
  const matchFactor = 1 - (matched.length / roleData.requiredSkills.length) * 0.7;
  const learningTimeMonths = Math.max(2, Math.round(roleData.learningBase * matchFactor));

  return {
    targetRole,
    learningTimeMonths,
    salaryRange: roleData.salary,
    demandTrend: roleData.demandTrend,
    demandScore: roleData.demandScore,
    gapSkills: gap,
    matchedSkills: matched,
    matchPercent,
    difficulty: matchPercent > 60 ? 'easy' : matchPercent > 30 ? 'moderate' : 'challenging',
  };
}

// ── 4. Decision Engine ──────────────────────────────────────────────

export function computeDecisionEngine(text: string, selectedOptions: string[]): CareerComparison {
  const options: CareerOption[] = selectedOptions.map((name) => {
    const roleData = ROLE_DATABASE[name] || ROLE_DATABASE['Full-Stack Developer'];
    const matched = matchedKeywords(text, roleData.requiredSkills);
    const matchBonus = (matched.length / roleData.requiredSkills.length) * 2;

    const salary = clamp(Math.round((roleData.salary.median / 22000) * 10) / 10 + matchBonus * 0.3, 1, 10);
    const growth = clamp(roleData.growthScore + matchBonus * 0.5, 1, 10);
    const stability = clamp(roleData.stabilityScore + matchBonus * 0.3, 1, 10);
    const demand = clamp(roleData.demandScore + matchBonus * 0.2, 1, 10);
    const total = Math.round(((salary + growth + stability + demand) / 4) * 10) / 10;

    return {
      name,
      salary: Math.round(salary * 10) / 10,
      growth: Math.round(growth * 10) / 10,
      stability: Math.round(stability * 10) / 10,
      demand: Math.round(demand * 10) / 10,
      total,
    };
  });

  options.sort((a, b) => b.total - a.total);
  const best = options[0];
  const verdictDetails = [
    { category: 'Salary', winner: [...options].sort((a, b) => b.salary - a.salary)[0].name },
    { category: 'Growth', winner: [...options].sort((a, b) => b.growth - a.growth)[0].name },
    { category: 'Stability', winner: [...options].sort((a, b) => b.stability - a.stability)[0].name },
    { category: 'Market Demand', winner: [...options].sort((a, b) => b.demand - a.demand)[0].name },
  ];

  const reasoning = `${best.name} scores highest overall (${best.total}/10) with strong ${
    best.growth >= best.salary && best.growth >= best.stability
      ? 'growth potential'
      : best.salary >= best.stability
      ? 'salary prospects'
      : 'job stability'
  }. Based on your current skill set, this role offers the best alignment for career advancement.`;

  return {
    options,
    bestChoice: best.name,
    reasoning,
    verdictDetails,
  };
}

// ── 5. Reputation Score ─────────────────────────────────────────────

export function computeReputationScore(text: string): ReputationResult {
  const lower = text.toLowerCase();

  // Skills component (0-40)
  const allSkillKeywords = [
    ...Object.values(AI_RESISTANT_SKILLS).flat(),
    ...Object.values(FUTURE_PROOF_SKILLS).flat(),
    ...Object.values(GENERAL_TECH_SKILLS).flat(),
  ];
  const uniqueSkills = new Set(allSkillKeywords.filter((kw) => lower.includes(kw)));
  const skillsScore = clamp(Math.round((uniqueSkills.size / 20) * 40), 0, 40);

  // Projects component (0-25)
  let projectsScore = 0;
  const projectKeywords = ['project', 'built', 'developed', 'created', 'implemented', 'designed', 'launched', 'open-source', 'contribution', 'portfolio'];
  const projectMatches = matchCount(text, projectKeywords);
  projectsScore = clamp(Math.round((projectMatches / 6) * 25), 0, 25);

  // Certifications component (0-20)
  let certsScore = 0;
  const certKeywords = ['certification', 'certified', 'certificate', 'aws certified', 'google certified', 'microsoft certified', 'comptia', 'cka', 'ckad', 'pmp'];
  const certMatches = matchCount(text, certKeywords);
  certsScore = clamp(Math.round((certMatches / 4) * 20), 0, 20);

  // Experience component (0-15)
  let expScore = 0;
  const expKeywords = ['senior', 'lead', 'principal', 'staff', 'manager', 'director', 'architect', 'years', 'experience'];
  const expMatches = matchCount(text, expKeywords);
  expScore = clamp(Math.round((expMatches / 4) * 15), 0, 15);

  const totalScore = clamp(skillsScore + projectsScore + certsScore + expScore, 0, 100);

  let level: ReputationResult['level'];
  let nextLevel: string;
  let nextLevelAt: number;
  if (totalScore >= 85) {
    level = 'elite';
    nextLevel = 'Max Level';
    nextLevelAt = 100;
  } else if (totalScore >= 65) {
    level = 'expert';
    nextLevel = 'Elite';
    nextLevelAt = 85;
  } else if (totalScore >= 40) {
    level = 'professional';
    nextLevel = 'Expert';
    nextLevelAt = 65;
  } else {
    level = 'beginner';
    nextLevel = 'Professional';
    nextLevelAt = 40;
  }

  const progressToNext = level === 'elite' ? 100 : Math.round(((totalScore - (nextLevelAt - (level === 'beginner' ? 40 : level === 'professional' ? 25 : 20))) / (nextLevelAt - (nextLevelAt - (level === 'beginner' ? 40 : level === 'professional' ? 25 : 20)))) * 100);

  const badges: string[] = [];
  if (uniqueSkills.size > 15) badges.push('🛡️ Skill Master');
  if (projectMatches > 4) badges.push('🚀 Builder');
  if (certMatches > 2) badges.push('🏅 Certified Pro');
  if (expMatches > 3) badges.push('⭐ Experienced');
  if (totalScore >= 65) badges.push('🔥 Top Performer');
  if (badges.length === 0) badges.push('🌱 Rising Star');

  return {
    score: totalScore,
    level,
    breakdown: {
      skills: skillsScore,
      projects: projectsScore,
      certifications: certsScore,
      experience: expScore,
    },
    nextLevel,
    nextLevelAt,
    progressToNext: clamp(progressToNext, 0, 100),
    badges,
  };
}

// ── 6. Digital Twin ─────────────────────────────────────────────────

export function computeDigitalTwin(text: string): DigitalTwinProfile {
  const lower = text.toLowerCase();

  // Detect current role
  const rolePhrases = ['software engineer', 'developer', 'data scientist', 'product manager', 'devops', 'architect', 'analyst', 'engineer', 'designer', 'lead', 'manager'];
  const detectedRole = rolePhrases.find((r) => lower.includes(r)) || 'Software Professional';
  const currentRole = detectedRole.charAt(0).toUpperCase() + detectedRole.slice(1);

  // Experience years estimation
  const yearMatch = lower.match(/(\d+)\+?\s*years?\s*(of\s+)?experience/);
  const expYears = yearMatch ? parseInt(yearMatch[1]) : lower.includes('senior') ? 5 : lower.includes('junior') ? 1 : 3;

  // Top strengths
  const allMatchable: { name: string; kws: string[] }[] = [
    ...Object.entries(AI_RESISTANT_SKILLS).map(([name, kws]) => ({ name, kws })),
    ...Object.entries(FUTURE_PROOF_SKILLS).map(([name, kws]) => ({ name, kws })),
    ...Object.entries(GENERAL_TECH_SKILLS).map(([name, kws]) => ({ name, kws })),
  ];
  const scored = allMatchable
    .map((s) => ({ name: s.name, count: matchCount(text, s.kws) }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);
  const topStrengths = scored.slice(0, 6).map((s) => s.name);

  // Skill growth items
  const skillGrowth: SkillGrowthItem[] = scored.slice(0, 8).map((s) => {
    const maxKws = allMatchable.find((a) => a.name === s.name)?.kws.length || 1;
    const current = clamp(Math.round((s.count / maxKws) * 100), 10, 95);
    const isRising = ['AI / ML', 'Cloud', 'DevOps', 'Data Engineering', 'Cybersecurity'].includes(s.name);
    const projected = clamp(current + (isRising ? 20 : 10), current, 100);
    return {
      name: s.name,
      current,
      projected,
      trend: isRising ? 'rising' as const : 'stable' as const,
    };
  });

  // Add missing high-demand skills with low current score
  const missingHighDemand = ['AI / ML', 'Cloud', 'DevOps'].filter(
    (name) => !skillGrowth.find((sg) => sg.name === name)
  );
  for (const name of missingHighDemand.slice(0, 2)) {
    skillGrowth.push({ name, current: 0, projected: 35, trend: 'rising' });
  }

  // Future opportunities
  const futureOpportunities: string[] = [];
  if (lower.includes('architect') || lower.includes('system design')) {
    futureOpportunities.push('Chief Technology Officer (CTO)');
  }
  if (lower.includes('machine learning') || lower.includes('ai')) {
    futureOpportunities.push('AI Solutions Architect');
    futureOpportunities.push('ML Engineering Lead');
  }
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('azure')) {
    futureOpportunities.push('Cloud Platform Director');
  }
  if (lower.includes('devops') || lower.includes('kubernetes')) {
    futureOpportunities.push('Platform Engineering Lead');
  }
  if (lower.includes('lead') || lower.includes('mentor') || lower.includes('manager')) {
    futureOpportunities.push('VP of Engineering');
  }
  if (futureOpportunities.length === 0) {
    futureOpportunities.push('Senior Developer', 'Technical Lead', 'Solutions Architect');
  }

  // Predicted roles with probability
  const predictedRoles = futureOpportunities.slice(0, 4).map((role, i) => ({
    role,
    probability: clamp(85 - i * 15, 30, 90),
    timeframe: `${2 + i * 2}-${3 + i * 2} years`,
  }));

  // Market alignment
  const futureSkillCount = Object.values(FUTURE_PROOF_SKILLS).flat().filter((kw) => lower.includes(kw)).length;
  const marketAlignment = clamp(Math.round((futureSkillCount / 15) * 100), 10, 95);

  const careerTrajectory = expYears >= 8
    ? 'You are positioned for senior leadership and strategic roles. Focus on business acumen and organizational leadership.'
    : expYears >= 4
    ? 'Mid-career growth phase. Strong technical expansion with emerging leadership opportunities ahead.'
    : 'Early career trajectory with high growth potential. Building a diverse foundation will accelerate advancement.';

  return {
    currentRole,
    experienceYears: expYears,
    topStrengths,
    skillGrowth: skillGrowth.slice(0, 8),
    futureOpportunities: futureOpportunities.slice(0, 5),
    careerTrajectory,
    predictedRoles,
    marketAlignment,
  };
}
