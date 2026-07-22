"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import {
  MockHeader,
  MockLabel,
  MockMeter,
  MockStatusBadge,
  MockWindow,
  staggerItem,
  useMockReveal,
} from "./foundry-chrome";

const CONFIDENCE = 92;

export function HiringRecommendationMockup({ className }: { className?: string }) {
  const { t } = useLocale();
  const copy = t.careers.foundryShowcase.mockups.hiringRecommendation;
  const { ref, active, reduced } = useMockReveal();

  return (
    <div ref={ref} className={cn(className)}>
      <MockWindow path={copy.urlPath} label={copy.windowLabel} reduced={reduced}>
        <MockHeader
          icon={CheckCircle2}
          title={copy.panelTitle}
          subtitle={copy.panelSubtitle}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] bg-[var(--accent-soft)] p-4">
          <p className="font-heading text-lg font-semibold tracking-tight text-[var(--accent)]">
            {copy.recommendation}
          </p>
          <MockStatusBadge>{copy.confidenceLabel}: {CONFIDENCE}%</MockStatusBadge>
        </div>

        <div className="mt-4">
          <MockMeter
            label={copy.confidenceLabel}
            value={CONFIDENCE}
            active={active}
            reduced={reduced}
          />
        </div>

        <div className="mt-5">
          <MockLabel>{copy.rationaleLabel}</MockLabel>
          <ul className="space-y-2">
            {copy.rationale.map((item, index) =>
              reduced ? (
                <li key={item} className="flex gap-2 text-xs leading-relaxed text-[var(--foreground)]/85">
                  <span className="text-[var(--accent)]">•</span>
                  {item}
                </li>
              ) : (
                <motion.li
                  key={item}
                  variants={staggerItem}
                  initial="hidden"
                  animate={active ? "shown" : "hidden"}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.08 }}
                  className="flex gap-2 text-xs leading-relaxed text-[var(--foreground)]/85"
                >
                  <span className="text-[var(--accent)]">•</span>
                  {item}
                </motion.li>
              )
            )}
          </ul>
        </div>
      </MockWindow>
    </div>
  );
}
