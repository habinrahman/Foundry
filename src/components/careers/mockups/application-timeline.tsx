"use client";

import { motion } from "framer-motion";
import { Check, GitCommitVertical } from "lucide-react";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import { MockHeader, MockWindow, useMockReveal } from "./foundry-chrome";

const CURRENT_INDEX = 3;

export function ApplicationTimelineMockup({ className }: { className?: string }) {
  const { t } = useLocale();
  const copy = t.careers.foundryShowcase.mockups.applicationTimeline;
  const { ref, reduced } = useMockReveal();

  return (
    <div ref={ref} className={cn(className)}>
      <MockWindow path={copy.urlPath} label={copy.windowLabel} reduced={reduced}>
        <MockHeader
          icon={GitCommitVertical}
          title={copy.panelTitle}
          subtitle={copy.panelSubtitle}
        />

        <ol className="relative ms-2 space-y-4 border-s border-[var(--border-strong)] ps-6">
          {copy.stages.map((label, index) => {
            const done = index < CURRENT_INDEX;
            const current = index === CURRENT_INDEX;
            return (
              <li key={label} className="relative">
                <span
                  className={cn(
                    "absolute -start-[1.95rem] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-[var(--surface)]",
                    done && "bg-[var(--success)]",
                    current && "bg-[var(--accent)]",
                    !done && !current && "bg-[color-mix(in_oklab,var(--muted)_35%,transparent)]"
                  )}
                  aria-hidden
                >
                  {done ? <Check className="h-2.5 w-2.5 text-[var(--surface)]" /> : null}
                  {current && !reduced ? (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-[var(--accent)]"
                      animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.9, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : null}
                </span>
                <p
                  className={cn(
                    "text-sm font-medium",
                    !done && !current && "text-[var(--muted)]"
                  )}
                >
                  {label}
                </p>
              </li>
            );
          })}
        </ol>
      </MockWindow>
    </div>
  );
}
