import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: "lg" | "sm";
  delay?: number;
}

export default function ScoreGauge({ score, label, size = "lg", delay = 0 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [visible, setVisible] = useState(false);

  const isLarge = size === "lg";
  const radius = isLarge ? 90 : 40;
  const stroke = isLarge ? 12 : 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 10) * circumference;
  const svgSize = isLarge ? 220 : 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      let current = 0;
      const step = score / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          current = score;
          clearInterval(interval);
        }
        setAnimatedScore(Math.round(current * 10) / 10);
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const getColor = (s: number) => {
    if (s >= 7) return { stroke: "#10b981", text: "#059669" };
    if (s >= 4) return { stroke: "#f59e0b", text: "#d97706" };
    return { stroke: "#ef4444", text: "#dc2626" };
  };

  const colors = getColor(score);

  return (
    <div className={`flex flex-col items-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${colors.stroke}40)`,
            transition: "stroke-dashoffset 0.05s linear",
          }}
        />
      </svg>
      <div className={`${isLarge ? "-mt-[140px] mb-[80px]" : "-mt-[65px] mb-[30px]"} flex flex-col items-center`}>
        <span className={`${isLarge ? "text-5xl" : "text-xl"} font-bold`} style={{ color: colors.text }}>
          {animatedScore.toFixed(1)}
        </span>
        <span className={`${isLarge ? "text-sm" : "text-[10px]"}`} style={{ color: '#94a3b8' }}>/10</span>
      </div>
      <p className={`${isLarge ? "text-sm" : "text-xs"} text-center mt-1`} style={{ color: '#64748b' }}>{label}</p>
    </div>
  );
}
