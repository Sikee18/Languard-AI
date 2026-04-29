import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
}

const RiskGauge = ({ score }: RiskGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1500;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const rotation = (animatedScore / 100) * 180 - 90;
  const riskLevel = animatedScore <= 30 ? "Low" : animatedScore <= 70 ? "Medium" : "High";
  const riskColor =
    animatedScore <= 30
      ? "hsl(142, 70%, 45%)"
      : animatedScore <= 70
      ? "hsl(38, 92%, 50%)"
      : "hsl(0, 72%, 51%)";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-28 overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(220, 16%, 18%)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={riskColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${(animatedScore / 100) * 251.3} 251.3`}
            className="transition-all duration-300"
          />
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={riskColor}
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation}, 100, 100)`}
            className="transition-transform duration-300"
          />
          <circle cx="100" cy="100" r="6" fill={riskColor} />
        </svg>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold font-mono" style={{ color: riskColor }}>
          {animatedScore}
        </div>
        <div className="text-sm font-semibold mt-1" style={{ color: riskColor }}>
          {riskLevel} Risk
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
