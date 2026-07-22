export type { Messages } from "@/lib/translations/en";

export type LocaleCode = "en" | "ar";
export type TextDirection = "ltr" | "rtl";

export interface LocaleMeta {
  code: LocaleCode;
  language: string;
  nativeLabel: string;
  direction: TextDirection;
  htmlLang: string;
  intl: string;
}

export interface AILocaleContext {
  language: string;
  code: LocaleCode;
  direction: TextDirection;
  preserveTechnicalTerms: true;
}
