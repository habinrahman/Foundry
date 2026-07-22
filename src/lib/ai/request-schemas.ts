import { z } from "zod";
import {
  answerEvaluationSchema,
  parsedResumeSchema,
  resumeAnalysisSchema,
  technicalQuestionSchema,
} from "./schemas";

export const parseResumeRequestSchema = z.object({
  resumeText: z.string().min(1, "resumeText is required"),
  linkedInUrl: z.string().url().optional().nullable(),
});

export const analyzeResumeRequestSchema = z.object({
  resume: parsedResumeSchema,
  linkedInUrl: z.string().url().optional().nullable(),
});

export const fitRationaleRequestSchema = z.object({
  resume: parsedResumeSchema,
  analysis: resumeAnalysisSchema,
  stream: z.boolean().optional().default(false),
});

export const questionsRequestSchema = z.object({
  resume: parsedResumeSchema,
  analysis: resumeAnalysisSchema.optional().nullable(),
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
