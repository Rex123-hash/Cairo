import { useEffect, useRef, useState } from "react";
import { loadGoogleCharts } from "../lib/googleCharts";
import type { CategoryResult } from "../engine/types";

/** Category colours — match the CSS custom properties. */
const CATEGORY_COLORS: Record<string, string> = {
  transport: "#3b7dd8",
  diet: "#5a8a32",
  energy: "#c79a2b",
  shopping: "#8b5cf6",
};

interface GDonutProps {
  categories: CategoryResult[];
  total: number;
}

/**
 * Donut chart powered by Google Charts (official Google product #7).
 * Falls back to a CSS-grid legend if the library hasn't loaded yet.
 */
export function GDonut({ categories, total }: GDonutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadGoogleCharts()
      .then(() => setReady(true))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current || categories.length === 0) return;

    const { google } = window;
    const data = new google.visualization.DataTable();
    data.addColumn("string", "Category");
    data.addColumn("number", "kg CO₂e");

    data.addRows(
      categories.map((c) => [
        c.category.charAt(0).toUpperCase() + c.category.slice(1),
        c.monthlyKg,
      ])
    );

    const colors = categories.map((c) => CATEGORY_COLORS[c.category] ?? "#8a9684");

    const options: Record<string, unknown> = {
      pieHole: 0.55,
      chartArea: { width: "90%", height: "90%" },
      legend: { position: "none" },
      pieSliceText: "none",
      tooltip: {
        text: "value",
        showColorCode: true,
      },
      colors,
      backgroundColor: "transparent",
      enableInteractivity: true,
    };

    const chart = new google.visualization.PieChart(containerRef.current);
    chart.draw(data, options);

    // Redraw on window resize
    const onResize = () => chart.draw(data, options);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.clearChart();
    };
  }, [ready, categories]);

  const pct = (kg: number) => Math.round((kg / total) * 100);

  return (
    <section className="card rise d2" aria-labelledby="breakdown-heading">
      <h2 id="breakdown-heading">Category breakdown</h2>
      <p className="card-sub">Monthly kg CO₂e by lifestyle area</p>

      <div className="donut-wrap">
        {/* Google Charts container */}
        <div style={{ position: "relative", width: 180, height: 180, flexShrink: 0 }}>
          {!error ? (
            <div ref={containerRef} style={{ width: 180, height: 180 }} />
          ) : (
            // Fallback: simple CSS circle if Charts fails to load
            <svg width={180} height={180} viewBox="0 0 180 180" aria-hidden="true">
              <circle cx={90} cy={90} r={70} fill="none" stroke="var(--border)" strokeWidth={28} />
            </svg>
          )}
          {/* Centre label */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1, color: "var(--ink)" }}>
              {total}
            </span>
            <span style={{ fontSize: "0.62rem", color: "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em" }}>
              KG / MO
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="legend">
          {categories.map((c) => (
            <div className="legend-row" key={c.category}>
              <span
                className="dot"
                style={{ background: CATEGORY_COLORS[c.category] ?? "var(--ink-3)" }}
              />
              <span className="cat">{c.category}</span>
              <span className="meta">
                {c.monthlyKg} kg &nbsp;
                <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>
                  {pct(c.monthlyKg)}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Powered-by attribution */}
      <p style={{ marginTop: 12, fontSize: "0.72rem", color: "var(--ink-3)", textAlign: "right" }}>
        Chart by <span style={{ color: "var(--mustard-600)", fontWeight: 600 }}>Google Charts</span>
      </p>
    </section>
  );
}
