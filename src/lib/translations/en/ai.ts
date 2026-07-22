export const ai = {
  pipeline: {
    heading: "AI pipeline",
    preparing: "Preparing hiring intelligence",
    progressLabel: "AI analysis progress",
    analysisComplete: "Analysis complete",
    readyForReview: "Ready for your review",
    foundryLabel: "Foundry",
  },
  stages: {
    // Fixed-length tuples (not string[]) so a locale can't ship a mismatched
    // stage count without failing typecheck — see Milestone 1 review.
    recruiterProcessing: [
      "Parsing resume…",
      "Extracting skills…",
      "Evaluating experience…",
      "Generating interview questions…",
      "Complete",
    ] as readonly [string, string, string, string, string],
    livePipeline: [
      "Extracting resume text...",
      "Parsing resume structure...",
      "Analyzing candidate profile...",
      "Generating fit rationale...",
      "Generating interview questions...",
      "Building recruiter report...",
    ] as readonly [string, string, string, string, string, string],
  },
  errors: {
    missingApiKey:
      "Gemini API key is not configured. Add GEMINI_API_KEY to .env.local and restart the dev server.",
    rateLimited: "AI rate limit reached. Wait a moment and try again.",
    generic: "Something went wrong while running the AI pipeline.",
    noResumeText: "No resume text available to analyze.",
  },
};
