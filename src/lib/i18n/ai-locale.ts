import { z } from "zod";
import { locales } from "./locale";
import type { AILocaleContext, LocaleCode } from "./types";

/** Mirrors `AILocaleContext`. Used to validate/default locale on AI requests. */
export const aiLocaleContextSchema = z.object({
  language: z.string(),
  code: z.enum(["en", "ar"]),
  direction: z.enum(["ltr", "rtl"]),
  preserveTechnicalTerms: z.literal(true),
});

export function buildAILocaleContext(code: LocaleCode): AILocaleContext {
  const meta = locales[code];
  return {
    language: meta.language,
    code: meta.code,
    direction: meta.direction,
    preserveTechnicalTerms: true,
  };
}

export function buildLocaleSystemAppendix(ctx: AILocaleContext): string {
  const terms =
    "Python, TypeScript, React, Next.js, FastAPI, PostgreSQL, Docker, Kubernetes, Gemini, OpenAI, LLM, RAG, ATS, API, JWT, OAuth";
  if (ctx.code === "ar") {
    return [
      "The UI language is Arabic.",
      "Respond entirely in Modern Standard Arabic.",
      "Use professional recruiter language. Do not mix colloquial Arabic.",
      `Preserve industry-standard technical terms in English (${terms}).`,
      "Do not translate technology names; translate surrounding explanations.",
    ].join("\n");
  }
  return [
    "The UI language is English.",
    "Respond in clear professional English.",
    `Preserve industry-standard technical terms as commonly written (${terms}).`,
  ].join("\n");
}
