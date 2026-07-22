"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AiPipeline } from "@/components/ai/ai-pipeline";
import { ResumeDropzone } from "@/components/upload/resume-dropzone";
import { TypewriterText } from "@/components/motion/typewriter-text";
import { FadeIn, PageTransition } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { useLiveAiPipeline } from "@/hooks/use-live-ai-pipeline";
import { useCandidateStore } from "@/store/candidate-store";
import { DEMO_RESUME_TEXT } from "@/data/demo-resume-text";
import { formatTalentApiError } from "@/lib/ai/api-client";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

type Phase = "boot" | "upload" | "linkedin" | "analyzing" | "insight";

interface ChatBubble {
  id: string;
  role: "foundry" | "user";
  content: ReactNode;
}

export function CandidateFlowClient() {
  const { candidate, setCandidate } = useCandidateStore();
  const { t, aiLocale } = useLocale();
  const [phase, setPhase] = useState<Phase>("boot");
  const [fileName, setFileName] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [demoResumeText, setDemoResumeText] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState(candidate.resume.linkedin ?? "");
  const [bubbles, setBubbles] = useState<ChatBubble[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const pipeline = useLiveAiPipeline({
    onComplete: (session) => {
      setCandidate(session);
      setPhase("insight");
    },
    messages: {
      missingApiKey: t.ai.errors.missingApiKey,
      rateLimited: t.ai.errors.rateLimited,
      generic: t.ai.errors.generic,
      noResumeText: t.ai.errors.noResumeText,
    },
  });

  const pushFoundry = useCallback((id: string, content: ReactNode) => {
    setBubbles((prev) => {
      if (prev.some((b) => b.id === id)) return prev;
      return [...prev, { id, role: "foundry", content }];
    });
  }, []);

  const pushUser = useCallback((id: string, content: ReactNode) => {
    setBubbles((prev) => [...prev, { id, role: "user", content }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [bubbles, phase, pipeline.stageIndex, pipeline.done]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      pushFoundry(
        "welcome",
        <TypewriterText
          text={t.foundry.talk.welcome}
          className="text-sm leading-relaxed"
          speedMs={14}
        />
      );
      setPhase("upload");
    }, 350);
    return () => window.clearTimeout(timer);
  }, [pushFoundry, t.foundry.talk.welcome]);

  const beginAnalysis = async (withLinkedIn: boolean) => {
    const linkedInUrl =
      withLinkedIn && linkedin.trim() ? linkedin.trim() : null;

    if (withLinkedIn && linkedInUrl) {
      pushUser("linkedin", linkedInUrl);
    } else {
      pushUser("linkedin-skip", t.foundry.talk.continueWithoutLinkedin);
    }

    pushFoundry(
      "analyzing",
      <span className="text-sm text-[var(--muted)]">
        {t.foundry.talk.analyzingMessage}
      </span>
    );
    setPhase("analyzing");

    try {
      await pipeline.run({
        file: resumeFile,
        resumeText: demoResumeText ?? undefined,
        linkedInUrl,
        locale: aiLocale,
      });
    } catch (error) {
      pushFoundry(
        "pipeline-error",
        <span className="text-sm text-[var(--danger)]">
          {formatTalentApiError(error, {
            missingApiKey: t.ai.errors.missingApiKey,
            rateLimited: t.ai.errors.rateLimited,
            generic: t.ai.errors.generic,
          })}
        </span>
      );
      setPhase("linkedin");
    }
  };

  const onFile = (file: File) => {
    setResumeFile(file);
    setDemoResumeText(null);
    setFileName(file.name);
    pushUser(
      `file-${file.name}`,
      formatMessage(t.foundry.talk.uploadedFile, { fileName: file.name })
    );
    pushFoundry(
      "ask-linkedin",
      <TypewriterText
        text={t.foundry.talk.askLinkedin}
        className="text-sm leading-relaxed"
        speedMs={12}
      />
    );
    setPhase("linkedin");
  };

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-2xl flex-col px-4 py-8 sm:px-6 lg:py-10">
        <FadeIn>
          <div className="mb-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
              {t.foundry.talk.eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-3xl tracking-tight sm:text-4xl">
              {t.foundry.talk.title}
            </h1>
          </div>
        </FadeIn>

        <div
          className="flex flex-1 flex-col gap-4 pb-24 sm:pb-8"
          aria-label={t.foundry.talk.ariaLabel}
          role="log"
          aria-relevant="additions"
        >
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "max-w-[92%] rounded-2xl px-4 py-3 text-sm",
                bubble.role === "foundry"
                  ? "self-start border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]"
                  : "self-end bg-[var(--accent)] text-[var(--accent-foreground)]"
              )}
            >
              {bubble.role === "foundry" ? (
                <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  {t.foundry.talk.foundryLabel}
                </p>
              ) : null}
              {bubble.content}
            </motion.div>
          ))}

          <AnimatePresence mode="wait">
            {phase === "upload" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-2"
              >
                <ResumeDropzone onFile={onFile} />
                <button
                  type="button"
                  className="mt-3 text-xs text-[var(--muted)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  onClick={() => {
                    pushUser("demo-file", t.foundry.talk.demoFileLabel);
                    pushFoundry(
                      "ask-linkedin",
                      <TypewriterText
                        text={t.foundry.talk.demoUsed}
                        className="text-sm leading-relaxed"
                        speedMs={12}
                      />
                    );
                    setResumeFile(null);
                    setDemoResumeText(DEMO_RESUME_TEXT);
                    setFileName("demo-aisha-rahman.pdf");
                    setPhase("linkedin");
                  }}
                >
                  {t.foundry.talk.skipUploadDemo}
                </button>
              </motion.div>
            ) : null}

            {phase === "linkedin" ? (
              <motion.div
                key="linkedin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]"
              >
                <label
                  htmlFor="linkedin"
                  className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]"
                >
                  {t.foundry.talk.linkedInLabel}
                </label>
                <input
                  id="linkedin"
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder={t.foundry.talk.linkedInPlaceholder}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 text-sm outline-none transition focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") beginAnalysis(true);
                  }}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="primary" onClick={() => beginAnalysis(true)}>
                    {t.foundry.talk.continue}
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                  </Button>
                  <Button variant="ghost" onClick={() => beginAnalysis(false)}>
                    {t.foundry.talk.skip}
                  </Button>
                </div>
              </motion.div>
            ) : null}

            {phase === "analyzing" || phase === "insight" ? (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1"
              >
                <AiPipeline
                  stageIndex={pipeline.stageIndex}
                  progress={pipeline.progress}
                  done={pipeline.done}
                />
                {pipeline.error ? (
                  <p className="mt-3 text-sm text-[var(--danger)]" role="alert">
                    {pipeline.error}
                  </p>
                ) : null}
              </motion.div>
            ) : null}

            {phase === "insight" && pipeline.done ? (
              <motion.div
                key="insight"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="max-w-[92%] self-start rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"
              >
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
                  <Sparkles className="h-3 w-3" aria-hidden />
                  {t.foundry.talk.foundryLabel}
                </p>
                <TypewriterText
                  text={candidate.fit.headline}
                  as="h2"
                  className="font-heading text-xl tracking-tight"
                  speedMs={16}
                />
                <div className="mt-3">
                  <TypewriterText
                    text={candidate.analysis.professionalSummary}
                    className="text-sm leading-relaxed text-[var(--muted)]"
                    speedMs={7}
                  />
                </div>
                {fileName ? (
                  <p className="mt-3 text-[11px] text-[var(--muted)]">
                    {t.foundry.talk.sourcePrefix} · {fileName}
                  </p>
                ) : null}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/recruiter">
                    <Button variant="primary">
                      {t.foundry.talk.openRecruiterReport}
                      <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden />
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setBubbles([]);
                      setFileName(null);
                      setResumeFile(null);
                      setDemoResumeText(null);
                      pipeline.reset();
                      setPhase("boot");
                      window.setTimeout(() => {
                        pushFoundry(
                          `welcome-${Date.now()}`,
                          <TypewriterText
                            text={t.foundry.talk.readyAgain}
                            className="text-sm leading-relaxed"
                            speedMs={12}
                          />
                        );
                        setPhase("upload");
                      }, 180);
                    }}
                  >
                    {t.foundry.talk.startOver}
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>
    </PageTransition>
  );
}
