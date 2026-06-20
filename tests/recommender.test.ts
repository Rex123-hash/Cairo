import { describe, expect, it } from "vitest";
import { recommend } from "../src/engine/recommender";
import type { Activity } from "../src/engine/types";

describe("recommend", () => {
  it("suggests shifting heavy car commutes to rail", () => {
    const recs = recommend([
      { category: "transport", mode: "car_petrol", km: 20, timesPerWeek: 6 },
    ]);
    expect(recs).toHaveLength(1);
    expect(recs[0]?.category).toBe("transport");
    expect(recs[0]?.monthlySavingsKg).toBeGreaterThan(0);
  });

  it("does not suggest changes for already-green transport", () => {
    const recs = recommend([
      { category: "transport", mode: "bike", km: 10, timesPerWeek: 7 },
    ]);
    expect(recs).toHaveLength(0);
  });

  it("moves a meat-heavy diet one tier greener", () => {
    const recs = recommend([{ category: "diet", diet: "meat_heavy" }]);
    expect(recs[0]?.category).toBe("diet");
    // meat_heavy(7.2) -> meat_medium(5.6) = 1.6/day * 30 = 48
    expect(recs[0]?.monthlySavingsKg).toBeCloseTo(48, 0);
  });

  it("makes no diet suggestion for vegan (already greenest)", () => {
    const recs = recommend([{ category: "diet", diet: "vegan" }]);
    expect(recs).toHaveLength(0);
  });

  it("ranks all recommendations by impact, highest first", () => {
    const activities: Activity[] = [
      { category: "shopping", itemsPerMonth: 4 },
      { category: "transport", mode: "car_petrol", km: 30, timesPerWeek: 6 },
      { category: "diet", diet: "meat_heavy" },
    ];
    const recs = recommend(activities);
    expect(recs.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i - 1]!.monthlySavingsKg).toBeGreaterThanOrEqual(
        recs[i]!.monthlySavingsKg,
      );
    }
  });
});
