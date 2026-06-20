/**
 * Core domain types for Cairo's carbon engine.
 *
 * The engine is deliberately framework-free and side-effect-free so that every
 * calculation is deterministic, auditable and unit-testable. The AI layer only
 * produces and consumes these types — it never does the maths itself.
 */

/** The four lifestyle categories Cairo reasons about. */
export type Category = "transport" | "diet" | "energy" | "shopping";

/** Transport modes, keyed to emission factors (kg CO2e per km). */
export type TransportMode =
  | "car_petrol"
  | "car_diesel"
  | "car_electric"
  | "bus"
  | "train"
  | "metro"
  | "motorbike"
  | "bike"
  | "walk"
  | "flight";

/** Diet profiles, keyed to emission factors (kg CO2e per day). */
export type DietType =
  | "meat_heavy"
  | "meat_medium"
  | "pescatarian"
  | "vegetarian"
  | "vegan";

/** A single piece of lifestyle context the user provides. */
export type Activity =
  | {
      category: "transport";
      mode: TransportMode;
      /** Distance for one trip, in km. */
      km: number;
      /** Trips per week. */
      timesPerWeek: number;
    }
  | {
      category: "diet";
      diet: DietType;
    }
  | {
      category: "energy";
      /** Household electricity use in kWh per day. */
      electricityKwhPerDay: number;
      /** Air-conditioning / heating hours per day. */
      acHoursPerDay: number;
    }
  | {
      category: "shopping";
      /** Self-reported new-item purchases per month (clothes, gadgets…). */
      itemsPerMonth: number;
    };

/** Per-category result of a footprint calculation, normalised to kg CO2e / month. */
export interface CategoryResult {
  category: Category;
  monthlyKg: number;
  /** Human-readable label for the dominant driver in this category. */
  label: string;
}

/** The full footprint breakdown produced by the calculator. */
export interface Footprint {
  totalMonthlyKg: number;
  byCategory: CategoryResult[];
}

/** Difficulty of adopting a recommended action. */
export type Difficulty = "easy" | "moderate" | "ambitious";

/** A single, quantified reduction action produced by the recommender. */
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: Category;
  /** Estimated monthly saving in kg CO2e if adopted. */
  monthlySavingsKg: number;
  difficulty: Difficulty;
}

/** A persisted snapshot of a footprint, used by the "Track" pillar. */
export interface FootprintEntry {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
  totalMonthlyKg: number;
}
