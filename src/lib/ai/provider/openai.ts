import type { z } from "zod";
import type { AIConfig } from "../config";
import { AIError } from "../errors";
import type {
  AIProvider,
  GenerateStructuredParams,
  GenerateTextParams,
} from "./types";

/**
 * OpenAI adapter stub — keeps the provider seam real without shipping OpenAI yet.
 * Swap implementation later without touching TalentAI services.
 */
export class OpenAIProvider implements AIProvider {
  readonly name = "openai";

  constructor(config: AIConfig) {
    if (!config.openaiApiKey) {
      throw new AIError({
        message: "OPENAI_API_KEY is not set.",
        code: "MISSING_API_KEY",
        retryable: false,
        provider: "openai",
      });
    }
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    void params;
    throw this.notImplemented();
  }

  async *streamText(
    params: GenerateTextParams
  ): AsyncGenerator<string, void, unknown> {
    void params;
    throw this.notImplemented();
    yield "";
  }

  async generateStructured<TSchema extends z.ZodType>(
    params: GenerateStructuredParams<TSchema>
  ): Promise<z.infer<TSchema>> {
    void params;
    throw this.notImplemented();
  }

  private notImplemented(): AIError {
    return new AIError({
      message:
        "OpenAI provider is not implemented yet. Set AI_PROVIDER=gemini.",
      code: "PROVIDER_UNAVAILABLE",
      retryable: false,
      provider: "openai",
    });
  }
}
