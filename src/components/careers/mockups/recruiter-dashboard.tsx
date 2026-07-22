"use client";

import { motion } from "framer-motion";
import { Activity, LayoutDashboard } from "lucide-react";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import {
  MockHeader,
  MockLabel,
  MockWindow,
  staggerItem,
  useMockReveal,
} from "./foundry-chrome";

const STAT_VALUES = [6, 24, 9];

export function RecruiterDashboardMockup({ className }: { className?: string }) {
  const { t } = useLocale();
  const copy = t.careers.foundryShowcase.mockups.recruiterDashboard;
  const { ref, active, reduced } = useMockReveal();

  return (
    <div ref={ref} className={cn(className)}>
      <MockWindow path={copy.urlPath} label={copy.windowLabel} reduced={reduced}>
        <MockHeader
          icon={LayoutDashboard}
          title={copy.panelTitle}
          subtitle={copy.panelSubtitle}
        />

        <div className="grid grid-cols-3 gap-2.5">
          {copy.stats.map((label, index) => (
            <div
              key={label}
              className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-3"
            >
              <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
                {STAT_VALUES[index]}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <MockLabel>
            <span className="inline-flex items-center gap-1.5">
              <Activity className="h-3 w-3" aria-hidden />
              {copy.activityLabel}
            </span>
          </MockLabel>
          <ul className="space-y-2">
            {copy.activity.map((item, index) =>
              reduced ? (
                <li key={item}>
                  <ActivityRow label={item} />
                </li>
              ) : (
                <motion.li
                  key={item}
                  variants={staggerItem}
                  initial="hidden"
                  animate={active ? "shown" : "hidden"}
                  transition={{ duration: 0.35, delay: index * 0.12 }}
                >
                  <ActivityRow label={item} />
                </motion.li>
              )
            )}
          </ul>
        </div>
      </MockWindow>
    </div>
  );
}

function ActivityRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--chart-2)]" aria-hidden />
      {label}
    </div>
  );
}
