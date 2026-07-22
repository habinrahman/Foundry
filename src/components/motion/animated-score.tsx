"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { useLocale } from "@/lib/i18n/hooks";

export function AnimatedScore({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const { formatNumber } = useLocale();
  const current = useCountUp(value);
  return (
    <span className={className}>{formatNumber(Math.round(current))}</span>
  );
}
