import type { ParsedResume, ResumeAnalysis } from "@/types/candidate";
import type { AIMessage } from "../provider/types";
import { formatRoleBrief, TALENT_AI_SYSTEM } from "./system";

export function buildTechnicalQuestionsMessages(input: {
  resume: ParsedResume;
  analysis?: ResumeAnalysis | null;
}): AIMessage[] {
  return [
    {
      role: "system",
      content: `${TALENT_AI_SYSTEM}

Task: GENERATE_TECHNICAL_QUESTIONS
Generate exactly 10 technical interview questions adapted to this candidate for the AI Product Engineer role.

Design rules:
1. Adapt to their stack, projects, and seniority — reference resume context in rationale.
2. Mix difficulty: ~2 easy, ~5 medium, ~3 hard.
3. Cover categories across: fundamentals, llm-systems, product-sense, debugging, architecture, behavioral-technical.
4. Prefer open questions that reveal reasoning, not trivia.
5. Avoid questions that only restate their resume; probe decision-making and depth.
6. ids must be q1..q10 in order.
7. expectedSignals: what a strong answer should demonstrate.
8. adaptationNotes: brief explanation of how the set was tailored.`,
    },
    {
      role: "user",
      content: [
        formatRoleBrief(),
        "",
        input.analysis
          ? `ANALYSIS SUMMARY:\n${JSON.stringify(
              {
                topStrengths: input.analysis.topStrengths,
                weaknesses: input.analysis.weaknesses,
                missingSkills: input.analysis.missingSkills,
                hiringRecommendation: input.analysis.hiringRecommendation,
              },
              null,
              2
            )}`
          : "No prior analysis provided.",
        "",
        "RESUME JSON:",
        JSON.stringify(input.resume, null, 2),
      ].join("\n"),
    },
  ];
}
