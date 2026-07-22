import type { ParsedResume } from "@/types/candidate";
import type { AIMessage } from "../provider/types";
import { formatRoleBrief, TALENT_AI_SYSTEM } from "./system";

export function buildAnalyzeResumeMessages(input: {
  resume: ParsedResume;
  linkedInUrl?: string | null;
}): AIMessage[] {
  return [
    {
      role: "system",
      content: `${TALENT_AI_SYSTEM}

Task: ANALYZE_RESUME
Produce a hiring-oriented analysis for the target role.
Calibration guide for hiringRecommendation:
- Strong Hire: rare; clear, repeated evidence across must-haves + strong AI product signal
- Hire: solid match with manageable gaps
- Interview: promising but incomplete evidence; worth a conversation
- Reject: material mismatch on must-haves or seniority

ATS score (0–100):
- Reward clarity, quantified impact, relevant skills, role alignment
- Penalize vagueness, missing core skills, poor structure, keyword stuffing without evidence

Output requirements:
- professionalSummary: 3–5 sentences, third person, factual
- topStrengths / weaknesses / missingSkills: concrete bullet strings
- recommendationRationale: 2–4 sentences explaining the recommendation`,
    },
    {
      role: "user",
      content: [
        formatRoleBrief(),
        "",
        input.linkedInUrl
          ? `Candidate-provided LinkedIn: ${input.linkedInUrl}`
          : "No additional LinkedIn URL provided.",
        "",
        "PARSED RESUME JSON:",
        JSON.stringify(input.resume, null, 2),
      ].join("\n"),
    },
  ];
}
