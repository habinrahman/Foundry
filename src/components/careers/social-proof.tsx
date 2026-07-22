"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCountUp, usePrefersReducedMotion } from "@/hooks";
import { Reveal } from "@/components/landing/primitives";
import { useLocale } from "@/lib/i18n/hooks";

const STATS = [
  { key: "countries", value: 12, suffix: "" },
  { key: "engineers", value: 40, suffix: "+" },
  { key: "deployments", value: 200, suffix: "+" },
  { key: "platformUptime", value: 99.9, suffix: "%", decimals: 1 },
] as const;

function Stat({
  label,
  value,
  suffix,
  decimals = 0,
  active,
}: {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  active: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const counted = useCountUp(active || reduced ? value : 0, 1200);
  const display =
    decimals > 0 ? counted.toFixed(decimals) : String(Math.round(counted));

  return (
    <div className="text-center sm:text-start">
      <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">{label}</p>
    </div>
  );
}

/** Illustrative social proof — clearly labeled as demo metrics. */
export function CareersSocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLocale();

  return (
    <section
      ref={ref}
      className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      aria-label={t.careers.socialProof.ariaLabel}
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <p className="text-center text-sm text-[var(--muted)] sm:text-base">
            {t.careers.socialProof.trustedBy}
          </p>
          <p className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
            {t.careers.socialProof.illustrativeNote}
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-8 border-y border-[var(--border)] py-10 lg:grid-cols-4 lg:gap-10 lg:py-14">
          {STATS.map((stat) => (
            <Stat
              key={stat.key}
              label={t.careers.socialProof.stats[stat.key]}
              value={stat.value}
              suffix={stat.suffix}
              decimals={"decimals" in stat ? stat.decimals : 0}
              active={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
