import type { FootprintEntry } from "../engine/types";

interface HistoryProps {
  entries: FootprintEntry[];
  onClear: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Saved footprint snapshots over time — a sparkline + the "Track" pillar. */
export function History({ entries, onClear }: HistoryProps) {
  if (entries.length === 0) return null;

  const latest = entries[0]?.totalMonthlyKg ?? 0;
  const previous = entries[1]?.totalMonthlyKg;
  const delta =
    previous !== undefined ? Math.round(latest - previous) : undefined;

  // Oldest → newest for the sparkline.
  const chrono = [...entries].reverse();
  const max = Math.max(...chrono.map((e) => e.totalMonthlyKg), 1);

  return (
    <section className="card rise" aria-labelledby="history-heading">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 id="history-heading" style={{ margin: 0 }}>
          Your trend
        </h2>
        <button type="button" className="link-btn" onClick={onClear}>
          Clear history
        </button>
      </div>

      {delta !== undefined && (
        <p className="muted" style={{ marginTop: 8 }}>
          {delta < 0
            ? `↓ ${Math.abs(delta)} kg vs last snapshot — nice progress.`
            : delta > 0
              ? `↑ ${delta} kg vs last snapshot.`
              : "No change vs last snapshot."}
        </p>
      )}

      {chrono.length > 1 && (
        <div className="spark" role="img" aria-label="Footprint trend over time">
          {chrono.map((e) => (
            <div
              className="bar"
              key={e.id}
              style={{ height: `${(e.totalMonthlyKg / max) * 100}%` }}
              title={`${e.totalMonthlyKg} kg/mo`}
            />
          ))}
        </div>
      )}

      <div>
        {entries.map((e) => (
          <div className="history-row" key={e.id}>
            <span className="date">{formatDate(e.createdAt)}</span>
            <span>
              <strong>{e.totalMonthlyKg.toLocaleString()}</strong> kg/mo
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
