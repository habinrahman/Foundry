"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

/**
 * Shared "one Foundry app" chrome for the Building Foundry mockups.
 * Every mockup is a static illustrative screen (no live store data) that
 * reuses the same window frame, header, and status-chip language so the
 * six beats read as one product, not six unrelated widgets.
 */

/** Gates each mockup's "alive" cue to when it scrolls into view, and to a
 * static final state when the user prefers reduced motion. */
export function useMockReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return { ref, reduced, active: reduced || inView };
}

export function MockWindow({
  path,
  label,
  children,
  className,
  reduced,
}: {
  path: string;
  label: string;
  children: ReactNode;
  className?: string;
  reduced?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]",
        !reduced && "transition hover:border-[var(--border-strong)]",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="h-2.5 w-2.5 rounded-full bg-[color-mix(in_oklab,var(--muted)_32%,transparent)]"
            />
          ))}
        </span>
        <span className="truncate rounded-md bg-[var(--background)] px-2.5 py-1 font-mono text-[11px] text-[var(--muted)]">
          {path}
        </span>
        <span className="ms-auto shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          {label}
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function MockHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span
            className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]"
            aria-hidden
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <div>
          <h3 className="font-heading text-sm font-semibold tracking-wide text-[var(--foreground)]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}

export function MockLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
      {children}
    </p>
  );
}

export function MockStatusBadge({
  children,
  tone = "accent",
}: {
  children: ReactNode;
  tone?: "accent" | "success";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone === "accent"
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]"
      )}
    >
      {children}
    </span>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0 },
};

/** A single labeled meter bar (score breakdown, confidence, etc.) that fills
 * once when `active` flips true, and renders at its final width statically
 * when `reduced` is set. */
export function MockMeter({
  label,
  value,
  active,
  reduced,
  delay = 0,
  tone = "accent",
}: {
  label: string;
  value: number;
  active: boolean;
  reduced: boolean;
  delay?: number;
  tone?: "accent" | "chart-2" | "chart-3";
}) {
  const color =
    tone === "accent"
      ? "var(--accent)"
      : tone === "chart-2"
        ? "var(--chart-2)"
        : "var(--chart-3)";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="text-[var(--foreground)]/90">{label}</span>
        <span className="font-mono tabular-nums text-[var(--muted)]">
          {value}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        {reduced ? (
          <div
            className="h-full rounded-full"
            style={{ background: color, width: `${value}%` }}
          />
        ) : (
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: active ? `${value}%` : 0 }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </div>
    </div>
  );
}
