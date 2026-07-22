"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { Section } from "@/components/landing/primitives";
import { usePrefersReducedMotion } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

/** Illustrative "you are here" marker for a typical candidate. Deliberately
 * a numbered checklist stepper—not FoundryPipeline's icon-node diagram—so
 * this reads as a candidate's journey, not system architecture. */
const CURRENT_STAGE_INDEX = 3;

export function HiringTimeline({ className }: { className?: string }) {
  const { t } = useLocale();
  const reduced = usePrefersReducedMotion();
  const timeline = t.careers.timeline;
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const active = reduced || inView;
  const total = timeline.stages.length;
  const progress = CURRENT_STAGE_INDEX / (total - 1);

  return (
    <Section
      id="timeline"
      className={className}
      eyebrow={timeline.eyebrow}
      title={timeline.title}
      description={timeline.description}
    >
      <ol
        ref={ref}
        aria-label={timeline.title}
        className="relative flex flex-col gap-4 md:grid md:grid-cols-6 md:gap-3"
      >
        {/* Stepper progress rail—a candidate's status bar, not the pipeline's
         * animated architecture connector. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[8.4%] top-[22px] hidden h-[3px] overflow-hidden rounded-full bg-[var(--border)] md:block"
        >
          <motion.span
            className="block h-full origin-left rounded-full bg-[var(--accent)] rtl:origin-right"
            initial={reduced ? false : { scaleX: 0 }}
            animate={active ? { scaleX: progress } : undefined}
            style={reduced ? { transform: `scaleX(${progress})` } : undefined}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>

        {timeline.stages.map((stage, index) => {
          const isCompleted = index < CURRENT_STAGE_INDEX;
          const isCurrent = index === CURRENT_STAGE_INDEX;
          const isLast = index === total - 1;

          return (
            <motion.li
              key={stage.title}
              aria-current={isCurrent ? "step" : undefined}
              className="relative"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={active ? { opacity: 1, y: 0 } : undefined}
              transition={{
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute start-[21px] top-[46px] h-[calc(100%-14px)] w-px bg-[var(--border)] md:hidden"
                />
              ) : null}

              <div
                className={cn(
                  "relative flex h-full flex-col gap-3 rounded-2xl border p-5",
                  isCurrent &&
                    "border-[color-mix(in_oklab,var(--accent)_50%,transparent)] bg-[var(--accent-soft)] shadow-[var(--accent-glow)]",
                  isCompleted && "border-[var(--border)] bg-[var(--surface)]",
                  !isCurrent &&
                    !isCompleted &&
                    "border-dashed border-[var(--border)] bg-transparent"
                )}
              >
                <span
                  className={cn(
                    "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-medium",
                    isCompleted &&
                      "border border-[color-mix(in_oklab,var(--success)_35%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--success)]",
                    isCurrent &&
                      "border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]",
                    !isCompleted &&
                      !isCurrent &&
                      "border border-[var(--border)] text-[var(--muted)]"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                  {isCurrent && !reduced ? (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-lg bg-[var(--accent)]"
                      initial={{ opacity: 0.55, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.6 }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  ) : null}
                </span>

                <div>
                  <h3 className="font-heading text-base font-semibold">
                    {stage.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">
                    {stage.body}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
