import {
  Brain,
  Users,
  ShieldAlert,
  GitFork,
  Award,
  Rocket,
  Fingerprint,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Zap,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import type { ModuleId } from './Sidebar';
import { mentorEngine } from '../engine/mentorEngine';
import { dummyAuth } from '../auth/dummyAuth';

interface HomeProps {
  onNavigate: (id: ModuleId) => void;
}

const modules = [
  {
    id: 'simulation' as ModuleId,
    title: 'AI Career Simulation',
    desc: 'Simulate your 10-year career trajectory with AI-powered predictive models and scenario analysis.',
    icon: <Brain size={28} />,
    gradient: 'from-primary to-primary/70',
    glow: 'shadow-primary/20',
    tag: 'Predictive AI',
  },
  {
    id: 'mentor' as ModuleId,
    title: 'Mentor Marketplace',
    desc: 'Connect with industry experts for paid 1:1 career consultations and personalized guidance.',
    icon: <Users size={28} />,
    gradient: 'from-secondary to-secondary/70',
    glow: 'shadow-secondary/20',
    tag: 'Marketplace',
  },
  {
    id: 'risk' as ModuleId,
    title: 'Career Risk Analyzer',
    desc: 'AI predicts job saturation, layoff probability, and automation risks for any career path.',
    icon: <ShieldAlert size={28} />,
    gradient: 'from-rose-500 to-rose-600',
    glow: 'shadow-rose-500/20',
    tag: 'Risk Intelligence',
  },
  {
    id: 'decision' as ModuleId,
    title: 'Decision Engine',
    desc: 'Confused between career paths? AI compares salary, demand, skills, and growth to recommend the best option.',
    icon: <GitFork size={28} />,
    gradient: 'from-amber-500 to-amber-600',
    glow: 'shadow-amber-500/20',
    tag: 'Decision AI',
  },
  {
    id: 'reputation' as ModuleId,
    title: 'Reputation Score',
    desc: 'Build a career credibility score from certifications, projects, and portfolio — your digital career identity.',
    icon: <Award size={28} />,
    gradient: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-cyan-500/20',
    tag: 'Credibility',
  },
  {
    id: 'startup' as ModuleId,
    title: 'Startup Founder Path',
    desc: 'AI guides aspiring entrepreneurs through idea validation, MVP building, and fundraising roadmaps.',
    icon: <Rocket size={28} />,
    gradient: 'from-orange-500 to-orange-600',
    glow: 'shadow-orange-500/20',
    tag: 'Entrepreneurship',
  },
  {
    id: 'twin' as ModuleId,
    title: 'Career Digital Twin',
    desc: 'Create a virtual version of your career profile. AI simulates skill upgrades, career moves, and salary growth.',
    icon: <Fingerprint size={28} />,
    gradient: 'from-violet-500 to-violet-600',
    glow: 'shadow-violet-500/20',
    tag: 'Very Advanced',
  },
];

const stats = [
  { value: '7+', label: 'AI Modules', icon: <Sparkles size={20} /> },
  { value: '10yr', label: 'Career Forecasting', icon: <TrendingUp size={20} /> },
  { value: '50+', label: 'Career Paths', icon: <Globe size={20} /> },
  { value: 'Real-time', label: 'AI Analysis', icon: <Zap size={20} /> },
];

export function Home({ onNavigate }: HomeProps) {
  const currentUser = dummyAuth.getCurrentUser();
  const userName = currentUser?.name || 'Anonymous User';
  const assignedMentor = mentorEngine.getMentorForUser(userName);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-slide-up">
            <Sparkles size={14} />
            Global AI Career Intelligence Platform
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Your Career,</span>
            <br />
            <span className="gradient-text">Powered by AI</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AI Career Simulator uses predictive AI, behavioral analytics, and simulation systems to guide your career decisions — 
            from your first job to founding a startup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => onNavigate('simulation')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/25 hover:shadow-primary/40 cursor-pointer"
            >
              Launch Career AI
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('risk')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass text-foreground font-semibold text-lg hover:bg-muted transition-all cursor-pointer"
            >
              Analyze Risks
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Mentor Overview (If Assigned) */}
      {assignedMentor && (
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto glass-card rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 animate-slide-up bg-secondary/5 border-secondary/20 border shadow-2xl shadow-secondary/5">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex flex-shrink-0 items-center justify-center text-secondary font-black text-2xl shadow-inner border border-secondary/30">
                {assignedMentor.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Your Career Mentor</div>
                <h3 className="text-2xl font-black text-foreground">{assignedMentor}</h3>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('messages')}
              className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-secondary text-primary-foreground font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-secondary/25 cursor-pointer"
            >
              <MessageCircle size={18} />
              Message Mentor
            </button>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 text-center animate-slide-up" style={{ animationDelay: `${0.1 * i}s` }}>
              <div className="flex justify-center mb-3 text-primary">{s.icon}</div>
              <div className="text-3xl font-black text-foreground mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">Advanced AI Modules</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each module is a standalone AI system designed to solve a specific career intelligence problem.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m, i) => (
              <button
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className="glass-card rounded-2xl p-6 text-left group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white shadow-xl ${m.glow}`}>
                    {m.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {m.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{m.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{m.desc}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-semibold">
                  Explore
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <p className="text-muted-foreground text-sm">
          © 2025 AI Career Simulator — AI Career Intelligence Platform. Built for the future workforce.
        </p>
      </footer>
    </div>
  );
}
