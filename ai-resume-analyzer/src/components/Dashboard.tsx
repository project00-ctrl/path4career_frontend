import { useState, useMemo } from 'react';
import {
  Shield,
  AlertTriangle,
  Rocket,
  Scale,
  Award,
  User,
  ArrowLeft,
  Bell,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import type { AnalysisResult } from '../utils/analyzer';
import type { DashboardTab } from '../utils/types';
import {
  computeCareerShield,
  computeRiskAnalysis,
  computeDecisionEngine as _cde,
  computeReputationScore,
  computeDigitalTwin,
} from '../utils/careerEngine';
import CareerShield from './CareerShield';
import RiskAnalyzer from './RiskAnalyzer';
import CareerSimulation from './CareerSimulation';
import DecisionEngine from './DecisionEngine';
import ReputationScore from './ReputationScore';
import DigitalTwin from './DigitalTwin';
import NotificationToast from './NotificationToast';

interface Props {
  result: AnalysisResult;
  resumeText: string;
  fileName: string;
  onReset: () => void;
}

const tabs: { id: DashboardTab; label: string; icon: typeof Shield; color: string }[] = [
  { id: 'shield', label: 'Career Shield', icon: Shield, color: 'text-blue-600' },
  { id: 'risk', label: 'Risk Analyzer', icon: AlertTriangle, color: 'text-amber-600' },
  { id: 'simulation', label: 'Simulation', icon: Rocket, color: 'text-purple-600' },
  { id: 'decision', label: 'Decision Engine', icon: Scale, color: 'text-indigo-600' },
  { id: 'reputation', label: 'Reputation', icon: Award, color: 'text-pink-600' },
  { id: 'twin', label: 'Digital Twin', icon: User, color: 'text-teal-600' },
];

export default function Dashboard({ result, resumeText, fileName, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('shield');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);

  // Compute all module data
  const shieldData = useMemo(() => computeCareerShield(resumeText, result.overallScore), [resumeText, result.overallScore]);
  const riskData = useMemo(() => computeRiskAnalysis(resumeText), [resumeText]);
  const reputationData = useMemo(() => computeReputationScore(resumeText), [resumeText]);
  const twinData = useMemo(() => computeDigitalTwin(resumeText), [resumeText]);

  const scoreColor = result.overallScore >= 7
    ? { text: '#059669', bg: '#ecfdf5', border: '#a7f3d0' }
    : result.overallScore >= 4
    ? { text: '#d97706', bg: '#fffbeb', border: '#fde68a' }
    : { text: '#dc2626', bg: '#fef2f2', border: '#fecaca' };

  const renderContent = () => {
    switch (activeTab) {
      case 'shield':
        return <CareerShield data={shieldData} />;
      case 'risk':
        return <RiskAnalyzer data={riskData} />;
      case 'simulation':
        return <CareerSimulation resumeText={resumeText} />;
      case 'decision':
        return <DecisionEngine resumeText={resumeText} />;
      case 'reputation':
        return <ReputationScore data={reputationData} />;
      case 'twin':
        return <DigitalTwin data={twinData} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', color: '#0f172a' }}>
      {/* Notification Toasts */}
      {showNotifications && (
        <NotificationToast alerts={shieldData.alerts.slice(0, 3)} />
      )}

      {/* Top Bar */}
      <header className="sticky top-[104px] z-40" style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 transition-colors cursor-pointer text-sm"
              style={{ color: '#64748b' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
            <div className="h-5 w-px hidden sm:block" style={{ background: '#e2e8f0' }} />
            <div className="hidden sm:flex items-center gap-2">
              <div className="p-1 rounded" style={{ background: '#2563eb' }}>
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                <span style={{ color: '#2563eb' }}>AI Career Shield</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* File Badge */}
            {fileName && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <FileText className="w-3 h-3" style={{ color: '#94a3b8' }} />
                <span className="text-xs" style={{ color: '#64748b' }}>{fileName}</span>
              </div>
            )}

            {/* Score Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold" style={{ color: scoreColor.text, background: scoreColor.bg, border: `1px solid ${scoreColor.border}` }}>
              <Shield className="w-3 h-3" />
              {result.overallScore.toFixed(1)}/10
            </div>

            {/* Notification Toggle */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={showNotifications ? { background: '#fffbeb', color: '#d97706' } : { background: '#f1f5f9', color: '#94a3b8' }}
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg cursor-pointer"
              style={{ background: '#f1f5f9', color: '#64748b' }}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar — Desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0 min-h-[calc(100vh-57px-66px)] sticky top-[123px]" style={{ borderRight: '1px solid #e2e8f0', background: '#ffffff' }}>
          <nav className="p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                  style={isActive
                    ? { background: '#eff6ff', color: '#0f172a', border: '1px solid #bfdbfe' }
                    : { background: 'transparent', color: '#64748b', border: '1px solid transparent' }
                  }
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 lg:hidden top-[66px]"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute left-0 top-[57px] w-64 h-full p-3"
              style={{ background: '#ffffff', borderRight: '1px solid #e2e8f0' }}
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
                      style={isActive
                        ? { background: '#eff6ff', color: '#0f172a', border: '1px solid #bfdbfe' }
                        : { background: 'transparent', color: '#64748b', border: '1px solid transparent' }
                      }
                    >
                      <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          {/* Mobile Tab Bar */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-4 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                  style={isActive
                    ? { background: '#eff6ff', color: '#0f172a', border: '1px solid #bfdbfe' }
                    : { background: '#f1f5f9', color: '#64748b', border: '1px solid transparent' }
                  }
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Module Content */}
          {renderContent()}

          {/* Footer */}
          <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid #e2e8f0' }}>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              Results are based on heuristic analysis. For comprehensive evaluation, consult career experts.
            </p>
            <button
              onClick={() => window.print()}
              className="text-xs transition-colors cursor-pointer"
              style={{ color: '#64748b' }}
            >
              Download Report
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
