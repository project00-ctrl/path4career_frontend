import { useState, useEffect } from 'react';
import { Rocket, Lightbulb, Search, Code, DollarSign, CheckCircle2, Circle, ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';
import { showToast } from './NotificationToast';
import { sendTaskDeadlineReminder } from '../utils/emailService';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  duration: string;
  deadline: string; // human-readable, e.g. "3 days"
  daysLeft: number;
  tasks: string[];
  resources: string[];
  tips: string[];
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Idea Validation',
    description: 'Validate your startup idea before building anything. Talk to potential users, research the market, and refine your value proposition.',
    icon: <Lightbulb size={24} />,
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-amber-600',
    duration: '2-4 weeks',
    deadline: 'Apr 5, 2026',
    daysLeft: 22,
    tasks: [
      'Define the problem you are solving',
      'Interview 20+ potential customers',
      'Analyze existing solutions & competitors',
      'Create a one-page business hypothesis',
      'Build a landing page to test interest',
      'Validate willingness to pay',
    ],
    resources: ['Lean Canvas Template', 'Customer Interview Guide', 'Competitor Analysis Framework'],
    tips: ['Don\'t build before validating', 'Talk to users, not friends', 'If nobody wants it, pivot early'],
  },
  {
    id: 2,
    title: 'Market Research',
    description: 'Deep dive into your target market. Understand the size, growth, competition, and your unique positioning.',
    icon: <Search size={24} />,
    color: 'text-primary',
    gradient: 'bg-primary',
    duration: '2-3 weeks',
    deadline: 'Apr 28, 2026',
    daysLeft: 45,
    tasks: [
      'Calculate TAM, SAM, SOM',
      'Identify target customer segments',
      'Map competitor landscape',
      'Define your unfair advantage',
      'Research industry trends',
      'Create positioning statement',
    ],
    resources: ['Market Sizing Calculator', 'Industry Reports', 'Positioning Framework'],
    tips: ['Focus on niche first', 'Build for a specific persona', 'Validate market size with data'],
  },
  {
    id: 3,
    title: 'MVP Building',
    description: 'Build the minimum viable product. Focus on the core feature that solves the main problem.',
    icon: <Code size={24} />,
    color: 'text-secondary',
    gradient: 'bg-secondary',
    duration: '4-8 weeks',
    deadline: 'Jun 15, 2026',
    daysLeft: 93,
    tasks: [
      'Define core feature set (max 3 features)',
      'Choose tech stack wisely',
      'Build working prototype',
      'Get 10 beta users testing',
      'Collect feedback & iterate',
      'Prepare for initial launch',
    ],
    resources: ['Tech Stack Guide', 'MVP Checklist', 'Beta Testing Framework'],
    tips: ['Ship fast, iterate faster', 'Don\'t over-engineer', 'Focus on one killer feature'],
  },
  {
    id: 4,
    title: 'Fundraising Roadmap',
    description: 'If needed, raise capital to scale. Prepare your pitch, find investors, and close your round.',
    icon: <DollarSign size={24} />,
    color: 'text-violet-400',
    gradient: 'from-violet-500 to-violet-600',
    duration: '6-12 weeks',
    deadline: 'Sep 30, 2026',
    daysLeft: 200,
    tasks: [
      'Create pitch deck (10-12 slides)',
      'Build financial projections',
      'Identify target investors (30-50)',
      'Practice pitch relentlessly',
      'Send warm introductions',
      'Negotiate terms & close',
    ],
    resources: ['Pitch Deck Template', 'Financial Model', 'Investor Database'],
    tips: ['Traction speaks louder than slides', 'Always be fundraising', 'SAFE notes for early stage'],
  },
];

interface StartupPathProps {
  isAuthenticated?: boolean;
  requireAuth?: (cb: () => void) => void;
}

export function StartupPath({ isAuthenticated }: StartupPathProps = {}) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<Record<number, string>>({});
  // Track completed tasks per step: { [stepId]: Set<taskIndex> }
  const [completedTasks, setCompletedTasks] = useState<Record<number, Set<number>>>({});

  const toggleComplete = (id: number) => {
    setCompletedSteps(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleTaskComplete = (stepId: number, taskIdx: number, taskName: string) => {
    setCompletedTasks(prev => {
      const prevSet = prev[stepId] || new Set();
      const newSet = new Set(prevSet);
      const step = steps.find(s => s.id === stepId)!;
      if (newSet.has(taskIdx)) {
        newSet.delete(taskIdx);
      } else {
        newSet.add(taskIdx);
        // Task completed toast
        showToast({
          type: 'success',
          title: 'Task Completed! 🎉',
          message: `"${taskName}" marked done in ${step.title}.`,
          duration: 4000,
        });
        // Fire email reminder if deadline is close
        if (step.daysLeft <= 7) {
          sendTaskDeadlineReminder('user@example.com', taskName, step.title, step.daysLeft);
          showToast({
            type: 'deadline',
            title: '⏰ Deadline Approaching!',
            message: `${step.title} deadline in ${step.daysLeft} day(s) — ${step.deadline}`,
            duration: 7000,
          });
        }
      }

      // Auto-unlock next step logic
      const stepIndex = steps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        if (newSet.size === step.tasks.length) {
          setCompletedSteps(cs => cs.includes(stepId) ? cs : [...cs, stepId]);
          if (stepIndex + 1 < steps.length) {
            setExpandedStep(steps[stepIndex + 1].id);
            showToast({
              type: 'email',
              title: '🔓 Next Step Unlocked!',
              message: `You unlocked "${steps[stepIndex + 1].title}". Keep going!`,
              duration: 5000,
            });
          } else {
            showToast({
              type: 'success',
              title: '🏆 Startup Path Complete!',
              message: 'Congratulations! You\'ve completed all founder journey steps.',
              duration: 7000,
            });
          }
        } else {
          setCompletedSteps(cs => cs.filter(id => id !== stepId));
        }
      }

      return { ...prev, [stepId]: newSet };
    });
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate total tasks and completed tasks for dynamic progress
  const totalTasks = steps.reduce((sum, step) => sum + step.tasks.length, 0);
  const completedTaskCount = steps.reduce((sum, step) => sum + (completedTasks[step.id]?.size || 0), 0);
  const progress = totalTasks > 0 ? (completedTaskCount / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            <Rocket size={14} />
            Entrepreneurship
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">Startup Founder Path</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            AI guides aspiring entrepreneurs through the complete startup journey — from idea to fundraising.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground font-bold text-sm">Your Founder Journey</h3>
            <span className="text-orange-400 font-bold text-sm">{completedTaskCount}/{totalTasks} tasks completed</span>
          </div>
          <div className="w-full bg-muted/50 border border-border rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: mounted ? `${progress}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {steps.map(s => (
              <div key={s.id} className={`flex items-center gap-1 text-xs ${completedSteps.includes(s.id) ? 'text-orange-400' : 'text-muted-foreground'}`}>
                {completedSteps.includes(s.id) ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                <span className="hidden sm:inline">{s.title.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => {
            const isExpanded = expandedStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            // Remove locks after login - all steps unlocked for authenticated users
            const isLocked = isAuthenticated ? false : (step.id > 1 && !completedSteps.includes(step.id - 1));
            const tab = activeTab[step.id] || 'tasks';

            return (
              <div
                key={step.id}
                className={`glass-card rounded-2xl overflow-hidden animate-slide-up ${isCompleted ? 'border-primary/20' : ''} ${isLocked ? 'opacity-60 grayscale-[50%]' : ''}`}
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                {/* Step Header */}
                <button
                  onClick={() => {
                    if (!isLocked) setExpandedStep(isExpanded ? null : step.id);
                  }}
                  className={`w-full flex items-center gap-4 p-5 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={isLocked}
                >
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (!isLocked) toggleComplete(step.id); 
                    }}
                    disabled={isLocked}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                      isCompleted
                        ? `bg-primary text-primary-foreground shadow-lg`
                        : 'bg-muted/50 border border-border text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={22} /> : step.icon}
                  </button>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground text-xs font-bold">STEP {step.id}</span>
                      {isCompleted && <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">COMPLETED</span>}
                      {isLocked && <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border flex items-center gap-1">LOCKED</span>}
                    </div>
                    <h3 className={`font-bold truncate ${isCompleted ? 'text-primary' : isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                      📅 Deadline: {step.deadline} · {step.daysLeft}d left
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">{step.duration}</span>
                    {isExpanded ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && !isLocked && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{step.description}</p>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4">
                      {['tasks', 'resources', 'tips'].map(t => (
                        <button
                          key={t}
                          onClick={() => setActiveTab(prev => ({ ...prev, [step.id]: t }))}
                          className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all cursor-pointer ${
                            tab === t
                              ? `bg-primary text-primary-foreground`
                              : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted/50 border border-border'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-2">
                      {(tab === 'tasks' ? step.tasks : tab === 'resources' ? step.resources : step.tips).map((item, j) => (
                        <div key={j} className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 border border-border rounded-xl p-3">
                          {tab === 'tasks' ? (
                            <>
                              <button
                                onClick={() => toggleTaskComplete(step.id, j, item)}
                                className={`w-6 h-6 flex items-center justify-center rounded-full border transition-colors cursor-pointer ${completedTasks[step.id]?.has(j) ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground hover:bg-muted'}`}
                                aria-label={completedTasks[step.id]?.has(j) ? 'Mark as not done' : 'Mark as done'}
                              >
                                {completedTasks[step.id]?.has(j) ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                              </button>
                              <span className={completedTasks[step.id]?.has(j) ? 'line-through text-primary' : ''}>{item}</span>
                            </>
                          ) : tab === 'resources' ? (
                            <>
                              <ArrowRight size={16} className={`mt-0.5 flex-shrink-0 text-primary`} />
                              {item}
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} className={`mt-0.5 flex-shrink-0 text-primary`} />
                              {item}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
