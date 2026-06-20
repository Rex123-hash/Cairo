import type { Equivalency } from "../engine/insights";
import { Icon } from "./Icon";

interface EquivalenciesProps {
  items: Equivalency[];
}

/** "Your footprint equals…" — relatable real-world equivalents. */
export function Equivalencies({ items }: EquivalenciesProps) {
  return (
    <section className="card rise d2" aria-labelledby="equiv-heading">
      <h2 id="equiv-heading">Put it in perspective</h2>
      <div className="equiv-grid">
        {items.map((e) => (
          <div className="equiv" key={e.label}>
            <span className="icon">
              <Icon name={e.icon} size={20} />
            </span>
            <div className="v">{e.value}</div>
            <div className="l">{e.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
