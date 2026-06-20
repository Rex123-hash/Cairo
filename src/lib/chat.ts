/**
 * Gemini conversational chat — "Ask Cairo".
 *
 * Injects the user's current footprint as system context so Gemini can answer
 * specific, personalised questions about their carbon score, categories, and
 * recommended actions. Falls back to a friendly offline message if no key.
 */

import type { Footprint, Recommendation } from "../engine/types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = "gemini-1.5-flash";
const ENDPOINT = (key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

/** Build a system context string from the user's footprint + recommendations. */
function buildContext(footprint: Footprint, recs: Recommendation[]): string {
  return [
    "You are Cairo, a warm and knowledgeable carbon footprint coach.",
    "Answer concisely (2-4 sentences unless a list is clearly better).",
    "Use the user's actual footprint data below. Do not invent numbers.",
    "",
    `USER'S FOOTPRINT (monthly):`,
    `  Total: ${footprint.totalMonthlyKg} kg CO₂e/month`,
    `  Annual: ~${((footprint.totalMonthlyKg * 12) / 1000).toFixed(1)} tonnes/year`,
    `  Breakdown: ${footprint.byCategory.map((c) => `${c.category} ${c.monthlyKg}kg`).join(", ")}`,
    "",
    `TOP RECOMMENDATIONS (by impact):`,
    ...recs
      .slice(0, 4)
      .map((r, i) => `  ${i + 1}. ${r.title} — saves ${r.monthlySavingsKg}kg/mo (${r.difficulty})`),
  ].join("\n");
}

/**
 * Send a message to Gemini with full conversation history + footprint context.
 * Returns the model's reply, or null if the request fails.
 */
export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
  footprint: Footprint,
  recommendations: Recommendation[],
): Promise<string | null> {
  if (!API_KEY) return null;

  const systemContext = buildContext(footprint, recommendations);

  // Build contents array — system context as the first "user" turn with a
  // model acknowledgement, then the actual conversation history, then the new message.
  const contents = [
    { role: "user", parts: [{ text: systemContext }] },
    {
      role: "model",
      parts: [{ text: "Understood. I have your footprint data and I'm ready to help." }],
    },
    ...history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  try {
    const res = await fetch(ENDPOINT(API_KEY), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.6, maxOutputTokens: 400 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" ? text.trim() : null;
  } catch {
    return null;
  }
}

/** Offline reply used when no Gemini key is configured. */
export function offlineChatReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("transport") || lower.includes("car") || lower.includes("commute"))
    return "Transport is usually the biggest lever. Swapping even half your car trips to public transit or cycling can cut 100–200 kg CO₂e per month. Add a Gemini API key to get a personalised breakdown for your specific commute.";
  if (lower.includes("diet") || lower.includes("food") || lower.includes("vegan") || lower.includes("vegetarian"))
    return "Diet is one of the highest-impact changes you can make. Moving from a meat-heavy diet to vegetarian saves around 150 kg CO₂e per month. Even one meat-free day a week makes a meaningful difference.";
  if (lower.includes("energy") || lower.includes("electricity") || lower.includes("ac"))
    return "Energy savings compound over time. Raising your AC thermostat by 1–2°C and eliminating standby loads typically saves 20–60 kg CO₂e per month with minimal lifestyle change.";
  return "I'm running in offline mode — add a Gemini API key to your .env.local to unlock personalised AI coaching. In the meantime, check the Recommendations card for your highest-impact actions.";
}

export const chatEnabled = Boolean(API_KEY);
