import type { Recommendation } from "./types";

/**
 * Derived insights layer — turns a raw footprint number into the things people
 * actually understand: a grade, relatable equivalencies, and a comparison to
 * benchmarks. All pure functions, fully unit-tested.
 *
 * Benchmark sources (per-capita, converted to kg CO2e per month):
 *  - World average ≈ 4.7 t/yr  → ~392 kg/month
 *  - Paris-aligned sustainable target ≈ 2 t/yr → ~167 kg/month
 */

export const WORLD_AVG_MONTHLY_KG = 392;
export const SUSTAINABLE_MONTHLY_KG = 167;

const TREE_KG_PER_YEAR = 21; // CO2 absorbed by one mature tree per year
const CAR_KG_PER_KM = 0.192;
const SHORT_FLIGHT_KG = 130; // one-way short-haul flight, per passenger
const PHONE_CHARGE_KG = 0.0084; // charging a smartphone once

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export interface EcoScore {
  /** 0–100, higher is greener. */
  score: number;
  grade: Grade;
  label: string;
  annualTonnes: number;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

const GRADE_LABELS: Record<Grade, string> = {
  A: "Outstanding — well below sustainable levels",
  B: "Great — near the sustainable target",
  C: "Good — below the world average",
  D: "Fair — around the world average",
  E: "High — above the world average",
  F: "Very high — well above the world average",
};

/** Convert a monthly footprint into a 0–100 score and an A–F grade. */
export function ecoScore(monthlyKg: number): EcoScore {
  const annualTonnes = (monthlyKg * 12) / 1000;
  const score = Math.round(clamp(100 - annualTonnes * 6.25, 0, 100));

  let grade: Grade;
  if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 55) grade = "C";
  else if (score >= 40) grade = "D";
  else if (score >= 20) grade = "E";
  else grade = "F";

  return {
    score,
    grade,
    label: GRADE_LABELS[grade],
    annualTonnes: Math.round(annualTonnes * 10) / 10,
  };
}

export type EquivIcon = "tree" | "car" | "plane" | "bolt";

export interface Equivalency {
  icon: EquivIcon;
  value: string;
  label: string;
}

/** Translate a monthly footprint into relatable real-world equivalents. */
export function equivalencies(monthlyKg: number): Equivalency[] {
  const annualKg = monthlyKg * 12;
  return [
    {
      icon: "tree",
      value: Math.max(1, Math.ceil(annualKg / TREE_KG_PER_YEAR)).toLocaleString(),
      label: "trees to offset a year",
    },
    {
      icon: "car",
      value: Math.round(monthlyKg / CAR_KG_PER_KM).toLocaleString(),
      label: "km driven / month",
    },
    {
      icon: "plane",
      value: (Math.round((monthlyKg / SHORT_FLIGHT_KG) * 10) / 10).toString(),
      label: "short flights / month",
    },
    {
      icon: "bolt",
      value: Math.round(monthlyKg / PHONE_CHARGE_KG).toLocaleString(),
      label: "phone charges / month",
    },
  ];
}

export interface Comparison {
  monthlyKg: number;
  worldAvg: number;
  target: number;
  /** Percentage of the world average (100 = exactly average). */
  vsWorldPct: number;
  belowWorld: boolean;
  meetsTarget: boolean;
}

/** Compare a footprint against world-average and sustainable benchmarks. */
export function comparison(monthlyKg: number): Comparison {
  return {
    monthlyKg,
    worldAvg: WORLD_AVG_MONTHLY_KG,
    target: SUSTAINABLE_MONTHLY_KG,
    vsWorldPct: Math.round((monthlyKg / WORLD_AVG_MONTHLY_KG) * 100),
    belowWorld: monthlyKg < WORLD_AVG_MONTHLY_KG,
    meetsTarget: monthlyKg <= SUSTAINABLE_MONTHLY_KG,
  };
}

/**
 * Projected footprint after adopting a set of recommendations — powers the
 * interactive "what-if" simulator.
 */
export function projectedFootprint(
  total: number,
  selected: Recommendation[],
): number {
  const saved = selected.reduce((sum, r) => sum + r.monthlySavingsKg, 0);
  return Math.max(0, Math.round((total - saved) * 10) / 10);
}
