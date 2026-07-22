"use client";

import { useCallback, useRef, useState } from "react";
import {
  analyzeResumeApi,
  formatTalentApiError,
  generateFitApi,
  generateQuestionsApi,
  parseResumeApi,
  extractResumeText,
  type TalentApiErrorMessages,
} from "@/lib/ai/api-client";
import { buildCandidateSession } from "@/lib/candidate/build-session";
import type { AILocaleContext } from "@/lib/i18n/types";
import type { CandidateSession } from "@/types/dashboard";

export const AI_PIPELINE_STAGES = [
  "Extracting resume text...",
  "Parsing resume structure...",
  "Analyzing candidate profile...",
  "Generating fit rationale...",
  "Generating interview questions...",
  "Building recruiter report...",
] as const;

export interface LiveAiPipelineInput {
  file?: File | null;
  resumeText?: string;
  linkedInUrl?: string | null;
  /**
   * Snapshotted at the start of `run()`. Mid-flight locale switches by the
   * caller do not affect a request already in progress.
   */
  locale?: AILocaleContext;
}

export interface LiveAiPipelineMessages extends TalentApiErrorMessages {
  noResumeText: string;
}

const DEFAULT_PIPELINE_MESSAGES: LiveAiPipelineMessages = {
  missingApiKey:
    "Gemini API key is not configured. Add GEMINI_API_KEY to .env.local and restart the dev server.",
  rateLimited: "AI rate limit reached. Wait a moment and try again.",
  generic: "Something went wrong while running the AI pipeline.",
  noResumeText: "No resume text available to analyze.",
};

export interface LiveAiPipelineState {
  active: boolean;
  done: boolean;
  stageIndex: number;
  stageLabel: string;
  progress: number;
  error: string | null;
  run: (input: LiveAiPipelineInput) => Promise<CandidateSession>;
  reset: () => void;
}

const STAGE_PROGRESS = [8, 22, 42, 62, 82, 100] as const;

export function useLiveAiPipeline(options?: {
  onComplete?: (session: CandidateSession) => void;
  messages?: LiveAiPipelineMessages;
}): LiveAiPipelineState {
  const onCompleteRef = useRef(options?.onComplete);
  onCompleteRef.current = options?.onComplete;
  const messages = options?.messages ?? DEFAULT_PIPELINE_MESSAGES;
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setActive(false);
    setDone(false);
    setStageIndex(0);
    setProgress(0);
    setError(null);
  }, []);

  const run = useCallback(async (input: LiveAiPipelineInput) => {
    // Snapshot once so a locale switch that happens while this run is in
    // flight cannot mutate an already-issued request.
    const locale = input.locale;

    setActive(true);
    setDone(false);
    setError(null);
    setStageIndex(0);
    setProgress(2);

    try {
      let resumeText = input.resumeText?.trim() ?? "";

      if (input.file) {
        setStageIndex(0);
        setProgress(STAGE_PROGRESS[0]);
        const extracted = await extractResumeText(input.file);
        resumeText = extracted.text;
      } else {
        setStageIndex(1);
        setProgress(STAGE_PROGRESS[1]);
      }

      if (!resumeText) {
        throw new Error(messagesRef.current.noResumeText);
      }

      const linkedInUrl = input.linkedInUrl?.trim() || null;

      setStageIndex(1);
      setProgress(STAGE_PROGRESS[1]);
      const resume = await parseResumeApi({ resumeText, linkedInUrl, locale });

      setStageIndex(2);
      setProgress(STAGE_PROGRESS[2]);
      const analysis = await analyzeResumeApi({ resume, linkedInUrl, locale });

      setStageIndex(3);
      setProgress(STAGE_PROGRESS[3]);
      const fit = await generateFitApi({ resume, analysis, locale });

      setStageIndex(4);
      setProgress(STAGE_PROGRESS[4]);
      const questions = await generateQuestionsApi({ resume, analysis, locale });

      setStageIndex(5);
      setProgress(STAGE_PROGRESS[5]);
      const session = buildCandidateSession({
        resume,
        analysis,
        fit,
        questions,
        linkedInUrl,
        locale,
      });

      setProgress(100);
      setDone(true);
      setActive(false);
      onCompleteRef.current?.(session);
      return session;
    } catch (err) {
      const message = formatTalentApiError(err, messagesRef.current);
      setError(message);
      setActive(false);
      throw err;
    }
  }, []);

  return {
    active,
    done,
    stageIndex,
    stageLabel: AI_PIPELINE_STAGES[stageIndex] ?? AI_PIPELINE_STAGES[0],
    progress,
    error,
    run,
    reset,
  };
}
