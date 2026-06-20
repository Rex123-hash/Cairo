import { useEffect, useRef, useState } from "react";
import {
  chatEnabled,
  offlineChatReply,
  sendChatMessage,
  type ChatMessage,
} from "../lib/chat";
import { trackChatMessage } from "../lib/analytics";
import type { Footprint, Recommendation } from "../engine/types";
import { Icon } from "./Icon";

/** Suggested starter questions pre-populated with user's context. */
const STARTERS = [
  "Which single change has the most impact?",
  "How does my footprint compare to the average?",
  "What if I went vegetarian for a month?",
  "Explain my transport emissions in plain English.",
  "How many trees would offset my annual footprint?",
];

interface ChatProps {
  footprint: Footprint;
  recommendations: Recommendation[];
  onClose: () => void;
}

export function Chat({ footprint, recommendations, onClose }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: `Hi! I'm Cairo, your carbon coach. Your footprint is **${footprint.totalMonthlyKg} kg CO₂e/month** — ask me anything about it.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open, Escape to close
  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", text: text.trim() };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    trackChatMessage(messages.filter((m) => m.role === "user").length);

    let reply: string | null = null;
    if (chatEnabled) {
      reply = await sendChatMessage(
        messages, // history before user's new message
        text.trim(),
        footprint,
        recommendations,
      );
    }
    if (!reply) reply = offlineChatReply(text);

    setMessages([...nextHistory, { role: "model", text: reply }]);
    setLoading(false);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  /** Render a message bubble with very basic **bold** markdown. */
  function renderText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={i}>{part.slice(2, -2)}</strong>
        : part,
    );
  }

  return (
    <div
      className="faq-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Ask Cairo — AI carbon coach"
    >
      <div className="faq-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="faq-panel chat-panel rise">
        {/* Header */}
        <div className="faq-panel-header">
          <div>
            <h2 className="faq-panel-title">Ask Cairo</h2>
            <p className="faq-panel-sub">
              {chatEnabled
                ? "Powered by Gemini 1.5 Flash — ask anything about your footprint."
                : "Offline mode — add a Gemini key for personalised AI answers."}
            </p>
          </div>
          <button className="faq-close" onClick={onClose} aria-label="Close chat">
            <Icon name="check" size={18} />
          </button>
        </div>

        {/* Suggested starters (only when conversation is fresh) */}
        {messages.length === 1 && (
          <div className="chat-starters">
            {STARTERS.map((s) => (
              <button
                key={s}
                className="chat-starter-chip"
                onClick={() => send(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Message list */}
        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              {m.role === "model" && (
                <span className="chat-avatar" aria-hidden="true">
                  <Icon name="leaf" size={14} />
                </span>
              )}
              <div className="chat-text">{renderText(m.text)}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble model">
              <span className="chat-avatar" aria-hidden="true">
                <Icon name="leaf" size={14} />
              </span>
              <div className="chat-text chat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your footprint… (Enter to send)"
            rows={2}
            disabled={loading}
            aria-label="Chat input"
          />
          <button
            className="chat-send"
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <Icon name="trend" size={18} />
          </button>
        </div>

        {/* Footer */}
        <div className="faq-tech-strip">
          <span className="faq-tech-label">Powered by</span>
          <span className="faq-tech-pill">Gemini 1.5 Flash</span>
          <span className="chat-hint">Shift+Enter for new line · Esc to close</span>
        </div>
      </div>
    </div>
  );
}
