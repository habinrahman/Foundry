"use client";

import { motion } from "framer-motion";
import type { TimelineEvent } from "@/types/dashboard";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelHeader } from "./panel";

const kindColor: Record<TimelineEvent["kind"], string> = {
  education: "bg-[var(--chart-2)]",
  experience: "bg-[var(--accent)]",
  project: "bg-[var(--chart-3)]",
  milestone: "bg-[var(--warning)]",
  interview: "bg-[var(--success)]",
};

export function CandidateTimeline({
  events,
  delay = 0.2,
}: {
  events: TimelineEvent[];
  delay?: number;
}) {
  const { t } = useLocale();
  const panel = t.recruiter.panels.timeline;

  if (events.length === 0) {
    return (
      <Panel delay={delay}>
        <PanelHeader title={panel.title} subtitle={panel.subtitle} />
        <EmptyState title={panel.empty.title} description={panel.empty.description} />
      </Panel>
    );
  }

  return (
    <Panel delay={delay}>
      <PanelHeader title={panel.title} subtitle={panel.subtitle} />
      <ol className="relative ms-2 space-y-5 border-s border-[var(--border-strong)] ps-6">
        {events.map((event, index) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + index * 0.05, duration: 0.35 }}
            className="relative"
          >
            <span
              className={cn(
                "absolute -start-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[var(--surface)]",
                kindColor[event.kind]
              )}
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">{event.label}</p>
              <span className="font-mono text-[11px] text-[var(--muted)]">
                {event.at}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{event.detail}</p>
          </motion.li>
        ))}
      </ol>
    </Panel>
  );
}
