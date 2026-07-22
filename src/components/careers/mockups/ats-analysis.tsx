"use client";

import { Gauge } from "lucide-react";
import { useCountUp } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import {
  MockHeader,
  MockLabel,
  MockMeter,
  MockStatusBadge,
  MockWindow,
  useMockReveal,
} from "./foundry-chrome";

const SCORE = 88;
const CATEGORY_VALUES = [92, 85, 81];
const METER_TONES = ["accent", "chart-2", "chart-3"] as const;

export function AtsAnalysisMockup({ className }: { className?: string }) {
  const { t } = useLocale();
  const copy = t.careers.foundryShowcase.mockups.atsAnalysis;
  const { ref, active, reduced } = useMockReveal();
  const score = useCountUp(active ? SCORE : 0, 900);

  return (
    <div ref={ref} className={cn(className)}>
      <MockWindow path={copy.urlPath} label={copy.windowLabel} reduced={reduced}>
        <MockHeader
          icon={Gauge}
          title={copy.panelTitle}
          subtitle={copy.panelSubtitle}
        />

        <div className="flex flex-wrap items-end justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
              {copy.scoreLabel}
            </p>
            <p className="mt-1 font-heading text-4xl font-semibold tracking-tight tabular-nums">
              {Math.round(score)}
              <span className="text-lg text-[var(--muted)]">/100</span>
            </p>
          </div>
          <MockStatusBadge tone="success">{copy.statusBadge}</MockStatusBadge>
        </div>
        <p className="mt-2 text-[11px] text-[var(--muted)]">{copy.scoreCaption}</p>

        <div className="mt-5 space-y-3.5">
          <MockLabel>{copy.breakdownLabel}</MockLabel>
          {copy.categories.map((category, index) => (
            <MockMeter
              key={category}
              label={category}
              value={CATEGORY_VALUES[index]}
              active={active}
              reduced={reduced}
              delay={index * 0.1}
              tone={METER_TONES[index]}
            />
          ))}
        </div>
      </MockWindow>
    </div>
  );
}
