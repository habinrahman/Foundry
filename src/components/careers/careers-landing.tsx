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
import {
  GlassCard,
  Reveal,
  Section,
} from "@/components/landing/primitives";
import { Button } from "@/components/ui/button";
import { CAREERS_ROLES, getFeaturedRoles } from "@/data/careers/roles";
import { CAREERS_COMPANY, CAREERS_NAME } from "@/lib/careers-site";

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
  { title: "Build responsibly", body: "Reliability, privacy, and trust are product features." },
  { title: "Learn continuously", body: "Curiosity is expected; teaching is celebrated." },
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
  { icon: Globe2, title: "Remote friendly", body: "Work from where you do your best thinking." },
  { icon: Laptop, title: "Flexible hours", body: "Overlap matters; rigid presence does not." },
  { icon: GraduationCap, title: "Learning budget", body: "Courses, books, and conferences supported." },
  { icon: Wallet, title: "Competitive compensation", body: "Salary and equity aligned with impact." },
  { icon: Laptop, title: "Top equipment", body: "The tools you need to ship without friction." },
  { icon: Users, title: "Global team", body: "Diverse collaborators across time zones." },
] as const;

function CareersLandingInner() {
  const featured = getFeaturedRoles();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="landing-noise absolute inset-0" />
        <div className="landing-orb-1 absolute -left-[10%] top-0 h-[420px] w-[420px] rounded-full opacity-50 blur-[100px]" />
        <div className="landing-orb-2 absolute -right-[8%] top-[12%] h-[380px] w-[380px] rounded-full opacity-40 blur-[100px]" />
      </div>

      <section className="relative px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                {CAREERS_NAME}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 max-w-[14ch] font-heading text-[2.6rem] leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]">
                Build AI that transforms manufacturing.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                Join engineers who turn models into durable product—grounded in
                real operations, measured by quality, and shipped with care.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-9 flex flex-wrap gap-3">
              <Link href="/apply">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-12 rounded-full px-7 shadow-[var(--accent-glow)]"
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
                  View Open Roles
                </Button>
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <CareersHeroVisual />
          </Reveal>
        </div>
      </section>

      <Section
        id="why"
        eyebrow="Why Tamm"
        title="Engineers who want depth and leverage."
        description={`At ${CAREERS_COMPANY}, you work on AI that has to earn trust in complex physical environments—not demos that disappear after a launch post.`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((item) => (
            <GlassCard key={item.title} className="h-full">
              <item.icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        id="engineering"
        eyebrow="Engineering culture"
        title="How we build."
        description="A culture that values speed with judgment—and learning in public inside the team."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CULTURE.map((item, i) => (
            <GlassCard key={item.title} hover={false}>
              <p className="font-mono text-xs text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-heading text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section
        id="life"
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
        eyebrow="What you'll build"
        title="The technical surface area."
        description="From model interfaces to cloud systems—manufacturing intelligence needs the full stack."
      >
        <ul className="flex flex-wrap gap-3">
          {BUILD.map((item) => (
            <li
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm shadow-[var(--shadow)]"
            >
              <item.icon className="h-4 w-4 text-[var(--accent)]" aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="benefits"
        eyebrow="Benefits"
        title="Support for serious work."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]"
            >
              <item.icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
              <h3 className="mt-4 font-heading text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="process"
        eyebrow="Hiring process"
        title="Clear steps. No mystery theater."
        description="We respect your time with a transparent path from application to offer."
      >
        <HiringProcess />
      </Section>

      <Section
        id="roles"
        eyebrow="Open roles"
        title="Engineering opportunities."
        description="Start with a role that matches your craft—every application is reviewed carefully."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {featured.map((role) => (
            <JobCard key={role.slug} role={role} featured />
          ))}
          {CAREERS_ROLES.filter((r) => !r.featured)
            .slice(0, 2)
            .map((role) => (
              <JobCard key={role.slug} role={role} />
            ))}
        </div>
        <div className="mt-8">
          <Link href="/careers">
            <Button variant="secondary" className="rounded-full px-5">
              See all open roles
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </Section>

      <section className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <GlassCard shine className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl tracking-tight sm:text-4xl">
                Ready to build with us?
              </h2>
              <p className="mt-3 text-[var(--muted)]">
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

      <footer className="border-t border-[var(--border)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading text-sm tracking-tight">{CAREERS_NAME}</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
            <Link href="/careers" className="hover:text-[var(--foreground)]">
              Open roles
            </Link>
            <Link href="/apply" className="hover:text-[var(--foreground)]">
              Apply
            </Link>
            <a href="#why" className="hover:text-[var(--foreground)]">
              About
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function CareersLandingPage() {
  return <CareersLandingInner />;
}
