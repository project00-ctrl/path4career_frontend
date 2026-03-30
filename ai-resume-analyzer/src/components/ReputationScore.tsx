import { useEffect, useState } from 'react';
import { Award, Star, Zap, ChevronUp, Sparkles } from 'lucide-react';
import type { ReputationResult } from '../utils/types';

interface Props {
  data: ReputationResult;
}

const levelConfig = {
  beginner: {
    label: 'Beginner',
    color: '#6b7280',
    gradient: 'from-gray-500 to-slate-600',
    bg: '#f8fafc',
    text: '#6b7280',
    border: '#e2e8f0',
    ringBg: '#f1f5f9',
  },
  professional: {
    label: 'Professional',
    color: '#2563eb',
    gradient: 'from-blue-500 to-indigo-600',
    bg: '#eff6ff',
    text: '#2563eb',
    border: '#bfdbfe',
    ringBg: '#dbeafe',
  },
  expert: {
    label: 'Expert',
    color: '#7c3aed',
    gradient: 'from-purple-500 to-pink-600',
    bg: '#f5f3ff',
    text: '#7c3aed',
    border: '#c4b5fd',
    ringBg: '#ede9fe',
  },
  elite: {
    label: 'Elite',
    color: '#d97706',
    gradient: 'from-amber-400 to-yellow-600',
    bg: '#fffbeb',
    text: '#d97706',
    border: '#fde68a',
    ringBg: '#fef3c7',
  },
};

const breakdownMeta = [
  { key: 'skills' as const, label: 'Skills', max: 40, color: '#0891b2', icon: Zap },
  { key: 'projects' as const, label: 'Projects', max: 25, color: '#7c3aed', icon: Star },
  { key: 'certifications' as const, label: 'Certifications', max: 20, color: '#d97706', icon: Award },
  { key: 'experience' as const, label: 'Experience', max: 15, color: '#db2777', icon: Sparkles },
];

export default function ReputationScore({ data }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const lc = levelConfig[data.level];

  useEffect(() => {
    let current = 0;
    const step = data.score / 80;
    const interval = setInterval(() => {
      current += step;
      if (current >= data.score) {
        current = data.score;
        clearInterval(interval);
      }
      setAnimatedScore(Math.round(current));
    }, 16);
    return () => clearInterval(interval);
  }, [data.score]);

  const circumference = 2 * Math.PI * 80;
  const progress = (animatedScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Score Hero */}
      <div className="rounded-2xl p-8" style={{ background: lc.bg, border: `1px solid ${lc.border}` }}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circular Score */}
          <div className="relative flex-shrink-0">
            <svg width="190" height="190" className="-rotate-90">
              <circle cx="95" cy="95" r="80" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <circle
                cx="95"
                cy="95"
                r="80"
                fill="none"
                stroke={lc.color}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.05s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black" style={{ color: '#0f172a' }}>{animatedScore}</span>
              <span className="text-xs" style={{ color: '#94a3b8' }}>/100</span>
            </div>
          </div>

          {/* Level Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${lc.gradient} shadow-lg`}>
                <span className="text-sm font-bold text-white">{lc.label}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: '#0f172a' }}>Reputation Score</h3>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Your professional reputation based on skills, projects, and certifications
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {data.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: lc.ringBg, color: lc.text, border: `1px solid ${lc.border}` }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Level Progress */}
      {data.level !== 'elite' && (
        <div className="rounded-2xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm flex items-center gap-2" style={{ color: '#64748b' }}>
              <ChevronUp className="w-4 h-4" style={{ color: '#2563eb' }} />
              Next Level: <strong style={{ color: '#0f172a' }}>{data.nextLevel}</strong>
            </span>
            <span className="text-xs" style={{ color: '#94a3b8' }}>{data.score} / {data.nextLevelAt}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
            <div
              className={`h-full bg-gradient-to-r ${lc.gradient} rounded-full transition-all duration-1000`}
              style={{ width: `${data.progressToNext}%` }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>
            {data.nextLevelAt - data.score} points to reach {data.nextLevel} level
          </p>
        </div>
      )}

      {/* Breakdown */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <h4 className="text-sm font-semibold mb-4" style={{ color: '#64748b' }}>Score Breakdown</h4>
        <div className="space-y-4">
          {breakdownMeta.map((item) => {
            const Icon = item.icon;
            const val = data.breakdown[item.key];
            const pct = (val / item.max) * 100;
            return (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm flex items-center gap-2" style={{ color: '#64748b' }}>
                    <Icon className="w-4 h-4" style={{ color: '#94a3b8' }} />
                    {item.label}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#0f172a' }}>
                    {val}<span style={{ color: '#94a3b8' }}>/{item.max}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ background: item.color, width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Tiers */}
      <div className="rounded-2xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <h4 className="text-sm font-semibold mb-3" style={{ color: '#64748b' }}>Level Tiers</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(levelConfig) as [ReputationResult['level'], typeof levelConfig.beginner][]).map(([key, config]) => (
            <div
              key={key}
              className="p-3 rounded-xl text-center transition-all"
              style={
                data.level === key
                  ? { background: config.bg, border: `1px solid ${config.border}`, transform: 'scale(1.02)' }
                  : { background: '#f8fafc', border: '1px solid #e2e8f0', opacity: 0.5 }
              }
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center mx-auto mb-2`}>
                <Star className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-semibold" style={{ color: data.level === key ? config.text : '#94a3b8' }}>
                {config.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>
                {key === 'beginner' ? '0-39' : key === 'professional' ? '40-64' : key === 'expert' ? '65-84' : '85+'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
