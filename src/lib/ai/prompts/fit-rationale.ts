import type { AILocaleContext } from "@/lib/i18n/types";
import type { ParsedResume, ResumeAnalysis } from "@/types/candidate";
import type { AIMessage } from "../provider/types";
import { buildTalentAiSystem, formatRoleBrief } from "./system";

export function buildFitRationaleMessages(input: {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  locale: AILocaleContext;
}): AIMessage[] {
  return [
    {
      role: "system",
      content: `${buildTalentAiSystem(input.locale)}

Task: WHY_YOU_ARE_A_FIT
Write a tailored "Why you're a fit" rationale for the AI Product Engineer role.
Voice: direct, premium, candidate-facing but honest — not flattery.
Structure guidance for fields:
- headline: one crisp sentence
- narrative: 180–280 words, second person ("you"), specific to their background
- matchPoints: concrete alignments to must-haves / experience
- riskPoints: honest gaps or risks (always include at least one)
- confidence: 0–1 calibrated belief that this narrative is well-supported

Do not invent experience. Ground every claim in the resume/analysis.`,
    },
    {
      role: "user",
      content: [
        formatRoleBrief(),
        "",
        "ANALYSIS JSON:",
        JSON.stringify(input.analysis, null, 2),
        "",
        "RESUME JSON:",
        JSON.stringify(input.resume, null, 2),
      ].join("\n"),
    },
  ];
}

/** Streaming prose variant — returns markdown narrative only. */
export function buildFitRationaleStreamMessages(input: {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  locale: AILocaleContext;
}): AIMessage[] {
  return [
    {
      role: "system",
      content: `${buildTalentAiSystem(input.locale)}

Task: WHY_YOU_ARE_A_FIT_STREAM
Write a candidate-facing markdown narrative titled "Why you're a fit" for the AI Product Engineer role.

Requirements:
- Start with a short bold headline line
- Then 2–4 short paragraphs in second person
- Include a final short section "## Gaps to address" with 2–4 bullets
- Be specific to the candidate; no generic buzzwords
- Do not invent experience
- Output markdown only — no JSON`,
    },
    {
      role: "user",
      content: [
        formatRoleBrief(),
        "",
        "Key strengths:",
        ...input.analysis.topStrengths.map((s) => `- ${s}`),
        "",
        "Known gaps:",
        ...input.analysis.weaknesses.map((s) => `- ${s}`),
        "",
        "Candidate:",
        `Name: ${input.resume.name ?? "Unknown"}`,
        `Skills: ${input.resume.skills.slice(0, 30).join(", ") || "n/a"}`,
        `Recent roles: ${
          input.resume.experience
            .slice(0, 3)
            .map((e) => `${e.title} @ ${e.company}`)
            .join("; ") || "n/a"
        }`,
      ].join("\n"),
    },
  ];
}
