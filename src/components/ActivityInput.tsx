interface ActivityInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onAnalyze: () => void;
}

const EXAMPLES = [
  "I drive 20km to work 5 days a week, eat meat daily and run AC all night.",
  "Vegetarian, take the metro 12km each way, buy 6 new things a month.",
  "Fly 800km twice a month, electric car for 15km commute, 8 kWh/day at home.",
];

/** Free-text lifestyle input with one-tap examples. */
export function ActivityInput({
  value,
  loading,
  onChange,
  onAnalyze,
}: ActivityInputProps) {
  return (
    <section className="card" aria-labelledby="input-heading">
      <h2 id="input-heading">Describe your week</h2>
      <label htmlFor="lifestyle">
        Tell Cairo about your commute, diet, energy use and shopping — in plain
        words.
      </label>
      <textarea
        id="lifestyle"
        value={value}
        placeholder="e.g. I drive 20km to work 5 days a week, eat meat daily, and run the AC all night…"
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="examples" role="group" aria-label="Example inputs">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            type="button"
            className="chip"
            onClick={() => onChange(ex)}
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn"
        onClick={onAnalyze}
        disabled={loading || value.trim().length === 0}
      >
        {loading ? "Analysing…" : "Analyse my footprint →"}
      </button>
    </section>
  );
}
