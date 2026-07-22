"use client";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-lg bg-[color-mix(in_oklab,var(--muted)_18%,transparent)]",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-3"
          style={{ width: `${88 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div
      className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-label="Loading dashboard"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 lg:flex-row lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-80 rounded-2xl lg:col-span-5" />
        <Skeleton className="h-80 rounded-2xl lg:col-span-7" />
      </div>
      <span className="sr-only">Loading recruiter dashboard…</span>
    </div>
  );
}
