import { useState, useEffect, useCallback } from 'react';
import { X, Mail, Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ReactElement } from 'react';

export type ToastType = 'email' | 'reminder' | 'deadline' | 'success' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // ms, default 5000
}

// Global toast state (simple pub/sub)
type Listener = (toasts: Toast[]) => void;
let listeners: Listener[] = [];
let toastQueue: Toast[] = [];

function notify(t: Toast[]) {
  listeners.forEach(fn => fn(t));
}

export function showToast(toast: Omit<Toast, 'id'>): void {
  const id = Math.random().toString(36).slice(2);
  toastQueue = [...toastQueue, { ...toast, id }];
  notify(toastQueue);
  // Auto-remove after duration
  setTimeout(() => {
    removeToast(id);
  }, toast.duration ?? 6000);
}

function removeToast(id: string): void {
  toastQueue = toastQueue.filter(t => t.id !== id);
  notify(toastQueue);
}

// ── Component ────────────────────────────────────────────────────────────────
const icons: Record<ToastType, ReactElement> = {
  email: <Mail size={18} />,
  reminder: <Bell size={18} />,
  deadline: <AlertTriangle size={18} />,
  success: <CheckCircle size={18} />,
  warning: <AlertTriangle size={18} />,
};

const colors: Record<ToastType, string> = {
  email: 'border-primary/40 text-primary',
  reminder: 'border-secondary/40 text-secondary',
  deadline: 'border-amber-400/40 text-amber-400',
  success: 'border-emerald-500/40 text-emerald-400',
  warning: 'border-rose-500/40 text-rose-400',
};

export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const update = useCallback((t: Toast[]) => setToasts([...t]), []);

  useEffect(() => {
    listeners.push(update);
    return () => { listeners = listeners.filter(fn => fn !== update); };
  }, [update]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[100] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: 360 }}>
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl bg-card border shadow-2xl backdrop-blur-md animate-slide-up ${colors[t.type]}`}
        >
          <div className="mt-0.5 flex-shrink-0">{icons[t.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{t.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{t.message}</p>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
