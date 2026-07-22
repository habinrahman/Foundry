"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { LandingBackground } from "@/components/landing/background";
import { GlassCard, Reveal, Stat } from "@/components/landing/primitives";
import { Button } from "@/components/ui/button";
import { useCountUp, usePrefersReducedMotion } from "@/hooks";
import { APP_NAME, APP_TAGLINE } from "@/lib/site";
import { AI_PIPELINE_STAGES } from "@/hooks/use-live-ai-pipeline";

const PIPELINE = AI_PIPELINE_STAGES.map((s) => s.replace(/\.\.\.$/, ""));

export function LandingHero() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.3]);

  const statEndpoints = useCountUp(5, 1200);
  const statCapabilities = useCountUp(6, 1400);
  const statQuestions = useCountUp(10, 1600);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-32 lg:pt-20"
    >
      <LandingBackground />

      <div className="relative mx-auto max-w-[1200px]">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs text-[var(--muted)] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden />
            <span className="font-medium text-[var(--foreground)]">{APP_NAME}</span>
            <span className="text-[var(--border-strong)]">·</span>
            <span>{APP_TAGLINE}</span>
          </div>
        </Reveal>

        <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Reveal delay={0.05}>
              <h1 className="max-w-[14ch] font-heading text-[2.75rem] leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.5rem]">
                Hiring intelligence,{" "}
                <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--chart-2)] bg-clip-text text-transparent">
                  engineered.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                Parse resumes, run adaptive interviews, and deliver executive hiring
                reports — with a live AI pipeline recruiters can trust.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/candidate">
                <Button
                  variant="primary"
                  size="lg"
                  className="landing-glass-strong h-12 rounded-full px-7 shadow-[var(--accent-glow)] transition hover:scale-[1.02] hover:shadow-[var(--accent-glow-hover)]"
                >
                  Start hiring flow
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/recruiter">
                <Button
                  variant="secondary"
                  size="lg"
                  className="landing-glass h-12 rounded-full border-[var(--border-strong)] px-7 backdrop-blur-xl transition hover:scale-[1.02]"
                >
                  View dashboard
                </Button>
              </Link>
            </Reveal>

            <Reveal delay={0.2} className="mt-14 grid grid-cols-3 gap-6 border-t border-[var(--border)] pt-10">
              <Stat value={statEndpoints} label="AI endpoints" />
              <Stat value={statCapabilities} label="Capabilities" />
              <Stat value={statQuestions} label="Interview Qs" />
            </Reveal>
          </div>

          <motion.div style={reduced ? undefined : { y, opacity }} className="relative">
            <div className="landing-float relative">
              <GlassCard shine className="overflow-hidden p-2 sm:p-3">
                <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                  <Image
                    src="/images/dashboard.png"
                    alt="Foundry recruiter dashboard preview"
                    width={1200}
                    height={675}
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute left-6 top-6 landing-glass rounded-xl px-3 py-2 text-xs">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
                    Live signal
                  </p>
                  <p className="mt-0.5 font-heading text-lg font-semibold text-[var(--accent)]">
                    ATS 92
                  </p>
                </div>
                <div className="absolute bottom-8 right-6 landing-glass rounded-xl px-3 py-2 text-xs">
                  <p className="font-mono text-[10px] text-[var(--muted)]">Recommendation</p>
                  <p className="mt-0.5 font-medium text-[var(--foreground)]">Strong Hire</p>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="absolute -bottom-6 -left-4 hidden max-w-[220px] p-4 sm:block landing-pulse-glow">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                AI pipeline
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
                {PIPELINE[2]}
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
