import { useEffect } from "react";
import { Icon } from "./Icon";

interface HeaderProps {
  aiEnabled: boolean;
  onFaqOpen: () => void;
  /** Only passed when a footprint result exists — unlocks the chat button. */
  onChatOpen?: () => void;
}

/** Sticky SaaS topbar with original leaf logo, wordmark, nav buttons, and AI badge. */
export function Header({ aiEnabled, onFaqOpen, onChatOpen }: HeaderProps) {
  // Global Escape handler for FAQ/Chat — also handled in those panels,
  // but this is a safety net if focus is elsewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        // Individual panels handle their own Escape; no-op here.
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="header">
      {/* Original logo: white stroke leaf on gradient tile */}
      <div className="logo" aria-hidden="true">
        <Icon name="leaf" size={26} />
      </div>

      <div className="header-name">
        <span className="cairo-wordmark">Cairo</span>
        <span className="header-tagline">Carbon Intelligence</span>
      </div>

      <nav className="header-nav" aria-label="Site navigation">
        {onChatOpen && (
          <button
            className="nav-btn nav-btn-accent"
            onClick={onChatOpen}
            aria-label="Open Ask Cairo chat"
            title="Ask Cairo — AI carbon coach"
          >
            <Icon name="spark" size={14} />
            Ask Cairo
          </button>
        )}
        <button
          className="nav-btn"
          onClick={onFaqOpen}
          aria-label="Open FAQ"
          title="Frequently asked questions"
        >
          FAQ
        </button>
      </nav>

      <span
        className={aiEnabled ? "badge on" : "badge"}
        title={
          aiEnabled
            ? "Gemini is configured — AI parsing & coaching active."
            : "Running in offline mode — add a Gemini key to enable AI."
        }
      >
        <span className="dot" />
        {aiEnabled ? "Gemini active" : "Offline mode"}
      </span>
    </header>
  );
}
