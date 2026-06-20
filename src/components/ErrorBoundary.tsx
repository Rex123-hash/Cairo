import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional fallback UI. Defaults to a subtle inline error message. */
  fallback?: ReactNode;
  /** Section name used in the default error message. */
  section?: string;
}

interface State {
  hasError: boolean;
}

/**
 * React error boundary — catches render-time exceptions in a subtree and
 * shows a graceful fallback rather than a blank screen.
 *
 * Usage:
 *   <ErrorBoundary section="Dashboard">
 *     <Dashboard ... />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // In production you'd send this to an error reporting service.
    console.error("[Cairo] Render error in boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="insight"
          role="alert"
          style={{ borderColor: "var(--danger)", background: "#faece9", marginBottom: 18 }}
        >
          {this.props.section
            ? `The "${this.props.section}" section encountered an error and could not render.`
            : "A section encountered an error and could not render."}{" "}
          Refresh the page to try again.
        </div>
      );
    }
    return this.props.children;
  }
}
