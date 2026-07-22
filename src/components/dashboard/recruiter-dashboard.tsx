"use client";

import dynamic from "next/dynamic";
import { memo, useCallback, useState } from "react";
import {
  Activity,
  Brain,
  FileSearch,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { ApplicationsList } from "@/components/dashboard/applications-list";
import { OverviewCard } from "@/components/dashboard/overview-cards";
import { SkillMatrix } from "@/components/dashboard/skill-matrix";
import { CandidateTimeline } from "@/components/dashboard/timeline";
import { ResumeSummary } from "@/components/dashboard/resume-summary";
import { ProjectsPanel } from "@/components/dashboard/projects-panel";
import { StrengthsWeaknesses } from "@/components/dashboard/strengths-weaknesses";
import { InterviewQaPanel } from "@/components/dashboard/interview-qa";
import { AiEvaluationPanel } from "@/components/dashboard/ai-evaluation";
import { HiringRecommendationPanel } from "@/components/dashboard/hiring-recommendation";
import { ExportBar } from "@/components/dashboard/export-bar";
import { RecommendationBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidateStore } from "@/store/candidate-store";
import { useCommandPalette, useLiveAiPipeline } from "@/hooks";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { DEMO_CANDIDATE } from "@/data/demo-candidate";
import type { Application } from "@/lib/applications/types";
import type { CandidateSession } from "@/types/dashboard";

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
  const { candidate, setCandidate } = useCandidateStore();
  const { setOpen } = useCommandPalette();
  const { scores, resume, analysis, fit, questions, answers, evaluation } =
    candidate;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analyzedIds, setAnalyzedIds] = useState<Set<string>>(() => new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [hydrateNotice, setHydrateNotice] = useState<string | null>(null);
  const [hydrateError, setHydrateError] = useState<string | null>(null);

  const pipeline = useLiveAiPipeline({
    onComplete: (session) => setCandidate(session),
  });

  const onSelectApplication = useCallback(
    async (app: Application) => {
      setSelectedId(app.id);
      setHydrateError(null);
      setBusyId(app.id);

      try {
        if (app.resume.text?.trim()) {
          setHydrateNotice("Running AI analysis on submitted resume…");
          const session = await pipeline.run({
            resumeText: app.resume.text,
            linkedInUrl: app.professional.linkedInUrl,
          });
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
          setAnalyzedIds((prev) => new Set(prev).add(app.id));
          setHydrateNotice(null);
        } else {
          setCandidate(seedFromApplication(app));
          setHydrateNotice(
            "Showing representative demo analysis — resume text unavailable for this application."
          );
        }
      } catch (err) {
        setHydrateError(
          err instanceof Error ? err.message : "Unable to analyze application."
        );
        setCandidate(seedFromApplication(app));
        setHydrateNotice(
          "Live analysis failed — showing representative demo insights for this candidate."
        );
      } finally {
        setBusyId(null);
      }
    },
    [pipeline.run, setCandidate]
  );

  const insights = [
    fit.matchPoints[0],
    evaluation.strengths[0],
    analysis.topStrengths[0],
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <ApplicationsList
        selectedId={selectedId}
        analyzedIds={analyzedIds}
        onSelect={onSelectApplication}
        busyId={busyId}
      />

      {hydrateNotice ? (
        <p
          className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3 text-sm"
          role="status"
        >
          {hydrateNotice}
          {pipeline.active ? ` ${pipeline.stageLabel}` : null}
        </p>
      ) : null}
      {hydrateError ? (
        <p className="mb-4 text-sm text-[var(--danger)]" role="alert">
          {hydrateError}
        </p>
      ) : null}

      <header className="mb-8 flex flex-col gap-6 border-b border-[var(--border)] pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Hiring report
          </p>
          <h1 className="mt-2 truncate font-heading text-3xl tracking-tight sm:text-4xl">
            {resume.name ?? "Candidate"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            {candidate.roleTitle} · calibrated against must-haves, interview
            depth, and communication signal.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <RecommendationBadge value={evaluation.hiringRecommendation} />
            <time
              dateTime={candidate.updatedAt}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]"
            >
              Updated {new Date(candidate.updatedAt).toLocaleString()}
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
            Commands
          </Button>
          <ExportBar />
        </div>
      </header>

      <FadeIn className="mb-6">
        <aside
          aria-label="Interactive insights"
          className="grid gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 sm:grid-cols-3"
        >
          {insights.map((insight, index) => (
            <div
              key={`${insight}-${index}`}
              className="rounded-xl bg-[var(--background)]/70 px-4 py-3 transition hover:bg-[var(--accent-soft)]"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                Insight 0{index + 1}
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
        aria-label="Score overview"
      >
        <OverviewCard
          label="Overall"
          value={scores.overallScore}
          icon={Sparkles}
          accent="teal"
          hint="Composite hiring bar"
          delay={0}
        />
        <OverviewCard
          label="AI Confidence"
          value={scores.aiConfidence}
          icon={Brain}
          accent="blue"
          hint="Fit certainty"
          delay={0.04}
        />
        <OverviewCard
          label="ATS"
          value={scores.atsScore}
          icon={FileSearch}
          accent="cyan"
          hint="Resume structure"
          delay={0.08}
        />
        <OverviewCard
          label="Technical"
          value={scores.technicalScore}
          icon={Activity}
          accent="slate"
          hint="Interview depth"
          delay={0.12}
        />
        <OverviewCard
          label="Communication"
          value={scores.communicationScore}
          icon={MessageSquareText}
          accent="amber"
          hint="Decision framing"
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
