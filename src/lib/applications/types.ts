export interface ApplicationRoleRef {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
}

export interface ApplicationPersonal {
  fullName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
}

export interface ApplicationProfessional {
  yearsOfExperience: string;
  currentCompany?: string | null;
  currentPosition?: string | null;
  linkedInUrl: string;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
}

export interface ApplicationResume {
  fileName?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  text?: string | null;
}

export interface ApplicationAnswers {
  interestReason: string;
  strongFitReason: string;
  additionalNotes?: string | null;
}

export interface ApplicationAnalysis {
  skills: string[];
  atsScore: number | null;
  summary: string | null;
  strengths: string[];
  risks: string[];
  interviewQuestions: string[];
}

export interface ApplicationMetadata {
  source: "tamm-careers";
  userAgent?: string | null;
  referrer?: string | null;
}

export type ApplicationStatus = "received" | "analyzing" | "ready" | "demo";

export interface Application {
  id: string;
  role: ApplicationRoleRef;
  status: ApplicationStatus;
  submittedAt: string;
  personal: ApplicationPersonal;
  professional: ApplicationProfessional;
  resume: ApplicationResume;
  answers: ApplicationAnswers;
  analysis: ApplicationAnalysis | null;
  metadata: ApplicationMetadata;
}

export interface CreateApplicationInput {
  roleSlug: string;
  personal: ApplicationPersonal;
  professional: ApplicationProfessional;
  resume: ApplicationResume;
  answers: ApplicationAnswers;
  metadata?: Partial<Omit<ApplicationMetadata, "source">>;
}

export const YEARS_OF_EXPERIENCE = [
  "0-1",
  "1-3",
  "3-5",
  "5-8",
  "8+",
] as const;

export type YearsOfExperience = (typeof YEARS_OF_EXPERIENCE)[number];
