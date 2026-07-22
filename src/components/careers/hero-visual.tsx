"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

const NODES = [
  { id: "resume", labelKey: "resume", x: 56, y: 160 },
  { id: "skills", labelKey: "skills", x: 152, y: 100 },
  { id: "graph", labelKey: "knowledgeGraph", x: 248, y: 170 },
  { id: "insights", labelKey: "insights", x: 344, y: 100 },
  { id: "decision", labelKey: "decision", x: 424, y: 160 },
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 2],
  [2, 4],
];

/** Original hiring-intelligence visualization — Resume → Decision. */
export function CareersHeroVisual({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const { t } = useLocale();

  return (
    <div className={cn("relative", className)} aria-hidden>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
        {!reduced ? (
          <>
            <motion.div
              className="landing-orb-1 absolute -start-16 top-[-20%] h-64 w-64 rounded-full blur-[100px]"
              animate={{ x: [0, 24, 0], y: [0, 16, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="landing-orb-2 absolute -end-12 bottom-[-10%] h-56 w-56 rounded-full blur-[100px]"
              animate={{ x: [0, -18, 0], y: [0, -12, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : (
          <>
            <div className="landing-orb-1 absolute -start-16 top-[-20%] h-64 w-64 rounded-full blur-[100px]" />
            <div className="landing-orb-2 absolute -end-12 bottom-[-10%] h-56 w-56 rounded-full blur-[100px]" />
          </>
        )}
        <div className="landing-grid-bg absolute inset-0 opacity-40" />

        <svg
          viewBox="0 0 480 360"
          className="relative h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {EDGES.map(([from, to], i) => {
            const a = NODES[from];
            const b = NODES[to];
            const length = Math.hypot(b.x - a.x, b.y - a.y);
            return (
              <motion.line
                key={`${a.id}-${b.id}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={reduced ? undefined : `${length * 0.35} ${length}`}
                initial={reduced ? false : { opacity: 0.25, strokeDashoffset: length }}
                animate={
                  reduced
                    ? { opacity: 0.35 }
                    : {
                        opacity: [0.25, 0.7, 0.25],
                        strokeDashoffset: [length, 0, -length],
                      }
                }
                transition={{
                  duration: 3.6,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {NODES.map((node, index) => (
            <g key={node.id}>
              {!reduced ? (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="28"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1"
                  animate={{
                    opacity: [0.12, 0.4, 0.12],
                    scale: [0.95, 1.1, 0.95],
                  }}
                  transition={{
                    duration: 3.2,
                    delay: index * 0.22,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ) : null}
              <circle
                cx={node.x}
                cy={node.y}
                r="18"
                fill="color-mix(in oklab, var(--surface-elevated) 88%, transparent)"
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r="5"
                fill={
                  index === NODES.length - 1 ? "var(--accent)" : "var(--chart-2)"
                }
              />
              <text
                x={node.x}
                y={node.y + 42}
                textAnchor="middle"
                fill="var(--muted)"
                fontSize="11"
                fontFamily="var(--font-body)"
              >
                {t.careers.heroVisual.nodes[node.labelKey]}
              </text>
            </g>
          ))}

          {!reduced ? (
            <motion.path
              d="M60 280 C140 250, 220 310, 300 255 C360 220, 400 270, 440 240"
              stroke="var(--chart-2)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: 1, opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <path
              d="M60 280 C140 250, 220 310, 300 255 C360 220, 400 270, 440 240"
              stroke="var(--chart-2)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
          )}
        </svg>

        <div className="absolute bottom-4 start-4 end-4 flex flex-wrap items-end justify-between gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] px-3 py-2 text-xs backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
              {t.careers.heroVisual.hiringIntelligence}
            </p>
            <p className="mt-0.5 font-heading text-sm font-semibold text-[var(--foreground)]">
              {t.careers.heroVisual.resumeToDecision}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-glass)] px-3 py-2 font-mono text-[10px] text-[var(--accent)] backdrop-blur-md">
            {t.careers.heroVisual.liveSignal}
          </div>
        </div>
      </div>
    </div>
  );
}
