"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks";

/** Original abstract manufacturing/AI signal field — not copied from any brand. */
export function CareersHeroVisual({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={className}
      aria-hidden
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
        <div className="landing-orb-1 absolute -left-10 top-0 h-56 w-56 rounded-full blur-3xl" />
        <div className="landing-orb-2 absolute -right-8 bottom-0 h-48 w-48 rounded-full blur-3xl" />
        <div className="landing-grid-bg absolute inset-0 opacity-50" />

        <svg
          viewBox="0 0 480 360"
          className="relative h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="48"
            y="64"
            width="160"
            height="110"
            rx="18"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            fill="color-mix(in oklab, var(--surface-elevated) 80%, transparent)"
          />
          <rect
            x="272"
            y="88"
            width="160"
            height="150"
            rx="18"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            fill="color-mix(in oklab, var(--surface-elevated) 80%, transparent)"
          />
          <path
            d="M208 120 H272"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="128" cy="118" r="6" fill="var(--chart-1)" />
          <circle cx="352" cy="140" r="6" fill="var(--chart-2)" />
          <circle cx="320" cy="188" r="4" fill="var(--chart-3)" />
          <path
            d="M72 280 C140 240, 220 300, 300 250 C360 220, 400 260, 430 230"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.45"
          />
          {!reduced ? (
            <motion.circle
              cx="128"
              cy="118"
              r="14"
              stroke="var(--accent)"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.25, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </svg>

        <div className="absolute bottom-4 left-4 rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] px-3 py-2 text-xs backdrop-blur-md">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Signal
          </p>
          <p className="mt-0.5 font-heading text-sm font-semibold text-[var(--accent)]">
            Manufacturing intelligence
          </p>
        </div>
      </div>
    </div>
  );
}
