"use client";

import { cn, recommendationTone } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "strong" | "positive" | "negative";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClass(tone),
        className
      )}
    >
      {children}
    </span>
  );
}

export function RecommendationBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  return (
    <Badge tone={recommendationTone(value)} className={className}>
      {value}
    </Badge>
  );
}

function toneClass(tone: string): string {
  switch (tone) {
    case "accent":
    case "strong":
      return "bg-[var(--accent-soft)] text-[var(--accent)]";
    case "success":
    case "positive":
      return "bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-[var(--success)]";
    case "warning":
    case "neutral":
      return "bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-[var(--warning)]";
    case "danger":
    case "negative":
      return "bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-[var(--danger)]";
    default:
      return "border border-[var(--border)] text-[var(--muted)]";
  }
}
