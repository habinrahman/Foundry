"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Brain,
  Cloud,
  Cog,
  Globe2,
  GraduationCap,
  Laptop,
  Layers,
  Sparkles,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { CareersHeroVisual } from "@/components/careers/hero-visual";
import { HiringProcess } from "@/components/careers/hiring-process";
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

const SECTION_SPACE = "py-24 sm:py-28 lg:py-36";

const WHY = [
  {
    icon: Brain,
    title: "AI-first engineering",
    body: "Models, agents, and evaluation are part of the product—not a side experiment.",
  },
  {
    icon: Cog,
    title: "Real-world impact",
    body: "Your work reaches manufacturers who need clearer decisions on the floor.",
  },
  {
    icon: Layers,
    title: "Ownership",
    body: "Small teams, clear outcomes, and room to shape architecture and craft.",
  },
  {
    icon: Globe2,
    title: "Global collaboration",
    body: "Remote-friendly culture with asynchronous writing and crisp reviews.",
  },
  {
    icon: GraduationCap,
    title: "Continuous learning",
    body: "Budget and time for deep work, papers, and shipping what you learn.",
  },
] as const;

const CULTURE = [
  { title: "Ship quickly", body: "Tight loops from idea to production signal." },
  {
    title: "Build responsibly",
    body: "Reliability, privacy, and trust are product features.",
  },
  {
    title: "Learn continuously",
    body: "Curiosity is expected; teaching is celebrated.",
  },
  { title: "Own outcomes", body: "We measure impact, not ticket volume." },
] as const;

const BUILD = [
  { icon: Brain, label: "LLMs" },
  { icon: Sparkles, label: "AI agents" },
  { icon: Wrench, label: "Developer tools" },
  { icon: Cog, label: "Automation" },
  { icon: Cloud, label: "Cloud" },
  { icon: Boxes, label: "Scalable systems" },
  { icon: Layers, label: "Manufacturing intelligence" },
] as const;

const BENEFITS = [
  {
    icon: Globe2,
    title: "Remote friendly",
    body: "Work from where you do your best thinking.",
  },
  {
    icon: Laptop,
    title: "Flexible hours",
    body: "Overlap matters; rigid presence does not.",
  },
  {
    icon: GraduationCap,
    title: "Learning budget",
    body: "Courses, books, and conferences supported.",
  },
  {
    icon: Wallet,
    title: "Competitive compensation",
    body: "Salary and equity aligned with impact.",
  },
  {
    icon: Laptop,
    title: "Top equipment",
    body: "The tools you need to ship without friction.",
  },
  {
    icon: Users,
    title: "Global team",
    body: "Diverse collaborators across time zones.",
  },
] as const;

function CareersLandingInner() {
  const featured = getFeaturedRoles();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="landing-noise absolute inset-0" />
        <div className="landing-orb-1 absolute -left-[10%] top-0 h-[480px] w-[480px] rounded-full opacity-50 blur-[110px]" />
        <div className="landing-orb-2 absolute -right-[8%] top-[18%] h-[420px] w-[420px] rounded-full opacity-40 blur-[110px]" />
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
                Build AI that transforms manufacturing.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                Join engineers who turn models into durable product—grounded in
                real operations, measured by quality, and shipped with care.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
              <Link href="/apply">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-12 rounded-full px-7 shadow-[var(--accent-glow)] transition hover:shadow-[var(--accent-glow-hover)]"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/careers">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 rounded-full px-7"
                >
                  View Engineering Roles
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
        eyebrow="Why Tamm"
        title="Engineers who want depth and leverage."
        description={`At ${CAREERS_COMPANY}, you work on AI that has to earn trust in complex physical environments—not demos that disappear after a launch post.`}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((item) => (
            <GlassCard key={item.title} className="h-full">
              <item.icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
              <h3 className="mt-5 font-heading text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        id="engineering"
        className={SECTION_SPACE}
        eyebrow="Engineering culture"
        title="How we build."
        description="A culture that values speed with judgment—and learning in public inside the team."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CULTURE.map((item, i) => (
            <GlassCard key={item.title} hover={false}>
              <p className="font-mono text-xs text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-heading text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        id="life"
        className={SECTION_SPACE}
        eyebrow="Life at Tamm"
        title="Calm intensity."
        description="We protect focus time, write things down, and celebrate shipping that makes operators’ days easier."
      >
        <GlassCard shine className="max-w-3xl">
          <p className="text-base leading-relaxed text-[var(--foreground)] sm:text-lg">
            Expect thoughtful design reviews, honest postmortems, and teammates
            who care about both craft and clarity. Remote-first does not mean
            disconnected—it means intentional.
          </p>
        </GlassCard>
      </Section>

      <Section
        id="build"
        className={SECTION_SPACE}
        eyebrow="What you'll build"
        title="The technical surface area."
        description="From model interfaces to cloud systems—manufacturing intelligence needs the full stack."
      >
        <ul className="flex flex-wrap gap-3">
          {BUILD.map((item) => (
            <li
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm shadow-[var(--shadow)] transition hover:-translate-y-0.5"
            >
              <item.icon className="h-4 w-4 text-[var(--accent)]" aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="benefits"
        className={SECTION_SPACE}
        eyebrow="Benefits"
        title="Support for serious work."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow)] transition hover:-translate-y-1 hover:border-[var(--border-strong)]"
            >
              <item.icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
              <h3 className="mt-5 font-heading text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="process"
        className={SECTION_SPACE}
        eyebrow="Hiring process"
        title="Clear steps. No mystery theater."
        description="We respect your time with a transparent path from application to offer."
      >
        <HiringProcess />
      </Section>

      <Section
        id="roles"
        className={SECTION_SPACE}
        eyebrow="Open roles"
        title="Engineering opportunities."
        description="Start with a role that matches your craft—every application is reviewed carefully."
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
              See all open roles
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </Section>

      <section className={`relative px-4 sm:px-6 lg:px-8 ${SECTION_SPACE}`}>
        <div className="mx-auto max-w-[1200px]">
          <GlassCard
            shine
            className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"
          >
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                Ready to build with us?
              </h2>
              <p className="mt-4 text-[var(--muted)]">
                Apply in minutes. Our recruiting team reviews every submission.
              </p>
            </div>
            <Link href="/apply">
              <Button
                variant="primary"
                size="lg"
                className="rounded-full px-7 shadow-[var(--accent-glow)]"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-heading text-lg tracking-tight">{CAREERS_NAME}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              Engineering careers at {CAREERS_COMPANY}. Build AI for the
              physical world.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Engineering
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
              <li>
                <Link href="/careers" className="hover:text-[var(--foreground)]">
                  Open Roles
                </Link>
              </li>
              <li>
                <a href="#process" className="hover:text-[var(--foreground)]">
                  Hiring Process
                </a>
              </li>
              <li>
                <a href="#why" className="hover:text-[var(--foreground)]">
                  About
                </a>
              </li>
              <li>
                <Link href="/apply" className="hover:text-[var(--foreground)]">
                  Apply
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              Company
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
              <li>
                <span className="cursor-default">Privacy</span>
              </li>
              <li>
                <span className="cursor-default">Accessibility</span>
              </li>
              <li>
                <a
                  href="mailto:careers@example.com"
                  className="hover:text-[var(--foreground)]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1200px] flex-col gap-2 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {CAREERS_COMPANY}</p>
          <p className="text-xs">Built for engineers who ship.</p>
        </div>
      </footer>
    </div>
  );
}

export function CareersLandingPage() {
  return <CareersLandingInner />;
}
