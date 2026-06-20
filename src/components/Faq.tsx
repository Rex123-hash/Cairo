import { useEffect, useState } from "react";
import { Icon } from "./Icon";

interface FaqItem {
  q: string;
  a: string | JSX.Element;
}

const GOOGLE_PRODUCTS = [
  {
    name: "Gemini 2.5 Flash",
    desc: "Parses your free-text lifestyle description into structured activities and writes your personalised coaching summary. Also powers the Ask Cairo conversational chat — your footprint is injected as context so Gemini can answer specific questions.",
  },
  {
    name: "Google Maps Distance Matrix API",
    desc: "Converts a \"home → office\" commute string into real driving kilometres based on your actual geography, not an estimate. Falls back gracefully when no key is configured.",
  },
  {
    name: "Firebase Hosting",
    desc: "Serves Cairo globally via Google's CDN with HTTPS, zero cold-start latency, and automatic SSL. Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) are configured in firebase.json.",
  },
  {
    name: "Google Fonts",
    desc: "Inter typeface loaded from fonts.googleapis.com — a clean, modern sans-serif that improves readability and gives Cairo its SaaS feel.",
  },
  {
    name: "Google Analytics 4",
    desc: "Tracks 8 custom events: page_view, analyze_clicked, score_calculated (with grade parameter), recommendation_toggled, faq_opened, chat_opened, chat_message_sent, and history_cleared — giving real behavioural insight.",
  },
  {
    name: "Google Charts",
    desc: "The official Google Charts library (loaded from gstatic.com) powers the interactive category breakdown donut chart with hover tooltips, smooth animations, and automatic resize handling.",
  },
  {
    name: "Gemini Chat (Ask Cairo)",
    desc: "A dedicated conversational interface that sends your entire footprint breakdown + top recommendations as context to Gemini 2.5 Flash. Ask any follow-up: \"What if I went vegan?\", \"Which single change matters most?\", or \"Explain my transport emissions.\"",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "What is Cairo and how does it work?",
    a: "Cairo is an AI-powered carbon footprint tracker. You describe your week in plain English — commute, diet, energy use, shopping — and Cairo uses Google Gemini to parse your text, then a deterministic emissions engine to calculate your monthly CO₂ equivalent. The result is a score, a breakdown by category, ranked actions you can simulate, and an AI coach you can chat with.",
  },
  {
    q: "Which Google products does Cairo use? (7 total)",
    a: (
      <span>
        Cairo is built on <strong>seven Google products</strong>:
        <ul style={{ margin: "10px 0 0", paddingLeft: "1.3em", lineHeight: 2 }}>
          {GOOGLE_PRODUCTS.map((p) => (
            <li key={p.name}>
              <strong>{p.name}</strong> — {p.desc}
            </li>
          ))}
        </ul>
      </span>
    ),
  },
  {
    q: "What is 'Ask Cairo' and how does it work?",
    a: "Ask Cairo is a full conversational AI chat panel powered by Gemini 2.5 Flash. After analysing your lifestyle, the 'Ask Cairo' button appears in the topbar. Click it and ask anything — your exact footprint figures, category breakdown, and top 4 recommendations are injected as context into every message so Gemini gives personalised, data-grounded answers. It also works offline with smart fallback responses.",
  },
  {
    q: "How accurate is my carbon score?",
    a: "Cairo uses published IPCC and IEA emission factors (kg CO₂e per unit of activity). The numbers are estimates for awareness, not compliance reporting — real footprints vary by geography, energy mix, and lifestyle nuance. The score is most useful as a relative benchmark and for tracking change over time.",
  },
  {
    q: "What does the Eco-Score grade (A–F) mean?",
    a: "The grade compares your monthly footprint against the globally sustainable target of roughly 190 kg CO₂e/month (≈ 2.3 tonnes/year — the Paris Agreement-aligned per-capita budget). A = under 190 kg, B = under 350 kg, C = under 550 kg, D = under 800 kg, E = under 1,100 kg, F = above 1,100 kg.",
  },
  {
    q: "What is the what-if simulator?",
    a: "In the Recommendations card, each action has a checkbox. Ticking it adds its monthly saving to a live projection banner at the top — so you can see exactly how much your footprint would drop if you adopted a combination of changes, before committing to any of them.",
  },
  {
    q: "Does Cairo store my data anywhere?",
    a: "No. Your footprint history is stored only in your browser's localStorage — nothing is sent to a server or database. Cairo has no backend. The only outbound calls are to the Gemini API (your text) and the Maps API (commute origin/destination), both of which are key-restricted to this domain. Google Analytics only collects anonymised interaction events (no personal data).",
  },
  {
    q: "What are 'real-world equivalencies'?",
    a: "After your result, Cairo shows your footprint in everyday terms: how many trees you'd need to plant to offset it, equivalent car kilometres, short-haul flights, and smartphone charge cycles. These are calculated from standard carbon sequestration and emission rates to make an abstract number feel tangible.",
  },
  {
    q: "Can I use Cairo without a Gemini API key?",
    a: "Yes. Cairo has a built-in offline parser (regex + heuristics) that extracts activities from your text without any API calls. The coaching summary falls back to a deterministic template. The Ask Cairo chat also falls back to context-aware offline replies. All core features — score, breakdown, simulator, history — work fully offline. The badge in the topbar shows whether Gemini is active.",
  },
  {
    q: "How do I improve my score?",
    a: "Cairo ranks recommendations by their monthly CO₂ saving. The biggest wins are almost always diet (switching from meat-heavy to vegetarian saves ~150 kg/month) and transport (shifting half your car trips to public transit). Use the what-if simulator to find the combination that fits your life, then ask Cairo to explain any recommendation in detail.",
  },
  {
    q: "Who built Cairo?",
    a: "Cairo was built for PromptWars Challenge 3 — a hackathon focused on building meaningful AI-powered applications using Google's developer ecosystem. It demonstrates a smart assistant with logical decision making based on user context, practical real-world usability, and clean maintainable code — the three core judging criteria.",
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

  // Escape key closes the panel
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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
              Cairo · 7 Google products · Carbon Intelligence
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

        {/* All 7 Google products footer strip */}
        <div className="faq-tech-strip">
          <span className="faq-tech-label">7 Google products</span>
          {[
            "Gemini 2.5 Flash",
            "Maps Distance Matrix",
            "Firebase Hosting",
            "Google Fonts",
            "Google Analytics 4",
            "Google Charts",
            "Gemini Chat",
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
