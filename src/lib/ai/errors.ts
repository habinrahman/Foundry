export type AIErrorCode =
  | "MISSING_API_KEY"
  | "PROVIDER_UNAVAILABLE"
  | "RATE_LIMITED"
  | "TIMEOUT"
  | "INVALID_RESPONSE"
  | "SCHEMA_VALIDATION"
  | "CONTENT_BLOCKED"
  | "UNKNOWN";

export class AIError extends Error {
  readonly code: AIErrorCode;
  readonly retryable: boolean;
  readonly cause?: unknown;
  readonly provider?: string;
  readonly status?: number;

  constructor(options: {
    message: string;
    code: AIErrorCode;
    retryable?: boolean;
    cause?: unknown;
    provider?: string;
    status?: number;
  }) {
    super(options.message);
    this.name = "AIError";
    this.code = options.code;
    this.retryable = options.retryable ?? false;
    this.cause = options.cause;
    this.provider = options.provider;
    this.status = options.status;
  }
}

export function isAIError(error: unknown): error is AIError {
  return error instanceof AIError;
}

export function toPublicAIErrorMessage(error: unknown): string {
  if (isAIError(error)) {
    switch (error.code) {
      case "MISSING_API_KEY":
        return "AI provider is not configured. Set the API key in environment variables.";
      case "RATE_LIMITED":
        return "The AI provider is rate-limiting requests. Please try again shortly.";
      case "TIMEOUT":
        return "The AI request timed out. Please try again.";
      case "SCHEMA_VALIDATION":
      case "INVALID_RESPONSE":
        return "The AI returned an unexpected response. Please retry.";
      case "CONTENT_BLOCKED":
        return "The AI provider blocked this request due to safety filters.";
      case "PROVIDER_UNAVAILABLE":
        return "The selected AI provider is not available.";
      default:
        return "An unexpected AI error occurred. Please try again.";
    }
  }

  return "An unexpected AI error occurred. Please try again.";
}
