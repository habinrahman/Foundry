"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/hooks";
import { usePrefersReducedMotion } from "@/hooks";

export function AiProcessingPanel({
  active,
  stageIndex,
  className,
}: {
  active: boolean;
  stageIndex: number;
  className?: string;
}) {
  const { t } = useLocale();
  const reduced = usePrefersReducedMotion();
  const stages = t.ai.stages.recruiterProcessing;

  if (!active) return null;

  return (
    <div
      className={cn(
        "mb-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
        {t.ai.pipeline.heading}
      </p>
      <p className="mt-1 font-heading text-lg font-semibold tracking-tight">
        {t.ai.pipeline.preparing}
      </p>
      <ol className="mt-5 space-y-2.5">
        {stages.map((label, index) => {
          const isLastStage = index === stages.length - 1;
          const done = index < stageIndex || (index === stageIndex && isLastStage);
          const current = index === stageIndex && !isLastStage;
          const completeCurrent = isLastStage && stageIndex >= stages.length - 1;

          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-3 text-sm transition",
                done || completeCurrent
                  ? "text-[var(--foreground)]"
                  : current
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)]"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                  done || completeCurrent
                    ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]"
                    : current
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border)]"
                )}
              >
                {done || completeCurrent ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : current && !reduced ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                ) : (
                  index + 1
                )}
              </span>
              {label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Runs a short staged animation; resolves when complete. Respects reduced motion. */
export async function runAiStageAnimation(
  onStage: (index: number) => void,
  reducedMotion: boolean,
  stageCount: number
): Promise<void> {
  if (reducedMotion) {
    onStage(stageCount - 1);
    return;
  }
  for (let i = 0; i < stageCount; i++) {
    onStage(i);
    const delay = i === stageCount - 1 ? 280 : 320;
    await new Promise((r) => setTimeout(r, delay));
  }
}
