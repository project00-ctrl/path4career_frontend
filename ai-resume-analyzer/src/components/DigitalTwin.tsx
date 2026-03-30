import { User, TrendingUp, Sparkles, Compass, BarChart3, Target, ArrowUpRight } from 'lucide-react';
import type { DigitalTwinProfile } from '../utils/types';

interface Props {
  data: DigitalTwinProfile;
}

const trendConfig = {
  rising: { text: '#059669', bg: '#ecfdf5', label: '↑' },
  stable: { text: '#d97706', bg: '#fffbeb', label: '→' },
  declining: { text: '#dc2626', bg: '#fef2f2', label: '↓' },
};

export default function DigitalTwin({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-2xl p-6 md:p-8" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#0d9488', boxShadow: '0 8px 20px rgba(13,148,136,0.2)' }}>
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#0d9488' }}>Career Digital Twin</p>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0f172a' }}>{data.currentRole}</h2>
            <p className="text-sm" style={{ color: '#64748b' }}>
              {data.experienceYears}+ years experience • Market alignment: <strong style={{ color: '#0f172a' }}>{data.marketAlignment}%</strong>
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-3xl font-black" style={{ color: '#0d9488' }}>{data.marketAlignment}%</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>Market Fit</div>
          </div>
        </div>

        {/* Top Strengths */}
        <div className="mt-5 pt-5" style={{ borderTop: '1px solid #e2e8f0' }}>
          <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: '#94a3b8' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#0d9488' }} />
            Top Strengths
          </p>
          <div className="flex flex-wrap gap-2">
            {data.topStrengths.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs" style={{ background: '#f0fdfa', color: '#0d9488', border: '1px solid #99f6e4' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Growth */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl" style={{ background: '#f0fdfa' }}>
            <BarChart3 className="w-5 h-5" style={{ color: '#0d9488' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>Skill Growth Tracker</h3>
        </div>
        <div className="space-y-4">
          {data.skillGrowth.map((skill, idx) => {
            const tc = trendConfig[skill.trend];
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm flex items-center gap-2" style={{ color: '#334155' }}>
                    {skill.name}
                    <span className="text-[10px]" style={{ color: tc.text }}>{tc.label}</span>
                  </span>
                  <span className="text-xs" style={{ color: '#94a3b8' }}>
                    {skill.current}% → <span style={{ color: tc.text }}>{skill.projected}%</span>
                  </span>
                </div>
                <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                  {/* Current level */}
                  <div
                    className="absolute h-full rounded-full transition-all duration-1000"
                    style={{ background: '#0d9488', width: `${skill.current}%` }}
                  />
                  {/* Projected level */}
                  <div
                    className="absolute h-full rounded-full transition-all duration-1000"
                    style={{ background: 'rgba(13,148,136,0.25)', width: `${skill.projected}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full" style={{ background: '#0d9488' }} />
            <span className="text-[10px]" style={{ color: '#94a3b8' }}>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full" style={{ background: 'rgba(13,148,136,0.25)' }} />
            <span className="text-[10px]" style={{ color: '#94a3b8' }}>Projected (12 months)</span>
          </div>
        </div>
      </div>

      {/* Career Trajectory */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl" style={{ background: '#eef2ff' }}>
            <Compass className="w-5 h-5" style={{ color: '#4f46e5' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>Career Trajectory</h3>
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748b' }}>{data.careerTrajectory}</p>

        {/* Predicted Roles */}
        <div className="space-y-3">
          {data.predictedRoles.map((pred, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl transition-all group"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#eef2ff' }}>
                <Target className="w-5 h-5" style={{ color: '#4f46e5' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{pred.role}</p>
                <p className="text-xs" style={{ color: '#94a3b8' }}>{pred.timeframe}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold" style={{ color: pred.probability >= 70 ? '#059669' : pred.probability >= 45 ? '#d97706' : '#64748b' }}>
                    {pred.probability}%
                  </span>
                  <ArrowUpRight className="w-3 h-3" style={{ color: '#cbd5e1' }} />
                </div>
                <p className="text-[10px]" style={{ color: '#94a3b8' }}>probability</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Opportunities */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl" style={{ background: '#ecfdf5' }}>
            <TrendingUp className="w-5 h-5" style={{ color: '#059669' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>Future Opportunities</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {data.futureOpportunities.map((opp, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}
            >
              <ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: '#059669' }} />
              <span className="text-sm" style={{ color: '#334155' }}>{opp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
