# Cairo 🌿
**AI-Powered Carbon Intelligence & Sustainability Coach**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://cairo-carbon-ai.web.app)
[![Gemini API](https://img.shields.io/badge/Google-Gemini_AI-blue.svg)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange.svg)](https://firebase.google.com/)

## 🌐 Live Demo
**Production URL:** [https://cairo-carbon-ai.web.app](https://cairo-carbon-ai.web.app)

---

## 🎯 Challenge Vertical: Smart Assistant
Cairo is built around the **Smart Assistant vertical** for Prompt Wars Challenge 3. It acts as an intelligent digital sustainability coach, translating unstructured conversational input about your lifestyle into strict, actionable carbon metrics and personalized recommendations.

## 🏆 Prompt Wars Challenge 3 Alignment
Cairo was designed from the ground up to excel in the three core judging criteria:

### 1. Smart Assistant (Gemini NL Parsing & Coaching)
Large Language Models excel at understanding language, but can hallucinate math. Cairo uses **Gemini 2.5 Flash** for exactly what it is best at:
- **Parsing**: It extracts messy, unstructured lifestyle data into a strict JSON schema. It understands synonyms, mixed units, and conversational tangents.
- **Coaching**: It powers the embedded **Ask Cairo** conversational panel. When you open the chat, Cairo injects your real-time footprint data (kg CO₂e), your A-F grade, and your ranked recommendations into the system prompt. This gives the AI perfect context to act as a highly personalised, accurate coach rather than a generic chatbot.

### 2. Logical Decision Making (Deterministic Impact Engine)
To prevent AI hallucinations in critical sustainability data, Cairo *never* asks Gemini to calculate carbon emissions.
- The AI handles the extraction, but a **deterministic, locally-running engine** handles the maths. 
- Cairo calculates CO₂e using published, scientifically-backed IPCC and IEA emission factors. 
- It generates "What-If" recommendations (e.g., "Switch to public transit") and mathematically ranks them by monthly CO₂ savings (kg/mo). The user is always presented with the highest-leverage actions first, completely eliminating AI hallucinations in the data and ensuring logical decision making.

### 3. Practical Real-World Application
Carbon footprinting is an abstract concept. Cairo makes it tangible, practical, and highly applicable to daily life:
- **Real-World Equivalencies**: Translates raw kg/mo into visual metrics people actually understand: "Trees needed to offset", "Equivalent smartphone charges", and "Equivalent long-haul flights".
- **Google Maps Integration**: Rather than asking the user to guess how many kilometres they drive, they can just say *"I commute from London to Manchester"*. Cairo integrates the **Google Maps Distance Matrix API** to calculate the true real-world driving distance instantly.

---

## 🧠 What It Does
Cairo solves the biggest problem in carbon tracking: tedious, multi-page data entry forms. 
Instead of forcing users to calculate their own utility bills or driving distances, Cairo lets them just type or speak naturally: 

> *"I drive a petrol car 15km to work, eat a heavy meat diet, and leave my AC on all day."*

The platform utilizes three core layers:

| Component | Role | Model / Tech |
| :--- | :--- | :--- |
| **Data Extractor** | Parses unstructured natural language into a strict JSON lifestyle schema | `gemini-2.5-flash` |
| **Deterministic Engine** | Calculates precise kg CO₂e using IPCC/IEA emission factors | Local TypeScript Engine |
| **Ask Cairo** | Conversational AI coach that uses your footprint as context for advice | `gemini-2.5-flash` |

---

## 🏗️ Architecture & Approach

```text
┌──────────────────────────────────────────────────────────────┐
│                     Firebase Hosting                         │
│                                                              │
│   ┌──────────────────┐    ┌──────────────────────────────┐   │
│   │  React 18 SPA    │───▶│   Deterministic Math Engine  │   │
│   │  (Vite + TS)     │    │      (Calculates kg CO2e)    │   │
│   └──────────────────┘    └──────────────┬───────────────┘   │
│                                          │                   │
│                         ┌────────────────▼──────────────┐    │
│                         │    Recommender & Insights     │    │
│                         │   (Ranks CO2 savings)         │    │
│                         └────────────────┬──────────────┘    │
└──────────────────────────────────────────┼───────────────────┘
                                           │
             ┌─────────────────────────────┼───────────────────┐
             │                             │                   │
      ┌──────▼──────┐             ┌────────▼──────┐  ┌───────▼──────┐
      │ Gemini API  │             │  Google Maps  │  │   Offline    │
      │ 2.5 Flash   │             │ Distance API  │  │   Fallback   │
      └─────────────┘             └───────────────┘  └──────────────┘
```

### Key Design Decisions
1. **Zero-Hallucination Math:** LLMs struggle with precise arithmetic. Cairo uses Gemini *only* for language parsing. The actual carbon calculation (kg CO₂e) is done by a deterministic TypeScript engine based on IPCC data.
2. **Context Injection:** The "Ask Cairo" chatbot doesn't start with a blank slate. It is injected with your exact calculated footprint, your A-F grade, and your highest-impact recommendations before you even say hello.
3. **Graceful Degradation:** If the Gemini API key hits a rate limit (HTTP 429) or the Maps API is unreachable, the app instantly falls back to offline Regex parsers and offline distance estimators. The app never crashes.

---

## 🚀 How It Works
**For Users:**
1. Type a description of your weekly routine in plain English.
2. The AI extracts your transport, diet, and energy usage.
3. The Deterministic Engine calculates your monthly footprint and assigns an **Eco-Score Grade (A-F)**.
4. "What-If" recommendations are mathematically ranked to show you the highest-leverage lifestyle changes.
5. You can open **Ask Cairo** to chat directly with the AI about your specific results.

---

## 🛠️ Tech Stack

### Frontend
- **React 18 + TypeScript + Vite**
- **CSS** — Custom design system with modern glassmorphism
- **Google Fonts** — Inter typography
- **Google Charts** — Interactive donut visualizations

### Engine
- **Pure TypeScript** (No Backend required)
- **Strict Vitest testing suite**

---

## ☁️ Google Services
Cairo deeply integrates the Google developer ecosystem to provide a seamless SaaS experience.

**1. Gemini API — Gemini 2.5 Flash**
- **File:** `src/lib/gemini.ts` & `src/lib/chat.ts`
- **Model:** `gemini-2.5-flash`
- **Role:** Handles Natural Language parsing (converting text to JSON) and the conversational AI context engine for the Ask Cairo coach.

**2. Google Maps Distance Matrix API**
- **File:** `src/lib/maps.ts`
- **Role:** Solves the "distance guessing" problem. Converts text commutes (e.g., "London to Manchester") into real-world geographic distances (km) for accurate transport calculations.

**3. Firebase Hosting**
- **Role:** Serves the application globally via Google's edge CDN, ensuring zero cold-start latency and instant load times.

**4. Google Fonts**
- **Role:** Delivers the crisp, modern *Inter* typeface, giving the application a clean, readable, premium feel.

**5. Google Analytics 4 (GA4)**
- **Role:** Tracks 8 custom interaction events (`analyze_clicked`, `score_calculated`, `recommendation_toggled`, `faq_opened`, etc.) to map user behaviour and measure product-market fit.

**6. Google Charts**
- **Role:** Renders interactive, animated donut charts (loaded securely via `gstatic.com`) to break down emission categories dynamically.

**7. Gemini Chat (Ask Cairo)**
- **Role:** A dedicated, embedded chat panel built specifically for contextual, follow-up coaching based on the user's footprint context.

---

## 📋 Setup & Running Locally

**Prerequisites**
- Node.js 18+

**1. Clone & Install**
```bash
git clone https://github.com/Rex123-hash/Cairo.git
cd Cairo
npm install
```

**2. Configure Environment**
Create a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_MAPS_API_KEY=your_maps_key
```

**3. Run Locally**
```bash
npm run dev    # → http://localhost:5173
```

---

## 🚢 Deployment (Firebase)
```bash
# 1. Build frontend
npm run build

# 2. Deploy to Firebase Hosting
npx firebase deploy --only hosting
```

---

## 🧪 Testing
Cairo runs on a mathematically deterministic engine with a strict test suite.
```bash
> cairo@1.0.0 test
> vitest run

 RUN  v2.1.9 cairo

 ✓ tests/parser.test.ts (6 tests)
 ✓ tests/recommender.test.ts (5 tests)
 ✓ tests/calculator.test.ts (8 tests)
 ✓ tests/insights.test.ts (9 tests)

 Test Files  4 passed (4)
      Tests  28 passed (28)
```
**28 tests — all passing.** Test coverage spans:

| Category | Tests | Description |
| :--- | :---: | :--- |
| **AI Parser** | 6 | Regex fallback and edge-case extraction |
| **Recommender** | 5 | "What-if" mathematical impact rankings |
| **Calculator** | 8 | IPCC emission logic and global averages |
| **Insights** | 9 | Real-world equivalency conversions |

---

## 📁 Project Structure
```text
cairo/
├── public/                      # Static assets
├── src/
│   ├── components/              # Pure UI components (Header, Chat, Dashboard)
│   ├── engine/                  # Deterministic Math (calculator, insights, recommender)
│   ├── lib/                     # API Integrations (gemini, maps, analytics)
│   ├── App.tsx                  # Main application state
│   └── index.css                # Global design system
├── tests/                       # Vitest test suite
├── package.json
└── README.md
```

---

## 🔐 Security
- **No Backend Vulnerabilities:** As a pure client-side application, there is no database to inject or server to breach.
- **Graceful Degradation:** The application safely catches HTTP 429 (Rate Limits) and HTTP 401 (Unauthorized) API errors, replacing them with safe offline mock functions.
- **XSS Prevention:** React natively sanitizes all AI outputs before rendering them to the DOM.
- `.env.local` excluded from git via `.gitignore`.

---

## 💡 Assumptions Made
- **Emission Factors:** We assume standard global averages for emission factors (e.g., an EV uses the average global grid mix). In a production version, this would be localized by the user's country.
- **Offline Fallback:** We assume that if the user provides no API keys, they still want to use the app. The app instantly falls back to a Regex engine that can parse basic phrases like *"I drive 10km"* without ever hitting Google servers.

---
<div align="center">
  <b>Built for Prompt Wars Hackathon 3</b><br>
  <i>Powered by Google Gemini & Firebase</i>
</div>
