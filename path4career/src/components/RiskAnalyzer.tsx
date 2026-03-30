import { analyzeRisk, RiskAnalysis } from '../engine/careerEngine';
import { CAREERS } from '../engine/careerData';
import { Modal } from './ui/Modal';
import { useState, useEffect } from 'react';
import { ShieldAlert, TrendingDown, Bot, Users, AlertTriangle, CheckCircle, XCircle, BarChart3, Zap, Search } from 'lucide-react';

const careerNames = Object.keys(CAREERS);


const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Low': return 'text-secondary';
    case 'Medium': return 'text-amber-400';
    case 'High': return 'text-rose-400';
    case 'Critical': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
};

const getRiskBg = (risk: string) => {
  switch (risk) {
    case 'Low': return 'bg-secondary/10 border-secondary/20';
    case 'Medium': return 'bg-amber-500/10 border-amber-500/20';
    case 'High': return 'bg-rose-500/10 border-rose-500/20';
    case 'Critical': return 'bg-red-500/10 border-red-500/20';
    default: return 'bg-muted/50 border border-border';
  }
};

const getBarColor = (value: number) => {
  if (value <= 25) return 'bg-secondary';
  if (value <= 50) return 'bg-amber-500';
  if (value <= 75) return 'bg-orange-500';
  return 'bg-rose-500';
};

interface RiskAnalyzerProps {
  requireAuth?: (cb: () => void) => void;
}

export function RiskAnalyzer({ requireAuth }: RiskAnalyzerProps = {}) {
  const [search, setSearch] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<RiskAnalysis | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (requireAuth) {
      requireAuth(() => {});
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    if (requireAuth) {
      requireAuth(() => {});
    }
  }, []);

  const handleSelectCareer = (careerName: string) => {
    const doSelect = () => {
      const risk = analyzeRisk(careerName);
      setSelectedCareer(risk);
    };
    if (requireAuth) requireAuth(doSelect);
    else doSelect();
  };

  const filtered = careerNames.filter(name =>
    name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-4">
            <ShieldAlert size={14} />
            Risk Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">Career Risk Analyzer</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            AI predicts job saturation, layoff probability, and automation risks to help you future-proof your career.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search a career to analyze..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-xl glass text-foreground placeholder-slate-500 outline-none focus:ring-2 focus:ring-rose-500/30 transition-all"
            />
          </div>
        </div>

        {/* Risk Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {filtered.map((name, i) => {
            const career = analyzeRisk(name);
            return (
              <button
                key={name}
                onClick={() => handleSelectCareer(name)}
                className={`glass-card rounded-2xl p-5 text-left cursor-pointer animate-slide-up ${
                  selectedCareer?.career === name ? 'ring-2 ring-primary/40' : ''
                }`}
                style={{ animationDelay: `${0.05 * i}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-foreground font-bold text-sm">{name}</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    career.overallRisk === 'Low' ? 'bg-secondary' :
                    career.overallRisk === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                </div>

                <div className="mb-3">
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Risk Score</span>
                    <span className={`text-2xl font-black ${getRiskColor(career.overallRisk)}`}>{career.score}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`${getBarColor(career.score)} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: mounted ? `${career.score}%` : '0%' }}
                    />
                  </div>
                </div>

                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${getRiskBg(career.overallRisk)} ${getRiskColor(career.overallRisk)}`}>
                  {career.overallRisk === 'Low' ? <CheckCircle size={12} /> :
                   career.overallRisk === 'Medium' ? <AlertTriangle size={12} /> :
                   <XCircle size={12} />}
                  {career.overallRisk} Risk
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed View Modal */}
        <Modal
          isOpen={!!selectedCareer}
          title={selectedCareer ? `${selectedCareer.career} - Risk Analysis` : ''}
          onClose={() => setSelectedCareer(null)}
          size="lg"
          closeButton
        >
          {selectedCareer && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">Comprehensive AI risk analysis</p>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getRiskBg(selectedCareer.overallRisk)} ${getRiskColor(selectedCareer.overallRisk)} font-bold`}>
                  <ShieldAlert size={18} />
                  Risk Score: {selectedCareer.score}/100
                </div>
              </div>

              {/* Risk Bars */}
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Job Saturation', value: selectedCareer.saturation, icon: <Users size={16} /> },
                  { label: 'Automation Risk', value: selectedCareer.automation, icon: <Bot size={16} /> },
                  { label: 'Layoff Probability', value: selectedCareer.layoffRisk, icon: <TrendingDown size={16} /> },
                ].map(item => (
                  <div key={item.label} className="bg-muted/50 border border-border rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      {item.icon}
                      {item.label}
                    </div>
                    <div className="text-2xl font-black text-foreground mb-2">{item.value}%</div>
                    <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${getBarColor(item.value)} h-2 rounded-full transition-all duration-1000 ease-out delay-300`}
                        style={{ width: mounted ? `${item.value}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Impact & Recommendation */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
                    <Bot size={16} />
                    Risk Recommendation
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{selectedCareer.recommendation}</p>
                </div>

                <div className="bg-muted/50 border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-secondary font-bold text-sm mb-2">
                    <Zap size={16} />
                    AI Insight
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{selectedCareer.recommendation}</p>
                </div>
              </div>

              {/* Demand & Factors */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-muted/50 border border-border rounded-2xl p-4">
                  <div className="text-sm text-muted-foreground mb-2">Demand Trend</div>
                  <div className={`text-lg font-black flex items-center gap-2 ${
                    selectedCareer.demandTrend === 'Rising' ? 'text-secondary' :
                    selectedCareer.demandTrend === 'Stable' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    <BarChart3 size={18} />
                    {selectedCareer.demandTrend}
                  </div>
                </div>
                <div className="col-span-2 bg-muted/50 border border-border rounded-2xl p-4">
                  <div className="text-sm text-muted-foreground mb-3">Key Risk Factors</div>
                  <div className="space-y-2">
                    {selectedCareer.factors.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setSelectedCareer(null)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground font-bold hover:bg-muted/80 transition-all"
                >
                  Close
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
                  Book Mentor
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
