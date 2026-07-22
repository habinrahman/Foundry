"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { listApplicationsApi } from "@/lib/applications/api-client";
import type { Application } from "@/lib/applications/types";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

function resumeStatus(app: Application): string {
  if (app.resume.text) return "Text ready";
  if (app.resume.fileName) return "Uploaded";
  return "Missing";
}

function analysisStatus(
  app: Application,
  selectedId: string | null,
  analyzedIds: Set<string>
): string {
  if (analyzedIds.has(app.id)) return "Analyzed";
  if (app.analysis) return "Ready";
  if (app.resume.text) return "Ready to analyze";
  return "Demo fallback";
}

export function ApplicationsList({
  selectedId,
  analyzedIds,
  onSelect,
  busyId,
}: {
  selectedId: string | null;
  analyzedIds: Set<string>;
  onSelect: (application: Application) => void;
  busyId: string | null;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section
      aria-label="Applications"
      className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] sm:p-5"
    >
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
          description="When candidates apply through Tamm Careers, they will appear here for AI-assisted review."
          className="py-10"
        />
      ) : null}

      {!loading && applications.length > 0 ? (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)]">
          {applications.map((app) => {
            const selected = selectedId === app.id;
            const busy = busyId === app.id;
            return (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => onSelect(app)}
                  disabled={Boolean(busyId)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full flex-col gap-2 px-4 py-3 text-left transition sm:flex-row sm:items-center sm:justify-between",
                    selected
                      ? "bg-[var(--accent-soft)]"
                      : "hover:bg-[var(--background)]/80",
                    busyId && !busy ? "opacity-60" : null
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{app.personal.fullName}</p>
                    <p className="truncate text-sm text-[var(--muted)]">
                      {app.role.title}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-[var(--muted)]">
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5">
                      {new Date(app.submittedAt).toLocaleString()}
                    </span>
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5">
                      Resume: {resumeStatus(app)}
                    </span>
                    <span className="rounded-full border border-[var(--border)] px-2 py-0.5">
                      {busy ? (
                        <span className="inline-flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Analyzing
                        </span>
                      ) : (
                        `AI: ${analysisStatus(app, selectedId, analyzedIds)}`
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
