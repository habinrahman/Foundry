"use client";

import { useCallback, useRef, useState } from "react";
import {
  analyzeResumeApi,
  formatTalentApiError,
  generateFitApi,
  generateQuestionsApi,
  parseResumeApi,
  extractResumeText,
} from "@/lib/ai/api-client";
import { buildCandidateSession } from "@/lib/candidate/build-session";
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
}

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
}): LiveAiPipelineState {
  const onCompleteRef = useRef(options?.onComplete);
  onCompleteRef.current = options?.onComplete;

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
        throw new Error("No resume text available to analyze.");
      }

      const linkedInUrl = input.linkedInUrl?.trim() || null;

      setStageIndex(1);
      setProgress(STAGE_PROGRESS[1]);
      const resume = await parseResumeApi({ resumeText, linkedInUrl });

      setStageIndex(2);
      setProgress(STAGE_PROGRESS[2]);
      const analysis = await analyzeResumeApi({ resume, linkedInUrl });

      setStageIndex(3);
      setProgress(STAGE_PROGRESS[3]);
      const fit = await generateFitApi({ resume, analysis });

      setStageIndex(4);
      setProgress(STAGE_PROGRESS[4]);
      const questions = await generateQuestionsApi({ resume, analysis });

      setStageIndex(5);
      setProgress(STAGE_PROGRESS[5]);
      const session = buildCandidateSession({
        resume,
        analysis,
        fit,
        questions,
        linkedInUrl,
      });

      setProgress(100);
      setDone(true);
      setActive(false);
      onCompleteRef.current?.(session);
      return session;
    } catch (err) {
      const message = formatTalentApiError(err);
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
