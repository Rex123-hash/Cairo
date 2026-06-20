import type { Activity, DietType, TransportMode } from "../engine/types";

/**
 * Defensive validation for anything entering the engine.
 *
 * All user- and AI-supplied data passes through here before it touches the
 * calculator. We clamp numbers to sane ranges and drop malformed activities,
 * so neither a typo nor a hostile/garbled AI response can corrupt results.
 */

const TRANSPORT_MODES: ReadonlySet<TransportMode> = new Set<TransportMode>([
  "car_petrol",
  "car_diesel",
  "car_electric",
  "bus",
  "train",
  "metro",
  "motorbike",
  "bike",
  "walk",
  "flight",
]);

const DIET_TYPES: ReadonlySet<DietType> = new Set<DietType>([
  "meat_heavy",
  "meat_medium",
  "pescatarian",
  "vegetarian",
  "vegan",
]);

function isTransportMode(value: unknown): value is TransportMode {
  return typeof value === "string" && TRANSPORT_MODES.has(value as TransportMode);
}

function isDietType(value: unknown): value is DietType {
  return typeof value === "string" && DIET_TYPES.has(value as DietType);
}

/** Coerce to a finite number clamped to [min, max]; returns null if unusable. */
function clampNumber(value: unknown, min: number, max: number): number | null {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

/** Validate and normalise a single unknown object into an Activity, or null. */
export function validateActivity(input: unknown): Activity | null {
  if (typeof input !== "object" || input === null) return null;
  const obj = input as Record<string, unknown>;

  switch (obj.category) {
    case "transport": {
      if (!isTransportMode(obj.mode)) return null;
      const km = clampNumber(obj.km, 0, 20000);
      const timesPerWeek = clampNumber(obj.timesPerWeek, 0, 50);
      if (km === null || timesPerWeek === null) return null;
      return { category: "transport", mode: obj.mode, km, timesPerWeek };
    }
    case "diet": {
      if (!isDietType(obj.diet)) return null;
      return { category: "diet", diet: obj.diet };
    }
    case "energy": {
      const electricityKwhPerDay = clampNumber(obj.electricityKwhPerDay, 0, 500);
      const acHoursPerDay = clampNumber(obj.acHoursPerDay, 0, 24);
      if (electricityKwhPerDay === null || acHoursPerDay === null) return null;
      return { category: "energy", electricityKwhPerDay, acHoursPerDay };
    }
    case "shopping": {
      const itemsPerMonth = clampNumber(obj.itemsPerMonth, 0, 1000);
      if (itemsPerMonth === null) return null;
      return { category: "shopping", itemsPerMonth };
    }
    default:
      return null;
  }
}

/** Validate a batch, dropping anything malformed. */
export function validateActivities(inputs: unknown): Activity[] {
  if (!Array.isArray(inputs)) return [];
  const out: Activity[] = [];
  for (const item of inputs) {
    const valid = validateActivity(item);
    if (valid) out.push(valid);
  }
  return out;
}
