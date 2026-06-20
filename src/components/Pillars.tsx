/** The three pillars from the challenge brief, made explicit for the user. */
export function Pillars() {
  const items = [
    { n: "01", title: "Understand", desc: "See your footprint broken down by category." },
    { n: "02", title: "Track", desc: "Save snapshots and watch the trend over time." },
    { n: "03", title: "Reduce", desc: "Get ranked, quantified actions for your life." },
  ];

  return (
    <div className="pillars" aria-label="What Cairo does">
      {items.map((p) => (
        <div className="pillar" key={p.n}>
          <span className="pnum">{p.n}</span>
          <h3>{p.title}</h3>
          <span>{p.desc}</span>
        </div>
      ))}
    </div>
  );
}
