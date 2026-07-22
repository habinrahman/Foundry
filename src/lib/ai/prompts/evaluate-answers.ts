import type { AILocaleContext } from "@/lib/i18n/types";
import type {
  CandidateAnswer,
  ParsedResume,
  TechnicalQuestion,
} from "@/types/candidate";
import type { AIMessage } from "../provider/types";
import { buildTalentAiSystem, formatRoleBrief } from "./system";

export function buildEvaluateAnswersMessages(input: {
  resume: ParsedResume;
  questions: TechnicalQuestion[];
  answers: CandidateAnswer[];
  locale: AILocaleContext;
}): AIMessage[] {
  return [
    {
      role: "system",
      content: `${buildTalentAiSystem(input.locale)}

Task: EVALUATE_CANDIDATE_ANSWERS
Evaluate interview answers for the AI Product Engineer role.

Scoring:
- perQuestion.score: 0–10 (0 empty/irrelevant, 5 partial, 8 strong, 10 exceptional)
- overallScore: 0–100 weighted view of the full set
- hiringRecommendation uses the same calibrated scale as resume analysis
- Empty or very short answers should score low and be called out

Be rigorous:
- Reward correct reasoning, trade-off awareness, and concrete examples
- Penalize vagueness, buzzwords without mechanism, and contradictions
- overallEvaluation: 3–6 sentences, balanced, decision-useful
- Include perQuestion feedback for every answered question id provided`,
    },
    {
      role: "user",
      content: [
        formatRoleBrief(),
        "",
        "CANDIDATE RESUME (context):",
        JSON.stringify(
          {
            name: input.resume.name,
            skills: input.resume.skills,
            experience: input.resume.experience.slice(0, 4),
            projects: input.resume.projects.slice(0, 4),
          },
          null,
          2
        ),
        "",
        "QUESTIONS:",
        JSON.stringify(input.questions, null, 2),
        "",
        "ANSWERS:",
        JSON.stringify(input.answers, null, 2),
      ].join("\n"),
    },
  ];
}
