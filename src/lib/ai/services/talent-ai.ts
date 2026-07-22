import { buildAILocaleContext } from "@/lib/i18n/ai-locale";
import type { AILocaleContext } from "@/lib/i18n/types";
import type {
  AnswerEvaluation,
  CandidateAnswer,
  FitRationale,
  ParsedResume,
  ResumeAnalysis,
  TechnicalQuestion,
  TechnicalQuestionSet,
} from "@/types/candidate";
import { getAIConfig, type AIConfig } from "../config";
import {
  buildAnalyzeResumeMessages,
  buildEvaluateAnswersMessages,
  buildFitRationaleMessages,
  buildFitRationaleStreamMessages,
  buildParseResumeMessages,
  buildTechnicalQuestionsMessages,
} from "../prompts";
import { createAIProvider, type AIProvider } from "../provider";
import {
  answerEvaluationSchema,
  fitRationaleSchema,
  parsedResumeSchema,
  resumeAnalysisSchema,
  technicalQuestionSetSchema,
} from "../schemas";

export interface ParseResumeInput {
  resumeText: string;
  linkedInUrl?: string | null;
  locale?: AILocaleContext;
}

export interface AnalyzeResumeInput {
  resume: ParsedResume;
  linkedInUrl?: string | null;
  locale?: AILocaleContext;
}

export interface FitRationaleInput {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  locale?: AILocaleContext;
}

export interface GenerateQuestionsInput {
  resume: ParsedResume;
  analysis?: ResumeAnalysis | null;
  locale?: AILocaleContext;
}

export interface EvaluateAnswersInput {
  resume: ParsedResume;
  questions: TechnicalQuestion[];
  answers: CandidateAnswer[];
  locale?: AILocaleContext;
}

/** Backward-compat default for callers that omit `locale` entirely. */
function resolveLocale(locale?: AILocaleContext): AILocaleContext {
  return locale ?? buildAILocaleContext("en");
}

/**
 * Deep module: all hiring AI capabilities behind a small interface.
 * Callers never talk to Gemini/OpenAI directly.
 */
export class TalentAI {
  private readonly provider: AIProvider;
  private readonly config: AIConfig;

  constructor(options?: { provider?: AIProvider; config?: AIConfig }) {
    this.config = options?.config ?? getAIConfig();
    this.provider = options?.provider ?? createAIProvider(this.config);
  }

  async parseResume(input: ParseResumeInput): Promise<ParsedResume> {
    const text = input.resumeText?.trim();
    if (!text) {
      return emptyResume(input.linkedInUrl);
    }

    return this.provider.generateStructured({
      schemaName: "ParsedResume",
      schema: parsedResumeSchema,
      temperature: 0.1,
      messages: buildParseResumeMessages({
        resumeText: text,
        linkedInUrl: input.linkedInUrl,
        locale: resolveLocale(input.locale),
      }),
    });
  }

  async analyzeResume(input: AnalyzeResumeInput): Promise<ResumeAnalysis> {
    return this.provider.generateStructured({
      schemaName: "ResumeAnalysis",
      schema: resumeAnalysisSchema,
      temperature: 0.2,
      messages: buildAnalyzeResumeMessages({
        resume: input.resume,
        linkedInUrl: input.linkedInUrl,
        locale: resolveLocale(input.locale),
      }),
    });
  }

  async generateFitRationale(
    input: FitRationaleInput
  ): Promise<FitRationale> {
    return this.provider.generateStructured({
      schemaName: "FitRationale",
      schema: fitRationaleSchema,
      temperature: 0.4,
      messages: buildFitRationaleMessages({
        ...input,
        locale: resolveLocale(input.locale),
      }),
    });
  }

  /**
   * Streams markdown "Why you're a fit" for progressive UI rendering.
   */
  streamFitRationale(
    input: FitRationaleInput
  ): AsyncGenerator<string, void, unknown> {
    return this.provider.streamText({
      temperature: 0.5,
      messages: buildFitRationaleStreamMessages({
        ...input,
        locale: resolveLocale(input.locale),
      }),
    });
  }

  async generateTechnicalQuestions(
    input: GenerateQuestionsInput
  ): Promise<TechnicalQuestionSet> {
    return this.provider.generateStructured({
      schemaName: "TechnicalQuestionSet",
      schema: technicalQuestionSetSchema,
      temperature: 0.35,
      messages: buildTechnicalQuestionsMessages({
        resume: input.resume,
        analysis: input.analysis,
        locale: resolveLocale(input.locale),
      }),
    });
  }

  async evaluateAnswers(
    input: EvaluateAnswersInput
  ): Promise<AnswerEvaluation> {
    return this.provider.generateStructured({
      schemaName: "AnswerEvaluation",
      schema: answerEvaluationSchema,
      temperature: 0.2,
      messages: buildEvaluateAnswersMessages({
        ...input,
        locale: resolveLocale(input.locale),
      }),
    });
  }
}

let singleton: TalentAI | null = null;

export function getTalentAI(): TalentAI {
  if (!singleton) singleton = new TalentAI();
  return singleton;
}

export function resetTalentAI(): void {
  singleton = null;
}

function emptyResume(linkedInUrl?: string | null): ParsedResume {
  return {
    name: null,
    email: null,
    phone: null,
    skills: [],
    education: [],
    experience: [],
    projects: [],
    achievements: [],
    certifications: [],
    github: null,
    portfolio: null,
    linkedin: linkedInUrl ?? null,
    rawTextExcerpt: null,
  };
}
