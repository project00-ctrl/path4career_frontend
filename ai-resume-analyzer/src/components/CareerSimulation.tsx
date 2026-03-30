import { useState } from 'react';
import {
  Rocket,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';
import { SIMULATION_ROLES, type SimulationRole } from '../utils/types';
import type { SimulationResult } from '../utils/types';
import { computeCareerSimulation } from '../utils/careerEngine';

interface Props {
  resumeText: string;
}

const trendConfig = {
  rising: { icon: TrendingUp, text: '#059669', bg: '#ecfdf5', label: 'Rising ↑' },
  stable: { icon: Minus, text: '#d97706', bg: '#fffbeb', label: 'Stable →' },
  declining: { icon: TrendingDown, text: '#dc2626', bg: '#fef2f2', label: 'Declining ↓' },
};

const difficultyConfig = {
  easy: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  moderate: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  challenging: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
};

export default function CareerSimulation({ resumeText }: Props) {
  const [selectedRole, setSelectedRole] = useState<SimulationRole>(SIMULATION_ROLES[0]);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = () => {
    const sim = computeCareerSimulation(resumeText, selectedRole);
    setResult(sim);
  };

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl" style={{ background: '#f5f3ff' }}>
            <Rocket className="w-5 h-5" style={{ color: '#7c3aed' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>Career Path Simulator</h3>
        </div>
        <p className="text-sm mb-4" style={{ color: '#64748b' }}>
          Select a target role to simulate your career transition
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as SimulationRole)}
            className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors appearance-none cursor-pointer"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
          >
            {SIMULATION_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={handleSimulate}
            className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-opacity cursor-pointer flex items-center gap-2 justify-center hover:opacity-90"
            style={{ background: '#2563eb' }}
          >
            <Zap className="w-4 h-4" />
            Simulate
          </button>
        </div>
      </div>

      {/* Simulation Results */}
      {result && (
        <>
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Learning Time */}
            <div className="rounded-2xl p-5 hover:scale-[1.02] transition-all" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" style={{ color: '#2563eb' }} />
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#94a3b8' }}>Learning Time</span>
              </div>
              <p className="text-3xl font-black" style={{ color: '#0f172a' }}>
                {result.learningTimeMonths}
                <span className="text-lg font-normal ml-1" style={{ color: '#94a3b8' }}>mo</span>
              </p>
              <div className="mt-2 inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: difficultyConfig[result.difficulty].bg, color: difficultyConfig[result.difficulty].text, border: `1px solid ${difficultyConfig[result.difficulty].border}` }}>
                {result.difficulty}
              </div>
            </div>

            {/* Salary */}
            <div className="rounded-2xl p-5 hover:scale-[1.02] transition-all" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4" style={{ color: '#059669' }} />
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#94a3b8' }}>Salary Range</span>
              </div>
              <p className="text-2xl font-black" style={{ color: '#0f172a' }}>
                ${(result.salaryRange.median / 1000).toFixed(0)}K
              </p>
              <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                ${(result.salaryRange.min / 1000).toFixed(0)}K – ${(result.salaryRange.max / 1000).toFixed(0)}K
              </p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                <div
                  className="h-full rounded-full"
                  style={{ background: '#10b981', width: `${(result.salaryRange.median / 250000) * 100}%` }}
                />
              </div>
            </div>

            {/* Demand */}
            <div className="rounded-2xl p-5 hover:scale-[1.02] transition-all" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" style={{ color: '#7c3aed' }} />
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: '#94a3b8' }}>Demand Trend</span>
              </div>
              <p className="text-3xl font-black" style={{ color: '#0f172a' }}>
                {result.demandScore.toFixed(1)}
                <span className="text-lg font-normal" style={{ color: '#94a3b8' }}>/10</span>
              </p>
              {(() => {
                const tc = trendConfig[result.demandTrend];
                const TrendIcon = tc.icon;
                return (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.text }}>
                    <TrendIcon className="w-3 h-3" />
                    {tc.label}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Skill Match */}
          <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold" style={{ color: '#0f172a' }}>Skill Match</h4>
              <span className="text-sm font-bold" style={{ color: result.matchPercent >= 60 ? '#059669' : result.matchPercent >= 30 ? '#d97706' : '#dc2626' }}>{result.matchPercent}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-5" style={{ background: '#e2e8f0' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  background: result.matchPercent >= 60 ? '#10b981' : result.matchPercent >= 30 ? '#f59e0b' : '#ef4444',
                  width: `${result.matchPercent}%`,
                }}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: '#64748b' }}>
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#059669' }} />
                  Skills You Have ({result.matchedSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px]"
                      style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}
                    >
                      {skill}
                    </span>
                  ))}
                  {result.matchedSkills.length === 0 && (
                    <span className="text-xs" style={{ color: '#94a3b8' }}>No matching skills found</span>
                  )}
                </div>
              </div>

              {/* Gap Skills */}
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: '#64748b' }}>
                  <XCircle className="w-3.5 h-3.5" style={{ color: '#dc2626' }} />
                  Skills to Learn ({result.gapSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.gapSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px]"
                      style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }}
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
