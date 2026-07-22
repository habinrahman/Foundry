/**
 * Foundry — AI layer public surface.
 *
 * Preferred entry: `getTalentAI()` / `TalentAI`
 * Provider seam: `createAIProvider()` (gemini default, openai stub)
 */

export { getAIConfig, type AIConfig, type AIProviderName } from "./config";
export {
  AIError,
  isAIError,
  toPublicAIErrorMessage,
  type AIErrorCode,
} from "./errors";
export { withRetry } from "./retry";
export { jsonOk, jsonError, streamTextResponse } from "./http";
export {
  createAIProvider,
  resetAIProviderCache,
  type AIProvider,
  type AIMessage,
} from "./provider";
export {
  TalentAI,
  getTalentAI,
  resetTalentAI,
  type ParseResumeInput,
  type AnalyzeResumeInput,
  type FitRationaleInput,
  type GenerateQuestionsInput,
  type EvaluateAnswersInput,
} from "./services";
export * from "./schemas";
export * from "./prompts";
export * from "./request-schemas";
