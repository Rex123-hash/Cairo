/**
 * CairoLogo — the brand mark for Cairo.
 * A geometric leaf-shield SVG that works at any size.
 * Pass `wordmark` to render "Cairo" next to the mark.
 */

interface CairoLogoProps {
  /** Size of the logomark square in px */
  size?: number;
  /** Show the "Cairo" wordmark text next to the mark */
  wordmark?: boolean;
  className?: string;
}

export function CairoLogo({ size = 40, wordmark = false, className }: CairoLogoProps) {
  return (
    <span
      className={`cairo-brand${className ? ` ${className}` : ""}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
    >
      {/* Logomark — geometric leaf inside a rounded square */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Background tile */}
        <rect width="40" height="40" rx="10" fill="url(#cairo-grad)" />

        {/* Leaf shape — centered geometric spear */}
        <path
          d="M20 8 C28 8 33 14 33 20 C33 26 28 34 20 34 C20 34 12 27 12 20 C12 13 15 8 20 8Z"
          fill="rgba(255,255,255,0.18)"
        />
        {/* Inner leaf vein */}
        <path
          d="M20 10 C26 10 31 15.5 31 20.5 C31 25.5 27 32 20 32"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        {/* Central vein line */}
        <line
          x1="20" y1="10"
          x2="20" y2="32"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Left veins */}
        <line x1="20" y1="16" x2="14" y2="20" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
        <line x1="20" y1="21" x2="14" y2="24" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" />
        <line x1="20" y1="26" x2="15" y2="28" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeLinecap="round" />
        {/* Right veins */}
        <line x1="20" y1="16" x2="27" y2="19" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
        <line x1="20" y1="21" x2="27" y2="24" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeLinecap="round" />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="cairo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5a8a32" />
            <stop offset="55%" stopColor="#87a82e" />
            <stop offset="100%" stopColor="#c79a2b" />
          </linearGradient>
        </defs>
      </svg>

      {wordmark && (
        <span className="cairo-wordmark" aria-label="Cairo">
          Cairo
        </span>
      )}
    </span>
  );
}
