"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { OrbitIllustration } from "@/components/illustrations/orbit";
import { FadeIn } from "@/components/motion/fade-in";
import { TypewriterText } from "@/components/motion/typewriter-text";
import { Button } from "@/components/ui/button";
import { useCommandPalette, usePrefersReducedMotion } from "@/hooks";
import { APP_NAME } from "@/lib/site";

const FEATURES = [
  {
    title: "Resume intelligence",
    body: "Structured extraction, ATS scoring, and calibrated recommendations.",
  },
  {
    title: "Adaptive interviews",
    body: "Ten technical questions tailored to stack and seniority.",
  },
  {
    title: "Executive dashboard",
    body: "Radar, matrix, timeline, and one-click multi-format export.",
  },
] as const;

const SHORTCUTS = [
  ["⌘K", "Command palette"],
  ["T", "Toggle theme"],
  ["G H", "Home"],
  ["G D", "Dashboard"],
  ["G U", "Upload"],
  ["Esc", "Close"],
] as const;

export function HomePageClient() {
  const { setOpen } = useCommandPalette();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative">
      <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <FadeIn>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent)]">
              {APP_NAME}
            </p>
          </FadeIn>
          <FadeIn delay={0.04}>
            <h1 className="mt-5 max-w-[12ch] font-heading text-[2.75rem] leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
              Hire with AI clarity.
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <TypewriterText
              text="A conversation that turns resumes into executive hiring decisions."
              className="mt-6 max-w-md text-base leading-relaxed text-[var(--muted)] sm:text-lg"
              speedMs={16}
            />
          </FadeIn>
          <FadeIn delay={0.16} className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/candidate">
              <Button variant="primary" size="lg">
                Start conversation
              </Button>
            </Link>
            <Link href="/recruiter">
              <Button variant="secondary" size="lg">
                Recruiter view
                <ArrowUpRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden text-sm text-[var(--muted)] transition hover:text-[var(--foreground)] sm:inline-flex"
            >
              Press ⌘K
            </button>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="relative">
          <motion.div
            animate={reduced ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)]/80 p-3 shadow-[var(--shadow)] backdrop-blur-md"
          >
            <OrbitIllustration className="opacity-95" />
          </motion.div>
        </FadeIn>
      </section>

      <section className="border-y border-[var(--border)]">
        <div className="mx-auto grid max-w-[1200px] gap-px bg-[var(--border)] md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FadeIn key={feature.title} delay={0.04 * index}>
              <article className="h-full bg-[var(--background)] px-6 py-10 transition hover:bg-[var(--surface)] sm:px-8">
                <p className="font-mono text-[11px] text-[var(--accent)]">
                  0{index + 1}
                </p>
                <h2 className="mt-4 font-heading text-2xl tracking-tight">
                  {feature.title}
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
                  {feature.body}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <section
        id="shortcuts"
        className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <FadeIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-3xl tracking-tight">
                Keyboard-first
              </h2>
              <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
                Built for operators who never leave the keyboard.
              </p>
            </div>
          </div>
          <dl className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SHORTCUTS.map(([key, label]) => (
              <div
                key={key}
                className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface-elevated)]"
              >
                <dt className="text-sm text-[var(--muted)] group-hover:text-[var(--foreground)]">
                  {label}
                </dt>
                <dd>
                  <kbd className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 font-mono text-[11px] text-[var(--foreground)]">
                    {key}
                  </kbd>
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </section>
    </div>
  );
}
