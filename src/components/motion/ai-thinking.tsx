"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

export function AiThinking({
  label = "Foundry is thinking",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 shadow-[var(--shadow)]",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="relative flex h-2.5 w-2.5">
        {!reduced ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
        ) : null}
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
      </span>
      <span className="text-xs text-[var(--muted)]">{label}</span>
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1 w-1 rounded-full bg-[var(--accent)]"
            animate={
              reduced ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }
            }
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
    </div>
  );
}
