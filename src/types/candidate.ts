export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startDate: string | null;
  endDate: string | null;
  highlights: string[];
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
  url: string | null;
  highlights: string[];
}

export interface AchievementEntry {
  title: string;
  description: string;
  date: string | null;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  date: string | null;
  credentialUrl: string | null;
}

export interface ParsedResume {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  achievements: AchievementEntry[];
  certifications: CertificationEntry[];
  github: string | null;
  portfolio: string | null;
  linkedin: string | null;
  rawTextExcerpt: string | null;
}

export interface ResumeAnalysis {
  professionalSummary: string;
  topStrengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsScore: number;
  hiringRecommendation: HiringRecommendation;
  recommendationRationale: string;
}

export type HiringRecommendation =
  | "Strong Hire"
  | "Hire"
  | "Interview"
  | "Reject";

export interface FitRationale {
  headline: string;
  narrative: string;
  matchPoints: string[];
  riskPoints: string[];
  confidence: number;
}

export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionCategory =
  | "fundamentals"
  | "llm-systems"
  | "product-sense"
  | "debugging"
  | "architecture"
  | "behavioral-technical";

export interface TechnicalQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  rationale: string;
  expectedSignals: string[];
}

export interface TechnicalQuestionSet {
  questions: TechnicalQuestion[];
  adaptationNotes: string;
}

export interface CandidateAnswer {
  questionId: string;
  answer: string;
}

export interface AnswerEvaluationItem {
  questionId: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
}

export interface AnswerEvaluation {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  overallEvaluation: string;
  hiringRecommendation: HiringRecommendation;
  perQuestion: AnswerEvaluationItem[];
}

export interface HiringReport {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  fit: FitRationale;
  questions: TechnicalQuestionSet;
  evaluation: AnswerEvaluation | null;
  generatedAt: string;
}
