import { useEffect, useState } from"react";
import { Shield, Cpu, Search, BarChart3, CheckCircle2 } from"lucide-react";

const STEPS = [
  { icon: Search, text:"Scanning resume content..." },
  { icon: Cpu, text:"Analyzing skill categories..." },
  { icon: Shield, text:"Evaluating AI resilience..." },
  { icon: BarChart3, text:"Calculating career safety score..." },
  { icon: CheckCircle2, text:"Generating personalized insights..." },
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
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
              <Shield className="w-10 h-10 text-foreground" />
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-cyan-400/30 animate-ping" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mt-6">Analyzing Your Resume</h2>
          <p className="text-gray-400 text-sm mt-1">AI Career Shield™ is processing your profile</p>
        </div>

        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                  isDone
                    ?"bg-secondary/10 border border-secondary/20"
                    : isActive
                    ?"bg-cyan-500/10 border border-cyan-500/30"
                    :"bg-white/[0.02] border border-white/5"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ?"bg-secondary/20"
                      : isActive
                      ?"bg-cyan-500/20 animate-pulse"
                      :"bg-muted/50 border border-border"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ?"text-cyan-400" :"text-gray-600"}`} />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isDone ?"text-secondary" : isActive ?"text-cyan-300" :"text-gray-600"
                  }`}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1.5 bg-muted/50 border border-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
