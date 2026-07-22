import { GoogleGenAI, ApiError } from "@google/genai";
import type { z } from "zod";
import type { AIConfig } from "../config";
import { AIError } from "../errors";
import { withRetry } from "../retry";
import { zodToGeminiJsonSchema } from "./json-schema";
import type {
  AIMessage,
  AIProvider,
  GenerateStructuredParams,
  GenerateTextParams,
} from "./types";

function mapGeminiError(error: unknown): AIError {
  if (error instanceof AIError) return error;

  if (error instanceof ApiError) {
    const status = error.status;
    if (status === 429) {
      return new AIError({
        message: "Gemini rate limit exceeded.",
        code: "RATE_LIMITED",
        retryable: true,
        cause: error,
        provider: "gemini",
        status,
      });
    }

    if (status === 408 || status === 504) {
      return new AIError({
        message: "Gemini request timed out.",
        code: "TIMEOUT",
        retryable: true,
        cause: error,
        provider: "gemini",
        status,
      });
    }

    if (status >= 500) {
      return new AIError({
        message: "Gemini service unavailable.",
        code: "PROVIDER_UNAVAILABLE",
        retryable: true,
        cause: error,
        provider: "gemini",
        status,
      });
    }

    if (status === 400 && /safety|blocked|prohibited/i.test(error.message)) {
      return new AIError({
        message: "Gemini blocked the content.",
        code: "CONTENT_BLOCKED",
        retryable: false,
        cause: error,
        provider: "gemini",
        status,
      });
    }
  }

  const message = error instanceof Error ? error.message : "Unknown Gemini error";

  if (/timeout|ETIMEDOUT|AbortError/i.test(message)) {
    return new AIError({
      message: "Gemini request timed out.",
      code: "TIMEOUT",
      retryable: true,
      cause: error,
      provider: "gemini",
    });
  }

  return new AIError({
    message,
    code: "UNKNOWN",
    retryable: false,
    cause: error,
    provider: "gemini",
  });
}

function toGeminiContents(messages: AIMessage[]): string {
  // Gemini prefers a single user turn for structured tasks; fold roles into text.
  return messages
    .map((message) => {
      const label =
        message.role === "system"
          ? "SYSTEM"
          : message.role === "assistant"
            ? "ASSISTANT"
            : "USER";
      return `[${label}]\n${message.content}`;
    })
    .join("\n\n");
}

function extractSystemInstruction(messages: AIMessage[]): {
  systemInstruction?: string;
  contents: string;
} {
  const systemParts = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content);
  const nonSystem = messages.filter((m) => m.role !== "system");

  return {
    systemInstruction:
      systemParts.length > 0 ? systemParts.join("\n\n") : undefined,
    contents: toGeminiContents(nonSystem.length > 0 ? nonSystem : messages),
  };
}

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private readonly client: GoogleGenAI;
  private readonly config: AIConfig;

  constructor(config: AIConfig) {
    if (!config.geminiApiKey) {
      throw new AIError({
        message: "GEMINI_API_KEY is not set.",
        code: "MISSING_API_KEY",
        retryable: false,
        provider: "gemini",
      });
    }

    this.config = config;
    this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }

  async generateText(params: GenerateTextParams): Promise<string> {
    return withRetry(
      async () => {
        try {
          const { systemInstruction, contents } = extractSystemInstruction(
            params.messages
          );
          const response = await this.client.models.generateContent({
            model: params.model ?? this.config.model,
            contents,
            config: {
              temperature: params.temperature ?? this.config.temperature,
              systemInstruction,
            },
          });

          const text = response.text?.trim();
          if (!text) {
            throw new AIError({
              message: "Gemini returned an empty text response.",
              code: "INVALID_RESPONSE",
              retryable: true,
              provider: "gemini",
            });
          }

          return text;
        } catch (error) {
          throw mapGeminiError(error);
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelayMs: this.config.retryBaseDelayMs,
      }
    );
  }

  async *streamText(
    params: GenerateTextParams
  ): AsyncGenerator<string, void, unknown> {
    // Streaming retries only the initial connection; mid-stream failures surface.
    try {
      const { systemInstruction, contents } = extractSystemInstruction(
        params.messages
      );
      const stream = await withRetry(
        async () =>
          this.client.models.generateContentStream({
            model: params.model ?? this.config.model,
            contents,
            config: {
              temperature: params.temperature ?? this.config.temperature,
              systemInstruction,
            },
          }),
        {
          maxRetries: this.config.maxRetries,
          baseDelayMs: this.config.retryBaseDelayMs,
        }
      );

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) yield text;
      }
    } catch (error) {
      throw mapGeminiError(error);
    }
  }

  async generateStructured<TSchema extends z.ZodType>(
    params: GenerateStructuredParams<TSchema>
  ): Promise<z.infer<TSchema>> {
    return withRetry(
      async () => {
        try {
          const { systemInstruction, contents } = extractSystemInstruction(
            params.messages
          );
          const responseJsonSchema = zodToGeminiJsonSchema(params.schema);

          const response = await this.client.models.generateContent({
            model: params.model ?? this.config.model,
            contents,
            config: {
              temperature: params.temperature ?? this.config.temperature,
              systemInstruction,
              responseMimeType: "application/json",
              responseJsonSchema,
            },
          });

          const raw = response.text?.trim();
          if (!raw) {
            throw new AIError({
              message: `Gemini returned empty JSON for ${params.schemaName}.`,
              code: "INVALID_RESPONSE",
              retryable: true,
              provider: "gemini",
            });
          }

          let parsedJson: unknown;
          try {
            parsedJson = JSON.parse(raw);
          } catch (cause) {
            throw new AIError({
              message: `Gemini returned invalid JSON for ${params.schemaName}.`,
              code: "INVALID_RESPONSE",
              retryable: true,
              cause,
              provider: "gemini",
            });
          }

          const validated = params.schema.safeParse(parsedJson);
          if (!validated.success) {
            throw new AIError({
              message: `Schema validation failed for ${params.schemaName}: ${validated.error.message}`,
              code: "SCHEMA_VALIDATION",
              retryable: true,
              cause: validated.error,
              provider: "gemini",
            });
          }

          return validated.data;
        } catch (error) {
          throw mapGeminiError(error);
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelayMs: this.config.retryBaseDelayMs,
      }
    );
  }
}
