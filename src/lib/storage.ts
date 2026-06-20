import type { FootprintEntry } from "../engine/types";

/**
 * History storage for the "Track" pillar.
 *
 * Default implementation uses localStorage so the app works instantly with no
 * backend. The interface intentionally mirrors a Firestore collection
 * (list / add) so swapping in `firestore.rules` + Firestore is a drop-in change
 * — see README "Upgrading to Firestore".
 */

const STORAGE_KEY = "cairo:history:v1";

function readAll(): FootprintEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FootprintEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAll(entries: FootprintEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage may be unavailable (private mode); fail silently — history is
    // a convenience, never required for the core flow.
  }
}

/** Return saved footprint snapshots, newest first. */
export function listHistory(): FootprintEntry[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Persist a new footprint snapshot and return the updated list. */
export function addHistory(totalMonthlyKg: number): FootprintEntry[] {
  const entry: FootprintEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    totalMonthlyKg,
  };
  const next = [entry, ...readAll()].slice(0, 30);
  writeAll(next);
  return listHistory();
}

/** Clear all saved history. */
export function clearHistory(): void {
  writeAll([]);
}
