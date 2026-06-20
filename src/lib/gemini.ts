import { parseLifestyle } from "../engine/parser";
import type { Activity, Footprint, Recommendation } from "../engine/types";
import { validateActivities } from "./validation";

/**
 * Google Gemini integration — the "language" layer of Cairo.
 *
 * Gemini does TWO jobs and never the maths:
 *   1. parse()   — turn free text into structured activities (richer than the
 *                  offline regex parser).
 *   2. explain() — phrase the deterministic engine's output as friendly coaching.
 *
 * Both functions fall back to a fully offline path when no key is configured or
 * the network fails, so the product always works. In production the key would be
 * proxied server-side; here it is read from an env var for a self-contained demo.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = "gemini-2.5-flash";
const ENDPOINT = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

/** True when a Gemini key is present and AI features are active. */
export const aiEnabled = Boolean(API_KEY);

async function callGemini(prompt: string): Promise<string | null> {
  if (!API_KEY) return null;
  try {
    const res = await fetch(ENDPOINT(API_KEY), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: unknown =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" ? text : null;
  } catch {
    return null;
  }
}

/**
 * Parse free text into validated activities. Uses Gemini when available, and
 * always falls back to the offline parser — the result is validated either way.
 */
export async function parseWithAI(text: string): Promise<Activity[]> {
  if (aiEnabled) {
    const prompt = [
      "Extract lifestyle carbon activities from the user's message as JSON.",
      'Return ONLY a JSON array. Each item is one of:',
      '{"category":"transport","mode":"car_petrol|car_diesel|car_electric|bus|train|metro|motorbike|bike|walk|flight","km":number,"timesPerWeek":number}',
      '{"category":"diet","diet":"meat_heavy|meat_medium|pescatarian|vegetarian|vegan"}',
      '{"category":"energy","electricityKwhPerDay":number,"acHoursPerDay":number}',
      '{"category":"shopping","itemsPerMonth":number}',
      "",
      `User message: ${text}`,
    ].join("\n");

    const raw = await callGemini(prompt);
    if (raw) {
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          const valid = validateActivities(parsed);
          if (valid.length > 0) return valid;
        } catch {
          // fall through to offline parser
        }
      }
    }
  }
  return parseLifestyle(text);
}

/** A reliable, deterministic explanation used offline or as a fallback. */
function templateExplanation(
  footprint: Footprint,
  recommendations: Recommendation[],
): string {
  const top = recommendations[0];
  const tonnes = (footprint.totalMonthlyKg * 12) / 1000;
  const lead = `Your estimated footprint is about ${footprint.totalMonthlyKg} kg CO₂e per month (~${tonnes.toFixed(1)} tonnes/year).`;
  if (!top) return `${lead} Add a bit more detail and Cairo can suggest where to cut.`;
  return `${lead} Your single biggest win: ${top.title.toLowerCase()} — saving about ${top.monthlySavingsKg} kg CO₂e every month.`;
}

/**
 * Produce a friendly, personalised summary of the result. Gemini phrases it when
 * available; otherwise a deterministic template keeps the experience intact.
 */
export async function explainWithAI(
  footprint: Footprint,
  recommendations: Recommendation[],
): Promise<string> {
  if (aiEnabled) {
    const prompt = [
      "You are Cairo, a warm, concise carbon coach. In 2-3 sentences, summarise",
      "the user's footprint and motivate their top action. Use the numbers given;",
      "do not invent figures. Plain text only.",
      "",
      `Total: ${footprint.totalMonthlyKg} kg CO2e/month.`,
      `Breakdown: ${footprint.byCategory
        .map((c) => `${c.category} ${c.monthlyKg}kg`)
        .join(", ")}.`,
      `Top actions: ${recommendations
        .slice(0, 3)
        .map((r) => `${r.title} (saves ${r.monthlySavingsKg}kg/mo)`)
        .join("; ")}.`,
    ].join("\n");

    const raw = await callGemini(prompt);
    if (raw && raw.trim()) return raw.trim();
  }
  return templateExplanation(footprint, recommendations);
}
