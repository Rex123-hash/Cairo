/**
 * Google Charts loader utility.
 *
 * Loads the Google Charts library from gstatic.com (official Google CDN)
 * once and caches the promise. Safe to call from multiple components.
 *
 * Google Charts is the 7th Google product used by Cairo:
 *   https://developers.google.com/chart
 */

let loadPromise: Promise<void> | null = null;

/** Load Google Charts — returns a promise that resolves when ready to draw. */
export function loadGoogleCharts(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    // If the loader script is already present (e.g. SSR re-render), reuse it
    if (typeof window.google?.charts?.load === "function") {
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.gstatic.com/charts/loader.js";
    script.async = true;
    script.onload = () => {
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(resolve);
    };
    script.onerror = () => reject(new Error("Failed to load Google Charts"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** True when Google Charts has been loaded and is ready to draw. */
export function isChartsReady(): boolean {
  return typeof window.google?.visualization !== "undefined";
}
