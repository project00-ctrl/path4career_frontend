import { useState, useCallback, useRef } from "react";
import {
  Shield,
  Upload,
  FileText,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Brain,
  Lock,
  TrendingUp,
  Cpu,
  Zap,
  Target,
  X,
} from "lucide-react";
import { analyzeResume, type AnalysisResult } from "./utils/analyzer";
import AnalyzingAnimation from "./components/AnalyzingAnimation";
import Dashboard from "./components/Dashboard";

type AppState = "landing" | "analyzing" | "dashboard";

function App() {
  const [state, setState] = useState<AppState>("landing");
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = useCallback(() => {
    if (!resumeText.trim()) return;
    setState("analyzing");
  }, [resumeText]);

  const handleAnalysisComplete = useCallback(() => {
    const analysisResult = analyzeResume(resumeText);
    setResult(analysisResult);
    setState("dashboard");
    window.scrollTo(0, 0);
  }, [resumeText]);

  const handleReset = useCallback(() => {
    setState("landing");
    setResumeText("");
    setResult(null);
    setFileName("");
    window.scrollTo(0, 0);
  }, []);

  const extractTextFromFile = useCallback(async (file: File) => {
    setFileName(file.name);
    const fn = file.name.toLowerCase();
    
    try {
      if (fn.endsWith('.pdf')) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          let lastY = null;
          let pageText = '';
          for (const item of content.items as any[]) {
            const y = item.transform ? item.transform[5] : null;
            if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) pageText += '\n';
            pageText += item.str;
            lastY = y;
          }
          text += pageText + '\n';
        }
        setResumeText(text);
      } else if (fn.endsWith('.docx')) {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value);
      } else if (fn.endsWith('.doc')) {
        const arrayBuffer = await file.arrayBuffer();
        const arr = new Uint8Array(arrayBuffer);
        let txt = '';
        for(let i=0; i<arr.length; i++) {
          const c = arr[i];
          if((c>=32 && c<=126) || c===10 || c===13) txt+=String.fromCharCode(c);
        }
        txt = txt.split('\n').map(l=>l.replace(/[^\x20-\x7E]/g,' ').replace(/\s{3,}/g,' ').trim()).filter(l=>l.length>2).join('\n');
        setResumeText(txt);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeText((e.target?.result as string) || "");
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error("Error reading file:", err);
      if(!fn.endsWith('.pdf') && !fn.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = (e) => setResumeText((e.target?.result as string) || "");
        reader.readAsText(file);
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) extractTextFromFile(file);
    },
    [extractTextFromFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) extractTextFromFile(file);
    },
    [extractTextFromFile]
  );

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSample = () => {
    const sampleResume = `John Smith
Senior Software Engineer | Cloud & AI Solutions

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years of expertise in backend development, cloud architecture, and system design. Passionate about building scalable distributed systems and leveraging AI/ML technologies to solve complex problems. Strong leadership and cross-functional collaboration skills.

SKILLS
Programming: Python, Java, Go, TypeScript, JavaScript
Cloud: AWS (EC2, Lambda, S3, DynamoDB, SQS), Azure, Google Cloud Platform (GCP)
DevOps: Docker, Kubernetes, Terraform, Jenkins, GitHub Actions, CI/CD pipelines
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch, Cassandra
Frameworks: Spring Boot, Django, React, Node.js, Express, GraphQL
AI/ML: TensorFlow, PyTorch, Natural Language Processing, Machine Learning fundamentals
Architecture: Microservices, Event-driven architecture, Domain-driven design, CQRS
Security: OAuth2, JWT, Identity management, Security architecture
Monitoring: Prometheus, Grafana, Datadog, ELK Stack

EXPERIENCE
Senior Software Engineer — TechCorp Inc. (2020 – Present)
• Led the design and implementation of a microservices architecture serving 10M+ users
• Built scalable data pipelines using Apache Kafka and Apache Spark
• Implemented CI/CD pipelines reducing deployment time by 70%
• Mentored junior engineers and conducted system design reviews
• Integrated AI-assisted coding tools to improve team productivity

Software Engineer — DataFlow Solutions (2017 – 2020)
• Developed RESTful APIs and GraphQL services using Python and Java
• Managed cloud infrastructure on AWS with Terraform
• Implemented automated testing strategies using pytest and Selenium
• Contributed to data engineering projects involving ETL pipelines

Junior Developer — WebStart Agency (2015 – 2017)
• Built responsive web applications using React and Node.js
• Worked with PostgreSQL and MongoDB databases
• Participated in agile development processes and code reviews

EDUCATION
B.S. Computer Science — State University (2015)

CERTIFICATIONS
• AWS Solutions Architect Associate
• Certified Kubernetes Administrator (CKA)
• Google Cloud Professional Data Engineer

PROJECTS
• Open-source contribution to machine learning libraries
• Built a real-time analytics dashboard with streaming data
• Designed a scalable chat application handling 100K concurrent users`;

    setResumeText(sampleResume);
    setFileName("sample-resume.txt");
  };

  // ─── Analyzing State ──────────────────────────────────────────
  if (state === "analyzing") {
    return <AnalyzingAnimation onComplete={handleAnalysisComplete} />;
  }

  // ─── Dashboard State ─────────────────────────────────────────
  if (state === "dashboard" && result) {
    return <Dashboard result={result} resumeText={resumeText} fileName={fileName} onReset={handleReset} />;
  }

  // ─── Landing State ────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-[115px]" style={{ background: '#f8fafc', color: '#0f172a' }}>


      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: '#ffffff' }}>
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#2563eb' }} />
              <span className="text-sm font-medium" style={{ color: '#2563eb' }}>AI-Powered Career Analysis</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6" style={{ color: '#0f172a' }}>
              Is Your Career{" "}
              <span style={{ color: '#2563eb' }}>
                AI-Proof
              </span>
              ?
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: '#64748b' }}>
              Upload your resume and get an instant{" "}
              <strong style={{ color: '#0f172a' }}>AI Career Safety Score</strong>. Discover your strengths,
              vulnerability areas, and a personalized roadmap to stay ahead of automation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={scrollToUpload}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                style={{ background: '#2563eb', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
              >
                <Shield className="w-5 h-5" />
                Check Your Score Now
              </button>
              <button
                onClick={loadSample}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-medium transition-all cursor-pointer"
                style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' }}
              >
                Try Sample Resume
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>50+</p>
                <p className="text-xs" style={{ color: '#64748b' }}>Skills Analyzed</p>
              </div>
              <div className="text-center" style={{ borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>3</p>
                <p className="text-xs" style={{ color: '#64748b' }}>Risk Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>10+</p>
                <p className="text-xs" style={{ color: '#64748b' }}>Career Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0f172a' }}>How It Works</h2>
            <p className="max-w-lg mx-auto" style={{ color: '#64748b' }}>
              Three simple steps to understand your career's AI resilience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: "Upload Resume",
                desc: "Paste your resume text or upload a text file. We analyze your skills, experience, and keywords.",
                color: "#2563eb",
                step: "01",
              },
              {
                icon: Cpu,
                title: "AI Analysis",
                desc: "Our engine evaluates your skills against AI-resistant, AI-vulnerable, and future-proof categories.",
                color: "#7c3aed",
                step: "02",
              },
              {
                icon: Target,
                title: "Get Your Score",
                desc: "Receive a detailed safety score, personalized recommendations, and a learning roadmap.",
                color: "#db2777",
                step: "03",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl p-8 transition-all group hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
              >
                <span className="absolute top-4 right-4 text-5xl font-black transition-colors" style={{ color: 'rgba(0,0,0,0.04)' }}>
                  {item.step}
                </span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: item.color }}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Analyze */}
      <section className="py-20" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0f172a' }}>What We Analyze</h2>
            <p className="max-w-lg mx-auto" style={{ color: '#64748b' }}>
              Your resume is evaluated across multiple dimensions of career resilience
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "AI-Resistant Skills",
                items: ["System Design", "Architecture", "Leadership", "Problem Solving", "Product Thinking"],
                iconColor: "#059669",
                iconBg: "#ecfdf5",
              },
              {
                icon: Brain,
                title: "Future-Proof Skills",
                items: ["AI / ML", "Cloud Computing", "DevOps", "Data Engineering", "Cybersecurity"],
                iconColor: "#0891b2",
                iconBg: "#ecfeff",
              },
              {
                icon: TrendingUp,
                title: "General Tech Skills",
                items: ["Backend Dev", "Frontend Dev", "Databases", "Mobile", "Testing & QA"],
                iconColor: "#2563eb",
                iconBg: "#eff6ff",
              },
              {
                icon: Zap,
                title: "Vulnerability Check",
                items: ["Repetitive Coding", "Manual Testing", "Data Entry", "Basic Support", "Template Work"],
                iconColor: "#d97706",
                iconBg: "#fffbeb",
              },
              {
                icon: FileText,
                title: "Resume Quality",
                items: ["ATS Compatibility", "Keyword Density", "Content Length", "Section Coverage"],
                iconColor: "#7c3aed",
                iconBg: "#f5f3ff",
              },
              {
                icon: Lock,
                title: "Career Readiness",
                items: ["Learning Path", "Certifications", "Career Suggestions", "Skill Gaps"],
                iconColor: "#db2777",
                iconBg: "#fdf2f8",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="rounded-xl p-6 transition-all hover:-translate-y-0.5"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: card.iconBg }}>
                  <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#0f172a' }}>{card.title}</h3>
                <ul className="space-y-1.5">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: card.iconColor, opacity: 0.5 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score Explanation */}
      <section className="py-20" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0f172a' }}>Score Interpretation</h2>
            <p className="max-w-lg mx-auto" style={{ color: '#64748b' }}>
              Understanding what your AI Career Safety Score means
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                range: "7 – 10",
                label: "AI Safe Zone",
                icon: ShieldCheck,
                color: "#059669",
                bg: "#ecfdf5",
                borderColor: "#a7f3d0",
                desc: "Your profile shows strong resilience against automation trends. AI tools will likely assist you rather than replace you.",
                tips: ["Continue upgrading skills", "Learn AI tools", "Move towards architecture roles"],
              },
              {
                range: "4 – 6",
                label: "Moderate Risk",
                icon: Shield,
                color: "#d97706",
                bg: "#fffbeb",
                borderColor: "#fde68a",
                desc: "Some of your skills may become automated. Upgrading your technical stack and learning AI-assisted development is recommended.",
                tips: ["Add cloud technologies", "Learn AI-assisted coding", "Improve system design"],
              },
              {
                range: "0 – 3",
                label: "High Risk",
                icon: ShieldCheck,
                color: "#dc2626",
                bg: "#fef2f2",
                borderColor: "#fecaca",
                desc: "Your resume indicates skills that may be significantly impacted by automation. Consider reskilling into high-demand technologies.",
                tips: ["Learn data analytics", "Start AI/ML basics", "Explore DevOps & Cybersecurity"],
              },
            ].map((tier, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-8 transition-all hover:-translate-y-0.5"
                style={{ background: tier.bg, border: `1px solid ${tier.borderColor}`, boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: tier.color }}>
                  <tier.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-mono mb-1" style={{ color: '#64748b' }}>Score {tier.range}</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#0f172a' }}>{tier.label}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#64748b' }}>{tier.desc}</p>
                <ul className="space-y-2">
                  {tier.tips.map((tip, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#334155' }}>
                      <ChevronRight className="w-3 h-3" style={{ color: '#94a3b8' }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview Cards — Light Theme */}
      <section className="py-20" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0f172a' }}>
              Explore Our Tools
            </h2>
            <p style={{ color: '#64748b' }} className="max-w-lg mx-auto">
              Powerful AI-driven career intelligence modules designed to future-proof your professional journey
            </p>
          </div>
          <div
            className="grid gap-6 overview-grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
            }}
          >
            <style>{`
              .overview-card {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 1px 3px rgba(0,0,0,.04);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }
              .overview-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
              }
              @media (max-width: 1024px) {
                .overview-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                }
              }
              @media (max-width: 640px) {
                .overview-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
            {[
              {
                title: 'Risk Analyzer',
                desc: 'Detect AI automation risk for role and skills.',
                icon: Zap,
              },
              {
                title: 'Simulation',
                desc: 'Simulate future career scenarios and AI impact.',
                icon: Cpu,
              },
              {
                title: 'Decision Engine',
                desc: 'Recommend best AI-safe career path.',
                icon: Target,
              },
              {
                title: 'Reputation',
                desc: 'Calculate AI career strength score.',
                icon: TrendingUp,
              },
              {
                title: 'Digital Twin',
                desc: 'Create virtual AI career model.',
                icon: Brain,
              },
            ].map((card, idx) => (
              <div key={idx} className="overview-card">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: '#f1f5f9' }}
                >
                  <card.icon className="w-5 h-5" style={{ color: '#0f172a' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#0f172a' }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section ref={uploadSectionRef} className="py-20" id="upload" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <Shield className="w-4 h-4" style={{ color: '#2563eb' }} />
              <span className="text-sm font-medium" style={{ color: '#2563eb' }}>Free Career Analysis</span>
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#0f172a' }}>Analyze Your Resume</h2>
            <p style={{ color: '#64748b' }}>
              Paste your resume content below or upload a text file to get started
            </p>
          </div>

          <div className="rounded-3xl p-8" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6"
              style={{
                borderColor: dragActive ? '#2563eb' : '#e2e8f0',
                background: dragActive ? '#eff6ff' : '#f8fafc',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: dragActive ? '#2563eb' : '#94a3b8' }} />
              <p className="text-sm" style={{ color: '#64748b' }}>
                <span className="font-medium" style={{ color: '#2563eb' }}>Click to upload</span> or drag & drop
              </p>
              <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>Supports PDF, DOCX, DOC, TXT</p>
              {fileName && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <FileText className="w-4 h-4" style={{ color: '#2563eb' }} />
                  <span className="text-sm" style={{ color: '#2563eb' }}>{fileName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileName("");
                      setResumeText("");
                    }}
                    className="ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" style={{ color: '#94a3b8' }} />
                  </button>
                </div>
              )}
            </div>

            {/* Textarea */}
            <div className="relative mb-6">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your resume text here...&#10;&#10;Include your skills, experience, education, certifications, and projects for the most accurate analysis."
                className="w-full h-56 rounded-2xl p-5 text-sm resize-none focus:outline-none transition-colors"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', }}
              />
              {resumeText && (
                <div className="absolute bottom-3 right-3 text-xs" style={{ color: '#94a3b8' }}>
                  {resumeText.split(/\s+/).filter(Boolean).length} words
                </div>
              )}
            </div>

            {/* Sample + Analyze button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!resumeText.trim()}
                className={`w-full sm:flex-1 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  resumeText.trim()
                    ? "text-white"
                    : "cursor-not-allowed"
                }`}
                style={resumeText.trim() ? { background: '#2563eb', boxShadow: '0 4px 14px rgba(37,99,235,0.25)' } : { background: '#f1f5f9', color: '#94a3b8' }}
              >
                <Shield className="w-5 h-5" />
                Analyze My Career Safety
              </button>
              <button
                onClick={loadSample}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-medium transition-all cursor-pointer text-sm"
                style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0' }}
              >
                Load Sample
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Lock className="w-3 h-3" style={{ color: '#94a3b8' }} />
              <p className="text-xs" style={{ color: '#94a3b8' }}>
                Your resume data is processed locally in your browser. We don't store or send your data anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default App;
