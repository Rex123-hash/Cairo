/**
 * Google Analytics 4 integration for Cairo.
 *
 * Uses gtag.js (loaded in index.html). All calls are no-ops when GA is not
 * configured so the app works identically with or without a Measurement ID.
 *
 * Events follow GA4 naming conventions (snake_case, ≤40 chars).
 */

/** True when window.gtag is available. */
function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/** Generic GA4 event helper. */
function track(event: string, params?: Record<string, string | number | boolean>): void {
  if (!hasGtag()) return;
  window.gtag("event", event, params);
}

// ── Page / session events ─────────────────────────────────────────────────

/** Call once on app mount — records a page_view. */
export function trackPageView(): void {
  track("page_view", { page_title: "Cairo — Carbon Intelligence" });
}

// ── Core feature events ───────────────────────────────────────────────────

/** User submitted their lifestyle description for analysis. */
export function trackAnalyzeClicked(textLength: number): void {
  track("analyze_clicked", { text_length: textLength });
}

/** Gemini/offline analysis completed. */
export function trackScoreCalculated(params: {
  total_kg: number;
  grade: string;
  category_count: number;
  ai_enabled: boolean;
}): void {
  track("score_calculated", params);
}

/** User toggled a what-if recommendation checkbox. */
export function trackRecommendationToggled(params: {
  rec_id: string;
  checked: boolean;
}): void {
  track("recommendation_toggled", params);
}

/** User opened the FAQ panel. */
export function trackFaqOpened(): void {
  track("faq_opened");
}

/** User opened the Ask-Cairo chat panel. */
export function trackChatOpened(): void {
  track("chat_opened");
}

/** User sent a message in the Ask-Cairo chat. */
export function trackChatMessage(turnIndex: number): void {
  track("chat_message_sent", { turn_index: turnIndex });
}

/** User cleared their history. */
export function trackHistoryCleared(): void {
  track("history_cleared");
}
