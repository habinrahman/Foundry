import { getAIConfig, type AIConfig } from "../config";
import { AIError } from "../errors";
import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import type { AIProvider } from "./types";

let cached: { key: string; provider: AIProvider } | null = null;

function cacheKey(config: AIConfig): string {
  return [
    config.provider,
    config.model,
    config.geminiApiKey ? "g1" : "g0",
    config.openaiApiKey ? "o1" : "o0",
  ].join(":");
}

export function createAIProvider(config: AIConfig = getAIConfig()): AIProvider {
  const key = cacheKey(config);
  if (cached?.key === key) return cached.provider;

  let provider: AIProvider;

  switch (config.provider) {
    case "gemini":
      provider = new GeminiProvider(config);
      break;
    case "openai":
      provider = new OpenAIProvider(config);
      break;
    default:
      throw new AIError({
        message: `Unknown AI provider: ${String(config.provider)}`,
        code: "PROVIDER_UNAVAILABLE",
        retryable: false,
      });
  }

  cached = { key, provider };
  return provider;
}

export function resetAIProviderCache(): void {
  cached = null;
}

export type { AIProvider } from "./types";
