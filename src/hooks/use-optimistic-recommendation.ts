"use client";

import { useCallback, useOptimistic, useTransition } from "react";
import type { HiringRecommendation } from "@/types/candidate";
import { useCandidateStore } from "@/store/candidate-store";

/**
 * Optimistic hiring recommendation updates for snappy demo UX.
 */
export function useOptimisticRecommendation() {
  const { candidate, setHiringRecommendation } = useCandidateStore();
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    candidate.evaluation.hiringRecommendation,
    (_current, next: HiringRecommendation) => next
  );

  const select = useCallback(
    (value: HiringRecommendation) => {
      startTransition(() => {
        setOptimistic(value);
        setHiringRecommendation(value);
      });
    },
    [setHiringRecommendation, setOptimistic]
  );

  return {
    recommendation: optimistic,
    select,
    isPending,
  };
}
