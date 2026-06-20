# Cairo 🌿 — Carbon Intelligence

**Cairo** is an AI-powered carbon footprint tracker and coaching assistant. Built for **PromptWars Challenge 3**, it translates your plain-English lifestyle descriptions into accurate carbon emissions, ranks high-leverage lifestyle changes, and acts as a conversational sustainability coach.

![Cairo Screenshot](https://raw.githubusercontent.com/Rex123-hash/Cairo/master/public/icon.svg)

## 🚀 Live Demo
**[cairo-carbon-ai.web.app](https://cairo-carbon-ai.web.app)**

---

## 🏆 Prompt Wars Challenge 3 Alignment

Cairo was designed specifically to excel in the three core judging criteria:

1. **Smart Assistant (Gemini NL Parsing & Coaching)**  
   Cairo uses **Gemini 2.5 Flash** to extract complex, unstructured lifestyle data (e.g., "I drive 15km to work in a petrol car and eat a heavy meat diet") into a strict JSON schema. It also powers the "Ask Cairo" conversational panel, which injects your real-time footprint data as context into the prompt, creating a highly personalised AI coach.

2. **Logical Decision Making (Deterministic Impact Engine)**  
   The AI handles the *language*, but a deterministic, locally-running engine handles the *maths*. Cairo calculates CO₂e using published IPCC and IEA emission factors. It then generates "What-If" recommendations, mathematically ranking them by monthly CO₂ savings (kg/mo) so the user is always presented with the highest-leverage actions first.

3. **Practical Real-World Application**  
   Carbon footprinting is a tangible, global problem. Cairo brings this abstract concept to life by using real-world equivalencies (e.g., "trees needed to offset", "equivalent smartphone charges") and integrating the **Google Maps Distance Matrix API** to calculate true commute distances rather than relying on user guesswork.

---

## ⚡ Built on 7 Google Products

Cairo is deeply integrated into the Google developer ecosystem:

1. **Gemini 2.5 Flash**: Natural Language parsing and conversational AI context engine.
2. **Google Maps Distance Matrix API**: Converts text commutes into real-world geographic distances (km).
3. **Firebase Hosting**: Serves the application globally via Google's edge CDN with zero cold-start latency.
4. **Google Fonts**: Delivers the crisp, modern *Inter* typeface for a premium SaaS feel.
5. **Google Analytics 4**: Tracks 8 custom interaction events to understand user engagement and drop-off.
6. **Google Charts**: Interactive, animated donut charts to break down emission categories.
7. **Gemini Chat**: The embedded "Ask Cairo" panel providing contextual, follow-up coaching.

---

## 🛡️ Architecture & Code Quality

- **Zero-Backend Architecture**: Cairo runs entirely in the browser. All logic is executed on the client-side, making it incredibly fast.
- **Graceful Degradation (Offline Mode)**: If API keys are missing, rate-limited, or network fails, Cairo automatically falls back to an offline Regex parser, offline Maps estimator, and deterministic template coaching. The app never breaks.
- **Strict Typing**: 100% TypeScript.
- **Accessibility (WCAG AA)**: Full keyboard navigation (Esc to close modals), `aria-labels`, `role="alert"`, and semantic HTML.
- **Security**: Strict Content Security Policy (CSP), `X-Frame-Options`, and `Referrer-Policy` enforced via `firebase.json`.

---

## 🧪 Comprehensive Testing Suite

Cairo includes **28 passing unit tests** using Vitest, covering every edge case of the deterministic engine:

- **`calculator.test.ts`**: Verifies exact CO₂e output against known IPCC emission factors for transport, diet, energy, and shopping.
- **`parser.test.ts`**: Ensures the offline Regex fallback correctly extracts activities, times per week, and units from messy natural language inputs.
- **`recommender.test.ts`**: Validates the logic that generates "What-If" recommendations (e.g., verifying that shifting from meat to vegetarian correctly calculates the delta in kg/mo).
- **`insights.test.ts`**: Tests the real-world equivalency mathematical conversions (trees, flights, cars).

To run the tests locally:
```bash
npm run test
```

---

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rex123-hash/Cairo.git
   cd Cairo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_MAPS_API_KEY=your_maps_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---
*Built for PromptWars Challenge 3.*
