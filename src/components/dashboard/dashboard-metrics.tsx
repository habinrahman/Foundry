"use client";

import { useLocale } from "@/lib/i18n/hooks";

type Metric = {
  label: string;
  value: string;
  hint?: string;
};

export function DashboardMetrics({ metrics }: { metrics: Metric[] }) {
  const { t } = useLocale();

  return (
    <section
      aria-label={t.recruiter.dashboard.metricsAriaLabel}
      className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-[var(--shadow)]"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
            {metric.label}
          </p>
          <p className="mt-2 font-heading text-3xl font-semibold tracking-tight tabular-nums">
            {metric.value}
          </p>
          {metric.hint ? (
            <p className="mt-1 text-xs text-[var(--muted)]">{metric.hint}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
}
