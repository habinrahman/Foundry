"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApplicationApi } from "@/lib/applications/api-client";
import type { Application } from "@/lib/applications/types";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

type PipelineState = "done" | "active" | "upcoming";

export function ApplicationSuccessView() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(Boolean(applicationId));

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    getApplicationApi(applicationId)
      .then((res) => {
        if (!cancelled) setApplication(res.application);
      })
      .catch(() => {
        if (!cancelled) setApplication(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  const roleTitle = application?.role.title ?? t.apply.success.fallbackRole;
  const idLabel = application?.id ?? applicationId ?? t.common.emptyValue;

  const pipeline = useMemo(() => {
    const copy = t.apply.success.pipeline;
    return [
      {
        title: copy.receivedTitle,
        body: copy.receivedBody,
        state: "done" as PipelineState,
      },
      {
        title: copy.processingTitle,
        body: copy.processingBody,
        state: "active" as PipelineState,
      },
      {
        title: copy.reviewTitle,
        body: copy.reviewBody,
        state: "upcoming" as PipelineState,
      },
      {
        title: copy.interviewTitle,
        body: copy.interviewBody,
        state: "upcoming" as PipelineState,
      },
    ];
  }, [t]);

  return (
    <div className="mx-auto max-w-[640px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <CheckCircle2 className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="mt-6 font-heading text-3xl tracking-tight sm:text-4xl">
          {t.apply.success.title}
        </h1>
        <p className="mt-3 text-[var(--muted)]" role="status">
          {loading
            ? t.apply.success.confirming
            : formatMessage(t.apply.success.thankYou, { role: roleTitle })}
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            {t.apply.success.applicationIdLabel}
          </p>
          <p className="mt-1 font-mono text-sm font-medium">{idLabel}</p>
        </div>

        <div className="mt-10">
          <h2 className="font-heading text-lg font-semibold">
            {t.apply.success.hiringProgressTitle}
          </h2>
          <ol className="relative mt-6 space-y-0">
            {pipeline.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
                {index < pipeline.length - 1 ? (
                  <span
                    className="absolute start-[11px] top-7 h-[calc(100%-12px)] w-px bg-[var(--border-strong)]"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium",
                    step.state === "done" &&
                      "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_16%,transparent)] text-[var(--success)]",
                    step.state === "active" &&
                      "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]",
                    step.state === "upcoming" &&
                      "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                  )}
                  aria-hidden
                >
                  {step.state === "done" ? "✓" : index + 1}
                </span>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      step.state === "upcoming"
                        ? "text-[var(--muted)]"
                        : "text-[var(--foreground)]"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-4 py-3 text-sm text-[var(--muted)]">
          {t.apply.success.footerNote}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/careers">
            <Button variant="primary" className="rounded-full px-5">
              {t.apply.success.viewOtherRoles}
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="rounded-full px-5">
              {t.apply.success.backToCareers}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
