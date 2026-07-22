"use client";

import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileSearch,
  Lock,
  MessageSquare,
  Radar,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import { GlassCard, Reveal, Section } from "@/components/landing/primitives";
import { Button } from "@/components/ui/button";
import { AI_PIPELINE_STAGES } from "@/hooks/use-live-ai-pipeline";
import { APP_NAME } from "@/lib/site";

const PROBLEMS = [
  "Hiring loops scatter across spreadsheets, notes, and ad-hoc AI prompts.",
  "Recruiters lack calibrated signal across resume, interview, and fit.",
  "Executive reports take hours to assemble — if they get assembled at all.",
] as const;

const CAPABILITIES = [
  {
    icon: FileSearch,
    title: "Resume parsing",
    body: "Structured extraction with Zod-validated Gemini outputs.",
  },
  {
    icon: Brain,
    title: "Adaptive interviews",
    body: "Ten role-calibrated technical questions per candidate.",
  },
  {
    icon: Radar,
    title: "Executive dashboard",
    body: "Radar, skill matrix, timeline, and hiring recommendation.",
  },
  {
    icon: MessageSquare,
    title: "Answer evaluation",
    body: "Per-question scores with strengths, gaps, and rationale.",
  },
  {
    icon: Workflow,
    title: "Live AI pipeline",
    body: "Parse → analyze → fit → questions on a real server path.",
  },
  {
    icon: Shield,
    title: "Export suite",
    body: "PDF, Markdown, JSON, and CSV — client-side, instant.",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Upload",
    body: "Drop a PDF or DOCX. Foundry extracts text server-side.",
  },
  {
    step: "02",
    title: "Analyze",
    body: "Gemini parses, scores ATS fit, and generates rationale.",
  },
  {
    step: "03",
    title: "Interview",
    body: "Adaptive technical questions tailored to the target role.",
  },
  {
    step: "04",
    title: "Decide",
    body: "Open the recruiter dashboard and export the hiring report.",
  },
] as const;

const EXPORTS = ["PDF", "Markdown", "JSON", "CSV"] as const;

const SECURITY = [
  "API keys stay server-side — never exposed to the browser.",
  "Security headers on every route via Next.js and Vercel.",
  "Demo runs in-memory; no persistence without your infrastructure.",
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Finally a hiring product where the AI layer is real — not just a loading animation.",
    role: "Demo · VP Engineering",
  },
  {
    quote:
      "The executive dashboard reads like something our board would actually review.",
    role: "Demo · Head of Talent",
  },
] as const;

const FAQ = [
  {
    q: "Does Foundry require a Gemini API key?",
    a: "The live candidate pipeline and /api/ai/* routes require GEMINI_API_KEY. The recruiter dashboard can load seeded demo data without a key.",
  },
  {
    q: "Is candidate data persisted?",
    a: "This demo keeps sessions in memory only. Refresh resets unless you wire persistence.",
  },
  {
    q: "Can I export hiring reports?",
    a: "Yes — PDF, Markdown, JSON, and CSV from the recruiter dashboard or command palette.",
  },
  {
    q: "What role does Foundry evaluate against?",
    a: "AI Product Engineer (Mid–Senior) by default, defined in src/constants/role.ts.",
  },
] as const;

const PIPELINE = AI_PIPELINE_STAGES.map((s) => s.replace(/\.\.\.$/, ""));

export function LandingSections() {
  return (
    <>
      <Section
        id="problem"
        eyebrow="The problem"
        title="Hiring is too slow to stay subjective."
        description="Foundry compresses resume intelligence, interview design, and executive reporting into one calm, keyboard-first workflow."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {PROBLEMS.map((item, i) => (
            <Reveal key={item} delay={0.05 * i}>
              <GlassCard>
                <p className="font-mono text-xs text-[var(--accent)]">0{i + 1}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{item}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="workflow"
        eyebrow="AI workflow"
        title="From resume to recommendation — live."
        description="A server-side pipeline you can call today. The UI runs it end-to-end when GEMINI_API_KEY is configured."
      >
        <Reveal>
          <GlassCard shine className="overflow-x-auto p-4 sm:p-8">
            <ol className="flex min-w-[640px] flex-col gap-0 sm:min-w-0 sm:flex-row sm:items-stretch sm:justify-between">
              {PIPELINE.map((stage, i) => (
                <li key={stage} className="relative flex flex-1 flex-col items-center px-2 text-center">
                  {i < PIPELINE.length - 1 ? (
                    <span
                      className="absolute left-[calc(50%+20px)] top-5 hidden h-px w-[calc(100%-40px)] bg-gradient-to-r from-[var(--accent)]/50 to-transparent sm:block"
                      aria-hidden
                    />
                  ) : null}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] font-mono text-xs text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <p className="mt-3 text-xs font-medium leading-snug text-[var(--foreground)] sm:text-sm">
                    {stage}
                  </p>
                </li>
              ))}
            </ol>
          </GlassCard>
        </Reveal>
      </Section>

      <Section
        id="capabilities"
        eyebrow="Capabilities"
        title="Everything a hiring team needs. Nothing they don't."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <Reveal key={cap.title} delay={0.04 * i}>
              <GlassCard className="h-full">
                <cap.icon className="h-5 w-5 text-[var(--accent)]" aria-hidden />
                <h3 className="mt-4 font-heading text-lg font-semibold">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{cap.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="how"
        eyebrow="How it works"
        title="Four steps. One hiring loop."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.step} delay={0.05 * i}>
              <GlassCard>
                <p className="font-mono text-sm text-[var(--accent)]">{step.step}</p>
                <h3 className="mt-3 font-heading text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{step.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="candidate"
        eyebrow="Candidate experience"
        title="A conversation, not a form."
        description="Upload a resume, watch the pipeline run, and receive a fit narrative — with typewriter pacing and live progress."
      >
        <Reveal>
          <GlassCard shine className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                Drag-and-drop PDF/DOCX, optional LinkedIn, and a staged AI analysis that
                calls Foundry&apos;s live endpoints when configured.
              </p>
            </div>
            <Link href="/candidate">
              <Button variant="primary" className="rounded-full px-6">
                Open candidate flow
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </GlassCard>
        </Reveal>
      </Section>

      <Section
        id="recruiter"
        eyebrow="Recruiter experience"
        title="An executive report, not a spreadsheet."
        description="Scores, radar, skill matrix, interview Q&A, and optimistic hiring recommendation overrides."
      >
        <Reveal>
          <GlassCard shine className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                Keyboard-first navigation, command palette exports, and lazy-loaded charts
                that stay fast on first paint.
              </p>
            </div>
            <Link href="/recruiter">
              <Button variant="primary" className="rounded-full px-6">
                Open dashboard
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          </GlassCard>
        </Reveal>
      </Section>

      <Section
        id="architecture"
        eyebrow="AI architecture"
        title="Deep modules. Clean seams."
        description="TalentAI facade → Gemini provider → Zod contracts. UI and API stay decoupled until you wire them."
      >
        <Reveal>
          <GlassCard className="font-mono text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
            <pre className="overflow-x-auto whitespace-pre text-[var(--foreground)]/90">
{`Client UI
    │
    ▼
POST /api/ai/extract-text
    │
    ▼
parse → analyze → fit → questions → evaluate
    │
    ▼
CandidateSession → Recruiter Dashboard`}
            </pre>
          </GlassCard>
        </Reveal>
      </Section>

      <Section id="exports" eyebrow="Exports" title="Ship the report anywhere.">
        <div className="flex flex-wrap gap-3">
          {EXPORTS.map((format, i) => (
            <Reveal key={format} delay={0.04 * i}>
              <span className="landing-glass rounded-full px-5 py-2.5 text-sm font-medium">
                {format}
              </span>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="security" eyebrow="Security" title="Built for production discipline.">
        <ul className="grid gap-4 lg:grid-cols-3">
          {SECURITY.map((item, i) => (
            <Reveal key={item} delay={0.05 * i}>
              <GlassCard className="flex gap-3">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
                <p className="text-sm text-[var(--muted)]">{item}</p>
              </GlassCard>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="testimonials" eyebrow="Voices" title="Built for teams who ship.">
        <p className="-mt-8 mb-8 text-xs text-[var(--muted)]">Demo testimonials — illustrative only.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.quote} delay={0.06 * i}>
              <GlassCard>
                <p className="text-base leading-relaxed text-[var(--foreground)]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-4 text-xs text-[var(--muted)]">{t.role}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Common questions.">
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={0.03 * i}>
              <details className="landing-glass group rounded-2xl px-6 py-4 open:bg-[var(--surface-elevated)]">
                <summary className="cursor-pointer list-none font-medium text-[var(--foreground)] marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <GlassCard
            shine
            className="mx-auto flex max-w-[1200px] flex-col items-center px-6 py-16 text-center sm:px-12"
          >
            <Sparkles className="h-8 w-8 text-[var(--accent)]" aria-hidden />
            <h2 className="mt-6 max-w-xl font-heading text-3xl tracking-tight sm:text-4xl">
              Ready to hire with clarity?
            </h2>
            <p className="mt-4 max-w-md text-sm text-[var(--muted)] sm:text-base">
              Run the live pipeline on a resume, or explore the executive dashboard with
              demo data — no setup required.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/candidate">
                <Button variant="primary" size="lg" className="rounded-full px-8">
                  Get started
                </Button>
              </Link>
              <Link href="/recruiter">
                <Button variant="secondary" size="lg" className="rounded-full px-8">
                  View demo report
                </Button>
              </Link>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      <footer className="border-t border-[var(--border)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-heading text-lg font-semibold">{APP_NAME}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">AI Hiring Intelligence Platform</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
            <Link href="/candidate" className="transition hover:text-[var(--foreground)]">
              Candidate
            </Link>
            <Link href="/recruiter" className="transition hover:text-[var(--foreground)]">
              Recruiter
            </Link>
            <a href="#faq" className="transition hover:text-[var(--foreground)]">
              FAQ
            </a>
          </nav>
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} {APP_NAME}
          </p>
        </div>
      </footer>
    </>
  );
}
