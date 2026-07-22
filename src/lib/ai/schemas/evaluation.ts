import { z } from "zod";
import { hiringRecommendationSchema } from "./analysis";

export const answerEvaluationItemSchema = z.object({
  questionId: z.string(),
  score: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  feedback: z.string(),
});

export const answerEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(2).max(8),
  weaknesses: z.array(z.string()).min(1).max(8),
  overallEvaluation: z.string(),
  hiringRecommendation: hiringRecommendationSchema,
  perQuestion: z.array(answerEvaluationItemSchema),
});

export type AnswerEvaluationSchema = z.infer<typeof answerEvaluationSchema>;
