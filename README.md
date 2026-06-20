<div align="center">

# Cairo

### Your AI carbon copilot — understand, track, and reduce your footprint.

Cairo turns a plain-language description of your week into a carbon **score**, a clear **breakdown**, and **ranked actions you can simulate** — grounded in a transparent rules engine, with Google Gemini handling the language.

[**Live demo →**](https://project-1-491916.web.app)

![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=googlegemini&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase&logoColor=black)
![Tests](https://img.shields.io/badge/tests-28%20passing-3c5d20)
![License](https://img.shields.io/badge/license-MIT-5a8a32)

</div>

---

## Contents

- [The problem](#the-problem)
- [What Cairo does](#what-cairo-does)
- [How it works](#how-it-works)
- [Google Cloud integration](#google-cloud-integration)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Security](#security)
- [Accessibility](#accessibility)
- [Assumptions and limitations](#assumptions-and-limitations)
- [License](#license)

---

## The problem

> **Challenge 3 — Carbon Footprint Awareness Platform:** *help individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.*

Most carbon tools either overwhelm people with forms or hand-wave with "go green." Cairo does neither. You describe your life in one sentence; Cairo gives you a number you can grasp, shows you exactly where it comes from, and tells you the **single highest-leverage change** for *your* situation — then lets you simulate the impact before committing.

Cairo addresses the brief through three named pillars:

| Pillar | In the product |
| --- | --- |
| **Understand** | An eco-score grade, an animated total, and a donut breakdown by category |
| **Track** | Saved snapshots with a trend sparkline and change-vs-last delta |
| **Reduce** | Ranked, quantified actions with an interactive what-if simulator |

---

## What Cairo does

- **Eco-Score (A–F)** — a 0–100 grade gauge that benchmarks your footprint at a glance.
- **Plain-language input** — "I drive 20km to work daily, eat meat, run AC all night" is enough.
- **Category breakdown** — an accessible donut chart across transport, diet, energy and shopping.
- **Real-world equivalencies** — trees to offset, km driven, short flights, phone charges.
- **Benchmark comparison** — you vs the world average vs the Paris-aligned sustainable target.
- **Interactive what-if simulator** — tick the actions you'd adopt and watch your projected footprint drop live, with the percentage saved.
- **Trend tracking** — every analysis is snapshotted into a sparkline history.
- **Works offline** — with no API keys it falls back to a built-in parser and template coaching, so it never breaks.

---

## How it works

The core design decision: **a transparent rules engine does all the maths and decision-making; Gemini only handles language.** Every number and recommendation is explainable and reproducible — never an AI guess.

```
  Plain text
      │
      ▼
  Gemini  ──►  parse to structured activities   (offline regex parser as fallback)
      │
      ▼
  Validation  ──►  clamp + sanitise every field
      │
      ▼
┌─────────────────────────── Deterministic engine ───────────────────────────┐
│  calculateFootprint()      recommend()            insights()                │
│  kg CO₂e by category       ranked savings actions  eco-score, equivalencies,│
│                                                    comparison, projection   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                    │
              Gemini explains  ◄────┤────►  Accessible React UI  +  history snapshot
              (template fallback)
```

### Approach and logic

1. **Parse** — your sentence becomes typed `Activity` objects (Gemini when a key is set, a dependency-free regex parser otherwise).
2. **Validate** — every value is clamped to a sane range before it reaches the engine, so a typo or a malformed AI response can't corrupt results.
3. **Calculate** — pure functions multiply activity data by published emission factors, normalised to kg CO₂e per month.
4. **Recommend** — for each activity the engine derives a concrete change, computes the exact saving, and ranks every option by impact.
5. **Insight** — the footprint becomes a grade, relatable equivalencies and benchmark comparisons.
6. **Explain and track** — Gemini (or a deterministic template) summarises the result as coaching, and a snapshot is saved to the trend.

---

## Google Cloud integration

Every integration has a real job and degrades gracefully — no key means an offline fallback, never a crash.

| Product | Role in Cairo |
| --- | --- |
| **Gemini API** (`gemini-2.5-flash`) | Natural-language parsing and coaching explanations |
| **Google Maps Platform** (Distance Matrix) | Converts "home → office" into real commute distance |
| **Firebase Hosting** | Serves the production build with a strict security-header policy |
| **Cloud Firestore** | Optional per-user history (security rules included) |
| **Google Fonts** (Inter) | Typography |

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript (strict) | Type safety end to end |
| UI | React 18 + Vite | Fast, minimal, static-deployable |
| Styling | Hand-written CSS | No framework weight; tiny bundle |
| Charts | Custom SVG | Zero chart dependencies |
| Tests | Vitest | Fast unit tests over the engine |
| AI | Google Gemini | Language parsing and coaching |
| Hosting | Firebase | One-command deploy, free tier |

Runtime dependencies: **just `react` and `react-dom`.** Everything else is dev-only.

---

## Getting started

```bash
# 1. Install
npm install

# 2. Run (works immediately — no keys needed)
npm run dev          # http://localhost:5173

# 3. Test
npm test             # 28 unit tests over the engine

# 4. Production build
npm run build        # type-check + bundle into dist/
```

Enable the AI features by copying `.env.example` to `.env.local` and adding your keys:

```env
VITE_GEMINI_API_KEY=your_key   # https://aistudio.google.com/apikey
VITE_MAPS_API_KEY=your_key     # Distance Matrix API, referrer-restricted
```

### Deploy (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting
```

---

## Project structure

```
src/
  engine/        types · emissionFactors · calculator · recommender · parser · insights   (pure, tested)
  lib/           gemini · maps · storage · validation                                      (integrations + safety)
  components/    Header · Pillars · ActivityInput · Dashboard · EcoScoreRing · Donut ·
                 Equivalencies · Comparison · Recommendations · History · Icon
  hooks/         useCountUp
  App.tsx · main.tsx · index.css
tests/           calculator · recommender · parser · insights
firebase.json · firestore.rules · .env.example
```

---

## Testing

`npm test` runs Vitest across the engine — `calculator`, `recommender`, `parser` and `insights` — covering typical inputs, boundary values (zero-emission modes, empty input, score clamping), category aggregation, the ranking guarantee, and the what-if projection. **28 tests, all passing.**

---

## Security

- **API keys are never committed** — `.env*` is git-ignored; `.env.example` documents the shape only.
- **All input is validated and clamped** in `src/lib/validation.ts` before reaching the engine.
- **Firestore security rules** (`firestore.rules`) scope every document to its owner's UID and reject out-of-range values; everything else is denied by default.
- **Security headers** (CSP, `X-Frame-Options`, `nosniff`) are set in `firebase.json`, with the CSP allow-listing only the Google APIs Cairo calls.
- The Maps key is restricted to the Distance Matrix API and should be HTTP-referrer restricted to the deployed domain.

> Production note: the demo reads keys from `import.meta.env` for a self-contained build. In production these calls would be proxied through a Cloud Function / Cloud Run service so keys never reach the browser — `src/lib/gemini.ts` and `src/lib/maps.ts` are the single integration points for that swap.

---

## Accessibility

Semantic landmarks, a skip link, labelled controls, ARIA descriptions on every chart, `role="status"` / `role="alert"` live regions for results and errors, visible focus rings, WCAG-AA colour contrast, and full `prefers-reduced-motion` support.

---

## Assumptions and limitations

- Emission factors are **regional averages** (DEFRA / IPCC transport, Scarborough et al. diet, ~0.4 kg/kWh grid) intended for **awareness, not compliance reporting**.
- Benchmarks: world average ≈ 4.7 t/yr, sustainable target ≈ 2 t/yr (per capita).
- A single-user local session; history is per-device unless Firestore is enabled.
- The offline parser captures the **dominant** transport mode mentioned; Gemini handles richer, multi-mode descriptions.

---

## License

MIT — built for **PromptWars Virtual, Challenge 3**.
