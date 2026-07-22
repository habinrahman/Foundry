"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { formatScore } from "@/lib/utils";

export function AnimatedScore({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const current = useCountUp(value);
  return <span className={className}>{formatScore(current)}</span>;
}
