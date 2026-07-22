"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";
import { listApplicationsApi } from "@/lib/applications/api-client";
import type { Application } from "@/lib/applications/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const delta = Math.max(0, now - then);
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function ResumeBadge({ app }: { app: Application }) {
  if (app.resume.text) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--success)_35%,var(--border))] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-2.5 py-0.5 text-[11px] text-[var(--success)]">
        <Check className="h-3 w-3" aria-hidden />
        Resume · Parsed
      </span>
    );
  }
  if (app.resume.fileName) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
        <FileText className="h-3 w-3" aria-hidden />
        Resume · Uploaded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
      Resume · Missing
    </span>
  );
}

function AiBadge({
  app,
  analyzed,
  busy,
}: {
  app: Application;
  analyzed: boolean;
  busy: boolean;
}) {
  if (busy) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2.5 py-0.5 text-[11px] text-[var(--accent)]">
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        AI · Processing
      </span>
    );
  }
  if (analyzed || app.analysis) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--success)_35%,var(--border))] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] px-2.5 py-0.5 text-[11px] text-[var(--success)]">
        <Sparkles className="h-3 w-3" aria-hidden />
        AI · Ready
      </span>
    );
  }
  if (app.resume.text) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
        AI · Ready to analyze
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
      AI · Demo available
    </span>
  );
}

export function ApplicationsList({
  selectedId,
  analyzedIds,
  atsById,
  onSelect,
  busyId,
  onLoaded,
}: {
  selectedId: string | null;
  analyzedIds: Set<string>;
  atsById: Record<string, number>;
  onSelect: (application: Application) => void;
  busyId: string | null;
  onLoaded?: (applications: Application[]) => void;
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listApplicationsApi();
      setApplications(res.applications);
      onLoaded?.(res.applications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [onLoaded]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section aria-label="Applications" className="mb-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Applications
          </p>
          <h2 className="mt-1 font-heading text-xl tracking-tight">
            Incoming from Tamm Careers
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading applications…
        </p>
      ) : null}

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Applications submitted through Tamm Careers will appear here automatically for AI-assisted review."
          className="py-12"
          action={
            <Link href="/" target="_blank" rel="noreferrer">
              <Button variant="primary" size="sm" className="rounded-full px-4">
                Open Careers
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </Link>
          }
        />
      ) : null}

      {!loading && applications.length > 0 ? (
        <ul className="grid gap-3">
          {applications.map((app) => {
            const selected = selectedId === app.id;
            const busy = busyId === app.id;
            const analyzed = analyzedIds.has(app.id);
            const ats = atsById[app.id] ?? app.analysis?.atsScore ?? null;

            return (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => onSelect(app)}
                  disabled={Boolean(busyId)}
                  aria-pressed={selected}
                  className={cn(
                    "group w-full rounded-2xl border bg-[var(--surface)] p-5 text-left shadow-[var(--shadow)] transition",
                    selected
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                      : "border-[var(--border)] hover:-translate-y-0.5 hover:border-[var(--border-strong)]",
                    busyId && !busy ? "opacity-60" : null
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                        {app.role.title}
                      </p>
                      <h3 className="mt-1.5 truncate font-heading text-xl font-semibold tracking-tight">
                        {app.personal.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Applied · {formatRelativeTime(app.submittedAt)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <ResumeBadge app={app} />
                        <AiBadge app={app} analyzed={analyzed} busy={busy} />
                        {typeof ats === "number" ? (
                          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-[var(--foreground)]">
                            ATS Match · {Math.round(ats)}%
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 self-start text-sm font-medium text-[var(--accent)] transition group-hover:gap-1.5">
                      {busy ? "Analyzing…" : "View candidate"}
                      {!busy ? (
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      )}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
