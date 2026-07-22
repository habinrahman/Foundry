"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n/hooks";
import { Button } from "./button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ImplProps extends Props {
  eyebrow: string;
  defaultTitle: string;
  unknownError: string;
  reload: string;
}

interface State {
  error: Error | null;
}

// Class component so React's error-boundary lifecycle (getDerivedStateFromError
// / componentDidCatch) is available — hooks can't be used here directly, so
// localized copy is threaded in as props from the `ErrorBoundary` wrapper below.
class ErrorBoundaryImpl extends Component<ImplProps, State> {
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
            {this.props.eyebrow}
          </p>
          <h2 className="font-heading text-2xl">
            {this.props.fallbackTitle ?? this.props.defaultTitle}
          </h2>
          <p className="text-sm text-[var(--muted)]">
            {this.state.error.message || this.props.unknownError}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            {this.props.reload}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children, fallbackTitle }: Props) {
  const { t } = useLocale();
  return (
    <ErrorBoundaryImpl
      fallbackTitle={fallbackTitle}
      eyebrow={t.foundry.errorBoundary.eyebrow}
      defaultTitle={t.foundry.errorBoundary.defaultTitle}
      unknownError={t.foundry.errorBoundary.unknownError}
      reload={t.foundry.errorBoundary.reload}
    >
      {children}
    </ErrorBoundaryImpl>
  );
}
