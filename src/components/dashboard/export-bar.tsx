"use client";

import { useState } from "react";
import {
  Check,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  exportCandidateCsv,
  exportCandidateJson,
  exportCandidateMarkdown,
  exportCandidatePdf,
} from "@/lib/export/candidate-export";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import { useCandidateStore } from "@/store/candidate-store";

export function ExportBar({ className }: { className?: string }) {
  const { t } = useLocale();
  const catalog = t.recruiter.export;
  const { candidate, resetToDemo } = useCandidateStore();
  const [toast, setToast] = useState<string | null>(null);

  const flash = (label: string) => {
    setToast(label);
    window.setTimeout(() => setToast(null), 1600);
  };

  const actions = [
    {
      label: catalog.pdf.label,
      hint: catalog.pdf.hint,
      icon: Download,
      onClick: () => {
        exportCandidatePdf(candidate);
        flash(catalog.pdf.toast);
      },
    },
    {
      label: catalog.markdown.label,
      hint: catalog.markdown.hint,
      icon: FileText,
      onClick: () => {
        exportCandidateMarkdown(candidate);
        flash(catalog.markdown.toast);
      },
    },
    {
      label: catalog.json.label,
      hint: catalog.json.hint,
      icon: FileJson,
      onClick: () => {
        exportCandidateJson(candidate);
        flash(catalog.json.toast);
      },
    },
    {
      label: catalog.csv.label,
      hint: catalog.csv.hint,
      icon: FileSpreadsheet,
      onClick: () => {
        exportCandidateCsv(candidate);
        flash(catalog.csv.toast);
      },
    },
  ] as const;

  return (
    <div className={cn("relative flex flex-col items-stretch gap-2 sm:items-end", className)}>
      <div
        className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow)]"
        role="group"
        aria-label={catalog.groupLabel}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            title={action.hint}
            aria-label={formatMessage(catalog.actionAriaLabel, {
              label: action.label,
              hint: action.hint,
            })}
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--foreground)] transition hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <action.icon className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
            {action.label}
          </button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" aria-hidden />
        <button
          type="button"
          onClick={() => {
            resetToDemo();
            flash(catalog.resetToast);
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label={catalog.resetAria}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          {catalog.reset}
        </button>
      </div>
      <div
        className={cn(
          "pointer-events-none flex min-h-5 items-center justify-end text-[11px] text-[var(--accent)] transition",
          toast ? "opacity-100" : "opacity-0"
        )}
        aria-live="polite"
      >
        {toast ? (
          <span className="inline-flex items-center gap-1">
            <Check className="h-3 w-3" aria-hidden />
            {toast}
          </span>
        ) : (
          "\u00A0"
        )}
      </div>
    </div>
  );
}
