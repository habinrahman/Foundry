"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--danger)]">
            Something went wrong
          </p>
          <h2 className="font-heading text-2xl">
            {this.props.fallbackTitle ?? "This view hit an unexpected error"}
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {this.state.error.message || "Unknown client error"}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Reload
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
