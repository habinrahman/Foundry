import type { LocaleCode } from "./types";
import { enMessages, type Messages } from "@/lib/translations/en";
import { arMessages } from "@/lib/translations/ar";

export type { Messages };

export const dictionaries: Record<LocaleCode, Messages> = {
  en: enMessages,
  ar: arMessages,
};

export function getMessages(locale: LocaleCode): Messages {
  return dictionaries[locale] ?? dictionaries.en;
}
