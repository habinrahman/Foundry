"use client";

import { useCallback, useEffect } from "react";

export type KeyCombo = {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
};

function matchesCombo(event: KeyboardEvent, combo: KeyCombo): boolean {
  const key = event.key.toLowerCase();
  const targetKey = combo.key.toLowerCase();
  if (key !== targetKey) return false;

  const metaOrCtrl = combo.meta || combo.ctrl;
  if (metaOrCtrl) {
    if (!(event.metaKey || event.ctrlKey)) return false;
  } else if (event.metaKey || event.ctrlKey) {
    return false;
  }

  if (Boolean(combo.shift) !== event.shiftKey) return false;
  if (Boolean(combo.alt) !== event.altKey) return false;
  return true;
}

export function useKeyboardShortcut(
  combo: KeyCombo,
  handler: (event: KeyboardEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const editable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable;

      // Allow Escape / Cmd+K even in inputs for palette UX
      const allowInInput =
        event.key === "Escape" ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k");

      if (editable && !allowInInput) return;
      if (!matchesCombo(event, combo)) return;

      event.preventDefault();
      handler(event);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [combo, handler, enabled]);
}

export function useKeyboardShortcuts(
  bindings: Array<{ combo: KeyCombo; handler: () => void }>,
  enabled = true
): void {
  const stableHandler = useCallback(
    (event: KeyboardEvent) => {
      for (const binding of bindings) {
        if (matchesCombo(event, binding.combo)) {
          const target = event.target as HTMLElement | null;
          const tag = target?.tagName?.toLowerCase();
          const editable =
            tag === "input" ||
            tag === "textarea" ||
            tag === "select" ||
            target?.isContentEditable;
          const allowInInput =
            event.key === "Escape" ||
            ((event.metaKey || event.ctrlKey) &&
              event.key.toLowerCase() === "k");
          if (editable && !allowInInput) continue;
          event.preventDefault();
          binding.handler();
          break;
        }
      }
    },
    [bindings]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("keydown", stableHandler);
    return () => window.removeEventListener("keydown", stableHandler);
  }, [stableHandler, enabled]);
}
