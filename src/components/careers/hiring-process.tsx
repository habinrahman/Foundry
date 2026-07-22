"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export function HiringProcess({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const { t } = useLocale();
  const steps = t.careers.process.steps;

  return (
    <ol className={cn("relative grid gap-4 md:grid-cols-5", className)}>
      {steps.map((step, index) => (
        <motion.li
          key={step.title}
          className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {!reduced && index < steps.length - 1 ? (
            <motion.span
              className="absolute start-[calc(50%+24px)] top-8 hidden h-px bg-gradient-to-r from-[var(--accent)]/50 to-transparent md:block"
              style={{ width: "calc(100% - 16px)" }}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.08, duration: 0.55 }}
              aria-hidden
            />
          ) : null}
          <p className="font-mono text-xs text-[var(--accent)]">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-3 font-heading text-lg font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            {step.body}
          </p>
        </motion.li>
      ))}
    </ol>
  );
}
