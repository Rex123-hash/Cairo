import type { Grade } from "../engine/insights";

interface EcoScoreRingProps {
  score: number;
  grade: Grade;
}

const GRADE_COLOR: Record<Grade, string> = {
  A: "#4a7327",
  B: "#7aa632",
  C: "#c79a2b",
  D: "#e0871e",
  E: "#db6a3a",
  F: "#cf4d39",
};

/** Circular SVG gauge showing the 0–100 eco score with the letter grade. */
export function EcoScoreRing({ score, grade }: EcoScoreRingProps) {
  const size = 168;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const color = GRADE_COLOR[grade];

  return (
    <div
      className="ring-wrap"
      role="img"
      aria-label={`Eco score ${score} out of 100, grade ${grade}`}
    >
      <svg width={size} height={size} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#eaeee0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="ring-grade">
        <div className="g" style={{ color }}>
          {grade}
        </div>
        <div className="s">{score}/100 ECO SCORE</div>
      </div>
    </div>
  );
}
