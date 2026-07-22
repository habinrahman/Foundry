import type { AILocaleContext } from "@/lib/i18n/types";
import type {
  AnswerEvaluation,
  FitRationale,
  ParsedResume,
  ResumeAnalysis,
  TechnicalQuestionSet,
} from "@/types/candidate";

export interface ApiEnvelope<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export class TalentApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 500) {
    super(message);
    this.name = "TalentApiError";
    this.code = code;
    this.status = status;
  }
}

async function readEnvelope<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !body.ok || body.data === undefined) {
    throw new TalentApiError(
      body.error?.code ?? "UNKNOWN",
      body.error?.message ?? "Request failed.",
      response.status
    );
  }

  return body.data;
}

export async function extractResumeText(file: File): Promise<{
  text: string;
  fileName: string;
  characterCount: number;
}> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch("/api/ai/extract-text", {
    method: "POST",
    body: form,
  });
  return readEnvelope(response);
}

export async function parseResumeApi(input: {
  resumeText: string;
  linkedInUrl?: string | null;
  locale?: AILocaleContext;
}): Promise<ParsedResume> {
  const response = await fetch("/api/ai/parse-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readEnvelope(response);
}

export async function analyzeResumeApi(input: {
  resume: ParsedResume;
  linkedInUrl?: string | null;
  locale?: AILocaleContext;
}): Promise<ResumeAnalysis> {
  const response = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readEnvelope(response);
}

export async function generateFitApi(input: {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  locale?: AILocaleContext;
}): Promise<FitRationale> {
  const response = await fetch("/api/ai/fit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, stream: false }),
  });
  return readEnvelope(response);
}

export async function generateQuestionsApi(input: {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  locale?: AILocaleContext;
}): Promise<TechnicalQuestionSet> {
  const response = await fetch("/api/ai/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readEnvelope(response);
}

export async function evaluateAnswersApi(input: {
  resume: ParsedResume;
  questions: TechnicalQuestionSet["questions"];
  answers: { questionId: string; answer: string }[];
  locale?: AILocaleContext;
}): Promise<AnswerEvaluation> {
  const response = await fetch("/api/ai/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return readEnvelope(response);
}

export interface TalentApiErrorMessages {
  missingApiKey: string;
  rateLimited: string;
  generic: string;
}

const DEFAULT_TALENT_API_ERROR_MESSAGES: TalentApiErrorMessages = {
  missingApiKey:
    "Gemini API key is not configured. Add GEMINI_API_KEY to .env.local and restart the dev server.",
  rateLimited: "AI rate limit reached. Wait a moment and try again.",
  generic: "Something went wrong while running the AI pipeline.",
};

export function formatTalentApiError(
  error: unknown,
  messages: TalentApiErrorMessages = DEFAULT_TALENT_API_ERROR_MESSAGES
): string {
  if (error instanceof TalentApiError) {
    if (error.code === "MISSING_API_KEY") {
      return messages.missingApiKey;
    }
    if (error.code === "RATE_LIMITED") {
      return messages.rateLimited;
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return messages.generic;
}
