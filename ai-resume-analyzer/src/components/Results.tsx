import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Target,
  FileText,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Award,
  FolderGit2,
  ChevronRight,
  Zap,
  Brain,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import type { AnalysisResult } from "../utils/analyzer";

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export default function Results({ result, onReset }: Props) {
  const {
    overallScore,
    aiResistantScore,
    futureProofScore,
    vulnerabilityScore,
    generalTechScore,
    strengths,
    risks,
    futureProofMatches,
    missingSkills,
    recommendations,
    careerSuggestions,
    learningPath,
    riskLevel,
    riskMessage,
    atsScore,
    keywordDensity,
    resumeLength,
  } = result;

  const riskConfig = {
    safe: {
      icon: ShieldCheck,
      label: "AI Safe Zone",
      gradient: "from-emerald-500 to-green-600",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20",
    },
    moderate: {
      icon: Shield,
      label: "Moderate Risk",
      gradient: "from-amber-500 to-orange-600",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      glow: "shadow-amber-500/20",
    },
    high: {
      icon: ShieldAlert,
      label: "High Risk",
      gradient: "from-red-500 to-rose-600",
      border: "border-red-500/20",
      bg: "bg-red-500/10",
      text: "text-red-400",
      glow: "shadow-red-500/20",
    },
  };

  const rc = riskConfig[riskLevel];
  const RiskIcon = rc.icon;

  const priorityColors = {
    high: "bg-red-500/20 text-red-300 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  const typeIcons = {
    course: BookOpen,
    certification: Award,
    project: FolderGit2,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Analyze Another Resume</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-white">
              <span className="text-cyan-400">AI Career Shield</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Score Section */}
        <div
          className={`relative overflow-hidden rounded-3xl border ${rc.border} ${rc.bg} p-8 md:p-12 mb-8`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/[0.02]" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <ScoreGauge score={overallScore} label="AI Career Safety Score" size="lg" delay={200} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${rc.gradient}`}>
                  <RiskIcon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold ${rc.text}`}>{rc.label}</span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-xl">{riskMessage}</p>
            </div>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col items-center">
            <ScoreGauge score={aiResistantScore} label="AI Resistance" size="sm" delay={400} />
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col items-center">
            <ScoreGauge score={futureProofScore} label="Future-Proof" size="sm" delay={600} />
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col items-center">
            <ScoreGauge score={generalTechScore} label="Tech Skills" size="sm" delay={800} />
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col items-center">
            <ScoreGauge score={vulnerabilityScore} label="Low Vulnerability" size="sm" delay={1000} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Strengths</h3>
            </div>
            {strengths.length > 0 || futureProofMatches.length > 0 ? (
              <div className="space-y-3">
                {[...strengths, ...futureProofMatches].map((match, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{match.category}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {match.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No strong AI-resistant or future-proof skills detected. Consider adding relevant keywords and skills.
              </p>
            )}
          </div>

          {/* Risk Areas */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-red-500/20">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Risk Areas</h3>
            </div>
            {risks.length > 0 ? (
              <div className="space-y-3">
                {risks.map((match, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{match.category}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {match.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-[11px] bg-red-500/15 text-red-300 border border-red-500/20"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <p className="text-sm text-emerald-300">
                  No high-risk AI-vulnerable skills detected in your resume. Great job!
                </p>
              </div>
            )}

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-400 mb-3">Missing Skills to Add:</p>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/10"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-cyan-500/20">
              <Lightbulb className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Personalized Recommendations</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-cyan-500/20 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Suggestions + Resume Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Career Suggestions */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-purple-500/20">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Career Suggestions</h3>
            </div>
            <div className="space-y-3">
              {careerSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-purple-500/5 rounded-xl border border-purple-500/10"
                >
                  <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Insights */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-xl bg-blue-500/20">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Resume Insights</h3>
            </div>
            <div className="space-y-4">
              {/* ATS Score */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-400">ATS Compatibility</span>
                  <span className="text-sm font-medium text-white">{atsScore}/10</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: `${(atsScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Keyword Density */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-400">Keyword Optimization</span>
                  <span className="text-sm font-medium text-white">{keywordDensity}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-1000"
                    style={{ width: `${keywordDensity}%` }}
                  />
                </div>
              </div>

              {/* Resume Length */}
              <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl">
                <span className="text-sm text-gray-400">Resume Length</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    resumeLength === "good"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : resumeLength === "short"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {resumeLength === "good"
                    ? "✓ Optimal"
                    : resumeLength === "short"
                    ? "⚠ Too Short"
                    : "⚠ Too Long"}
                </span>
              </div>

              {/* Skills Breakdown */}
              <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl">
                <span className="text-sm text-gray-400">Skills Detected</span>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">
                    {strengths.length + futureProofMatches.length + result.generalTechMatches.length} categories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-amber-500/20">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Personalized Learning Path</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {learningPath.map((item, idx) => {
              const TypeIcon = typeIcons[item.type];
              return (
                <div
                  key={idx}
                  className="p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-amber-500/20 transition-all hover:bg-white/[0.04] group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TypeIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                      {item.type}
                    </span>
                    <span
                      className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                        priorityColors[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-12">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button
              onClick={onReset}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Analyze Another Resume
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-colors cursor-pointer"
            >
              Download Report
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            Results are based on keyword analysis. For a comprehensive evaluation, consult with career experts.
          </p>
        </div>
      </div>
    </div>
  );
}
