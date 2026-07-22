import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAIError, toPublicAIErrorMessage } from "./errors";

export function jsonOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ ok: true, data }, { status: 200, ...init });
}

export function jsonError(
  error: unknown,
  fallbackStatus = 500
): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body.",
          details: error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  if (isAIError(error)) {
    const status =
      error.code === "MISSING_API_KEY"
        ? 503
        : error.code === "RATE_LIMITED"
          ? 429
          : error.code === "CONTENT_BLOCKED"
            ? 422
            : error.status && error.status >= 400 && error.status < 600
              ? error.status
              : fallbackStatus;

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: toPublicAIErrorMessage(error),
        },
      },
      { status }
    );
  }

  console.error("[ai-api]", error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: toPublicAIErrorMessage(error),
      },
    },
    { status: fallbackStatus }
  );
}

/**
 * Streams plain text (or SSE) from an async text generator.
 */
export function streamTextResponse(
  generator: AsyncGenerator<string, void, unknown>,
  options?: { format?: "plain" | "sse" }
): Response {
  const format = options?.format ?? "sse";
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          if (!chunk) continue;
          if (format === "sse") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
            );
          } else {
            controller.enqueue(encoder.encode(chunk));
          }
        }

        if (format === "sse") {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        }
        controller.close();
      } catch (error) {
        const message = toPublicAIErrorMessage(error);
        if (format === "sse") {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: message })}\n\n`
            )
          );
          controller.close();
        } else {
          controller.error(error);
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":
        format === "sse"
          ? "text/event-stream; charset=utf-8"
          : "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
