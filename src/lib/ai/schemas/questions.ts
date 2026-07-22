import { z } from "zod";

export const questionDifficultySchema = z.enum(["easy", "medium", "hard"]);

export const questionCategorySchema = z.enum([
  "fundamentals",
  "llm-systems",
  "product-sense",
  "debugging",
  "architecture",
  "behavioral-technical",
]);

export const technicalQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  category: questionCategorySchema,
  difficulty: questionDifficultySchema,
  rationale: z.string(),
  expectedSignals: z.array(z.string()).min(2).max(6),
});

export const technicalQuestionSetSchema = z.object({
  questions: z.array(technicalQuestionSchema).length(10),
  adaptationNotes: z.string(),
});

export type TechnicalQuestionSetSchema = z.infer<
  typeof technicalQuestionSetSchema
>;
