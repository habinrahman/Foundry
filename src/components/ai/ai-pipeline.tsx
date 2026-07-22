"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/motion/progress";

export function AiPipeline({
  stageIndex,
  progress,
  done,
  className,
}: {
  stageIndex: number;
  progress: number;
  done: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const { t } = useLocale();
  const stages = t.ai.stages.livePipeline;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy={!done}
      aria-label={done ? t.ai.pipeline.analysisComplete : stages[stageIndex]}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ThinkingOrb active={!done} />
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              {t.ai.pipeline.foundryLabel}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={done ? "done" : stageIndex}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-sm font-medium text-[var(--foreground)]"
              >
                {done ? t.ai.pipeline.readyForReview : stages[stageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
          {Math.round(progress)}%
        </span>
      </div>

      <ProgressBar value={progress} label={t.ai.pipeline.progressLabel} />

      <ol className="mt-5 space-y-2">
        {stages.map((stage, index) => {
          const complete = done || index < stageIndex;
          const current = !done && index === stageIndex;
          return (
            <li
              key={stage}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                current && "bg-[var(--accent-soft)]",
                complete && "text-[var(--foreground)]",
                !complete && !current && "text-[var(--muted)]"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                  complete &&
                    "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]",
                  current &&
                    "border-[var(--accent)] text-[var(--accent)]",
                  !complete &&
                    !current &&
                    "border-[var(--border-strong)] text-[var(--muted)]"
                )}
                aria-hidden
              >
                {complete ? <Check className="h-3 w-3" strokeWidth={3} /> : index + 1}
              </span>
              <span className={cn(current && "font-medium")}>{stage.replace(/\.\.\.$/, "")}</span>
              {current ? (
                <span className="ml-auto flex gap-1" aria-hidden>
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-1 w-1 rounded-full bg-[var(--accent)]"
                      animate={
                        reduced
                          ? undefined
                          : { opacity: [0.25, 1, 0.25] }
                      }
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: dot * 0.15,
                      }}
                    />
                  ))}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ThinkingOrb({ active }: { active: boolean }) {
  const reduced = usePrefersReducedMotion();
  return (
    <span className="relative flex h-10 w-10 items-center justify-center">
      {active && !reduced ? (
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-20" />
      ) : null}
      <span
        className={cn(
          "relative h-10 w-10 rounded-full bg-[var(--accent-soft)] ring-1 ring-[var(--accent)]/30",
          active && "shadow-[0_0_24px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
        )}
      />
      <span className="absolute h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
    </span>
  );
}
