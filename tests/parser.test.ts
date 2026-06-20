import { describe, expect, it } from "vitest";
import { parseLifestyle } from "../src/engine/parser";

describe("parseLifestyle", () => {
  it("returns an empty array for empty input", () => {
    expect(parseLifestyle("")).toEqual([]);
    expect(parseLifestyle("   ")).toEqual([]);
  });

  it("extracts a car commute with distance and frequency", () => {
    const acts = parseLifestyle(
      "I drive 20km to work 5 days a week",
    );
    const transport = acts.find((a) => a.category === "transport");
    expect(transport).toBeDefined();
    if (transport?.category === "transport") {
      expect(transport.mode).toBe("car_petrol");
      expect(transport.km).toBe(20);
      expect(transport.timesPerWeek).toBe(5);
    }
  });

  it("reads 'daily' as 7 times per week", () => {
    const acts = parseLifestyle("I take the train 12km daily");
    const transport = acts.find((a) => a.category === "transport");
    if (transport?.category === "transport") {
      expect(transport.mode).toBe("train");
      expect(transport.timesPerWeek).toBe(7);
    }
  });

  it("detects diet keywords", () => {
    const vegan = parseLifestyle("I'm vegan");
    expect(vegan.some((a) => a.category === "diet" && a.diet === "vegan")).toBe(
      true,
    );
    const meat = parseLifestyle("I eat beef every day");
    expect(
      meat.some((a) => a.category === "diet" && a.diet === "meat_heavy"),
    ).toBe(true);
  });

  it("captures energy use including 'all night' AC", () => {
    const acts = parseLifestyle("I run the AC all night, about 9 kWh a day");
    const energy = acts.find((a) => a.category === "energy");
    expect(energy).toBeDefined();
    if (energy?.category === "energy") {
      expect(energy.electricityKwhPerDay).toBe(9);
      expect(energy.acHoursPerDay).toBe(8);
    }
  });

  it("parses a full multi-category sentence", () => {
    const acts = parseLifestyle(
      "I drive 25km to work 5 days a week, eat meat daily, run AC all night and buy 6 items a month",
    );
    const categories = acts.map((a) => a.category);
    expect(categories).toContain("transport");
    expect(categories).toContain("diet");
    expect(categories).toContain("energy");
    expect(categories).toContain("shopping");
  });
});
