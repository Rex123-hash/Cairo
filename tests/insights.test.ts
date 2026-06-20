import { describe, expect, it } from "vitest";
import {
  comparison,
  ecoScore,
  equivalencies,
  projectedFootprint,
  SUSTAINABLE_MONTHLY_KG,
} from "../src/engine/insights";
import type { Recommendation } from "../src/engine/types";

describe("ecoScore", () => {
  it("awards a top grade to a very low footprint", () => {
    const s = ecoScore(100); // 1.2 t/yr
    expect(s.grade).toBe("A");
    expect(s.score).toBeGreaterThanOrEqual(85);
  });

  it("gives a poor grade to a very high footprint", () => {
    const s = ecoScore(1200); // 14.4 t/yr
    expect(["E", "F"]).toContain(s.grade);
    expect(s.score).toBeLessThan(40);
  });

  it("clamps the score between 0 and 100", () => {
    expect(ecoScore(0).score).toBe(100);
    expect(ecoScore(100000).score).toBe(0);
  });
});

describe("equivalencies", () => {
  it("returns four relatable metrics with non-empty values", () => {
    const eq = equivalencies(300);
    expect(eq).toHaveLength(4);
    for (const e of eq) {
      expect(e.value).not.toBe("");
      expect(e.label.length).toBeGreaterThan(0);
    }
  });

  it("scales with the footprint", () => {
    const small = equivalencies(100)[0]!;
    const big = equivalencies(1000)[0]!;
    expect(Number(big.value.replace(/,/g, ""))).toBeGreaterThan(
      Number(small.value.replace(/,/g, "")),
    );
  });
});

describe("comparison", () => {
  it("flags a footprint below the world average", () => {
    const c = comparison(200);
    expect(c.belowWorld).toBe(true);
    expect(c.vsWorldPct).toBeLessThan(100);
  });

  it("recognises meeting the sustainable target", () => {
    expect(comparison(SUSTAINABLE_MONTHLY_KG).meetsTarget).toBe(true);
    expect(comparison(SUSTAINABLE_MONTHLY_KG + 50).meetsTarget).toBe(false);
  });
});

describe("projectedFootprint", () => {
  const recs: Recommendation[] = [
    {
      id: "a",
      title: "A",
      description: "",
      category: "transport",
      monthlySavingsKg: 40,
      difficulty: "easy",
    },
    {
      id: "b",
      title: "B",
      description: "",
      category: "diet",
      monthlySavingsKg: 30,
      difficulty: "easy",
    },
  ];

  it("subtracts the savings of selected recommendations", () => {
    expect(projectedFootprint(300, recs)).toBe(230);
    expect(projectedFootprint(300, [recs[0]!])).toBe(260);
  });

  it("never goes below zero", () => {
    expect(projectedFootprint(50, recs)).toBe(0);
  });
});
