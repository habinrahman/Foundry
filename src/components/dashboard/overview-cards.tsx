"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AnimatedScore } from "@/components/motion/animated-score";
import { cn } from "@/lib/utils";

export const OverviewCard = memo(function OverviewCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "teal",
  delay = 0,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
  accent?: "teal" | "blue" | "cyan" | "slate" | "amber";
  delay?: number;
}) {
  const accentClass = {
    teal: "text-[var(--accent)] bg-[var(--accent-soft)]",
    blue: "text-[var(--chart-2)] bg-[color-mix(in_oklab,var(--chart-2)_16%,transparent)]",
    cyan: "text-[var(--chart-3)] bg-[color-mix(in_oklab,var(--chart-3)_16%,transparent)]",
    slate: "text-[var(--chart-4)] bg-[color-mix(in_oklab,var(--chart-4)_16%,transparent)]",
    amber: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_16%,transparent)]",
  }[accent];

  const barColor = {
    teal: "var(--accent)",
    blue: "var(--chart-2)",
    cyan: "var(--chart-3)",
    slate: "var(--chart-4)",
    amber: "var(--warning)",
  }[accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          {label}
        </p>
        <span
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-lg transition group-hover:scale-105",
            accentClass
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <AnimatedScore
          value={value}
          className="font-heading text-3xl font-semibold tracking-tight"
        />
        <span className="mb-1 text-xs text-[var(--muted)]">/ 100</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
        role="presentation"
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{
            duration: 0.8,
            delay: delay + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
      {hint ? <p className="mt-2 text-xs text-[var(--muted)]">{hint}</p> : null}
    </motion.article>
  );
});
