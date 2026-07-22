/**
 * Target role used for fit rationale, questions, and evaluation.
 * Keep this as the single source of truth for hiring context.
 */
export const TARGET_ROLE = {
  title: "AI Product Engineer",
  level: "Mid–Senior",
  summary:
    "Build AI-native product experiences end-to-end: prompt/system design, LLM orchestration, evaluation loops, and polished product UX.",
  mustHaves: [
    "Strong software engineering fundamentals (TypeScript/JavaScript or equivalent)",
    "Hands-on experience integrating LLMs into production products",
    "Ability to design prompts, tools, and evaluation criteria with measurable quality",
    "Product sense: ship usable features, not demos",
    "Clear written communication and structured problem-solving",
  ],
  niceToHaves: [
    "Experience with RAG, agents, or multimodal pipelines",
    "Familiarity with Next.js / React product surfaces",
    "Eval harnesses, offline metrics, or human-in-the-loop review flows",
    "Prior startup or 0→1 product experience",
  ],
  interviewFocus: [
    "System design for AI features",
    "Prompt engineering and failure modes",
    "Product trade-offs (latency, cost, quality, safety)",
    "Debugging non-deterministic systems",
    "Collaboration with design and product",
  ],
} as const;

export type TargetRole = typeof TARGET_ROLE;
