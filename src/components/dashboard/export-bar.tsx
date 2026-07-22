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
import { cn } from "@/lib/utils";
import { useCandidateStore } from "@/store/candidate-store";

export function ExportBar({ className }: { className?: string }) {
  const { candidate, resetToDemo } = useCandidateStore();
  const [toast, setToast] = useState<string | null>(null);

  const flash = (label: string) => {
    setToast(label);
    window.setTimeout(() => setToast(null), 1600);
  };

  const actions = [
    {
      label: "PDF",
      hint: "Print-ready report",
      icon: Download,
      onClick: () => {
        exportCandidatePdf(candidate);
        flash("Opening print dialog");
      },
    },
    {
      label: "Markdown",
      hint: "Shareable write-up",
      icon: FileText,
      onClick: () => {
        exportCandidateMarkdown(candidate);
        flash("Markdown downloaded");
      },
    },
    {
      label: "JSON",
      hint: "Full session payload",
      icon: FileJson,
      onClick: () => {
        exportCandidateJson(candidate);
        flash("JSON downloaded");
      },
    },
    {
      label: "CSV",
      hint: "Spreadsheet-friendly",
      icon: FileSpreadsheet,
      onClick: () => {
        exportCandidateCsv(candidate);
        flash("CSV downloaded");
      },
    },
  ] as const;

  return (
    <div className={cn("relative flex flex-col items-stretch gap-2 sm:items-end", className)}>
      <div
        className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[var(--shadow)]"
        role="group"
        aria-label="Export hiring report"
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            title={action.hint}
            aria-label={`Export ${action.label}: ${action.hint}`}
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
            flash("Demo session reset");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[var(--muted)] transition hover:bg-[var(--background)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label="Reset demo candidate"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset
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
