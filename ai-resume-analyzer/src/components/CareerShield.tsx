import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  ChevronRight,
  Sparkles,
  Bell,
} from 'lucide-react';
import type { CareerShieldResult } from '../utils/types';
import ScoreGauge from './ScoreGauge';

interface Props {
  data: CareerShieldResult;
}

const priorityConfig = {
  critical: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', label: 'CRITICAL' },
  high: { bg: '#fffbeb', border: '#fde68a', text: '#d97706', label: 'HIGH' },
  medium: { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb', label: 'MEDIUM' },
};

const alertTypeConfig = {
  warning: { icon: AlertTriangle, bg: '#fffbeb', border: '#fde68a', iconColor: '#d97706' },
  danger: { icon: ShieldAlert, bg: '#fef2f2', border: '#fecaca', iconColor: '#dc2626' },
  info: { icon: Bell, bg: '#eff6ff', border: '#bfdbfe', iconColor: '#2563eb' },
  success: { icon: ShieldCheck, bg: '#ecfdf5', border: '#a7f3d0', iconColor: '#059669' },
};

export default function CareerShield({ data }: Props) {
  const { safetyScore, alerts, protectionPlan, riskSummary } = data;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <ScoreGauge score={safetyScore} label="Career Safety Score" size="lg" delay={200} />
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Shield className="w-5 h-5" style={{ color: '#2563eb' }} />
              <h2 className="text-xl font-bold" style={{ color: '#0f172a' }}>AI Career Shield™</h2>
            </div>
            <p className="leading-relaxed" style={{ color: '#64748b' }}>{riskSummary}</p>
          </div>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl" style={{ background: '#fffbeb' }}>
            <Bell className="w-5 h-5" style={{ color: '#d97706' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>Risk Alerts</h3>
          <span className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: '#fffbeb', color: '#d97706' }}>
            {alerts.length}
          </span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const config = alertTypeConfig[alert.type];
            const Icon = config.icon;
            return (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-4 rounded-xl transition-all hover:scale-[1.01]"
                style={{ background: config.bg, border: `1px solid ${config.border}` }}
              >
                <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: '#ffffff' }}>
                  <Icon className="w-4 h-4" style={{ color: config.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{alert.title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#64748b' }}>{alert.message}</p>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ color: '#94a3b8' }}>{alert.timestamp}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Protection Plan */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl" style={{ background: '#eff6ff' }}>
            <Sparkles className="w-5 h-5" style={{ color: '#2563eb' }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: '#0f172a' }}>Skill Protection Plan</h3>
        </div>

        {/* Urgent Skills */}
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {protectionPlan.urgentSkills.map((skill, idx) => {
            const pc = priorityConfig[skill.priority];
            return (
              <div
                key={idx}
                className="p-4 rounded-xl hover:scale-[1.01] transition-all"
                style={{ background: pc.bg, border: `1px solid ${pc.border}` }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <ChevronRight className="w-3.5 h-3.5" style={{ color: pc.text }} />
                  <span className="text-sm font-medium" style={{ color: '#0f172a' }}>{skill.name}</span>
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>
                    {pc.label}
                  </span>
                </div>
                <p className="text-xs ml-5.5" style={{ color: '#64748b' }}>{skill.reason}</p>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        {protectionPlan.timeline.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: '#64748b' }}>
              <Clock className="w-4 h-4" />
              Learning Timeline
            </h4>
            {protectionPlan.timeline.map((phase, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#2563eb' }} />
                  {idx < protectionPlan.timeline.length - 1 && (
                    <div className="w-0.5 h-full min-h-8" style={{ background: '#e2e8f0' }} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{phase.phase}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {phase.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[11px]"
                        style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {protectionPlan.estimatedTimeMonths > 0 && (
          <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Clock className="w-4 h-4" style={{ color: '#94a3b8' }} />
            <span className="text-sm" style={{ color: '#64748b' }}>
              Estimated total: <strong style={{ color: '#0f172a' }}>{protectionPlan.estimatedTimeMonths} months</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
