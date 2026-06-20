import { useEffect, useState } from "react";
import { ActivityInput } from "./components/ActivityInput";
import { Chat } from "./components/Chat";
import { Comparison } from "./components/Comparison";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Equivalencies } from "./components/Equivalencies";
import { Faq } from "./components/Faq";
import { GDonut } from "./components/GDonut";
import { Header } from "./components/Header";
import { History } from "./components/History";
import { Pillars } from "./components/Pillars";
import { Recommendations } from "./components/Recommendations";
import { calculateFootprint } from "./engine/calculator";
import {
  comparison as buildComparison,
  equivalencies as buildEquivalencies,
} from "./engine/insights";
import { recommend } from "./engine/recommender";
import type {
  Footprint,
  FootprintEntry,
  Recommendation,
} from "./engine/types";
import {
  trackAnalyzeClicked,
  trackFaqOpened,
  trackChatOpened,
  trackHistoryCleared,
  trackPageView,
  trackScoreCalculated,
} from "./lib/analytics";
import { ecoScore } from "./engine/insights";
import { aiEnabled, explainWithAI, parseWithAI } from "./lib/gemini";
import { addHistory, clearHistory, listHistory } from "./lib/storage";

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [footprint, setFootprint] = useState<Footprint | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insight, setInsight] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<FootprintEntry[]>([]);
  const [faqOpen, setFaqOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    setHistory(listHistory());
    trackPageView();
  }, []);

  async function handleAnalyze() {
    setLoading(true);
    setError("");
    trackAnalyzeClicked(text.length);

    try {
      const activities = await parseWithAI(text);
      if (activities.length === 0) {
        setError(
          "Cairo couldn't spot any activities — mention a commute, diet, energy use or shopping.",
        );
        setFootprint(null);
        setRecommendations([]);
        return;
      }

      const fp = calculateFootprint(activities);
      const recs = recommend(activities);
      const explanation = await explainWithAI(fp, recs);
      const score = ecoScore(fp.totalMonthlyKg);

      setFootprint(fp);
      setRecommendations(recs);
      setInsight(explanation);
      setHistory(addHistory(fp.totalMonthlyKg));

      trackScoreCalculated({
        total_kg: fp.totalMonthlyKg,
        grade: score.grade,
        category_count: fp.byCategory.length,
        ai_enabled: aiEnabled,
      });
    } catch {
      setError("Something went wrong while analysing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    clearHistory();
    setHistory([]);
    trackHistoryCleared();
  }

  function openFaq() {
    setFaqOpen(true);
    trackFaqOpened();
  }

  function openChat() {
    setChatOpen(true);
    trackChatOpened();
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="app">
        <Header
          aiEnabled={aiEnabled}
          onFaqOpen={openFaq}
          onChatOpen={footprint ? openChat : undefined}
        />

        {/* Overlays */}
        {faqOpen && <Faq onClose={() => setFaqOpen(false)} />}
        {chatOpen && footprint && (
          <Chat
            footprint={footprint}
            recommendations={recommendations}
            onClose={() => setChatOpen(false)}
          />
        )}

        <p className="hero">
          Describe your week in plain English. Cairo gives you a{" "}
          <strong>carbon score</strong>, a category breakdown, and{" "}
          <strong>ranked what-if actions</strong> — all powered by Gemini.
        </p>
        <Pillars />

        <main id="main">
          <ErrorBoundary section="Input">
            <ActivityInput
              value={text}
              loading={loading}
              onChange={setText}
              onAnalyze={handleAnalyze}
            />
          </ErrorBoundary>

          {error && (
            <p
              className="insight"
              role="alert"
              style={{ borderColor: "var(--danger)", background: "#faece9" }}
            >
              {error}
            </p>
          )}

          {footprint && (
            <>
              <ErrorBoundary section="Dashboard">
                <Dashboard footprint={footprint} insight={insight} />
              </ErrorBoundary>

              <ErrorBoundary section="Breakdown chart">
                <GDonut
                  categories={footprint.byCategory}
                  total={footprint.totalMonthlyKg}
                />
              </ErrorBoundary>

              <ErrorBoundary section="Equivalencies">
                <Equivalencies items={buildEquivalencies(footprint.totalMonthlyKg)} />
              </ErrorBoundary>

              <ErrorBoundary section="Comparison">
                <Comparison data={buildComparison(footprint.totalMonthlyKg)} />
              </ErrorBoundary>

              <ErrorBoundary section="Recommendations">
                <Recommendations
                  recommendations={recommendations}
                  total={footprint.totalMonthlyKg}
                />
              </ErrorBoundary>
            </>
          )}

          <ErrorBoundary section="History">
            <History entries={history} onClear={handleClear} />
          </ErrorBoundary>
        </main>

        <footer className="foot">
          Estimates use published emission factors for awareness, not compliance
          reporting · Built for PromptWars Challenge 3
        </footer>
      </div>
    </>
  );
}
