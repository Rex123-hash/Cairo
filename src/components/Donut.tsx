import type { CategoryResult } from "../engine/types";

interface DonutProps {
  categories: CategoryResult[];
  total: number;
}

const COLORS: Record<CategoryResult["category"], string> = {
  transport: "#3b7dd8",
  diet: "#5a8a32",
  energy: "#c79a2b",
  shopping: "#8b5cf6",
};

/** SVG donut chart of the footprint by category, with a text legend. */
export function Donut({ categories, total }: DonutProps) {
  if (categories.length === 0 || total <= 0) return null;

  const size = 180;
  const stroke = 26;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  let acc = 0;
  const segments = categories.map((c) => {
    const fraction = c.monthlyKg / total;
    const dash = fraction * circumference;
    const seg = {
      category: c.category,
      color: COLORS[c.category],
      dasharray: `${dash} ${circumference - dash}`,
      dashoffset: -acc * circumference,
    };
    acc += fraction;
    return seg;
  });

  return (
    <section className="card rise d1" aria-labelledby="donut-heading">
      <h2 id="donut-heading">Where it comes from</h2>
      <div className="donut-wrap">
        <svg
          width={size}
          height={size}
          role="img"
          aria-label={`Footprint breakdown: ${categories
            .map((c) => `${c.category} ${Math.round((c.monthlyKg / total) * 100)}%`)
            .join(", ")}`}
        >
          {segments.map((s) => (
            <circle
              key={s.category}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          ))}
          <text
            x="50%"
            y="48%"
            textAnchor="middle"
            fill="#1d2a20"
            fontSize="22"
            fontWeight="800"
          >
            {Math.round(total).toLocaleString()}
          </text>
          <text x="50%" y="60%" textAnchor="middle" fill="#8a9684" fontSize="11">
            kg/mo
          </text>
        </svg>

        <div className="legend">
          {categories.map((c) => {
            const pct = Math.round((c.monthlyKg / total) * 100);
            return (
              <div className="legend-row" key={c.category}>
                <span className="dot" style={{ background: COLORS[c.category] }} />
                <span className="cat">{c.category}</span>
                <span className="meta">
                  {c.monthlyKg} kg · {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
