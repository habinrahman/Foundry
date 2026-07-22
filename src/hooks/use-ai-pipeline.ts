"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export const AI_PIPELINE_STAGES = [
  "Reading resume...",
  "Understanding projects...",
  "Extracting technical skills...",
  "Reasoning about experience...",
  "Evaluating product mindset...",
  "Generating interview...",
  "Preparing recruiter report...",
] as const;

export interface AiPipelineState {
  active: boolean;
  done: boolean;
  stageIndex: number;
  stageLabel: string;
  progress: number;
  start: () => void;
  reset: () => void;
}

export function useAiPipeline(options?: {
  stageDurationMs?: number;
  onComplete?: () => void;
}): AiPipelineState {
  const reduced = usePrefersReducedMotion();
  const stageDurationMs = options?.stageDurationMs ?? (reduced ? 140 : 850);
  const onCompleteRef = useRef(options?.onComplete);
  onCompleteRef.current = options?.onComplete;

  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const reset = useCallback(() => {
    setActive(false);
    setDone(false);
    setStageIndex(0);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    setDone(false);
    setStageIndex(0);
    setProgress(2);
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    const total = AI_PIPELINE_STAGES.length;
    let index = 0;
    let cancelled = false;

    setStageIndex(0);
    setProgress(2);

    const progressTimer = window.setInterval(() => {
      if (cancelled) return;
      setProgress((p) => {
        const floor = (index / total) * 100;
        const ceil = ((index + 1) / total) * 100;
        return Math.min(ceil - 0.4, Math.max(floor + 1, p + (reduced ? 6 : 1.6)));
      });
    }, 50);

    const stageTimer = window.setInterval(() => {
      if (cancelled) return;
      index += 1;
      if (index >= total) {
        window.clearInterval(progressTimer);
        window.clearInterval(stageTimer);
        setStageIndex(total - 1);
        setProgress(100);
        setDone(true);
        setActive(false);
        onCompleteRef.current?.();
        return;
      }
      setStageIndex(index);
      setProgress((index / total) * 100 + 2);
    }, stageDurationMs);

    return () => {
      cancelled = true;
      window.clearInterval(progressTimer);
      window.clearInterval(stageTimer);
    };
  }, [active, reduced, stageDurationMs]);

  return {
    active,
    done,
    stageIndex,
    stageLabel: AI_PIPELINE_STAGES[stageIndex] ?? AI_PIPELINE_STAGES[0],
    progress,
    start,
    reset,
  };
}
