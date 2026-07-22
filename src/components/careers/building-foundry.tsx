"use client";

import { Reveal, Section } from "@/components/landing/primitives";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import { ApplicationTimelineMockup } from "./mockups/application-timeline";
import { AtsAnalysisMockup } from "./mockups/ats-analysis";
import { HiringRecommendationMockup } from "./mockups/hiring-recommendation";
import { InterviewGenerationMockup } from "./mockups/interview-generation";
import { RecruiterDashboardMockup } from "./mockups/recruiter-dashboard";
import { ResumeIntelligenceMockup } from "./mockups/resume-intelligence";

/** Ordered to match `t.careers.foundryShowcase.beats` — one platform
 * unfolding: resume enters -> AI understands -> AI evaluates -> recruiter
 * collaborates -> AI recommends -> everything becomes traceable. */
const MOCKUPS = [
  ResumeIntelligenceMockup,
  AtsAnalysisMockup,
  RecruiterDashboardMockup,
  InterviewGenerationMockup,
  HiringRecommendationMockup,
  ApplicationTimelineMockup,
] as const;

export function BuildingFoundry({ className }: { className?: string }) {
  const { t } = useLocale();
  const showcase = t.careers.foundryShowcase;

  return (
    <Section
      id="foundry"
      className={className}
      eyebrow={showcase.eyebrow}
      title={showcase.title}
      description={showcase.description}
    >
      <div className="space-y-20 lg:space-y-28">
        {showcase.beats.map((beat, index) => {
          const Mockup = MOCKUPS[index];
          const mockFirst = index % 2 === 0;

          return (
            <Reveal key={beat.id} delay={0.05}>
              <div
                className={cn(
                  "flex flex-col gap-8 lg:items-center lg:gap-16",
                  mockFirst ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                <div className="lg:w-[55%]">
                  <span className="sr-only">{beat.ariaLabel}</span>
                  <div aria-hidden>
                    <Mockup />
                  </div>
                </div>
                <div className="lg:w-[45%]">
                  <span className="font-mono text-xs text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                    {beat.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
                    {beat.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
