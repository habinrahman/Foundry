"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Application", body: "Submit your profile and resume through Careers." },
  { title: "Resume review", body: "Our team reviews experience against the role." },
  { title: "Technical interview", body: "Deep dive on systems, craft, and judgment." },
  { title: "System design", body: "Collaborate on a realistic engineering problem." },
  { title: "Offer", body: "Align on scope, impact, and how we’ll work together." },
] as const;

export function HiringProcess({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();

  return (
    <ol className={cn("relative grid gap-4 md:grid-cols-5", className)}>
      {STEPS.map((step, index) => (
        <motion.li
          key={step.title}
          className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: index * 0.06, duration: 0.45 }}
        >
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
