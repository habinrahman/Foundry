import type { z } from "zod";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateTextParams {
  messages: AIMessage[];
  temperature?: number;
  model?: string;
}

export interface GenerateStructuredParams<TSchema extends z.ZodType> {
  messages: AIMessage[];
  schema: TSchema;
  schemaName: string;
  temperature?: number;
  model?: string;
}

/**
 * Provider seam — swap Gemini for OpenAI without changing service callers.
 */
export interface AIProvider {
  readonly name: string;

  generateText(params: GenerateTextParams): Promise<string>;

  streamText(params: GenerateTextParams): AsyncGenerator<string, void, unknown>;

  generateStructured<TSchema extends z.ZodType>(
    params: GenerateStructuredParams<TSchema>
  ): Promise<z.infer<TSchema>>;
}
