import { useState, useEffect } from 'react';
import { Award, FileCheck, FolderGit2, Briefcase, Globe, Users, Plus, X, Sparkles, TrendingUp, ChevronUp } from 'lucide-react';

interface ScoreCategory {
  label: string;
  icon: React.ReactNode;
  score: number;
  max: number;
  color: string;
  items: string[];
}

interface ReputationScoreProps {
  requireAuth?: (cb: () => void) => void;
}

export function ReputationScore({ requireAuth }: ReputationScoreProps = {}) {
  const [certifications, setCertifications] = useState<string[]>(['AWS Solutions Architect', 'Google Cloud Professional']);
  const [projects, setProjects] = useState<string[]>(['E-commerce Platform', 'AI Chatbot', 'Portfolio Website']);
  const [internships, setInternships] = useState<string[]>(['Google Summer Intern']);
  const [portfolio, setPortfolio] = useState<string[]>(['GitHub Profile', 'Personal Blog']);
  const [community, setCommunity] = useState<string[]>(['Stack Overflow Contributor', 'Open Source PR']);
  const [newItem, setNewItem] = useState('');
  const [activeAdd, setActiveAdd] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (requireAuth) {
      requireAuth(() => {});
    }
  }, []);


  const categories: ScoreCategory[] = [
    { label: 'Certifications', icon: <FileCheck size={20} />, score: Math.min(certifications.length * 8, 25), max: 25, color: 'bg-primary', items: certifications },
    { label: 'Projects', icon: <FolderGit2 size={20} />, score: Math.min(projects.length * 6, 25), max: 25, color: 'bg-secondary', items: projects },
    { label: 'Internships', icon: <Briefcase size={20} />, score: Math.min(internships.length * 10, 20), max: 20, color: 'bg-amber-500', items: internships },
    { label: 'Portfolio', icon: <Globe size={20} />, score: Math.min(portfolio.length * 7, 15), max: 15, color: 'bg-violet-500', items: portfolio },
    { label: 'Community', icon: <Users size={20} />, score: Math.min(community.length * 7, 15), max: 15, color: 'bg-cyan-500', items: community },
  ];

  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);

  const addItem = (category: string) => {
    if (!newItem.trim()) return;
    
    const executeAdd = () => {
      switch (category) {
        case 'Certifications': setCertifications(prev => [...prev, newItem]); break;
        case 'Projects': setProjects(prev => [...prev, newItem]); break;
        case 'Internships': setInternships(prev => [...prev, newItem]); break;
        case 'Portfolio': setPortfolio(prev => [...prev, newItem]); break;
        case 'Community': setCommunity(prev => [...prev, newItem]); break;
      }
      setNewItem('');
      setActiveAdd(null);
    };

    if (requireAuth) {
      requireAuth(executeAdd);
    } else {
      executeAdd();
    }
  };

  const removeItem = (category: string, index: number) => {
    switch (category) {
      case 'Certifications': setCertifications(prev => prev.filter((_, i) => i !== index)); break;
      case 'Projects': setProjects(prev => prev.filter((_, i) => i !== index)); break;
      case 'Internships': setInternships(prev => prev.filter((_, i) => i !== index)); break;
      case 'Portfolio': setPortfolio(prev => prev.filter((_, i) => i !== index)); break;
      case 'Community': setCommunity(prev => prev.filter((_, i) => i !== index)); break;
    }
  };

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-secondary', label: 'Exceptional' };
    if (score >= 80) return { grade: 'A', color: 'text-secondary', label: 'Outstanding' };
    if (score >= 70) return { grade: 'B+', color: 'text-primary', label: 'Very Good' };
    if (score >= 60) return { grade: 'B', color: 'text-primary', label: 'Good' };
    if (score >= 50) return { grade: 'C+', color: 'text-amber-400', label: 'Average' };
    if (score >= 40) return { grade: 'C', color: 'text-amber-400', label: 'Below Average' };
    return { grade: 'D', color: 'text-rose-400', label: 'Needs Improvement' };
  };

  const grade = getGrade(totalScore);
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = mounted ? circumference - (totalScore / 100) * circumference : circumference;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            <Award size={14} />
            Career Credibility
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">Reputation Score</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Build a career credibility score based on your certifications, projects, internships, portfolio, and community activity.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Categories */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {categories.map((cat) => (
              <div key={cat.label} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} bg-opacity-20 flex items-center justify-center text-primary-foreground`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="text-foreground font-bold text-sm">{cat.label}</h3>
                      <p className="text-xs text-muted-foreground">{cat.score}/{cat.max} points</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setActiveAdd(activeAdd === cat.label ? null : cat.label); setNewItem(''); }}
                    className="p-2 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border transition-all cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Progress */}
                <div className="w-full bg-muted/50 border border-border rounded-full h-2 mb-4">
                  <div
                    className={`${cat.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: mounted ? `${(cat.score / cat.max) * 100}%` : '0%' }}
                  />
                </div>

                {/* Items */}
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                      {item}
                      <button onClick={() => removeItem(cat.label, i)} className="text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Input */}
                {activeAdd === cat.label && (
                  <div className="flex gap-2 mt-3 animate-fade-in">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addItem(cat.label)}
                      placeholder={`Add ${cat.label.toLowerCase()}...`}
                      className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-foreground text-sm placeholder-slate-500 outline-none focus:ring-1 focus:ring-cyan-500/30"
                      autoFocus
                    />
                    <button
                      onClick={() => addItem(cat.label)}
                      className="px-4 py-2 rounded-lg bg-cyan-600 text-foreground text-sm font-medium hover:bg-cyan-500 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Score Display */}
          <div className="space-y-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Score Circle */}
            <div className="glass-card rounded-3xl p-8 text-center">
              <h3 className="text-muted-foreground text-sm font-medium mb-6">Career Credibility Score</h3>
              <div className="relative w-44 h-44 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(128,128,128,0.2)" strokeWidth="10" />
                  <circle
                    cx="90" cy="90" r="80"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-secondary, #0D9488)" />
                      <stop offset="100%" stopColor="var(--color-primary, #7C3AED)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-foreground animate-count-up">
                    {mounted ? totalScore : 0}
                  </span>
                  <span className="text-muted-foreground text-sm">/100</span>
                </div>
              </div>
              <div className={`text-2xl font-black ${grade.color.replace(/-[0-9]{3}/, '')} mb-1 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                {grade.grade}
              </div>
              <div className={`text-muted-foreground text-sm transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                {grade.label}
              </div>
            </div>

            {/* Breakdown */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-foreground font-bold text-sm mb-4">Score Breakdown</h4>
              <div className="space-y-3">
                {categories.map(cat => (
                  <div key={cat.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{cat.label}</span>
                    <span className="text-sm text-foreground font-bold">{cat.score}/{cat.max}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-foreground font-bold text-sm mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400" />
                Boost Your Score
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                {certifications.length < 3 && (
                  <div className="flex items-center gap-2">
                    <ChevronUp size={14} className="text-secondary" />
                    Add more certifications (+8 pts each)
                  </div>
                )}
                {projects.length < 4 && (
                  <div className="flex items-center gap-2">
                    <ChevronUp size={14} className="text-secondary" />
                    Showcase more projects (+6 pts each)
                  </div>
                )}
                {internships.length < 2 && (
                  <div className="flex items-center gap-2">
                    <ChevronUp size={14} className="text-secondary" />
                    Add internship experience (+10 pts each)
                  </div>
                )}
                {community.length < 2 && (
                  <div className="flex items-center gap-2">
                    <ChevronUp size={14} className="text-secondary" />
                    Contribute to community (+7 pts each)
                  </div>
                )}
              </div>
            </div>

            {/* Usage Note */}
            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <TrendingUp size={18} className="text-cyan-400 mt-0.5" />
                <div>
                  <div className="text-foreground font-bold text-sm mb-1">Replace Your Resume</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Companies can use your credibility score instead of traditional resumes for faster hiring decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
