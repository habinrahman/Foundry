"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export function useTypewriter(
  text: string,
  options?: { speedMs?: number; startDelayMs?: number; enabled?: boolean }
): { display: string; done: boolean } {
  const speedMs = options?.speedMs ?? 18;
  const startDelayMs = options?.startDelayMs ?? 200;
  const enabled = options?.enabled ?? true;
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(() =>
    reduced || !enabled ? text : ""
  );
  const [done, setDone] = useState(() => reduced || !enabled);

  useEffect(() => {
    if (reduced || !enabled) {
      setDisplay(text);
      setDone(true);
      return;
    }

    let cancelled = false;
    let intervalId: number | undefined;
    setDisplay("");
    setDone(false);
    let index = 0;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (cancelled) return;
        index += 1;
        setDisplay(text.slice(0, index));
        if (index >= text.length) {
          if (intervalId) window.clearInterval(intervalId);
          setDone(true);
        }
      }, speedMs);
    }, startDelayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speedMs, startDelayMs, enabled, reduced]);

  return { display, done };
}
