import { compareCareers, CareerComparison } from '../engine/careerEngine';
import { DECISION_ENGINE_CAREERS } from '../engine/careerData';

const careerChoices = Object.keys(DECISION_ENGINE_CAREERS);


import { useState, useEffect } from 'react';
import { GitFork, TrendingUp, Clock, DollarSign, Users, Sparkles, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';

interface DecisionEngineProps {
  requireAuth?: (cb: () => void) => void;
}

export function DecisionEngine({ requireAuth }: DecisionEngineProps = {}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<CareerComparison[] | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (requireAuth) {
      requireAuth(() => {});
    }
  }, []);

  useEffect(() => {
    if (requireAuth) {
      requireAuth(() => {});
    }
  }, []);


  const toggleChoice = (choice: string) => {
    setSelected(prev =>
      prev.includes(choice) ? prev.filter(c => c !== choice) : prev.length < 4 ? [...prev, choice] : prev
    );
  };

  const analyze = () => {
    const doAnalyze = () => {
      setAnalyzing(true);
      setTimeout(() => {
        const comparisons = compareCareers(selected);
        setResults(comparisons);
        setAnalyzing(false);
      }, 2000);
    };
    if (requireAuth) requireAuth(doAnalyze);
    else doAnalyze();
  };

  const reset = () => {
    setResults(null);
    setSelected([]);
  };

  const best = results?.[0];

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            <GitFork size={14} />
            Decision AI
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">Career Decision Engine</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Confused between career paths? AI compares salary growth, demand, skill compatibility, and time to learn.
          </p>
        </div>

        {!results ? (
          <div className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h3 className="text-foreground font-bold mb-2">What are you confused between?</h3>
              <p className="text-muted-foreground text-sm mb-5">Select 2–4 career options to compare</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {careerChoices.map(choice => (
                  <button
                    key={choice}
                    onClick={() => toggleChoice(choice)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      selected.includes(choice)
                        ? 'bg-amber-600 text-foreground shadow-lg shadow-amber-500/25'
                        : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted/50 border border-border hover:text-foreground'
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {selected.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Selected: {selected.join(' vs ')} ({selected.length}/4)
                </div>
              )}
            </div>

            <button
              onClick={analyze}
              disabled={selected.length < 2 || analyzing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-primary-foreground font-bold text-lg flex items-center justify-center gap-3 hover:from-amber-500 hover:to-orange-500 transition-all shadow-2xl shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI is analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Compare & Decide
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* Best Pick */}
            {best && (
              <div className="glass-card rounded-3xl p-8 border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-5 py-2 rounded-bl-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-primary-foreground text-sm font-bold">
                  🏆 AI Recommends
                </div>
                <h2 className="text-3xl font-black text-foreground mt-4 mb-2">{best.name}</h2>
                <p className="text-amber-400 font-semibold mb-6">Best option based on AI analysis</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
                    <DollarSign size={18} className="text-secondary mx-auto mb-1" />
                    <div className="text-xl font-black text-foreground">{best.salaryGrowth}%</div>
                    <div className="text-xs text-muted-foreground">Salary Growth</div>
                  </div>
                  <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
                    <TrendingUp size={18} className="text-primary mx-auto mb-1" />
                    <div className="text-xl font-black text-foreground">{best.demand}%</div>
                    <div className="text-xs text-muted-foreground">Market Demand</div>
                  </div>
                  <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
                    <Users size={18} className="text-amber-400 mx-auto mb-1" />
                    <div className="text-xl font-black text-foreground">{best.skillMatch}%</div>
                    <div className="text-xs text-muted-foreground">Skill Match</div>
                  </div>
                  <div className="bg-muted/50 border border-border rounded-xl p-4 text-center">
                    <Clock size={18} className="text-violet-400 mx-auto mb-1" />
                    <div className="text-xl font-black text-foreground">{best.timeToLearn}</div>
                    <div className="text-xs text-muted-foreground">Time to Learn</div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="text-foreground font-bold">Detailed Comparison</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-muted-foreground font-medium">Career Path</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Salary Growth</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Demand</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Skill Match</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Time</th>
                      <th className="text-center p-4 text-muted-foreground font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={r.name} className={`border-b border-white/5 ${i === 0 ? 'bg-amber-500/5' : ''}`}>
                        <td className="p-4 text-foreground font-bold flex items-center gap-2">
                          {i === 0 && <CheckCircle2 size={16} className="text-amber-400" />}
                          {r.name}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-secondary font-bold">{r.salaryGrowth}%</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-primary font-bold">{r.demand}%</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-amber-400 font-bold">{r.skillMatch}%</span>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">{r.timeToLearn}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-lg font-black text-lg ${
                            i === 0 ? 'text-amber-400 bg-amber-500/10' : 'text-muted-foreground'
                          }`}>
                            {r.totalScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((r, i) => (
                <div key={r.name} className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    {i === 0 && <span className="text-amber-400">🏆</span>}
                    <h4 className="text-foreground font-bold">{r.name}</h4>
                    <span className="ml-auto text-sm font-bold text-muted-foreground">Score: {r.totalScore}</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {r.pros.map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm text-secondary">
                        <CheckCircle2 size={13} /> {p}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {r.cons.map(c => (
                      <div key={c} className="flex items-center gap-2 text-sm text-rose-400">
                        <ChevronRight size={13} /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              Compare Different Options
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
