<div align="center">
  <img src="https://raw.githubusercontent.com/Rex123-hash/Cairo/main/public/icon.svg" alt="Cairo Logo" width="120" height="120" />
  <h1>Cairo — Carbon Intelligence</h1>
  <p><strong>An AI-powered carbon footprint tracker and coaching assistant.</strong></p>
  <p>Built for <b>PromptWars Challenge 3</b></p>
  <a href="https://cairo-carbon-ai.web.app"><strong>View Live Demo »</strong></a>
</div>

<br />

Cairo translates your plain-English lifestyle descriptions into accurate carbon emissions, ranks high-leverage lifestyle changes, and acts as a conversational sustainability coach. 

Instead of filling out tedious, multi-page forms, users simply type *"I drive a petrol car 15km to work and eat a lot of meat"*. Cairo parses this using Google Gemini, calculates the exact mathematical CO₂ output using a local deterministic engine, and provides interactive, ranked recommendations to lower the score.

---

## 🏆 Prompt Wars Challenge 3 Alignment

Cairo was designed from the ground up to excel in the three core judging criteria:

### 1. Smart Assistant (Gemini NL Parsing & Coaching)
Cairo uses **Gemini 2.5 Flash** for exactly what LLMs are best at: *Language*.
- **Parsing**: It extracts unstructured lifestyle data into a strict, validated JSON schema. 
- **Coaching**: It powers the embedded **Ask Cairo** conversational panel. When you open the chat, Cairo injects your real-time footprint data (kg CO₂e), your A-F grade, and your ranked recommendations into the system prompt. This gives the AI perfect context to act as a highly personalised coach.

### 2. Logical Decision Making (Deterministic Impact Engine)
LLMs are bad at precise math, so Cairo **never** asks Gemini to calculate carbon emissions.
- The AI handles the *extraction*, but a **deterministic, locally-running engine** handles the *maths*. 
- Cairo calculates CO₂e using published **IPCC and IEA emission factors**. 
- It generates "What-If" recommendations and mathematically ranks them by monthly CO₂ savings (kg/mo). The user is always presented with the highest-leverage actions first, completely eliminating AI hallucinations in the data.

### 3. Practical Real-World Application
Carbon footprinting is an abstract concept. Cairo makes it tangible and practical:
- **Real-World Equivalencies**: Translates raw kg/mo into "trees needed to offset", "equivalent smartphone charges", and "flights".
- **Google Maps Integration**: Rather than asking the user to guess how many kilometres they drive, they can just say "I commute from [Home Address] to [Work Address]". Cairo uses the Google Maps Distance Matrix API to calculate the true real-world driving distance.

---

## ⚡ Built on 7 Google Products

Cairo deeply integrates the Google developer ecosystem to provide a seamless SaaS experience:

1. **Gemini 2.5 Flash**: Natural Language parsing and conversational AI context engine.
2. **Google Maps Distance Matrix API**: Converts text commutes into real-world geographic distances (km).
3. **Firebase Hosting**: Serves the application globally via Google's edge CDN with zero cold-start latency.
4. **Google Fonts**: Delivers the crisp, modern *Inter* typeface.
5. **Google Analytics 4**: Tracks 8 custom interaction events (`analyze_clicked`, `score_calculated`, `recommendation_toggled`, etc.) to map user behaviour.
6. **Google Charts**: Interactive, animated donut charts (loaded via `gstatic.com`) to break down emission categories dynamically.
7. **Gemini Chat (Ask Cairo)**: A dedicated, embedded chat panel providing contextual, follow-up coaching based on the user's specific footprint.

---

## 🛡️ Architecture & Code Quality

- **Zero-Backend Architecture**: Cairo runs entirely in the browser. All heavy lifting (parsing, math, rendering) is executed on the client-side, making it incredibly fast.
- **Graceful Degradation (Offline Mode)**: If API keys are missing, rate-limited (HTTP 429), or the network fails, Cairo automatically falls back to an offline Regex parser, an offline Maps estimator, and a deterministic template coach. **The app never breaks.**
- **Strict Typing**: Built with 100% TypeScript.
- **Accessibility (WCAG AA)**: Full keyboard navigation (Esc to close modals), `aria-labels` on all interactables, `role="alert"` for dynamic errors, and semantic HTML.
- **Security**: Strict Content Security Policy (CSP), `X-Frame-Options: DENY`, and `Referrer-Policy` enforced via `firebase.json`.

---

## 🧪 Comprehensive Testing Suite

Cairo includes **28 passing unit tests** using Vitest, covering every edge case of the deterministic mathematical engine. This ensures the carbon calculations are always 100% accurate before Gemini ever sees them.

**Test Results (`npm run test`):**
```text
> cairo@1.0.0 test
> vitest run

 RUN  v2.1.9 cairo

 ✓ tests/parser.test.ts (6 tests)
 ✓ tests/recommender.test.ts (5 tests)
 ✓ tests/calculator.test.ts (8 tests)
 ✓ tests/insights.test.ts (9 tests)

 Test Files  4 passed (4)
      Tests  28 passed (28)
   Duration  537ms
```

### What is tested?
- **`calculator.test.ts`**: Verifies exact CO₂e output against known IPCC emission factors for transport, diet, energy, and shopping.
- **`parser.test.ts`**: Ensures the offline Regex fallback correctly extracts activities, times per week, and units from messy natural language inputs.
- **`recommender.test.ts`**: Validates the logic that generates "What-If" recommendations (e.g., verifying that shifting from meat-heavy to vegetarian correctly calculates the delta in kg/mo).
- **`insights.test.ts`**: Tests the real-world equivalency mathematical conversions (trees, flights, cars).

---

## 💻 Local Development Setup

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
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_key_here
   VITE_MAPS_API_KEY=your_maps_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
