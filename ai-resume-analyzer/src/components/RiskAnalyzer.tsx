import { AlertTriangle, ShieldCheck, TrendingDown, Activity, Globe, Cpu } from 'lucide-react';
import type { RiskAnalysis, RiskDimension } from '../utils/types';

interface Props {
  data: RiskAnalysis;
}

const riskColors = {
  low: {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    text: '#059669',
    pillBg: '#d1fae5',
    pillText: '#047857',
    pillBorder: '#6ee7b7',
    bar: '#10b981',
  },
  medium: {
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#d97706',
    pillBg: '#fef3c7',
    pillText: '#b45309',
    pillBorder: '#fcd34d',
    bar: '#f59e0b',
  },
  high: {
    bg: '#fef2f2',
    border: '#fecaca',
    text: '#dc2626',
    pillBg: '#fee2e2',
    pillText: '#b91c1c',
    pillBorder: '#fca5a5',
    bar: '#ef4444',
  },
};

const riskIcons = {
  automation: Cpu,
  industry: TrendingDown,
  redundancy: Activity,
  geographic: Globe,
};

function RiskCard({
  title,
  icon: IconKey,
  dimension,
}: {
  title: string;
  icon: keyof typeof riskIcons;
  dimension: RiskDimension;
}) {
  const colors = riskColors[dimension.level];
  const Icon = riskIcons[IconKey];
  const percentage = (dimension.score / 10) * 100;

  return (
    <div className="rounded-2xl p-5 hover:scale-[1.02] transition-all" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl" style={{ background: '#ffffff' }}>
            <Icon className="w-5 h-5" style={{ color: colors.text }} />
          </div>
          <h4 className="text-sm font-semibold" style={{ color: '#0f172a' }}>{title}</h4>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: colors.pillBg, color: colors.pillText, border: `1px solid ${colors.pillBorder}` }}>
          {dimension.level.toUpperCase()}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs" style={{ color: '#94a3b8' }}>Risk Level</span>
          <span className="text-sm font-bold" style={{ color: colors.text }}>{dimension.score}/10</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ background: colors.bar, width: `${percentage}%` }}
          />
        </div>
      </div>

      <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748b' }}>{dimension.description}</p>

      {/* Factors */}
      <div className="space-y-1.5">
        {dimension.factors.map((factor, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: colors.bar }} />
            <span className="text-xs" style={{ color: '#64748b' }}>{factor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RiskAnalyzer({ data }: Props) {
  const overallColors = riskColors[data.overallRisk];

  return (
    <div className="space-y-6">
      {/* Overall Risk Header */}
      <div className="rounded-2xl p-6 md:p-8" style={{ background: overallColors.bg, border: `1px solid ${overallColors.border}` }}>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: overallColors.bar, boxShadow: `0 8px 20px ${overallColors.bar}33` }}>
            {data.overallRisk === 'low' ? (
              <ShieldCheck className="w-10 h-10 text-white" />
            ) : data.overallRisk === 'high' ? (
              <AlertTriangle className="w-10 h-10 text-white" />
            ) : (
              <Activity className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
              <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>Overall Career Risk</h2>
              <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: overallColors.pillBg, color: overallColors.pillText, border: `1px solid ${overallColors.pillBorder}` }}>
                {data.overallRisk.toUpperCase()}
              </span>
            </div>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Combined risk score: <strong style={{ color: overallColors.text }}>{data.overallScore}/10</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Risk Dimension Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        <RiskCard title="Automation Risk" icon="automation" dimension={data.automationRisk} />
        <RiskCard title="Industry Decline" icon="industry" dimension={data.industryDecline} />
        <RiskCard title="Skill Redundancy" icon="redundancy" dimension={data.skillRedundancy} />
        <RiskCard title="Geographic Risk" icon="geographic" dimension={data.geographicRisk} />
      </div>
    </div>
  );
}
