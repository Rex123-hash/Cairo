import type { Comparison as Cmp } from "../engine/insights";

interface ComparisonProps {
  data: Cmp;
}

/** Horizontal bars comparing you vs the world average and the sustainable target. */
export function Comparison({ data }: ComparisonProps) {
  const scale = Math.max(data.monthlyKg, data.worldAvg, data.target) * 1.1;
  const pct = (v: number) => `${Math.min(100, (v / scale) * 100)}%`;

  const rows = [
    { key: "you", label: "You", value: data.monthlyKg, cls: "cmp-you" },
    { key: "world", label: "World average", value: data.worldAvg, cls: "cmp-world" },
    { key: "target", label: "Sustainable target", value: data.target, cls: "cmp-target" },
  ];

  return (
    <section className="card rise d3" aria-labelledby="cmp-heading">
      <h2 id="cmp-heading">How you compare</h2>
      <p className="card-sub">
        {data.meetsTarget
          ? "You're already at or below the Paris-aligned sustainable target — excellent."
          : data.belowWorld
            ? `You're at ${data.vsWorldPct}% of the world average — below average, with room to reach the target.`
            : `You're at ${data.vsWorldPct}% of the world average — above average. The actions below close the gap.`}
      </p>
      {rows.map((row) => (
        <div className="cmp-row" key={row.key}>
          <div className="cmp-label">
            <span>{row.label}</span>
            <span className="muted">{Math.round(row.value).toLocaleString()} kg/mo</span>
          </div>
          <div className="cmp-track">
            <div className={`cmp-fill ${row.cls}`} style={{ width: pct(row.value) }} />
          </div>
        </div>
      ))}
    </section>
  );
}
