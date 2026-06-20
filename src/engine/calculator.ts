import {
  AC_KWH_PER_HOUR,
  DAYS_PER_MONTH,
  DIET_FACTORS,
  ELECTRICITY_FACTOR,
  SHOPPING_ITEM_FACTOR,
  TRANSPORT_FACTORS,
  WEEKS_PER_MONTH,
} from "./emissionFactors";
import type { Activity, CategoryResult, Footprint } from "./types";

/** Round to one decimal place for stable, readable output. */
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Monthly kg CO2e for a single activity. Pure function — no side effects, fully
 * determined by its input. This is the heart of the engine.
 */
export function calculateActivity(activity: Activity): number {
  switch (activity.category) {
    case "transport": {
      const factor = TRANSPORT_FACTORS[activity.mode];
      const monthlyTrips = activity.timesPerWeek * WEEKS_PER_MONTH;
      return activity.km * factor * monthlyTrips;
    }
    case "diet": {
      return DIET_FACTORS[activity.diet] * DAYS_PER_MONTH;
    }
    case "energy": {
      const acKwhPerDay = activity.acHoursPerDay * AC_KWH_PER_HOUR;
      const dailyKwh = activity.electricityKwhPerDay + acKwhPerDay;
      return dailyKwh * ELECTRICITY_FACTOR * DAYS_PER_MONTH;
    }
    case "shopping": {
      return activity.itemsPerMonth * SHOPPING_ITEM_FACTOR;
    }
  }
}

/** A short human label describing the dominant driver of a category. */
function labelFor(activity: Activity): string {
  switch (activity.category) {
    case "transport":
      return `${activity.mode.replace(/_/g, " ")} · ${activity.km} km × ${activity.timesPerWeek}/wk`;
    case "diet":
      return activity.diet.replace(/_/g, " ");
    case "energy":
      return `${activity.electricityKwhPerDay} kWh/day + ${activity.acHoursPerDay}h AC`;
    case "shopping":
      return `${activity.itemsPerMonth} new items/month`;
  }
}

/**
 * Aggregate a list of activities into a full footprint, grouped by category and
 * normalised to kg CO2e per month.
 */
export function calculateFootprint(activities: Activity[]): Footprint {
  const totals = new Map<CategoryResult["category"], CategoryResult>();

  for (const activity of activities) {
    const monthlyKg = calculateActivity(activity);
    const existing = totals.get(activity.category);
    if (existing) {
      existing.monthlyKg = round1(existing.monthlyKg + monthlyKg);
    } else {
      totals.set(activity.category, {
        category: activity.category,
        monthlyKg: round1(monthlyKg),
        label: labelFor(activity),
      });
    }
  }

  const byCategory = [...totals.values()].sort(
    (a, b) => b.monthlyKg - a.monthlyKg,
  );
  const totalMonthlyKg = round1(
    byCategory.reduce((sum, c) => sum + c.monthlyKg, 0),
  );

  return { totalMonthlyKg, byCategory };
}
