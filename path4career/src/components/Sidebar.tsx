import { useState } from 'react';
import {
  Compass,
  Brain,
  Users,
  ShieldAlert,
  GitFork,
  Award,
  Rocket,
  Fingerprint,
  Menu,
  X,
  Zap,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils/cn';

export type ModuleId = 'home' | 'simulation' | 'mentor' | 'risk' | 'decision' | 'reputation' | 'startup' | 'twin' | 'auth' | 'profile' | 'messages' | 'mentorDashboard';

interface NavItem {
  id: ModuleId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'simulation', label: 'Career Simulation', shortLabel: 'Simulation', icon: <Brain size={18} />, color: 'text-primary' },
  { id: 'twin',       label: 'Digital Twin',      shortLabel: 'Twin',       icon: <Fingerprint size={18} />, color: 'text-violet-400' },
  { id: 'startup',    label: 'Startup Path',      shortLabel: 'Startup',    icon: <Rocket size={18} />,     color: 'text-orange-400' },
  { id: 'decision',   label: 'Decision Engine',   shortLabel: 'Decision',   icon: <GitFork size={18} />,    color: 'text-amber-400' },
  { id: 'reputation', label: 'Reputation Score',  shortLabel: 'Score',      icon: <Award size={18} />,      color: 'text-cyan-400' },
  { id: 'risk',       label: 'Risk Analyzer',     shortLabel: 'Risk',       icon: <ShieldAlert size={18} />,color: 'text-rose-400' },
  { id: 'mentor',     label: 'Mentor Marketplace',shortLabel: 'Mentors',    icon: <Users size={18} />,      color: 'text-secondary' },
];

interface SidebarProps {
  activeModule: ModuleId;
  onNavigate: (id: ModuleId) => void;
  isAuthenticated?: boolean;
  userRole?: 'user' | 'mentor' | 'admin';
  isDMOpen: boolean;
  onToggleDM: () => void;
}

export function Sidebar({ activeModule, onNavigate, isAuthenticated, userRole, isDMOpen, onToggleDM }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ── Mobile Top Bar ───────────────────────────────────── */}
      <div className="lg:hidden fixed top-[104px] left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center px-4 gap-3">
        {/* Hamburger — always left */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <button
          onClick={() => { onNavigate('home'); setMobileOpen(false); }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
            <img src="../../assets/images/path4career-icon.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          <span className="font-bold tracking-tight text-foreground">AI Career Simulator</span>
        </button>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 top-[66px]"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel — 288px wide so labels always fit */}
          <div className="lg:hidden fixed top-[66px] left-0 h-[calc(100vh-66px)] w-72 bg-card border-r border-border z-50 flex flex-col shadow-2xl">
            {/* Drawer header row: logo + close button */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <button
                onClick={() => { onNavigate('home'); setMobileOpen(false); }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
                  <img src="../../assets/images/path4career-icon.png" alt="Logo" className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="font-bold text-foreground text-base">AI Career Simulator</span>
                  <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-semibold mt-0.5">Predictive AI Platform</span>
                </div>
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
              {userRole === 'mentor' ? (
                <>
                  <div className="mb-3 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Mentor Panel
                  </div>
                  <button
                    onClick={() => { onNavigate('mentorDashboard'); setMobileOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer',
                      activeModule === 'mentorDashboard'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Users size={18} className={activeModule === 'mentorDashboard' ? 'text-primary-foreground' : 'text-secondary'} />
                    <span>Mentor Dashboard</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onNavigate('home'); setMobileOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer',
                      activeModule === 'home'
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Compass size={18} className={activeModule === 'home' ? 'text-primary-foreground' : 'text-primary'} />
                    <span>Home</span>
                  </button>
                  <div className="pt-4 pb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    AI Modules
                  </div>
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer',
                        activeModule === item.id
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <span className={activeModule === item.id ? 'text-primary-foreground' : item.color}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-3">
              {isAuthenticated && (
                <button
                  onClick={onToggleDM}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all shadow-lg cursor-pointer',
                    isDMOpen 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <MessageSquare size={16} />
                  <span>{isDMOpen ? 'Close Messages' : 'Messages (DM)'}</span>
                </button>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => window.location.href = '../../pages/auth/login.html'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-lg cursor-pointer"
                >
                  <Zap size={16} />
                  Get Started
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex fixed top-[104px] left-0 z-40 h-[calc(100vh-104px)] bg-card border-r border-border flex-col transition-all duration-300',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        {/* Logo area */}
        <div className={cn(
          'flex flex-col border-b border-border flex-shrink-0',
          collapsed ? 'items-center px-2 py-3' : 'px-6 pt-5 pb-2'
        )}>
          <button
            onClick={() => onNavigate('home')}
            className={cn('flex items-center gap-2 cursor-pointer', collapsed && 'justify-center')}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden bg-white">
              <img src="../../assets/images/path4career-icon.png" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>
            {!collapsed && (
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold tracking-tight text-foreground">AI Career</span>
                <span className="text-[10px] text-muted-foreground -mt-1 tracking-widest uppercase font-semibold">Simulator</span>
              </div>
            )}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              'mt-3 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground w-full text-xs font-medium',
              collapsed ? 'justify-center' : 'justify-end'
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <span>Collapse</span>
                <ChevronLeft size={16} />
              </>
            )}
          </button>
        </div>

        {/* Nav links */}
        <div className={cn('flex-1 overflow-y-auto py-6 px-4 space-y-1', collapsed && 'px-1')}>
          {userRole === 'mentor' ? (
            <>
              {!collapsed && (
                <div className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mentor Panel
                </div>
              )}
              <button
                onClick={() => onNavigate('mentorDashboard')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer',
                  activeModule === 'mentorDashboard'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-2 gap-0'
                )}
                title={collapsed ? 'Mentor Dashboard' : undefined}
              >
                <Users size={18} className={activeModule === 'mentorDashboard' ? 'text-primary-foreground' : 'text-secondary'} />
                {!collapsed && 'Mentor Dashboard'}
              </button>
            </>
          ) : (
            <>
              {!collapsed && (
                <div className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  AI Modules
                </div>
              )}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer',
                    activeModule === item.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    collapsed && 'justify-center px-2 gap-0'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={activeModule === item.id ? 'text-primary-foreground' : item.color}>
                    {item.icon}
                  </span>
                  {!collapsed && item.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={cn('p-4 border-t border-border space-y-3', collapsed && 'p-2')}>
          {isAuthenticated && (
            <button
              onClick={onToggleDM}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all shadow-lg cursor-pointer',
                isDMOpen 
                  ? 'bg-primary text-primary-foreground shadow-primary/20' 
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted',
                collapsed && 'px-2 py-2'
              )}
              title={isDMOpen ? "Close DM" : "Direct Messages"}
            >
              <MessageSquare size={16} />
              {!collapsed && <span>{isDMOpen ? 'Close DM' : 'Messages'}</span>}
            </button>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => window.location.href = '../../pages/auth/login.html'}
              className={cn(
                'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-lg cursor-pointer',
                collapsed && 'px-2 py-2'
              )}
            >
              <Zap size={16} />
              {!collapsed && 'Get Started'}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
