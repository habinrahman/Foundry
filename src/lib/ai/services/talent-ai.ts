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
}

export interface AnalyzeResumeInput {
  resume: ParsedResume;
  linkedInUrl?: string | null;
}

export interface FitRationaleInput {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
}

export interface GenerateQuestionsInput {
  resume: ParsedResume;
  analysis?: ResumeAnalysis | null;
}

export interface EvaluateAnswersInput {
  resume: ParsedResume;
  questions: TechnicalQuestion[];
  answers: CandidateAnswer[];
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
      messages: buildFitRationaleMessages(input),
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
      messages: buildFitRationaleStreamMessages(input),
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
      messages: buildEvaluateAnswersMessages(input),
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
