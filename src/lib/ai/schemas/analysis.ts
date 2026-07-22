import { z } from "zod";

export const hiringRecommendationSchema = z.enum([
  "Strong Hire",
  "Hire",
  "Interview",
  "Reject",
]);

export const resumeAnalysisSchema = z.object({
  professionalSummary: z.string(),
  topStrengths: z.array(z.string()).min(3).max(7),
  weaknesses: z.array(z.string()).min(2).max(6),
  missingSkills: z.array(z.string()).min(1).max(10),
  atsScore: z.number().min(0).max(100),
  hiringRecommendation: hiringRecommendationSchema,
  recommendationRationale: z.string(),
});

export type ResumeAnalysisSchema = z.infer<typeof resumeAnalysisSchema>;
