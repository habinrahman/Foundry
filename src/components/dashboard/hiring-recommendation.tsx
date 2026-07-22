"use client";

import { motion } from "framer-motion";
import type { HiringRecommendation } from "@/types/candidate";
import type { Messages } from "@/lib/i18n/dictionary";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import { useOptimisticRecommendation } from "@/hooks";
import { useCandidateStore } from "@/store/candidate-store";
import { Panel, PanelHeader } from "./panel";

const RECOMMENDATION_ORDER: HiringRecommendation[] = [
  "Strong Hire",
  "Hire",
  "Interview",
  "Reject",
];

type RecommendationOptionKey =
  keyof Messages["recruiter"]["panels"]["hiringRecommendation"]["options"];

const RECOMMENDATION_KEYS: Record<HiringRecommendation, RecommendationOptionKey> = {
  "Strong Hire": "strongHire",
  Hire: "hire",
  Interview: "interview",
  Reject: "reject",
};

/** Localized display label for a `HiringRecommendation` enum value (enum itself stays English). */
export function recommendationLabel(
  value: HiringRecommendation,
  t: Messages
): string {
  return t.recruiter.panels.hiringRecommendation.options[RECOMMENDATION_KEYS[value]]
    .label;
}

export function HiringRecommendationPanel({ delay = 0.32 }: { delay?: number }) {
  const { t } = useLocale();
  const { candidate } = useCandidateStore();
  const { recommendation, select, isPending } = useOptimisticRecommendation();
  const panel = t.recruiter.panels.hiringRecommendation;

  const options = RECOMMENDATION_ORDER.map((value) => ({
    value,
    ...panel.options[RECOMMENDATION_KEYS[value]],
  }));

  return (
    <Panel delay={delay}>
      <PanelHeader
        title={panel.title}
        subtitle={panel.subtitle}
        action={
          isPending ? (
            <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
              {panel.saving}
            </span>
          ) : null
        }
      />
      <div
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        role="radiogroup"
        aria-label={panel.title}
      >
        {options.map((option, index) => {
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
                "rounded-xl border p-4 text-start transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                active
                  ? toneActive(option.value)
                  : "border-[var(--border)] bg-[var(--background)]/40 hover:border-[var(--border-strong)]"
              )}
            >
              <p className="font-heading text-sm font-semibold">
                {option.label}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">
        {panel.rationalePrefix}: {candidate.analysis.recommendationRationale}
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
