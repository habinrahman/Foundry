import type { AIMessage } from "../provider/types";
import { TALENT_AI_SYSTEM } from "./system";

export function buildParseResumeMessages(input: {
  resumeText: string;
  linkedInUrl?: string | null;
}): AIMessage[] {
  return [
    {
      role: "system",
      content: `${TALENT_AI_SYSTEM}

Task: PARSE_RESUME
Extract a structured candidate profile from resume text.
Rules:
- Use null for unknown scalar fields; use [] for unknown lists.
- Normalize emails/phones/URLs when present; do not invent them.
- Skills should be deduplicated and title-cased consistently.
- Prefer recent experience order (most recent first).
- rawTextExcerpt should be a short 1–3 sentence excerpt useful for debugging, not the full resume.
- If a LinkedIn URL is provided separately, use it for linkedin when the resume lacks one.`,
    },
    {
      role: "user",
      content: [
        "Extract the candidate profile from the following resume text.",
        input.linkedInUrl
          ? `LinkedIn URL provided by candidate: ${input.linkedInUrl}`
          : "No LinkedIn URL was provided separately.",
        "",
        "RESUME TEXT:",
        "```",
        input.resumeText.slice(0, 80_000),
        "```",
      ].join("\n"),
    },
  ];
}
