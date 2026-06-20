import type { Activity, DietType, TransportMode } from "./types";

/**
 * A lightweight, dependency-free natural-language parser.
 *
 * This is Cairo's offline brain: it turns a sentence like
 *   "I drive 20km to work 5 days a week, eat meat daily and run AC all night"
 * into structured Activity objects WITHOUT any network call. When a Gemini key
 * is configured the app uses Gemini for richer parsing, but this guarantees the
 * product works end-to-end with zero credentials.
 */

const TRANSPORT_KEYWORDS: Array<[RegExp, TransportMode]> = [
  [/\b(electric car|ev|tesla)\b/i, "car_electric"],
  [/\b(diesel)\b/i, "car_diesel"],
  [/\b(drive|car|petrol|gas)\b/i, "car_petrol"],
  [/\b(motorbike|motorcycle|scooter|bike taxi)\b/i, "motorbike"],
  [/\b(metro|subway|underground|tube)\b/i, "metro"],
  [/\b(train|rail)\b/i, "train"],
  [/\b(bus|coach)\b/i, "bus"],
  [/\b(cycle|bicycle|biking)\b/i, "bike"],
  [/\b(walk|walking|on foot)\b/i, "walk"],
  [/\b(flight|fly|plane|airplane)\b/i, "flight"],
];

const DIET_KEYWORDS: Array<[RegExp, DietType]> = [
  [/\b(vegan|plant-based)\b/i, "vegan"],
  [/\b(vegetarian|veggie)\b/i, "vegetarian"],
  [/\b(pescatarian|fish)\b/i, "pescatarian"],
  [/\b(some meat|occasional meat|meat sometimes)\b/i, "meat_medium"],
  [/\b(meat|beef|chicken|steak|non-?veg)\b/i, "meat_heavy"],
];

/** Extract the first number that appears near a keyword, with a fallback. */
function findNumber(text: string, pattern: RegExp, fallback: number): number {
  const match = text.match(pattern);
  if (match && match[1]) {
    const value = Number.parseFloat(match[1]);
    if (Number.isFinite(value)) return value;
  }
  return fallback;
}

/** Detect weekly frequency from phrases like "5 days a week" / "daily". */
function findFrequency(text: string): number {
  if (/\b(daily|every ?day|each day)\b/i.test(text)) return 7;
  const perWeek = text.match(/(\d+)\s*(?:days?|times?|x)\s*(?:a|per)\s*week/i);
  if (perWeek && perWeek[1]) return Number.parseInt(perWeek[1], 10);
  return 5; // sensible commute default
}

/**
 * Parse free text into a list of activities. Always returns at least an empty
 * array — never throws — so the UI can rely on it.
 */
export function parseLifestyle(text: string): Activity[] {
  const activities: Activity[] = [];
  if (!text || !text.trim()) return activities;

  // Transport
  for (const [pattern, mode] of TRANSPORT_KEYWORDS) {
    if (pattern.test(text)) {
      const km = findNumber(text, /(\d+(?:\.\d+)?)\s*(?:km|kms|kilometre?s?)/i, 15);
      activities.push({
        category: "transport",
        mode,
        km,
        timesPerWeek: findFrequency(text),
      });
      break; // take the dominant mode mentioned
    }
  }

  // Diet
  for (const [pattern, diet] of DIET_KEYWORDS) {
    if (pattern.test(text)) {
      activities.push({ category: "diet", diet });
      break;
    }
  }

  // Energy
  if (/\b(ac|air ?con|electricity|power|energy|heating)\b/i.test(text)) {
    const electricityKwhPerDay = findNumber(text, /(\d+(?:\.\d+)?)\s*kwh/i, 10);
    const acHoursPerDay = /\ball night\b/i.test(text)
      ? 8
      : findNumber(text, /(\d+)\s*(?:hours?|hrs?)\s*(?:of\s*)?(?:ac|air)/i, 3);
    activities.push({
      category: "energy",
      electricityKwhPerDay,
      acHoursPerDay,
    });
  }

  // Shopping
  if (/\b(shop|shopping|buy|clothes|gadget|online order)\b/i.test(text)) {
    const itemsPerMonth = findNumber(
      text,
      /(\d+)\s*(?:items?|things?|orders?|products?)/i,
      4,
    );
    activities.push({ category: "shopping", itemsPerMonth });
  }

  return activities;
}
