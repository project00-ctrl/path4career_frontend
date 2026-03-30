import { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert, Info, CheckCircle2 } from 'lucide-react';
import type { CareerShieldAlert } from '../utils/types';

interface Props {
  alerts: CareerShieldAlert[];
}

const iconMap = {
  warning: AlertTriangle,
  danger: ShieldAlert,
  info: Info,
  success: CheckCircle2,
};

const colorMap = {
  warning: {
    bg: '#fffbeb',
    border: '#fde68a',
    icon: '#d97706',
    bar: '#f59e0b',
  },
  danger: {
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '#dc2626',
    bar: '#ef4444',
  },
  info: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: '#2563eb',
    bar: '#3b82f6',
  },
  success: {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: '#059669',
    bar: '#10b981',
  },
};

export default function NotificationToast({ alerts }: Props) {
  const [visible, setVisible] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    alerts.forEach((alert, idx) => {
      const timer = setTimeout(() => {
        setVisible((prev) => [...prev, alert.id]);
      }, idx * 600);
      timers.push(timer);
    });
    return () => timers.forEach(clearTimeout);
  }, [alerts]);

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visibleAlerts = alerts.filter(
    (a) => visible.includes(a.id) && !dismissed.has(a.id)
  );

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed top-[115px] right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {visibleAlerts.map((alert) => {
        const Icon = iconMap[alert.type];
        const colors = colorMap[alert.type];

        return (
          <div
            key={alert.id}
            className="rounded-2xl p-4 pointer-events-auto animate-slide-in"
            style={{ background: colors.bg, border: `1px solid ${colors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg" style={{ background: '#ffffff' }}>
                <Icon className="w-4 h-4" style={{ color: colors.icon }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: '#0f172a' }}>{alert.title}</p>
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="transition-colors cursor-pointer shrink-0"
                    style={{ color: '#94a3b8' }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#64748b' }}>{alert.message}</p>
                <p className="text-[10px] mt-2" style={{ color: '#94a3b8' }}>{alert.timestamp}</p>
              </div>
            </div>
            <div className="h-0.5 rounded-full mt-3 opacity-30" style={{ background: colors.bar }} />
          </div>
        );
      })}
    </div>
  );
}
