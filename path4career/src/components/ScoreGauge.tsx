import { useEffect, useState } from"react";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?:"lg" |"sm";
  delay?: number;
}

export default function ScoreGauge({ score, label, size ="lg", delay = 0 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [visible, setVisible] = useState(false);

  const isLarge = size ==="lg";
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
    if (s >= 7) return { stroke:"#10b981", bg:"rgba(16,185,129,0.1)", text:"text-secondary" };
    if (s >= 4) return { stroke:"#f59e0b", bg:"rgba(245,158,11,0.1)", text:"text-amber-400" };
    return { stroke:"#ef4444", bg:"rgba(239,68,68,0.1)", text:"text-red-400" };
  };

  const colors = getColor(score);

  return (
    <div className={`flex flex-col items-center transition-all duration-700 ${visible ?"opacity-100 translate-y-0" :"opacity-0 translate-y-4"}`}>
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
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
            filter: `drop-shadow(0 0 8px ${colors.stroke}50)`,
            transition:"stroke-dashoffset 0.05s linear",
          }}
        />
      </svg>
      <div className={`${isLarge ?"-mt-[140px] mb-[80px]" :"-mt-[65px] mb-[30px]"} flex flex-col items-center`}>
        <span className={`${isLarge ?"text-5xl" :"text-xl"} font-bold ${colors.text}`}>
          {animatedScore.toFixed(1)}
        </span>
        <span className={`${isLarge ?"text-sm" :"text-[10px]"} text-gray-400`}>/10</span>
      </div>
      <p className={`${isLarge ?"text-sm" :"text-xs"} text-gray-400 text-center mt-1`}>{label}</p>
    </div>
  );
}
