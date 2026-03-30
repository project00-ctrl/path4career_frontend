// ── Skill Dictionaries ──────────────────────────────────────────────

export const AI_RESISTANT_SKILLS: Record<string, string[]> = {
  "System Design": ["system design", "distributed systems", "scalability", "high availability", "load balancing", "microservices architecture", "event-driven", "cqrs", "domain-driven design"],
  "Architecture": ["solution architect", "enterprise architect", "software architect", "architectural patterns", "design patterns", "clean architecture", "hexagonal architecture"],
  "Problem Solving": ["problem solving", "critical thinking", "analytical", "algorithm design", "complex problem", "troubleshooting", "debugging complex"],
  "Leadership": ["tech lead", "team lead", "engineering manager", "cto", "vp engineering", "director of engineering", "mentoring", "cross-functional", "stakeholder management"],
  "Product Thinking": ["product management", "product strategy", "user research", "customer discovery", "roadmap", "product-market fit", "business strategy", "requirements gathering"],
  "Communication": ["technical writing", "documentation", "presentation", "public speaking", "client-facing", "cross-team collaboration"],
  "Strategic Planning": ["strategic planning", "digital transformation", "technology roadmap", "innovation", "r&d", "technology evaluation"],
};

export const AI_VULNERABLE_SKILLS: Record<string, string[]> = {
  "Repetitive Coding": ["html coding", "basic html", "simple websites", "wordpress theme", "copy paste", "boilerplate"],
  "Basic Data Entry": ["data entry", "data input", "spreadsheet entry", "form filling", "manual data"],
  "Manual Testing": ["manual testing", "manual qa", "manual test cases", "manual regression"],
  "Simple Scripting": ["simple scripts", "batch scripts", "basic scripting", "simple automation"],
  "Basic Support": ["l1 support", "level 1 support", "help desk", "basic troubleshooting", "password reset", "ticket management"],
  "Template Work": ["template-based", "wordpress customization", "no-code", "drag and drop", "wysiwyg"],
  "Basic Reporting": ["basic reporting", "report generation", "simple queries", "excel reports"],
};

export const FUTURE_PROOF_SKILLS: Record<string, string[]> = {
  "AI / ML": ["machine learning", "deep learning", "artificial intelligence", "neural network", "nlp", "natural language processing", "computer vision", "tensorflow", "pytorch", "transformers", "llm", "large language model", "generative ai", "prompt engineering", "langchain", "hugging face", "openai", "gpt", "bert", "reinforcement learning"],
  "Cloud": ["aws", "amazon web services", "azure", "google cloud", "gcp", "cloud architecture", "serverless", "lambda", "cloud formation", "terraform", "infrastructure as code", "multi-cloud"],
  "DevOps": ["devops", "ci/cd", "jenkins", "github actions", "gitlab ci", "docker", "kubernetes", "k8s", "helm", "argocd", "gitops", "site reliability", "sre", "monitoring", "observability", "prometheus", "grafana", "datadog"],
  "Data Engineering": ["data engineering", "data pipeline", "etl", "data warehouse", "data lake", "apache spark", "kafka", "airflow", "dbt", "snowflake", "databricks", "big data", "data modeling", "data architecture"],
  "Cybersecurity": ["cybersecurity", "information security", "penetration testing", "ethical hacking", "soc", "siem", "zero trust", "identity management", "iam", "compliance", "gdpr", "security architecture", "threat modeling", "vulnerability assessment", "devsecops"],
  "Blockchain / Web3": ["blockchain", "web3", "smart contracts", "solidity", "ethereum", "defi", "nft"],
  "Edge Computing / IoT": ["edge computing", "iot", "internet of things", "embedded systems", "mqtt", "raspberry pi", "arduino"],
};

export const GENERAL_TECH_SKILLS: Record<string, string[]> = {
  "Backend Development": ["backend", "node.js", "express", "django", "flask", "spring boot", "java", "python", "golang", "go lang", "rust", "c#", ".net", "ruby on rails", "api development", "rest api", "graphql", "grpc"],
  "Frontend Development": ["react", "angular", "vue", "svelte", "next.js", "nuxt", "typescript", "javascript", "tailwind", "css", "responsive design", "web performance", "accessibility"],
  "Mobile Development": ["react native", "flutter", "swift", "kotlin", "ios", "android", "mobile app"],
  "Database": ["postgresql", "mysql", "mongodb", "redis", "elasticsearch", "dynamodb", "cassandra", "neo4j", "sql server", "database design", "database optimization"],
  "Testing & QA": ["automation testing", "selenium", "cypress", "jest", "pytest", "test-driven", "tdd", "bdd", "performance testing", "jmeter", "load testing", "playwright"],
  "Version Control": ["git", "github", "gitlab", "bitbucket", "version control"],
};

// ── Analysis Types ──────────────────────────────────────────────────

export interface SkillMatch {
  category: string;
  keywords: string[];
}

export interface AnalysisResult {
  overallScore: number;
  aiResistantScore: number;
  futureProofScore: number;
  vulnerabilityScore: number;
  generalTechScore: number;

  strengths: SkillMatch[];
  risks: SkillMatch[];
  futureProofMatches: SkillMatch[];
  generalTechMatches: SkillMatch[];

  missingSkills: string[];
  recommendations: string[];
  careerSuggestions: string[];
  learningPath: LearningItem[];

  riskLevel: "safe" | "moderate" | "high";
  riskMessage: string;
  atsScore: number;
  keywordDensity: number;
  resumeLength: "short" | "good" | "long";
}

export interface LearningItem {
  title: string;
  type: "course" | "certification" | "project";
  priority: "high" | "medium" | "low";
}

// ── Analyzer ────────────────────────────────────────────────────────

function findMatches(text: string, dict: Record<string, string[]>): SkillMatch[] {
  const lower = text.toLowerCase();
  const matches: SkillMatch[] = [];
  for (const [category, keywords] of Object.entries(dict)) {
    const found = keywords.filter((kw) => lower.includes(kw));
    if (found.length > 0) {
      matches.push({ category, keywords: found });
    }
  }
  return matches;
}

export function analyzeResume(text: string): AnalysisResult {
  const lower = text.toLowerCase();

  // Find matches in each category
  const strengths = findMatches(text, AI_RESISTANT_SKILLS);
  const futureProofMatches = findMatches(text, FUTURE_PROOF_SKILLS);
  const risks = findMatches(text, AI_VULNERABLE_SKILLS);
  const generalTechMatches = findMatches(text, GENERAL_TECH_SKILLS);

  // Calculate sub-scores (0-10)
  const totalResistantCategories = Object.keys(AI_RESISTANT_SKILLS).length;
  const totalFutureCategories = Object.keys(FUTURE_PROOF_SKILLS).length;
  const totalVulnerableCategories = Object.keys(AI_VULNERABLE_SKILLS).length;
  const totalGeneralCategories = Object.keys(GENERAL_TECH_SKILLS).length;

  const aiResistantScore = Math.min(10, (strengths.length / totalResistantCategories) * 10 * 1.5);
  const futureProofScore = Math.min(10, (futureProofMatches.length / totalFutureCategories) * 10 * 1.8);
  const vulnerabilityPenalty = (risks.length / totalVulnerableCategories) * 10;
  const vulnerabilityScore = Math.max(0, 10 - vulnerabilityPenalty * 1.5);
  const generalTechScore = Math.min(10, (generalTechMatches.length / totalGeneralCategories) * 10 * 1.5);

  // Weighted overall score
  const overallScore = Math.min(10, Math.max(0,
    aiResistantScore * 0.30 +
    futureProofScore * 0.35 +
    generalTechScore * 0.20 +
    vulnerabilityScore * 0.15
  ));

  const roundedScore = Math.round(overallScore * 10) / 10;

  // Missing skills
  const missingSkills: string[] = [];
  const allFutureCategories = Object.keys(FUTURE_PROOF_SKILLS);
  const matchedFutureCategories = futureProofMatches.map((m) => m.category);
  allFutureCategories.forEach((cat) => {
    if (!matchedFutureCategories.includes(cat)) {
      missingSkills.push(cat);
    }
  });

  const allResistantCategories = Object.keys(AI_RESISTANT_SKILLS);
  const matchedResistantCategories = strengths.map((m) => m.category);
  allResistantCategories.forEach((cat) => {
    if (!matchedResistantCategories.includes(cat)) {
      if (!missingSkills.includes(cat)) missingSkills.push(cat);
    }
  });

  // Risk level
  let riskLevel: "safe" | "moderate" | "high";
  let riskMessage: string;

  if (roundedScore >= 7) {
    riskLevel = "safe";
    riskMessage = "Your profile shows strong resilience against automation trends. AI tools will likely assist you rather than replace you. Continue upgrading your skills and stay ahead of the curve.";
  } else if (roundedScore >= 4) {
    riskLevel = "moderate";
    riskMessage = "Some of your skills may become automated in the future. Upgrading your technical stack and learning AI-assisted development is recommended to strengthen your career position.";
  } else {
    riskLevel = "high";
    riskMessage = "Your resume indicates skills that may be significantly impacted by automation. Consider reskilling into high-demand technologies to future-proof your career.";
  }

  // Recommendations
  const recommendations: string[] = [];
  if (!matchedFutureCategories.includes("AI / ML")) {
    recommendations.push("Learn AI/ML fundamentals — understanding AI tools will make you more valuable, not replaceable.");
  }
  if (!matchedFutureCategories.includes("Cloud")) {
    recommendations.push("Add cloud platform skills (AWS, Azure, or GCP) — cloud expertise is essential for modern roles.");
  }
  if (!matchedFutureCategories.includes("DevOps")) {
    recommendations.push("Develop DevOps capabilities — CI/CD, Docker, and Kubernetes are in high demand.");
  }
  if (!matchedResistantCategories.includes("System Design")) {
    recommendations.push("Strengthen system design skills — this is one of the most AI-resistant competencies.");
  }
  if (!matchedResistantCategories.includes("Architecture")) {
    recommendations.push("Move towards architecture roles — solution and software architecture skills are highly valued.");
  }
  if (!matchedFutureCategories.includes("Cybersecurity")) {
    recommendations.push("Consider cybersecurity knowledge — it's a growing field with strong job security.");
  }
  if (!matchedFutureCategories.includes("Data Engineering")) {
    recommendations.push("Explore data engineering — data pipelines and analytics are future-proof domains.");
  }
  if (risks.length > 0) {
    recommendations.push("Transition away from routine tasks — focus on skills that require creativity and complex problem-solving.");
  }

  // Career suggestions based on current skills
  const careerSuggestions: string[] = [];
  if (risks.some((r) => r.category === "Manual Testing")) {
    careerSuggestions.push("Transition to Automation Testing Engineer — learn Selenium, Cypress, or Playwright.");
  }
  if (risks.some((r) => r.category === "Basic Data Entry")) {
    careerSuggestions.push("Move into Data Analytics or Data Engineering — learn SQL, Python, and visualization tools.");
  }
  if (risks.some((r) => r.category === "Simple Scripting")) {
    careerSuggestions.push("Upgrade to Full-Stack Development or DevOps Engineering.");
  }
  if (risks.some((r) => r.category === "Basic Support")) {
    careerSuggestions.push("Evolve into Cloud Engineering or Site Reliability Engineering (SRE).");
  }
  if (generalTechMatches.some((m) => m.category === "Backend Development")) {
    careerSuggestions.push("Consider evolving into a Solutions Architect or Staff Engineer role.");
  }
  if (generalTechMatches.some((m) => m.category === "Frontend Development")) {
    careerSuggestions.push("Explore Design Engineering or Full-Stack Development with AI integration.");
  }
  if (futureProofMatches.some((m) => m.category === "AI / ML")) {
    careerSuggestions.push("You're well-positioned for ML Engineer, AI Product Manager, or AI Solutions Architect roles.");
  }
  if (careerSuggestions.length === 0) {
    careerSuggestions.push("Start building a strong foundation in cloud technologies and modern development practices.");
    careerSuggestions.push("Consider a career in DevOps, Cloud Engineering, or Data Engineering.");
  }

  // Learning path
  const learningPath: LearningItem[] = [];
  if (!matchedFutureCategories.includes("AI / ML")) {
    learningPath.push({ title: "AI & Machine Learning Fundamentals", type: "course", priority: "high" });
    learningPath.push({ title: "Prompt Engineering Masterclass", type: "course", priority: "medium" });
  }
  if (!matchedFutureCategories.includes("Cloud")) {
    learningPath.push({ title: "AWS Solutions Architect Associate", type: "certification", priority: "high" });
  }
  if (!matchedFutureCategories.includes("DevOps")) {
    learningPath.push({ title: "Docker & Kubernetes Bootcamp", type: "course", priority: "high" });
    learningPath.push({ title: "Build a CI/CD Pipeline Project", type: "project", priority: "medium" });
  }
  if (!matchedResistantCategories.includes("System Design")) {
    learningPath.push({ title: "System Design Interview Prep", type: "course", priority: "high" });
    learningPath.push({ title: "Design a Scalable Chat Application", type: "project", priority: "medium" });
  }
  if (!matchedFutureCategories.includes("Cybersecurity")) {
    learningPath.push({ title: "CompTIA Security+ Certification", type: "certification", priority: "medium" });
  }
  if (!matchedFutureCategories.includes("Data Engineering")) {
    learningPath.push({ title: "Data Engineering with Python & SQL", type: "course", priority: "medium" });
  }
  learningPath.push({ title: "Contribute to Open Source AI Projects", type: "project", priority: "low" });

  // ATS score (basic heuristic)
  const wordCount = text.split(/\s+/).length;
  let atsScore = 5;
  if (wordCount > 200) atsScore += 1;
  if (wordCount > 400) atsScore += 1;
  if (lower.includes("experience")) atsScore += 0.5;
  if (lower.includes("education")) atsScore += 0.5;
  if (lower.includes("skills")) atsScore += 0.5;
  if (lower.includes("project")) atsScore += 0.5;
  if (lower.includes("certification") || lower.includes("certified")) atsScore += 0.5;
  if (generalTechMatches.length > 2) atsScore += 0.5;
  if (futureProofMatches.length > 1) atsScore += 0.5;
  atsScore = Math.min(10, Math.round(atsScore * 10) / 10);

  const keywordDensity = Math.min(100, Math.round(
    ((strengths.reduce((a, s) => a + s.keywords.length, 0) +
      futureProofMatches.reduce((a, s) => a + s.keywords.length, 0) +
      generalTechMatches.reduce((a, s) => a + s.keywords.length, 0)) /
      Math.max(1, wordCount)) * 100 * 10
  ));

  let resumeLength: "short" | "good" | "long";
  if (wordCount < 150) resumeLength = "short";
  else if (wordCount > 1000) resumeLength = "long";
  else resumeLength = "good";

  return {
    overallScore: roundedScore,
    aiResistantScore: Math.round(aiResistantScore * 10) / 10,
    futureProofScore: Math.round(futureProofScore * 10) / 10,
    vulnerabilityScore: Math.round(vulnerabilityScore * 10) / 10,
    generalTechScore: Math.round(generalTechScore * 10) / 10,
    strengths,
    risks,
    futureProofMatches,
    generalTechMatches,
    missingSkills: missingSkills.slice(0, 8),
    recommendations: recommendations.slice(0, 6),
    careerSuggestions: careerSuggestions.slice(0, 4),
    learningPath: learningPath.slice(0, 8),
    riskLevel,
    riskMessage,
    atsScore,
    keywordDensity,
    resumeLength,
  };
}
