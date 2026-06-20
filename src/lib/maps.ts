/**
 * Google Maps Platform integration (Distance Matrix API).
 *
 * Converts a "from → to" commute into a real one-way distance in km, so the
 * footprint reflects the user's actual geography rather than a guess. Falls back
 * to null when no key is set or the request fails, letting the caller use a
 * manual/estimated distance instead — the app never breaks.
 *
 * The key must be HTTP-referrer restricted and limited to the Distance Matrix
 * API in the Google Cloud console (see README "Security").
 */

const API_KEY = import.meta.env.VITE_MAPS_API_KEY as string | undefined;

/** True when a Maps key is present and distance lookups are active. */
export const mapsEnabled = Boolean(API_KEY);

/**
 * Return the driving distance in km between two place strings, or null if the
 * lookup is unavailable. Note: browser CORS means production should proxy this
 * through a function; included here to document the intended integration.
 */
export async function getCommuteKm(
  from: string,
  to: string,
): Promise<number | null> {
  if (!API_KEY || !from.trim() || !to.trim()) return null;
  try {
    const url = new URL(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
    );
    url.searchParams.set("origins", from);
    url.searchParams.set("destinations", to);
    url.searchParams.set("units", "metric");
    url.searchParams.set("key", API_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const meters: unknown = data?.rows?.[0]?.elements?.[0]?.distance?.value;
    if (typeof meters !== "number") return null;
    return Math.round((meters / 1000) * 10) / 10;
  } catch {
    return null;
  }
}
