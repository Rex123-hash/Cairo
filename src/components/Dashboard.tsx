import { ecoScore } from "../engine/insights";
import type { Footprint } from "../engine/types";
import { useCountUp } from "../hooks/useCountUp";
import { EcoScoreRing } from "./EcoScoreRing";

interface DashboardProps {
  footprint: Footprint;
  insight: string;
}

/** Headline: eco-score ring + animated total + AI coaching insight. */
export function Dashboard({ footprint, insight }: DashboardProps) {
  const score = ecoScore(footprint.totalMonthlyKg);
  const animated = useCountUp(footprint.totalMonthlyKg);

  return (
    <section className="card rise" aria-labelledby="result-heading">
      <h2 id="result-heading">Your footprint</h2>
      <div className="result-grid">
        <EcoScoreRing score={score.score} grade={score.grade} />
        <div>
          <div className="total">
            <span className="num">{Math.round(animated).toLocaleString()}</span>
            <span className="unit">kg CO₂e / month · ~{score.annualTonnes} t / year</span>
          </div>
          <div className="grade-label">
            Grade <strong>{score.grade}</strong> — {score.label}
          </div>
          <p className="insight" role="status">
            {insight}
          </p>
        </div>
      </div>
    </section>
  );
}
