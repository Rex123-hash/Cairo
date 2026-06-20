/**
 * Shared engine utilities.
 * Centralises helpers used across calculator.ts and recommender.ts.
 */

/** Round a number to one decimal place for stable, readable output. */
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Clamp a value between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
