import { z } from "zod";

export const fitRationaleSchema = z.object({
  headline: z.string(),
  narrative: z.string(),
  matchPoints: z.array(z.string()).min(3).max(8),
  riskPoints: z.array(z.string()).min(1).max(6),
  confidence: z.number().min(0).max(1),
});

export type FitRationaleSchema = z.infer<typeof fitRationaleSchema>;
