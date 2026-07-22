import type {
  AnswerEvaluation,
  CandidateAnswer,
  FitRationale,
  HiringRecommendation,
  ParsedResume,
  ResumeAnalysis,
  TechnicalQuestionSet,
} from "@/types/candidate";
import type { LocaleCode } from "@/lib/i18n/types";

export interface SkillMatrixItem {
  skill: string;
  proficiency: number; // 0–100
  relevance: number; // 0–100
  evidence: string;
}

export interface TimelineEvent {
  id: string;
  label: string;
  detail: string;
  at: string; // ISO date or period
  kind: "education" | "experience" | "project" | "milestone" | "interview";
}

export interface RadarAxis {
  axis: string;
  score: number; // 0–100
  fullMark: number;
}

export interface DashboardScores {
  overallScore: number;
  aiConfidence: number;
  atsScore: number;
  technicalScore: number;
  communicationScore: number;
}

export interface CandidateSession {
  id: string;
  roleTitle: string;
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  fit: FitRationale;
  questions: TechnicalQuestionSet;
  answers: CandidateAnswer[];
  evaluation: AnswerEvaluation;
  scores: DashboardScores;
  skillMatrix: SkillMatrixItem[];
  radar: RadarAxis[];
  timeline: TimelineEvent[];
  updatedAt: string;
  /** Locale the AI analysis/fit/questions text was generated in. */
  analysisLanguage: LocaleCode;
}

export interface HiringDecisionOption {
  value: HiringRecommendation;
  description: string;
}
