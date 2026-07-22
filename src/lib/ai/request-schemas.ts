import { z } from "zod";
import { aiLocaleContextSchema, buildAILocaleContext } from "@/lib/i18n/ai-locale";
import {
  answerEvaluationSchema,
  parsedResumeSchema,
  resumeAnalysisSchema,
  technicalQuestionSchema,
} from "./schemas";

/**
 * Optional on the wire; defaults to English so existing callers that omit
 * `locale` keep working unchanged.
 */
const localeRequestSchema = aiLocaleContextSchema
  .optional()
  .default(() => buildAILocaleContext("en"));

export const parseResumeRequestSchema = z.object({
  resumeText: z.string().min(1, "resumeText is required"),
  linkedInUrl: z.string().url().optional().nullable(),
  locale: localeRequestSchema,
});

export const analyzeResumeRequestSchema = z.object({
  resume: parsedResumeSchema,
  linkedInUrl: z.string().url().optional().nullable(),
  locale: localeRequestSchema,
});

export const fitRationaleRequestSchema = z.object({
  resume: parsedResumeSchema,
  analysis: resumeAnalysisSchema,
  stream: z.boolean().optional().default(false),
  locale: localeRequestSchema,
});

export const questionsRequestSchema = z.object({
  resume: parsedResumeSchema,
  analysis: resumeAnalysisSchema.optional().nullable(),
  locale: localeRequestSchema,
});

export const evaluateAnswersRequestSchema = z.object({
  resume: parsedResumeSchema,
  questions: z.array(technicalQuestionSchema).min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        answer: z.string(),
      })
    )
    .min(1),
  locale: localeRequestSchema,
});

export type ParseResumeRequest = z.infer<typeof parseResumeRequestSchema>;
export type AnalyzeResumeRequest = z.infer<typeof analyzeResumeRequestSchema>;
export type FitRationaleRequest = z.infer<typeof fitRationaleRequestSchema>;
export type QuestionsRequest = z.infer<typeof questionsRequestSchema>;
export type EvaluateAnswersRequest = z.infer<
  typeof evaluateAnswersRequestSchema
>;

// Re-export for consumers that want response shapes
export { answerEvaluationSchema };
