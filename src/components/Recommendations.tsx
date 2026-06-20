import { useState } from "react";
import { projectedFootprint } from "../engine/insights";
import type { Recommendation } from "../engine/types";

interface RecommendationsProps {
  recommendations: Recommendation[];
  total: number;
}

/**
 * Ranked reduction actions with an interactive "what-if" simulator: tick the
 * actions you'd adopt and watch your projected footprint drop in real time.
 */
export function Recommendations({ recommendations, total }: RecommendationsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (recommendations.length === 0) return null;

  const selectedRecs = recommendations.filter((r) => selected.has(r.id));
  const projected = projectedFootprint(total, selectedRecs);
  const saved = Math.round(total - projected);
  const pctDrop = total > 0 ? Math.round((saved / total) * 100) : 0;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section className="card rise d2" aria-labelledby="rec-heading">
      <h2 id="rec-heading">Your highest-leverage actions</h2>
      <p className="card-sub">
        Tick the changes you could realistically make — your projected footprint
        updates live.
      </p>

      <div className="whatif-banner" aria-live="polite">
        <span className="proj">{projected.toLocaleString()} kg/mo</span>
        {saved > 0 ? (
          <span className="drop">
            ↓ {saved.toLocaleString()} kg ({pctDrop}% lower)
          </span>
        ) : (
          <span className="muted">select actions to simulate your savings</span>
        )}
        <small>
          Projected monthly footprint after adopting {selected.size} of{" "}
          {recommendations.length} actions.
        </small>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {recommendations.map((r) => {
          const on = selected.has(r.id);
          return (
            <li
              className={on ? "rec on" : "rec"}
              key={r.id}
              onClick={() => toggle(r.id)}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggle(r.id)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Adopt: ${r.title}`}
              />
              <div className="save">
                <b>−{r.monthlySavingsKg}</b>
                <span>kg/mo</span>
              </div>
              <div className="body">
                <h4>{r.title}</h4>
                <p>{r.description}</p>
                <span className={`tag ${r.difficulty}`}>{r.difficulty}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
