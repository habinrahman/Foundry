"use client";

import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useState } from "react";
import {
  Activity,
  Brain,
  FileSearch,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import {
  AiProcessingPanel,
  runAiStageAnimation,
} from "@/components/dashboard/ai-processing-panel";
import { ApplicationsList } from "@/components/dashboard/applications-list";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { OverviewCard } from "@/components/dashboard/overview-cards";
import { SkillMatrix } from "@/components/dashboard/skill-matrix";
import { CandidateTimeline } from "@/components/dashboard/timeline";
import { ResumeSummary } from "@/components/dashboard/resume-summary";
import { ProjectsPanel } from "@/components/dashboard/projects-panel";
import { StrengthsWeaknesses } from "@/components/dashboard/strengths-weaknesses";
import { InterviewQaPanel } from "@/components/dashboard/interview-qa";
import { AiEvaluationPanel } from "@/components/dashboard/ai-evaluation";
import {
  HiringRecommendationPanel,
  recommendationLabel,
} from "@/components/dashboard/hiring-recommendation";
import { ExportBar } from "@/components/dashboard/export-bar";
import { RecommendationBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidateStore } from "@/store/candidate-store";
import {
  useCommandPalette,
  useLiveAiPipeline,
  usePrefersReducedMotion,
} from "@/hooks";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { DEMO_CANDIDATE } from "@/data/demo-candidate";
import { DEMO_RESUME_TEXT } from "@/data/demo-resume-text";
import { formatTalentApiError } from "@/lib/ai/api-client";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";
import { locales } from "@/lib/i18n/locale";
import type { Application } from "@/lib/applications/types";
import type { CandidateSession } from "@/types/dashboard";

/** Resume text + LinkedIn URL last used to generate the current session, so
 * "Regenerate" can re-run the live pipeline without re-selecting an
 * application. */
interface RegenerateSource {
  resumeText: string;
  linkedInUrl: string | null;
}

const DEMO_REGENERATE_SOURCE: RegenerateSource = {
  resumeText: DEMO_RESUME_TEXT,
  linkedInUrl: DEMO_CANDIDATE.resume.linkedin ?? null,
};

const CandidateRadarChart = dynamic(
  () =>
    import("@/components/dashboard/radar-chart").then(
      (m) => m.CandidateRadarChart
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[340px] w-full rounded-2xl" />,
  }
);

function seedFromApplication(app: Application): CandidateSession {
  return {
    ...DEMO_CANDIDATE,
    id: `app_${app.id}`,
    roleTitle: app.role.title,
    updatedAt: new Date().toISOString(),
    resume: {
      ...DEMO_CANDIDATE.resume,
      name: app.personal.fullName,
      email: app.personal.email,
      phone: app.personal.phone,
    },
  };
}

export const RecruiterDashboard = memo(function RecruiterDashboard() {
  const { t, formatDate, formatNumber, formatPercent, aiLocale, locale } =
    useLocale();
  const { candidate, setCandidate } = useCandidateStore();
  const { setOpen } = useCommandPalette();
  const reducedMotion = usePrefersReducedMotion();
  const { scores, resume, analysis, fit, questions, answers, evaluation } =
    candidate;

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analyzedIds, setAnalyzedIds] = useState<Set<string>>(() => new Set());
  const [atsById, setAtsById] = useState<Record<string, number>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [hydrateNotice, setHydrateNotice] = useState<string | null>(null);
  const [hydrateError, setHydrateError] = useState<string | null>(null);
  const [regenerateSource, setRegenerateSource] = useState<RegenerateSource>(
    DEMO_REGENERATE_SOURCE
  );

  const pipeline = useLiveAiPipeline({
    onComplete: (session) => setCandidate(session),
    messages: {
      missingApiKey: t.ai.errors.missingApiKey,
      rateLimited: t.ai.errors.rateLimited,
      generic: t.ai.errors.generic,
      noResumeText: t.ai.errors.noResumeText,
    },
  });

  const stageCount = t.ai.stages.recruiterProcessing.length;

  const onLoaded = useCallback((apps: Application[]) => {
    setApplications(apps);
  }, []);

  const onSelectApplication = useCallback(
    async (app: Application) => {
      setSelectedId(app.id);
      setHydrateError(null);
      setBusyId(app.id);
      setProcessing(true);
      setStageIndex(0);
      setHydrateNotice(null);

      const animation = runAiStageAnimation(
        setStageIndex,
        reducedMotion,
        stageCount
      );

      try {
        if (app.resume.text?.trim()) {
          const [, session] = await Promise.all([
            animation,
            pipeline.run({
              resumeText: app.resume.text,
              linkedInUrl: app.professional.linkedInUrl,
              locale: aiLocale,
            }),
          ]);
          setStageIndex(stageCount - 1);
          setCandidate({
            ...session,
            roleTitle: app.role.title,
            resume: {
              ...session.resume,
              name: app.personal.fullName || session.resume.name,
              email: app.personal.email || session.resume.email,
              phone: app.personal.phone || session.resume.phone,
            },
            updatedAt: new Date().toISOString(),
          });
          setAtsById((prev) => ({
            ...prev,
            [app.id]: session.scores.atsScore,
          }));
          setAnalyzedIds((prev) => new Set(prev).add(app.id));
          setRegenerateSource({
            resumeText: app.resume.text,
            linkedInUrl: app.professional.linkedInUrl ?? null,
          });
        } else {
          await animation;
          const seeded = seedFromApplication(app);
          setCandidate(seeded);
          setAtsById((prev) => ({
            ...prev,
            [app.id]: seeded.scores.atsScore,
          }));
          setAnalyzedIds((prev) => new Set(prev).add(app.id));
          setHydrateNotice(t.recruiter.notices.demoFallback);
          setRegenerateSource(DEMO_REGENERATE_SOURCE);
        }
      } catch (err) {
        await animation.catch(() => undefined);
        setHydrateError(
          formatTalentApiError(err, {
            missingApiKey: t.ai.errors.missingApiKey,
            rateLimited: t.ai.errors.rateLimited,
            generic: t.recruiter.notices.analyzeFailedGeneric,
          })
        );
        const seeded = seedFromApplication(app);
        setCandidate(seeded);
        setAtsById((prev) => ({
          ...prev,
          [app.id]: seeded.scores.atsScore,
        }));
        setHydrateNotice(t.recruiter.notices.liveAnalysisFailed);
        setRegenerateSource(DEMO_REGENERATE_SOURCE);
      } finally {
        setBusyId(null);
        setTimeout(() => setProcessing(false), reducedMotion ? 0 : 400);
      }
    },
    [
      aiLocale,
      pipeline,
      reducedMotion,
      setCandidate,
      stageCount,
      t.ai.errors,
      t.recruiter.notices,
    ]
  );

  const handleRegenerate = useCallback(async () => {
    setHydrateError(null);
    setProcessing(true);
    setStageIndex(0);

    const animation = runAiStageAnimation(
      setStageIndex,
      reducedMotion,
      stageCount
    );

    try {
      const [, session] = await Promise.all([
        animation,
        pipeline.run({
          resumeText: regenerateSource.resumeText,
          linkedInUrl: regenerateSource.linkedInUrl,
          locale: aiLocale,
        }),
      ]);
      setStageIndex(stageCount - 1);
      setCandidate({
        ...session,
        id: candidate.id,
        roleTitle: candidate.roleTitle,
        resume: {
          ...session.resume,
          name: candidate.resume.name || session.resume.name,
          email: candidate.resume.email || session.resume.email,
          phone: candidate.resume.phone || session.resume.phone,
        },
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      await animation.catch(() => undefined);
      setHydrateError(
        formatTalentApiError(err, {
          missingApiKey: t.ai.errors.missingApiKey,
          rateLimited: t.ai.errors.rateLimited,
          generic: t.recruiter.notices.analyzeFailedGeneric,
        })
      );
    } finally {
      setTimeout(() => setProcessing(false), reducedMotion ? 0 : 400);
    }
  }, [
    aiLocale,
    candidate.id,
    candidate.resume.email,
    candidate.resume.name,
    candidate.resume.phone,
    candidate.roleTitle,
    pipeline,
    reducedMotion,
    regenerateSource,
    setCandidate,
    stageCount,
    t.ai.errors,
    t.recruiter.notices.analyzeFailedGeneric,
  ]);

  const metrics = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => !analyzedIds.has(a.id)).length;
    const atsValues = Object.values(atsById);
    const avgAts =
      atsValues.length > 0
        ? Math.round(
            atsValues.reduce((sum, n) => sum + n, 0) / atsValues.length
          )
        : analyzedIds.size > 0
          ? Math.round(scores.atsScore)
          : null;
    const interviews = analyzedIds.size;
    const m = t.recruiter.metrics;

    return [
      {
        label: m.applications.label,
        value: formatNumber(total),
        hint: m.applications.hint,
      },
      {
        label: m.pendingReview.label,
        value: formatNumber(pending),
        hint: m.pendingReview.hint,
      },
      {
        label: m.averageAtsMatch.label,
        value: avgAts === null ? t.common.emptyValue : formatPercent(avgAts),
        hint: analyzedIds.size
          ? m.averageAtsMatch.hintAnalyzed
          : m.averageAtsMatch.hintEmpty,
      },
      {
        label: m.interviewsSuggested.label,
        value: formatNumber(interviews),
        hint: m.interviewsSuggested.hint,
      },
    ];
  }, [
    applications,
    analyzedIds,
    atsById,
    scores.atsScore,
    t.recruiter.metrics,
    t.common.emptyValue,
    formatNumber,
    formatPercent,
  ]);

  const insights = [
    fit.matchPoints[0],
    evaluation.strengths[0],
    analysis.topStrengths[0],
  ].filter(Boolean);

  const scoresCatalog = t.recruiter.scores;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <DashboardMetrics metrics={metrics} />

      <ApplicationsList
        selectedId={selectedId}
        analyzedIds={analyzedIds}
        atsById={atsById}
        onSelect={onSelectApplication}
        busyId={busyId}
        onLoaded={onLoaded}
      />

      <AiProcessingPanel active={processing} stageIndex={stageIndex} />

      {hydrateNotice && !processing ? (
        <p
          className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 text-sm"
          role="status"
        >
          {hydrateNotice}
        </p>
      ) : null}
      {hydrateError ? (
        <p className="mb-4 text-sm text-[var(--danger)]" role="alert">
          {hydrateError}
        </p>
      ) : null}

      {!processing && candidate.analysisLanguage !== locale ? (
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 text-sm"
          role="status"
        >
          <span>
            {formatMessage(t.recruiter.analysisLanguage.generatedIn, {
              language: locales[candidate.analysisLanguage].nativeLabel,
            })}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRegenerate}
            disabled={pipeline.active}
          >
            {formatMessage(t.recruiter.analysisLanguage.regenerateIn, {
              language: locales[locale].nativeLabel,
            })}
          </Button>
        </div>
      ) : null}

      <header className="mb-8 flex flex-col gap-6 border-b border-[var(--border)] pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            {t.recruiter.dashboard.hiringReport}
          </p>
          <h1 className="mt-2 truncate font-heading text-3xl tracking-tight sm:text-4xl">
            {resume.name ?? t.recruiter.dashboard.candidateFallback}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            {formatMessage(t.recruiter.dashboard.roleContext, {
              role: candidate.roleTitle,
            })}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <RecommendationBadge
              value={evaluation.hiringRecommendation}
              label={recommendationLabel(evaluation.hiringRecommendation, t)}
            />
            <time
              dateTime={candidate.updatedAt}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]"
            >
              {t.recruiter.dashboard.updatedPrefix}{" "}
              {formatDate(candidate.updatedAt, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <Button
            variant="ghost"
            size="sm"
            className="self-start sm:hidden"
            onClick={() => setOpen(true)}
          >
            {t.recruiter.dashboard.commands}
          </Button>
          <ExportBar />
        </div>
      </header>

      <FadeIn className="mb-6">
        <aside
          aria-label={t.recruiter.dashboard.insightsAriaLabel}
          className="grid gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:grid-cols-3"
        >
          {insights.map((insight, index) => (
            <div
              key={`${insight}-${index}`}
              className="rounded-xl bg-[var(--background)]/70 px-4 py-3 transition hover:bg-[var(--accent-soft)]"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                {formatMessage(t.recruiter.dashboard.insightLabel, {
                  index: index + 1,
                })}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-[var(--foreground)]">
                {insight}
              </p>
            </div>
          ))}
        </aside>
      </FadeIn>

      <section
        className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
        aria-label={t.recruiter.dashboard.scoreOverviewAriaLabel}
      >
        <OverviewCard
          label={scoresCatalog.overall.label}
          value={scores.overallScore}
          icon={Sparkles}
          accent="teal"
          hint={scoresCatalog.overall.hint}
          delay={0}
        />
        <OverviewCard
          label={scoresCatalog.aiConfidence.label}
          value={scores.aiConfidence}
          icon={Brain}
          accent="blue"
          hint={scoresCatalog.aiConfidence.hint}
          delay={0.04}
        />
        <OverviewCard
          label={scoresCatalog.ats.label}
          value={scores.atsScore}
          icon={FileSearch}
          accent="cyan"
          hint={scoresCatalog.ats.hint}
          delay={0.08}
        />
        <OverviewCard
          label={scoresCatalog.technical.label}
          value={scores.technicalScore}
          icon={Activity}
          accent="slate"
          hint={scoresCatalog.technical.hint}
          delay={0.12}
        />
        <OverviewCard
          label={scoresCatalog.communication.label}
          value={scores.communicationScore}
          icon={MessageSquareText}
          accent="amber"
          hint={scoresCatalog.communication.hint}
          delay={0.16}
        />
      </section>

      <section className="dashboard-grid mb-6">
        <div className="lg:col-span-5">
          <CandidateRadarChart data={candidate.radar} />
        </div>
        <div className="lg:col-span-7">
          <SkillMatrix skills={candidate.skillMatrix} />
        </div>
      </section>

      <section className="dashboard-grid mb-6">
        <div className="lg:col-span-5">
          <CandidateTimeline events={candidate.timeline} />
        </div>
        <div className="space-y-5 lg:col-span-7">
          <ResumeSummary resume={resume} analysis={analysis} />
          <ProjectsPanel projects={resume.projects} />
        </div>
      </section>

      <section className="mb-6">
        <StrengthsWeaknesses analysis={analysis} />
      </section>

      <section className="mb-6">
        <InterviewQaPanel
          questions={questions}
          answers={answers}
          evaluation={evaluation}
        />
      </section>

      <section className="mb-6">
        <AiEvaluationPanel evaluation={evaluation} fit={fit} />
      </section>

      <section className="mb-12">
        <HiringRecommendationPanel />
      </section>
    </div>
  );
});
