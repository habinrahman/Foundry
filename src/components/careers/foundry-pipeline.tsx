"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  BrainCircuit,
  Braces,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/landing/primitives";
import { usePrefersReducedMotion } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

/** One distinct visual metaphor per architecture stage—document, structured
 * data, entity graph, LLM node, report, dashboard—kept separate from the
 * card-grid language used by the hiring timeline further down the page. */
const STAGE_ICONS: readonly LucideIcon[] = [
  FileText,
  Braces,
  Share2,
  BrainCircuit,
  ClipboardCheck,
  LayoutDashboard,
];

export function FoundryPipeline({ className }: { className?: string }) {
  const { t } = useLocale();
  const reduced = usePrefersReducedMotion();
  const pipeline = t.careers.pipeline;
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const active = reduced || inView;

  return (
    <Section
      id="pipeline"
      className={className}
      eyebrow={pipeline.eyebrow}
      title={pipeline.title}
      description={pipeline.description}
    >
      <div className="relative">
        {/* Decorative connector spanning the icon row—layered diagram, not
         * the only representation; the <ol> below carries the real content.
         * Kept as a sibling of the list (not a child) so the <ol> only ever
         * contains <li> elements, per valid list semantics. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-[8.4%] top-7 hidden h-px overflow-hidden bg-[var(--border)] lg:block"
        >
          <motion.span
            className="block h-full origin-left bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/60 to-[var(--accent)]/20 rtl:origin-right rtl:bg-gradient-to-l"
            initial={reduced ? undefined : { scaleX: 0 }}
            animate={active ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>

        <ol
          ref={ref}
          aria-label={pipeline.listAriaLabel}
          className="relative flex flex-col gap-8 lg:grid lg:grid-cols-6 lg:gap-4"
        >
          {pipeline.stages.map((stage, index) => {
            const Icon = STAGE_ICONS[index];
            const isLast = index === pipeline.stages.length - 1;

            return (
              <li
                key={stage.title}
                className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
              >
                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute start-7 top-14 h-8 w-px overflow-hidden bg-[var(--border)] lg:hidden"
                  >
                    <motion.span
                      className="block h-full w-full origin-top bg-[var(--accent)]"
                      initial={reduced ? undefined : { scaleY: 0 }}
                      animate={active ? { scaleY: 1 } : undefined}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                ) : null}

                <motion.span
                  aria-hidden
                  className={cn(
                    "relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                    "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow)]"
                  )}
                  initial={reduced ? undefined : { opacity: 0, scale: 0.85 }}
                  animate={active ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 0.45, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {!reduced ? (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-[var(--accent-soft)]"
                      initial={{ opacity: 0.55, scale: 1 }}
                      animate={active ? { opacity: 0, scale: 1.7 } : undefined}
                      transition={{ duration: 0.9, delay: 0.1 + index * 0.12, ease: "easeOut" }}
                    />
                  ) : null}
                  <Icon className="h-6 w-6" />
                </motion.span>

                <div className="lg:mt-4">
                  <h3 className="font-heading text-base font-semibold">{stage.title}</h3>
                  <p className="mt-1.5 max-w-[220px] text-sm leading-relaxed text-[var(--muted)] lg:mx-auto">
                    {stage.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
