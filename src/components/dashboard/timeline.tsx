"use client";

import { motion } from "framer-motion";
import type { TimelineEvent } from "@/types/dashboard";
import { cn } from "@/lib/utils";
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
  return (
    <Panel delay={delay}>
      <PanelHeader title="Timeline" subtitle="Career + interview arc" />
      <ol className="relative space-y-5 border-l border-[var(--border-strong)] ml-2 pl-6">
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
                "absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[var(--surface)]",
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
