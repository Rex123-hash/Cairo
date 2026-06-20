import { useState } from "react";
import { Icon } from "./Icon";

interface FaqItem {
  q: string;
  a: string | JSX.Element;
}

const FAQS: FaqItem[] = [
  {
    q: "What is Cairo and how does it work?",
    a: "Cairo is an AI-powered carbon footprint tracker. You describe your week in plain English — commute, diet, energy use, shopping — and Cairo uses Google Gemini to parse your text, then a deterministic emissions engine to calculate your monthly CO₂ equivalent. The result is a score, a category breakdown, and ranked actions you can simulate.",
  },
  {
    q: "What Google technologies power Cairo?",
    a: (
      <span>
        Cairo is built on <strong>four Google products</strong>:
        <ul style={{ margin: "10px 0 0", paddingLeft: "1.3em", lineHeight: 1.9 }}>
          <li>
            <strong>Gemini 2.5 Flash</strong> — parses your free-text lifestyle
            description into structured activities and writes your personalised
            coaching summary.
          </li>
          <li>
            <strong>Google Maps Distance Matrix API</strong> — converts a
            "home → office" commute into real kilometres based on your actual
            geography, not a guess.
          </li>
          <li>
            <strong>Firebase Hosting</strong> — serves the application globally
            with a CDN, HTTPS, and zero cold-start latency.
          </li>
          <li>
            <strong>Google Fonts</strong> — Inter typeface loaded via{" "}
            <code>fonts.googleapis.com</code> for crisp, modern typography.
          </li>
        </ul>
      </span>
    ),
  },
  {
    q: "How accurate is my carbon score?",
    a: "Cairo uses published IPCC and IEA emission factors (kg CO₂e per unit of activity). The numbers are estimates for awareness, not compliance reporting — real footprints vary by geography, energy mix, and lifestyle nuance. The score is most useful as a relative benchmark and for tracking change over time.",
  },
  {
    q: "What does the Eco-Score grade (A–F) mean?",
    a: "The grade compares your monthly footprint against the globally sustainable target of roughly 190 kg CO₂e/month (≈ 2.3 tonnes/year — the Paris Agreement-aligned per-capita budget). A = under 190 kg, B = under 350 kg, C = under 550 kg, D = under 800 kg, E = under 1 100 kg, F = above 1 100 kg.",
  },
  {
    q: "What is the what-if simulator?",
    a: "In the Recommendations card, each action has a checkbox. Ticking it adds its monthly saving to a live projection banner at the top — so you can see exactly how much your footprint would drop if you adopted a combination of changes, before committing to any of them.",
  },
  {
    q: "Does Cairo store my data anywhere?",
    a: "No. Your footprint history is stored only in your browser's localStorage — nothing is sent to a server or database. Cairo has no backend. The only outbound calls are to the Gemini API (your text, anonymised) and the Maps API (your commute origin/destination), both of which are key-restricted to this domain.",
  },
  {
    q: "What are 'real-world equivalencies'?",
    a: "After your result, Cairo shows your footprint in everyday terms: how many trees you'd need to plant to offset it, equivalent car kilometres, short-haul flights, and smartphone charge cycles. These are calculated from standard carbon sequestration and emission rates to make an abstract number feel tangible.",
  },
  {
    q: "Can I use Cairo without a Gemini API key?",
    a: "Yes. Cairo has a built-in offline parser (regex + heuristics) that extracts activities from your text without any API calls. The coaching summary falls back to a deterministic template. All core features — score, breakdown, simulator, history — work fully offline. The badge in the top-right shows whether Gemini is active.",
  },
  {
    q: "How do I improve my score?",
    a: "Cairo ranks recommendations by their monthly CO₂ saving. The biggest wins are almost always diet (switching from meat-heavy to vegetarian saves ~150 kg/month) and transport (switching one car trip per week to public transit). Use the what-if simulator to find the combination that fits your life, then track your progress over time.",
  },
  {
    q: "Who built Cairo?",
    a: "Cairo was built for PromptWars Challenge 3 — a hackathon focused on building meaningful AI-powered applications using Google's developer ecosystem. It is an open-source, client-side app with no paid infrastructure beyond the free tiers of Gemini and Firebase.",
  },
];

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function AccordionItem({ item, isOpen, onToggle, index }: AccordionItemProps) {
  return (
    <div className={`faq-item${isOpen ? " open" : ""}`}>
      <button
        className="faq-q"
        onClick={onToggle}
        aria-expanded={isOpen}
        id={`faq-btn-${index}`}
        aria-controls={`faq-ans-${index}`}
      >
        <span>{item.q}</span>
        <span className="faq-chevron" aria-hidden="true">
          <Icon name="trend" size={16} />
        </span>
      </button>
      <div
        className="faq-a"
        id={`faq-ans-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        hidden={!isOpen}
      >
        <div className="faq-a-inner">{item.a}</div>
      </div>
    </div>
  );
}

interface FaqProps {
  onClose: () => void;
}

export function Faq({ onClose }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <div
      className="faq-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Frequently Asked Questions"
    >
      {/* Backdrop */}
      <div className="faq-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div className="faq-panel rise">
        <div className="faq-panel-header">
          <div>
            <h2 className="faq-panel-title">Frequently Asked Questions</h2>
            <p className="faq-panel-sub">
              Everything about Cairo, carbon scoring, and the Google stack.
            </p>
          </div>
          <button
            className="faq-close"
            onClick={onClose}
            aria-label="Close FAQ"
          >
            <Icon name="check" size={18} />
          </button>
        </div>

        <div className="faq-list">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Google products footer strip */}
        <div className="faq-tech-strip">
          <span className="faq-tech-label">Powered by</span>
          {[
            "Gemini 2.5 Flash",
            "Maps Distance Matrix",
            "Firebase Hosting",
            "Google Fonts",
          ].map((p) => (
            <span className="faq-tech-pill" key={p}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
