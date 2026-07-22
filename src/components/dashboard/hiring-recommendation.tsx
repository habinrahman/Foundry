"use client";

import { motion } from "framer-motion";
import type { HiringRecommendation } from "@/types/candidate";
import { cn } from "@/lib/utils";
import { useOptimisticRecommendation } from "@/hooks";
import { useCandidateStore } from "@/store/candidate-store";
import { Panel, PanelHeader } from "./panel";

const OPTIONS: {
  value: HiringRecommendation;
  description: string;
}[] = [
  {
    value: "Strong Hire",
    description: "Clear yes — advance to offer track",
  },
  {
    value: "Hire",
    description: "Solid match — proceed with confidence",
  },
  {
    value: "Interview",
    description: "Promising — continue deeper loops",
  },
  {
    value: "Reject",
    description: "Below bar — politely decline",
  },
];

export function HiringRecommendationPanel({ delay = 0.32 }: { delay?: number }) {
  const { candidate } = useCandidateStore();
  const { recommendation, select, isPending } = useOptimisticRecommendation();

  return (
    <Panel delay={delay}>
      <PanelHeader
        title="Hiring Recommendation"
        subtitle="Optimistic UI — updates in-memory session instantly"
        action={
          isPending ? (
            <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Saving…
            </span>
          ) : null
        }
      />
      <div
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        role="radiogroup"
        aria-label="Hiring recommendation"
      >
        {OPTIONS.map((option, index) => {
          const active = recommendation === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + index * 0.04 }}
              onClick={() => select(option.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                active
                  ? toneActive(option.value)
                  : "border-[var(--border)] bg-[var(--background)]/40 hover:border-[var(--border-strong)]"
              )}
            >
              <p className="font-heading text-sm font-semibold">
                {option.value}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">
        AI rationale: {candidate.analysis.recommendationRationale}
      </p>
    </Panel>
  );
}

function toneActive(value: HiringRecommendation): string {
  switch (value) {
    case "Strong Hire":
      return "border-[color-mix(in_oklab,var(--accent)_55%,var(--border))] bg-[var(--accent-soft)]";
    case "Hire":
      return "border-[color-mix(in_oklab,var(--success)_45%,var(--border))] bg-[color-mix(in_oklab,var(--success)_10%,transparent)]";
    case "Interview":
      return "border-[color-mix(in_oklab,var(--warning)_45%,var(--border))] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)]";
    case "Reject":
      return "border-[color-mix(in_oklab,var(--danger)_45%,var(--border))] bg-[color-mix(in_oklab,var(--danger)_10%,transparent)]";
  }
}
