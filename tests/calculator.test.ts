import { describe, expect, it } from "vitest";
import {
  calculateActivity,
  calculateFootprint,
} from "../src/engine/calculator";
import type { Activity } from "../src/engine/types";

describe("calculateActivity", () => {
  it("computes monthly transport emissions from km × factor × trips", () => {
    const activity: Activity = {
      category: "transport",
      mode: "car_petrol",
      km: 20,
      timesPerWeek: 5,
    };
    // 20 km * 0.192 * (5 * 4.345 weeks) ≈ 83.4 kg
    expect(calculateActivity(activity)).toBeCloseTo(83.4, 0);
  });

  it("treats walking and cycling as zero emission", () => {
    expect(
      calculateActivity({
        category: "transport",
        mode: "walk",
        km: 10,
        timesPerWeek: 7,
      }),
    ).toBe(0);
    expect(
      calculateActivity({
        category: "transport",
        mode: "bike",
        km: 10,
        timesPerWeek: 7,
      }),
    ).toBe(0);
  });

  it("computes diet emissions per month", () => {
    // meat_heavy 7.2 * 30 = 216
    expect(
      calculateActivity({ category: "diet", diet: "meat_heavy" }),
    ).toBeCloseTo(216, 5);
    // vegan 2.9 * 30 = 87
    expect(
      calculateActivity({ category: "diet", diet: "vegan" }),
    ).toBeCloseTo(87, 5);
  });

  it("includes AC load in energy emissions", () => {
    // (10 + 4*1.5) * 0.4 * 30 = 192
    expect(
      calculateActivity({
        category: "energy",
        electricityKwhPerDay: 10,
        acHoursPerDay: 4,
      }),
    ).toBeCloseTo(192, 5);
  });

  it("computes shopping emissions from item count", () => {
    expect(
      calculateActivity({ category: "shopping", itemsPerMonth: 4 }),
    ).toBe(60);
  });
});

describe("calculateFootprint", () => {
  it("aggregates by category and sorts descending", () => {
    const activities: Activity[] = [
      { category: "diet", diet: "meat_heavy" }, // 216
      { category: "shopping", itemsPerMonth: 2 }, // 30
      { category: "transport", mode: "car_petrol", km: 20, timesPerWeek: 5 }, // ~83
    ];
    const fp = calculateFootprint(activities);

    expect(fp.byCategory[0]?.category).toBe("diet");
    expect(fp.byCategory.at(-1)?.category).toBe("shopping");
    expect(fp.totalMonthlyKg).toBeGreaterThan(320);
    expect(fp.totalMonthlyKg).toBeLessThan(340);
  });

  it("merges multiple activities in the same category", () => {
    const fp = calculateFootprint([
      { category: "shopping", itemsPerMonth: 2 },
      { category: "shopping", itemsPerMonth: 3 },
    ]);
    expect(fp.byCategory).toHaveLength(1);
    expect(fp.byCategory[0]?.monthlyKg).toBe(75);
  });

  it("returns an empty footprint for no activities", () => {
    const fp = calculateFootprint([]);
    expect(fp.totalMonthlyKg).toBe(0);
    expect(fp.byCategory).toHaveLength(0);
  });
});
