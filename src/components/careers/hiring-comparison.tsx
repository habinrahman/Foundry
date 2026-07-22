"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileBarChart,
  Hash,
  HelpCircle,
  MessageSquareText,
  NotebookPen,
  Scale,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/landing/primitives";
import { usePrefersReducedMotion } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

/** Paired icons per row—muted "from" glyph vs. accent "to" glyph—so the
 * same visual language as the pipeline stages reinforces "replaced", not
 * "competing with". Indexed against `t.careers.comparison.rows`. */
const FROM_ICONS: readonly LucideIcon[] = [
  Search,
  Hash,
  NotebookPen,
  HelpCircle,
  Scale,
];
const TO_ICONS: readonly LucideIcon[] = [
  BrainCircuit,
  Sparkles,
  FileBarChart,
  MessageSquareText,
  CheckCircle2,
];

export function HiringComparison({ className }: { className?: string }) {
  const { t } = useLocale();
  const reduced = usePrefersReducedMotion();
  const comparison = t.careers.comparison;
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const active = reduced || inView;

  return (
    <Section
      id="comparison"
      className={className}
      eyebrow={comparison.eyebrow}
      title={comparison.title}
      description={comparison.description}
    >
      <ul ref={ref} className="flex flex-col divide-y divide-[var(--border)]">
        {comparison.rows.map((row, index) => {
          const FromIcon = FROM_ICONS[index % FROM_ICONS.length];
          const ToIcon = TO_ICONS[index % TO_ICONS.length];

          return (
            <motion.li
              key={row.from}
              className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-6"
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              animate={active ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.5,
                delay: 0.08 * index,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex flex-1 items-center gap-3.5">
                <span
                  aria-hidden
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)]"
                >
                  <FromIcon className="h-4 w-4" />
                </span>
                <span className="text-[15px] leading-snug text-[var(--muted)] line-through decoration-[var(--border-strong)]">
                  {row.from}
                </span>
              </div>

              <ArrowRight
                aria-hidden
                className="hidden h-4 w-4 shrink-0 text-[var(--muted)] rtl:rotate-180 sm:block"
              />

              <div className="flex flex-1 items-center gap-3.5">
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    "border border-[var(--border-strong)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  )}
                >
                  <ToIcon className="h-4 w-4" />
                </span>
                <span className="font-heading text-[15px] font-semibold leading-snug text-[var(--foreground)]">
                  {row.to}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
}
