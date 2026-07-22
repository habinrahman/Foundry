import { AIError, isAIError } from "./errors";

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultShouldRetry(error: unknown): boolean {
  if (isAIError(error)) return error.retryable;
  return false;
}

function computeDelayMs(baseDelayMs: number, attempt: number): number {
  const exponential = baseDelayMs * 2 ** attempt;
  const jitter = Math.floor(Math.random() * baseDelayMs);
  return Math.min(exponential + jitter, 8_000);
}

/**
 * Retries an async operation with exponential backoff + jitter.
 * Only retries when the error is marked retryable (or custom predicate).
 */
export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const shouldRetry = options.shouldRetry ?? defaultShouldRetry;
  let lastError: unknown;

  for (let attempt = 0; attempt <= options.maxRetries; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      const canRetry =
        attempt < options.maxRetries && shouldRetry(error, attempt);

      if (!canRetry) break;

      const delayMs = computeDelayMs(options.baseDelayMs, attempt);
      options.onRetry?.(error, attempt + 1, delayMs);
      await sleep(delayMs);
    }
  }

  if (isAIError(lastError)) throw lastError;

  throw new AIError({
    message: "AI operation failed after retries.",
    code: "UNKNOWN",
    retryable: false,
    cause: lastError,
  });
}
