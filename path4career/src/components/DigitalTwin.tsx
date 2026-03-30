import { predictSalary, SalaryPrediction } from '../engine/careerEngine';
import { SKILLS, CURRENT_ROLES, EXPERIENCE_LEVELS } from '../engine/careerData';

const availableSkills = Object.keys(SKILLS).map(name => ({ name, selected: false }));
const experienceLevels = Object.keys(EXPERIENCE_LEVELS);
const currentRoles = Object.keys(CURRENT_ROLES);


import { useState, useEffect } from 'react';
import { Fingerprint, Cpu, TrendingUp, Zap, Calendar, ArrowRight, RotateCcw, Sparkles, Target, BookOpen } from 'lucide-react';

interface SkillUpgrade {
  name: string;
  selected: boolean;
}

interface DigitalTwinProps {
  requireAuth?: (cb: () => void) => void;
}

export function DigitalTwin({ requireAuth }: DigitalTwinProps = {}) {

  const [step, setStep] = useState(0); // 0: Role, 1: Experience, 2: Skills, 3: Year, 4: Result
  const [skills, setSkills] = useState<SkillUpgrade[]>(availableSkills);
  const [experience, setExperience] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [targetYear, setTargetYear] = useState(2030);
  const [result, setResult] = useState<SalaryPrediction | null>(null);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (requireAuth) {
      requireAuth(() => {});
    }
  }, []);

  const selectedSkills = skills.filter(s => s.selected);

  const getCompletedStepsCount = () => {
    let count = 0;
    if (currentRole) count++;
    if (experience) count++;
    if (selectedSkills.length > 0) count++;
    if (targetYear) count++;
    return count;
  };
  const completedSteps = getCompletedStepsCount();



  const simulate = () => {
    const doSimulate = () => {
      setProcessing(true);
      setTimeout(() => {
        const salaryPrediction = predictSalary({
          currentRole,
          experience,
          skills: selectedSkills.map(s => s.name),
          targetYear
        });
        setResult(salaryPrediction);
        setProcessing(false);
        setStep(4); // Move to result step
      }, 3000);
    };
    if (requireAuth) requireAuth(doSimulate);
    else doSimulate();
  };

  const reset = () => {
    setResult(null);
    setSkills(availableSkills);
    setExperience('');
    setCurrentRole('');
    setStep(0);
    setProcessing(false);
    setTargetYear(2030);
  };

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            <Fingerprint size={14} />
            Very Advanced
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">Career Digital Twin</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Create a virtual version of your career profile. AI simulates skill upgrades, career moves, salary growth, and industry shifts.
          </p>
        </div>

        {/* Step Wizard */}
        {step < 4 ? (
          <div className="max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {step + 1} of 4
                </span>
                <span className="text-sm font-medium text-violet-500">
                  {Math.round((completedSteps / 4) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-violet-500 to-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedSteps / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="relative min-h-auto overflow-hidden">
              {/* Step 0: Current Role */}
              {step === 0 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <Target size={20} className="text-violet-400" />
                    What is your current role?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Select your current position in your career journey.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {currentRoles.map(role => (
                      <button
                        key={role}
                        onClick={() => setCurrentRole(currentRole === role ? '' : role)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                          currentRole === role
                            ? 'bg-violet-600 text-foreground shadow-lg shadow-violet-500/25'
                            : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted/50 border border-border'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Experience */}
              {step === 1 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <BookOpen size={20} className="text-primary" />
                    What is your experience level?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Select your total years of professional experience.
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {experienceLevels.map(exp => (
                      <button
                        key={exp}
                        onClick={() => setExperience(experience === exp ? '' : exp)}
                        className={`px-3 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          experience === exp
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted/50 border border-border'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Skill Upgrades */}
              {step === 2 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <Zap size={20} className="text-amber-400" />
                    Skills you plan to learn
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">Select skills to see how they impact your future.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {skills.map(skill => (
                      <button
                        key={skill.name}
                        onClick={() => setSkills(prev => prev.map(s => s.name === skill.name ? { ...s, selected: !s.selected } : s))}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
                          skill.selected
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                            : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted/50 border border-border'
                        }`}
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Target Year */}
              {step === 3 && (
                <div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <h3 className="text-foreground font-bold text-2xl mb-2 flex items-center gap-2">
                    <Calendar size={20} className="text-secondary" />
                    Predict until year: <span className="text-secondary">{targetYear}</span>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">Choose the year to predict your career growth until.</p>
                  <input
                    type="range"
                    min={2026}
                    max={2035}
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>2026</span>
                    <span>2035</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 rounded-xl bg-muted text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all cursor-pointer"
                >
                  <RotateCcw size={18} />
                  Back
                </button>
              )}
              <button
                onClick={step === 3 ? simulate : () => setStep(step + 1)}
                disabled={
                  (step === 0 && !currentRole) ||
                  (step === 1 && !experience) ||
                  (step === 2 && selectedSkills.length === 0) ||
                  (step === 3 && !targetYear) ||
                  processing
                }
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  step === 3
                    ? processing
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-gradient-to-r from-violet-500 to-primary text-primary-foreground hover:shadow-lg'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Digital Twin...
                  </>
                ) : step === 3 ? (
                  <>
                    <Fingerprint size={20} />
                    Generate Career Digital Twin
                  </>
                ) : (
                  <>
                    Next
                  </>
                )}
              </button>
            </div>

            {/* Selected Summary */}
            {(currentRole || experience || selectedSkills.length > 0 || (step >= 3 && targetYear)) && (
              <div className="mt-8 glass-card rounded-2xl p-4 text-sm">
                <p className="text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">Your selections:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentRole && <span className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-500 text-xs font-medium">{currentRole}</span>}
                  {experience && <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">{experience}</span>}
                  {selectedSkills.map(s => (
                    <span key={s.name} className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">{s.name}</span>
                  ))}
                  {step >= 3 && targetYear && <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium">{targetYear}</span>}
                </div>
              </div>
            )}
          </div>
        ) : (
          // ...existing code for result rendering...
          <>
          {/* Salary Prediction Hero */}
          <div className="space-y-6 animate-slide-up">
            <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-primary/10" />
              <div className="relative z-10">
                <div className="text-muted-foreground text-sm mb-2">If you learn {selectedSkills.map(s => s.name).join(' + ')}</div>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">{result?.year} Salary Prediction</h2>
                <div className="text-5xl sm:text-7xl font-black gradient-text mb-2 animate-count-up">{result?.predictedSalary ? `₹${result.predictedSalary}L` : result?.salaryRange}</div>
                <div className="flex items-center justify-center gap-2 text-secondary font-bold">
                  <TrendingUp size={18} />
                  +{result?.growthPercent}% growth from ₹{result?.baseSalary}L current
                </div>

              </div>
            </div>

            {/* Career Timeline */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-foreground font-bold mb-6 flex items-center gap-2">
                <Cpu size={18} className="text-violet-400" />
                Predicted Career Timeline
              </h3>
              <div className="space-y-4">
                {result?.careerMoves.map((move, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-16 text-right">
                      <span className="text-violet-400 font-black">{move.year}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${i === (result?.careerMoves.length ?? 0) - 1 ? 'bg-gradient-to-r from-violet-500 to-primary animate-pulse-glow' : 'bg-violet-500/50'}`} />
                      {i < (result?.careerMoves.length ?? 0) - 1 && <div className="w-0.5 h-8 bg-violet-500/20" />}
                    </div>
                    <div className="flex-1 bg-muted/50 border border-border rounded-xl p-4">
                      <div className="text-foreground font-bold text-sm">{move.role}</div>
                      <div className="text-muted-foreground text-xs">{move.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Impact */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-foreground font-bold mb-5">Skill Impact Analysis</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {result?.skillImpact.map((si, i) => (
                  <div key={i} className="bg-muted/50 border border-border rounded-xl p-4">
                    <div className="text-foreground font-bold text-sm mb-3">{si.skill}</div>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Salary Boost</div>
                        <div className="text-secondary font-black">{si.salaryBoost}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Demand Boost</div>
                        <div className="text-primary font-black">{si.demandBoost}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Shifts */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-foreground font-bold mb-4">Industry Shifts to Watch</h3>
              <div className="space-y-3">
                {result?.industryShifts.map((shift, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ArrowRight size={14} className="text-violet-400 flex-shrink-0" />
                    {shift}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="glass-card rounded-2xl p-6 border-violet-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} className="text-violet-400" />
                </div>
                <div>
                  <h4 className="text-foreground font-bold mb-1">AI Twin Recommendation</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{result?.recommendation}</p>
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              Create New Twin
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
