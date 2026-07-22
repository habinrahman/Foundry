"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Cog,
  Globe2,
  GraduationCap,
  Layers,
} from "lucide-react";
import { BuildingFoundry } from "@/components/careers/building-foundry";
import { CareersBenefits } from "@/components/careers/careers-benefits";
import { CareersFaq } from "@/components/careers/careers-faq";
import { CareersFooter } from "@/components/careers/careers-footer";
import { EngineeringChallenges } from "@/components/careers/engineering-challenges";
import { EngineeringPhilosophy } from "@/components/careers/engineering-philosophy";
import { FoundryBridge } from "@/components/careers/foundry-bridge";
import { FoundryPipeline } from "@/components/careers/foundry-pipeline";
import { CareersHeroVisual } from "@/components/careers/hero-visual";
import { HiringComparison } from "@/components/careers/hiring-comparison";
import { HiringTimeline } from "@/components/careers/hiring-timeline";
import { JobCard } from "@/components/careers/job-card";
import { CareersSocialProof } from "@/components/careers/social-proof";
import {
  GlassCard,
  Reveal,
  Section,
} from "@/components/landing/primitives";
import { Button } from "@/components/ui/button";
import { CAREERS_ROLES, getFeaturedRoles } from "@/data/careers/roles";
import { CAREERS_COMPANY, CAREERS_NAME } from "@/lib/careers-site";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";

const SECTION_SPACE = "py-24 sm:py-28 lg:py-36";

const WHY_ICONS = [Brain, Cog, Layers, Globe2, GraduationCap] as const;

function CareersLandingInner() {
  const featured = getFeaturedRoles();
  const { t } = useLocale();
  const careers = t.careers;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="landing-noise absolute inset-0" />
        <div className="landing-orb-1 absolute -start-[10%] top-0 h-[480px] w-[480px] rounded-full opacity-50 blur-[110px]" />
        <div className="landing-orb-2 absolute -end-[8%] top-[18%] h-[420px] w-[420px] rounded-full opacity-40 blur-[110px]" />
      </div>

      <section className="relative px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pb-36 lg:pt-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                {CAREERS_NAME}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 max-w-[14ch] font-heading text-[2.6rem] leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]">
                {careers.hero.title}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                {careers.hero.description}
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
              <Link href="/apply">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-12 rounded-full px-7 shadow-[var(--accent-glow)] transition hover:shadow-[var(--accent-glow-hover)]"
                >
                  {careers.hero.applyNow}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </Button>
              </Link>
              <Link href="/careers">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 rounded-full px-7"
                >
                  {careers.hero.viewRoles}
                </Button>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <CareersHeroVisual />
          </Reveal>
        </div>
      </section>

      <CareersSocialProof />

      <Section
        id="why"
        className={SECTION_SPACE}
        eyebrow={careers.why.eyebrow}
        title={careers.why.title}
        description={formatMessage(careers.why.description, {
          company: CAREERS_COMPANY,
        })}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {careers.why.items.map((item, i) => {
            const Icon = WHY_ICONS[i];
            return (
              <GlassCard key={item.title} className="h-full">
                <Icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
                <h3 className="mt-5 font-heading text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </Section>

      <EngineeringPhilosophy className={SECTION_SPACE} />

      <EngineeringChallenges className={SECTION_SPACE} />

      <FoundryBridge />

      <BuildingFoundry className={SECTION_SPACE} />

      <FoundryPipeline className={SECTION_SPACE} />

      <HiringComparison className={SECTION_SPACE} />

      <HiringTimeline className={SECTION_SPACE} />

      <CareersBenefits className={SECTION_SPACE} />

      <Section
        id="roles"
        className={SECTION_SPACE}
        eyebrow={careers.roles.eyebrow}
        title={careers.roles.title}
        description={careers.roles.description}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {featured.map((role) => (
            <JobCard key={role.slug} role={role} featured />
          ))}
          {CAREERS_ROLES.filter((r) => !r.featured)
            .slice(0, 2)
            .map((role) => (
              <JobCard key={role.slug} role={role} />
            ))}
        </div>
        <div className="mt-10">
          <Link href="/careers">
            <Button variant="secondary" className="rounded-full px-5">
              {careers.roles.seeAll}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
            </Button>
          </Link>
        </div>
      </Section>

      <CareersFaq className={SECTION_SPACE} />

      <section className={`relative px-4 sm:px-6 lg:px-8 ${SECTION_SPACE}`}>
        <div className="mx-auto max-w-[1200px]">
          <GlassCard
            shine
            className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"
          >
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                {careers.cta.title}
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                {careers.cta.description}
              </p>
            </div>
            <Link href="/apply">
              <Button
                variant="primary"
                size="lg"
                className="rounded-full px-7 shadow-[var(--accent-glow)]"
              >
                {careers.cta.applyNow}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>

      <CareersFooter />
    </div>
  );
}

export function CareersLandingPage() {
  return <CareersLandingInner />;
}
