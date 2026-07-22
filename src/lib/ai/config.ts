export type AIProviderName = "gemini" | "openai";

export interface AIConfig {
  provider: AIProviderName;
  geminiApiKey: string | undefined;
  openaiApiKey: string | undefined;
  model: string;
  temperature: number;
  maxRetries: number;
  retryBaseDelayMs: number;
  requestTimeoutMs: number;
}

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getAIConfig(): AIConfig {
  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();

  return {
    provider: provider === "openai" ? "openai" : "gemini",
    geminiApiKey: process.env.GEMINI_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: process.env.AI_MODEL ?? "gemini-2.5-flash",
    temperature: readNumber(process.env.AI_TEMPERATURE, 0.2),
    maxRetries: readNumber(process.env.AI_MAX_RETRIES, 3),
    retryBaseDelayMs: readNumber(process.env.AI_RETRY_BASE_DELAY_MS, 500),
    requestTimeoutMs: readNumber(process.env.AI_REQUEST_TIMEOUT_MS, 60_000),
  };
}
