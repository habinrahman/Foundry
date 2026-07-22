"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApplicationApi } from "@/lib/applications/api-client";
import type { Application } from "@/lib/applications/types";

export function ApplicationSuccessView() {
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

  const roleTitle = application?.role.title ?? "the role you selected";
  const idLabel = application?.id ?? applicationId ?? "—";

  return (
    <div className="mx-auto max-w-[640px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
          <CheckCircle2 className="h-6 w-6" aria-hidden />
        </div>
        <h1 className="mt-6 font-heading text-3xl tracking-tight sm:text-4xl">
          Application submitted
        </h1>
        <p className="mt-3 text-[var(--muted)]" role="status">
          {loading
            ? "Confirming your application…"
            : `Thank you for applying for ${roleTitle}.`}
        </p>

        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Application ID
          </p>
          <p className="mt-1 font-mono text-sm font-medium">{idLabel}</p>
        </div>

        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold">What happens next?</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
            <li>• Your application has been received.</li>
            <li>• Recruiters will review your profile.</li>
            <li>
              • Foundry will prepare AI-powered hiring insights.
            </li>
            <li>
              • If your experience is a good match, we&apos;ll contact you.
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/careers">
            <Button variant="primary" className="rounded-full px-5">
              View other roles
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="rounded-full px-5">
              Back to careers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
