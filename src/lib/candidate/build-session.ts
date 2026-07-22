import { TARGET_ROLE } from "@/constants/role";
import { DEFAULT_LOCALE } from "@/lib/i18n/locale";
import type { AILocaleContext } from "@/lib/i18n/types";
import type {
  FitRationale,
  ParsedResume,
  ResumeAnalysis,
  TechnicalQuestionSet,
} from "@/types/candidate";
import type {
  CandidateSession,
  DashboardScores,
  RadarAxis,
  SkillMatrixItem,
  TimelineEvent,
} from "@/types/dashboard";

function formatPeriod(
  start: string | null,
  end: string | null,
  current?: boolean
): string {
  const startLabel = start ?? "—";
  const endLabel = current ? "Present" : (end ?? "—");
  return `${startLabel} – ${endLabel}`;
}

function buildTimeline(
  resume: ParsedResume,
  questions: TechnicalQuestionSet
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  resume.education.forEach((edu, index) => {
    events.push({
      id: `edu-${index}`,
      label: `${edu.degree} ${edu.field}`.trim(),
      detail: edu.institution,
      at: formatPeriod(edu.startDate, edu.endDate),
      kind: "education",
    });
  });

  resume.experience.forEach((exp, index) => {
    events.push({
      id: `exp-${index}`,
      label: exp.title,
      detail: `${exp.company}${exp.location ? ` — ${exp.location}` : ""}`,
      at: formatPeriod(exp.startDate, exp.endDate, exp.current),
      kind: "experience",
    });
  });

  resume.projects.slice(0, 3).forEach((project, index) => {
    events.push({
      id: `proj-${index}`,
      label: project.name,
      detail: project.description,
      at: "Project",
      kind: "project",
    });
  });

  resume.achievements.slice(0, 2).forEach((item, index) => {
    events.push({
      id: `ach-${index}`,
      label: item.title,
      detail: item.description,
      at: item.date ?? "Milestone",
      kind: "milestone",
    });
  });

  events.push({
    id: "interview",
    label: "AI Interview Loop",
    detail: `${questions.questions.length} adaptive technical questions generated`,
    at: new Date().toISOString().slice(0, 7),
    kind: "interview",
  });

  return events;
}

function buildSkillMatrix(
  resume: ParsedResume,
  analysis: ResumeAnalysis
): SkillMatrixItem[] {
  const relevanceBase = Math.min(100, Math.max(55, analysis.atsScore));
  const proficiencyBase = Math.min(95, Math.max(45, analysis.atsScore - 4));

  const skills = resume.skills.length > 0 ? resume.skills.slice(0, 8) : analysis.topStrengths.slice(0, 6);

  return skills.map((skill, index) => ({
    skill,
    proficiency: Math.min(98, proficiencyBase + ((index % 3) - 1) * 4),
    relevance: Math.min(100, relevanceBase + ((index % 2) * 3)),
    evidence:
      analysis.topStrengths[index % Math.max(analysis.topStrengths.length, 1)] ??
      "Supported by resume and AI analysis",
  }));
}

function buildRadar(analysis: ResumeAnalysis, fit: FitRationale): RadarAxis[] {
  const confidence = Math.round(fit.confidence * 100);
  const ats = analysis.atsScore;

  return [
    { axis: "Technical", score: Math.min(100, ats + 2), fullMark: 100 },
    { axis: "AI Systems", score: Math.min(100, ats), fullMark: 100 },
    { axis: "Product", score: Math.min(100, ats + 3), fullMark: 100 },
    {
      axis: "Communication",
      score: Math.min(100, confidence),
      fullMark: 100,
    },
    {
      axis: "Architecture",
      score: Math.min(100, Math.max(55, ats - 3)),
      fullMark: 100,
    },
    {
      axis: "Execution",
      score: Math.min(100, Math.round((ats + confidence) / 2)),
      fullMark: 100,
    },
  ];
}

function buildScores(
  analysis: ResumeAnalysis,
  fit: FitRationale
): DashboardScores {
  const confidence = Math.round(fit.confidence * 100);
  return {
    overallScore: Math.round((analysis.atsScore + confidence) / 2),
    aiConfidence: confidence,
    atsScore: analysis.atsScore,
    technicalScore: Math.min(100, analysis.atsScore + 2),
    communicationScore: Math.min(100, confidence + 4),
  };
}

function buildPreInterviewEvaluation(analysis: ResumeAnalysis) {
  return {
    overallScore: Math.round(analysis.atsScore * 0.9),
    strengths: analysis.topStrengths,
    weaknesses: analysis.weaknesses,
    overallEvaluation: `${analysis.recommendationRationale} Interview answers have not been submitted yet — scores reflect resume analysis only.`,
    hiringRecommendation: analysis.hiringRecommendation,
    perQuestion: [],
  };
}

export function buildCandidateSession(input: {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  fit: FitRationale;
  questions: TechnicalQuestionSet;
  linkedInUrl?: string | null;
  /** Locale used to generate `analysis`/`fit`/`questions`. Defaults to `en`. */
  locale?: AILocaleContext;
}): CandidateSession {
  const linkedin =
    input.linkedInUrl?.trim() || input.resume.linkedin || null;

  const resume: ParsedResume = {
    ...input.resume,
    linkedin,
  };

  const scores = buildScores(input.analysis, input.fit);

  return {
    id: `cand_${Date.now()}`,
    roleTitle: TARGET_ROLE.title,
    updatedAt: new Date().toISOString(),
    resume,
    analysis: input.analysis,
    fit: input.fit,
    questions: input.questions,
    answers: [],
    evaluation: buildPreInterviewEvaluation(input.analysis),
    scores,
    skillMatrix: buildSkillMatrix(resume, input.analysis),
    radar: buildRadar(input.analysis, input.fit),
    timeline: buildTimeline(resume, input.questions),
    analysisLanguage: input.locale?.code ?? DEFAULT_LOCALE,
  };
}
