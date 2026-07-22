"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28", className)}>
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="max-w-2xl">
          {eyebrow ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {description}
            </p>
          ) : null}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function GlassCard({
  children,
  className,
  shine = false,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  shine?: boolean;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "landing-glass rounded-2xl p-6 transition duration-300 sm:p-8",
        shine && "landing-shine",
        hover && "hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--card-hover-shadow)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const display = Math.round(value);
  return (
    <div className="text-center sm:text-left">
      <p className="font-heading text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}
