"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/hooks";
import { locales } from "@/lib/i18n/locale";
import type { LocaleCode } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const localeList = Object.values(locales);

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const selectLocale = useCallback(
    (code: LocaleCode) => {
      setLocale(code);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [setLocale]
  );

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    const activeIndex = localeList.findIndex((meta) => meta.code === locale);
    const index = activeIndex >= 0 ? activeIndex : 0;
    setHighlightIndex(index);
    optionRefs.current[index]?.focus();
  }, [locale, open]);

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((i) => {
        const next = (i + 1) % localeList.length;
        optionRefs.current[next]?.focus();
        return next;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((i) => {
        const next = (i - 1 + localeList.length) % localeList.length;
        optionRefs.current[next]?.focus();
        return next;
      });
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setHighlightIndex(0);
      optionRefs.current[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const last = localeList.length - 1;
      setHighlightIndex(last);
      optionRefs.current[last]?.focus();
    }
  };

  const current = locales[locale];

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.navigation.switchLanguage}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border-strong)] hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      >
        <Globe className="h-4 w-4 text-[var(--muted)]" aria-hidden />
        <span>{current.nativeLabel}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-[var(--muted)] transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-label={t.navigation.language}
            tabIndex={-1}
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute end-0 top-[calc(100%+8px)] z-50 min-w-[160px] overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] p-1 shadow-[var(--shadow)]"
          >
            {localeList.map((meta, index) => {
              const active = meta.code === locale;
              return (
                <button
                  key={meta.code}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={active}
                  tabIndex={highlightIndex === index ? 0 : -1}
                  onClick={() => selectLocale(meta.code)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectLocale(meta.code);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset",
                    active
                      ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                  )}
                >
                  <span className="flex-1">{meta.nativeLabel}</span>
                  {active ? (
                    <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
