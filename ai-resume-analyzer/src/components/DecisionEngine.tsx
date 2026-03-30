import { useState } from 'react';
import { Scale, Crown, Plus, X, ChevronRight, Trophy, Minus } from 'lucide-react';
import { CAREER_OPTIONS_LIST } from '../utils/types';
import type { CareerComparison } from '../utils/types';
import { computeDecisionEngine } from '../utils/careerEngine';

interface Props {
  resumeText: string;
}

export default function DecisionEngine({ resumeText }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<CareerComparison | null>(null);

  const toggleOption = (opt: string) => {
    setSelected((prev) => {
      if (prev.includes(opt)) return prev.filter((o) => o !== opt);
      if (prev.length >= 3) return prev;
      return [...prev, opt];
    });
    setResult(null);
  };

  const handleCompare = () => {
    if (selected.length < 2) return;
    const comparison = computeDecisionEngine(resumeText, selected);
    setResult(comparison);
  };

  return (
    <div className="space-y-6">
      {/* Option Selector */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl" style={{ background: '#eef2ff' }}>
            <Scale className="w-5 h-5" style={{ color: '#4f46e5' }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>AI Decision Engine</h3>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Select 2-3 career paths to compare</p>
          </div>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selected.map((opt) => (
              <span
                key={opt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}
              >
                {opt}
                <button onClick={() => toggleOption(opt)} className="cursor-pointer" style={{ color: '#6366f1' }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Option grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-5">
          {CAREER_OPTIONS_LIST.map((opt) => {
            const isSelected = selected.includes(opt);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <button
                key={opt}
                onClick={() => !isDisabled && toggleOption(opt)}
                className="px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer"
                style={
                  isSelected
                    ? { background: '#eef2ff', border: '1px solid #a5b4fc', color: '#4338ca' }
                    : isDisabled
                    ? { background: '#f8fafc', border: '1px solid #e2e8f0', color: '#cbd5e1', cursor: 'not-allowed' }
                    : { background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }
                }
              >
                <div className="flex items-center gap-1.5 justify-center">
                  {isSelected ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleCompare}
          disabled={selected.length < 2}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={
            selected.length >= 2
              ? { background: '#2563eb', color: '#ffffff' }
              : { background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }
          }
        >
          <Scale className="w-4 h-4" />
          Compare ({selected.length}/3 selected)
        </button>
      </div>

      {/* Comparison Results */}
      {result && (
        <>
          {/* Best Choice Card */}
          <div className="rounded-2xl p-6" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl" style={{ background: '#d1fae5' }}>
                <Trophy className="w-5 h-5" style={{ color: '#059669' }} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#059669' }}>AI Recommendation</p>
                <h4 className="text-lg font-bold" style={{ color: '#0f172a' }}>{result.bestChoice}</h4>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-black" style={{ color: '#059669' }}>{result.options[0].total}</p>
                <p className="text-xs" style={{ color: '#94a3b8' }}>/10</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#334155' }}>{result.reasoning}</p>
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th className="text-left text-xs font-medium px-5 py-3" style={{ color: '#94a3b8' }}>Metric</th>
                    {result.options.map((opt) => (
                      <th key={opt.name} className="text-center text-xs font-medium px-4 py-3" style={{ color: opt.name === result.bestChoice ? '#059669' : '#94a3b8' }}>
                        {opt.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(['salary', 'growth', 'stability', 'demand'] as const).map((metric) => (
                    <tr key={metric} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-5 py-3 text-sm capitalize" style={{ color: '#64748b' }}>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3" style={{ color: '#cbd5e1' }} />
                          {metric === 'demand' ? 'Market Demand' : metric}
                        </div>
                      </td>
                      {result.options.map((opt) => {
                        const val = opt[metric];
                        const isMax = val === Math.max(...result.options.map((o) => o[metric]));
                        return (
                          <td key={opt.name} className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-sm font-bold" style={{ color: isMax ? '#059669' : '#64748b' }}>
                                {val.toFixed(1)}
                              </span>
                              <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                                <div
                                  className="h-full rounded-full"
                                  style={{ background: isMax ? '#10b981' : '#94a3b8', width: `${(val / 10) * 100}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr style={{ background: '#f8fafc' }}>
                    <td className="px-5 py-3 text-sm font-semibold" style={{ color: '#0f172a' }}>
                      <div className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5" style={{ color: '#d97706' }} />
                        Overall
                      </div>
                    </td>
                    {result.options.map((opt) => {
                      const isMax = opt.name === result.bestChoice;
                      return (
                        <td key={opt.name} className="px-4 py-3 text-center">
                          <span className="text-lg font-black" style={{ color: isMax ? '#059669' : '#64748b' }}>
                            {opt.total.toFixed(1)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict Details */}
          <div className="rounded-2xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#64748b' }}>Category Winners</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.verdictDetails.map((v, idx) => (
                <div key={idx} className="p-3 rounded-xl text-center" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: '#94a3b8' }}>{v.category}</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: '#0f172a' }}>{v.winner}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
