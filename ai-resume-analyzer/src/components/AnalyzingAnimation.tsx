import { useEffect, useState } from "react";
import { Shield, Cpu, Search, BarChart3, CheckCircle2 } from "lucide-react";

const STEPS = [
  { icon: Search, text: "Scanning resume content..." },
  { icon: Cpu, text: "Analyzing skill categories..." },
  { icon: Shield, text: "Evaluating AI resilience..." },
  { icon: BarChart3, text: "Calculating career safety score..." },
  { icon: CheckCircle2, text: "Generating personalized insights..." },
];

interface Props {
  onComplete: () => void;
}

export default function AnalyzingAnimation({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((s) => s + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f8fafc' }}>
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse" style={{ background: '#2563eb' }}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-full animate-ping" style={{ border: '2px solid rgba(37,99,235,0.3)' }} />
          </div>
          <h2 className="text-2xl font-bold mt-6" style={{ color: '#0f172a' }}>Analyzing Your Resume</h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>AI Career Shield™ is processing your profile</p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;

            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl transition-all duration-500"
                style={
                  isDone
                    ? { background: '#ecfdf5', border: '1px solid #a7f3d0' }
                    : isActive
                    ? { background: '#eff6ff', border: '1px solid #bfdbfe' }
                    : { background: '#f8fafc', border: '1px solid #e2e8f0' }
                }
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isActive ? 'animate-pulse' : ''}`}
                  style={
                    isDone
                      ? { background: '#d1fae5' }
                      : isActive
                      ? { background: '#dbeafe' }
                      : { background: '#f1f5f9' }
                  }
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#059669' }} />
                  ) : (
                    <Icon className="w-5 h-5" style={{ color: isActive ? '#2563eb' : '#94a3b8' }} />
                  )}
                </div>
                <span
                  className="text-sm font-medium transition-colors"
                  style={{ color: isDone ? '#059669' : isActive ? '#2563eb' : '#94a3b8' }}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1.5 rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ background: '#2563eb', width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
