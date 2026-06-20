import { calculateActivity } from "./calculator";
import { DIET_FACTORS } from "./emissionFactors";
import type { Activity, Recommendation } from "./types";

/** Round to one decimal place. */
function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * The recommendation engine — Cairo's "logical decision making based on user
 * context". For each activity it knows about, it derives a concrete, quantified
 * action and the monthly CO2e it would save, then ranks every option by impact.
 *
 * This is rules-based and deterministic on purpose: every suggestion is
 * explainable and reproducible, never an AI guess.
 */
export function recommend(activities: Activity[]): Recommendation[] {
  const recs: Recommendation[] = [];

  for (const activity of activities) {
    switch (activity.category) {
      case "transport": {
        // Suggest shifting the most carbon-heavy car/flight trips to transit.
        const heavyModes = new Set([
          "car_petrol",
          "car_diesel",
          "motorbike",
          "flight",
        ]);
        if (heavyModes.has(activity.mode) && activity.timesPerWeek > 0) {
          const shiftTrips = Math.max(1, Math.floor(activity.timesPerWeek / 2));
          const current = calculateActivity(activity);
          const reduced = calculateActivity({
            ...activity,
            timesPerWeek: activity.timesPerWeek - shiftTrips,
          });
          const greener = calculateActivity({
            category: "transport",
            mode: "train",
            km: activity.km,
            timesPerWeek: shiftTrips,
          });
          const savings = round1(current - reduced - greener);
          if (savings > 0) {
            recs.push({
              id: `transport-shift-${activity.mode}`,
              title: `Shift ${shiftTrips} of ${activity.timesPerWeek} weekly trips to train/metro`,
              description: `Swapping ${shiftTrips} ${activity.mode.replace(/_/g, " ")} trips a week for rail is your highest-leverage transport change.`,
              category: "transport",
              monthlySavingsKg: savings,
              difficulty: "moderate",
            });
          }
        }
        break;
      }

      case "diet": {
        // Suggest one tier "greener" on the diet ladder.
        const ladder: Array<keyof typeof DIET_FACTORS> = [
          "meat_heavy",
          "meat_medium",
          "pescatarian",
          "vegetarian",
          "vegan",
        ];
        const idx = ladder.indexOf(activity.diet);
        if (idx >= 0 && idx < ladder.length - 1) {
          const nextDiet = ladder[idx + 1]!;
          const current = calculateActivity(activity);
          const greener = calculateActivity({
            category: "diet",
            diet: nextDiet,
          });
          const savings = round1(current - greener);
          if (savings > 0) {
            recs.push({
              id: `diet-shift-${activity.diet}`,
              title: `Move from ${activity.diet.replace(/_/g, " ")} to ${nextDiet.replace(/_/g, " ")} a few days a week`,
              description: `Even a partial shift toward ${nextDiet.replace(/_/g, " ")} meaningfully cuts food emissions.`,
              category: "diet",
              monthlySavingsKg: savings,
              difficulty: "easy",
            });
          }
        }
        break;
      }

      case "energy": {
        // Suggest trimming AC and a 15% efficiency improvement.
        const current = calculateActivity(activity);
        const improved = calculateActivity({
          ...activity,
          electricityKwhPerDay: activity.electricityKwhPerDay * 0.85,
          acHoursPerDay: Math.max(0, activity.acHoursPerDay - 2),
        });
        const savings = round1(current - improved);
        if (savings > 0) {
          recs.push({
            id: "energy-efficiency",
            title: "Trim AC by 2h/day and cut standby loads ~15%",
            description:
              "Raising the thermostat a degree and killing standby power is a low-effort, recurring win.",
            category: "energy",
            monthlySavingsKg: savings,
            difficulty: "easy",
          });
        }
        break;
      }

      case "shopping": {
        if (activity.itemsPerMonth > 1) {
          const halved = Math.floor(activity.itemsPerMonth / 2);
          const current = calculateActivity(activity);
          const reduced = calculateActivity({
            category: "shopping",
            itemsPerMonth: activity.itemsPerMonth - halved,
          });
          const savings = round1(current - reduced);
          if (savings > 0) {
            recs.push({
              id: "shopping-reduce",
              title: `Buy ${halved} fewer new items/month (repair or buy second-hand)`,
              description:
                "Extending the life of what you own avoids the embodied carbon of new manufacturing.",
              category: "shopping",
              monthlySavingsKg: savings,
              difficulty: "moderate",
            });
          }
        }
        break;
      }
    }
  }

  // Rank by impact — the single most important decision the assistant makes.
  return recs.sort((a, b) => b.monthlySavingsKg - a.monthlySavingsKg);
}
