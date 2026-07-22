import type { LocaleCode, LocaleMeta } from "./types";

export const LOCALE_STORAGE_KEY = "foundry.locale";
export const DEFAULT_LOCALE: LocaleCode = "en";

export const locales = {
  en: {
    code: "en",
    language: "English",
    nativeLabel: "English",
    direction: "ltr",
    htmlLang: "en",
    intl: "en-US",
  },
  ar: {
    code: "ar",
    language: "Arabic",
    nativeLabel: "العربية",
    direction: "rtl",
    htmlLang: "ar",
    intl: "ar-SA",
  },
} as const satisfies Record<LocaleCode, LocaleMeta>;

export function isLocaleCode(value: unknown): value is LocaleCode {
  return value === "en" || value === "ar";
}

export function localeFromBrowserTag(tag: string): LocaleCode {
  const primary = tag.toLowerCase().split("-")[0];
  return primary === "ar" ? "ar" : "en";
}

/** Precedence: localStorage → navigator languages → default en. Browser only. */
export function resolveInitialLocale(): LocaleCode {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocaleCode(stored)) return stored;
  } catch {
    /* ignore */
  }
  const candidates = [
    ...(typeof navigator !== "undefined" ? navigator.languages ?? [] : []),
    typeof navigator !== "undefined" ? navigator.language : "",
  ].filter(Boolean);
  for (const tag of candidates) {
    if (localeFromBrowserTag(tag) === "ar") return "ar";
  }
  return DEFAULT_LOCALE;
}
