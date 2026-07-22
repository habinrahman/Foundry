"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildAILocaleContext } from "./ai-locale";
import type { Messages } from "./dictionary";
import { getMessages } from "./dictionary";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  locales,
  resolveInitialLocale,
} from "./locale";
import type { AILocaleContext, LocaleCode, TextDirection } from "./types";
import { createFormatters } from "@/lib/utils/format";

export interface LocaleContextValue {
  locale: LocaleCode;
  direction: TextDirection;
  setLocale: (code: LocaleCode) => void;
  t: Messages;
  formatDate: (
    value: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatPercent: (value: number) => string;
  aiLocale: AILocaleContext;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

function syncDocumentLocale(code: LocaleCode) {
  if (typeof document === "undefined") return;
  const meta = locales[code];
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.direction;
  document.documentElement.setAttribute("data-locale", code);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  // Resolve the real locale (localStorage → browser → default) after mount
  // to avoid SSR/client hydration mismatches.
  useEffect(() => {
    setLocaleState(resolveInitialLocale());
  }, []);

  useEffect(() => {
    syncDocumentLocale(locale);
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const meta = locales[locale];
    const { formatDate, formatNumber, formatPercent } = createFormatters(
      meta.intl
    );
    return {
      locale,
      direction: meta.direction,
      setLocale,
      t: getMessages(locale),
      formatDate,
      formatNumber,
      formatPercent,
      aiLocale: buildAILocaleContext(locale),
    };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
