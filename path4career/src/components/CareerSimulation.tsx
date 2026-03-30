import { simulateCareer, SimulationResult } from '../engine/careerEngine';
import { SKILLS, EDUCATION_MULTIPLIERS, GOAL_SCENARIO_IMPACT, LEARNING_PACE_MULTIPLIERS } from '../engine/careerData';

const skillOptions = Object.keys(SKILLS);
const educationOptions = Object.keys(EDUCATION_MULTIPLIERS);
const goalOptions = Object.keys(GOAL_SCENARIO_IMPACT);
const speedOptions = Object.keys(LEARNING_PACE_MULTIPLIERS);


import { useState, useEffect } from 'react';
import { Brain, Play, Briefcase, TrendingUp, AlertTriangle, Sparkles, ChevronRight, RotateCcw, ChevronLeft, CheckCircle } from 'lucide-react';


interface CareerSimulationProps {
  requireAuth?: (cb: () => void) => void;
}

export function CareerSimulation({ requireAuth }: CareerSimulationProps = {}) {
  const [currentStep, setCurrentStep] = useState(0); // 0: Skills, 1: Education, 2: Goal, 3: Speed
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [education, setEducation] = useState('');
  const [goal, setGoal] = useState('');
  const [speed, setSpeed] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [mounted, setMounted] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const goNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    setMounted(true);
    // Enforce authentication immediately on mount
    if (requireAuth) {
      requireAuth(() => {}); 
    }
  }, []);

  const runSimulation = () => {
    const doSimulate = () => {
      setSimulating(true);
      setTimeout(() => {
        const simulationResult = simulateCareer({
          skills: selectedSkills,
          education,
          goal,
          speed
        });
        setResult(simulationResult);
        setSimulating(false);
        setActiveScenario(simulationResult.primaryScenarioIndex);
      }, 2500);
    };
    if (requireAuth) requireAuth(doSimulate);
    else doSimulate();
  };

  const reset = () => {
    setCurrentStep(0);
    setResult(null);
    setSelectedSkills([]);
    setEducation('');
    setGoal('');
    setSpeed('');
  };

  const getCompletedStepsCount = () => {
    let count = 0;
    if (selectedSkills.length > 0) count++;
    if (education) count++;
    if (goal) count++;
    if (speed) count++;
    return count;
  };

  const completedSteps = getCompletedStepsCount();

  return (
    <div className="min-h-screen pb-16 px-4">
      <div className="max-w-5xl mx-auto pt-12 lg:pt-20">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Brain size={14} />
            Predictive AI Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">Career Simulation</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simulate your future career path over the next 10 years using AI-powered predictive models.
          </p>
        </div>

        {!result ? (
          /* Stepped Input Form Wizard */
          <div className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep + 1} of 4
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round((completedSteps / 4) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedSteps / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content Container */}
            <div className="relative min-h-auto overflow-hidden">
              {/* Step 0: Skills Selection */}
              {currentStep === 0 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <Sparkles size={20} className="text-primary" />
                    What are your current skills?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Select one or more skills that you currently have. You can select all that apply.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {skillOptions.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                          selectedSkills.includes(skill)
                            ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border'
                        }`}
                      >
                        {selectedSkills.includes(skill) && (
                          <CheckCircle size={14} className="inline mr-2" />
                        )}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Education Level */}
              {currentStep === 1 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    What's your education level?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Select your highest level of formal education or training.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {educationOptions.map(edu => (
                      <button
                        key={edu}
                        onClick={() => setEducation(education === edu ? '' : edu)}
                        className={`px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 border ${
                          education === edu
                            ? 'bg-gradient-to-r from-primary to-secondary border-primary text-primary-foreground shadow-lg'
                            : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {education === edu && (
                          <CheckCircle size={14} className="inline mr-2" />
                        )}
                        {edu}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Career Goal */}
              {currentStep === 2 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    What's your career goal?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Choose where you'd like your career to lead in the next 10 years.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {goalOptions.map(g => (
                      <button
                        key={g}
                        onClick={() => setGoal(goal === g ? '' : g)}
                        className={`px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 border ${
                          goal === g
                            ? 'bg-gradient-to-r from-primary to-secondary border-primary text-primary-foreground shadow-lg'
                            : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {goal === g && (
                          <CheckCircle size={14} className="inline mr-2" />
                        )}
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Learning Speed */}
              {currentStep === 3 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <Play size={20} className="text-primary" />
                    What's your learning pace?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Select how intensively you want to pursue your career growth.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {speedOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => setSpeed(speed === s ? '' : s)}
                        className={`px-4 py-4 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 border ${
                          speed === s
                            ? 'bg-gradient-to-r from-primary to-secondary border-primary text-primary-foreground shadow-lg'
                            : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {speed === s && (
                          <CheckCircle size={14} className="inline mr-2" />
                        )}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-2">
              {currentStep > 0 && (
                <button
                  onClick={goPrevStep}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all cursor-pointer"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              )}
              
              <button
                onClick={currentStep === 3 ? runSimulation : goNextStep}
                disabled={
                  (currentStep === 0 && selectedSkills.length === 0) ||
                  (currentStep === 1 && !education) ||
                  (currentStep === 2 && !goal) ||
                  (currentStep === 3 && !speed) ||
                  simulating
                }
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  currentStep === 3
                    ? simulating
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {simulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                    Running...
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <Play size={18} />
                    Run Simulation
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Selected Summary */}
            {(selectedSkills.length > 0 || education || goal || speed) && (
              <div className="mt-8 glass-card rounded-2xl p-4 text-sm">
                <p className="text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">Your selections:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">{s}</span>
                  ))}
                  {education && <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">{education}</span>}
                  {goal && <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium">{goal}</span>}
                  {speed && <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">{speed}</span>}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results */
          <div className="space-y-6 animate-slide-up">
            {/* Scenario Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {result.scenarios.map((_s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScenario(i)}
                  className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                    activeScenario === i
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md'
                      : 'glass text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Scenario {String.fromCharCode(65 + i)}
                </button>
              ))}
            </div>

            {/* Active Scenario */}
            {(() => {
              const s = result.scenarios[activeScenario];
              return (
                <div className="glass-card rounded-3xl p-8 animate-fade-in" key={activeScenario}>
                  {/* Career Path */}
                  <h3 className="text-foreground font-bold text-lg mb-6">Career Trajectory</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    {s.path.map((step, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
                          {step}
                        </span>
                        {j < s.path.length - 1 && <ChevronRight size={16} className="text-muted-foreground" />}
                      </div>
                    ))}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-muted/50 border border-border rounded-2xl p-5">
                      <div className="text-sm text-muted-foreground mb-1">Estimated Salary</div>
                      <div className="text-2xl font-black text-emerald-500">{s.salary}</div>
                    </div>
                    <div className="bg-muted/50 border border-border rounded-2xl p-5">
                      <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                      <div className={`text-2xl font-black ${s.riskColor} flex items-center gap-2`}>
                        <AlertTriangle size={20} />
                        {s.risk}
                      </div>
                    </div>
                    <div className="bg-muted/50 border border-border rounded-2xl p-5">
                      <div className="text-sm text-muted-foreground mb-1">Probability</div>
                      <div className="text-2xl font-black text-primary">{s.probability}%</div>
                      <div className="w-full bg-border rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 ease-out delay-300"
                          style={{ width: mounted ? `${s.probability}%` : '0%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-6">
                    <h4 className="text-foreground font-semibold mb-3">Key Highlights</h4>
                    <div className="space-y-2">
                      {s.highlights.map((h, j) => (
                        <div key={j} className="flex items-center gap-3 text-foreground/80 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">Timeline: {s.timeline}</div>
                </div>
              );
            })()}

            {/* AI Recommendation */}
            <div className="glass-card rounded-2xl p-6 border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-foreground font-bold mb-1">AI Recommendation</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{result.recommendation}</p>
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              Run New Simulation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
