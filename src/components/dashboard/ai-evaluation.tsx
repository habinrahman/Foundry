"use client";

import type { AnswerEvaluation, FitRationale } from "@/types/candidate";
import { TypewriterText } from "@/components/motion/typewriter-text";
import { ProgressRing } from "@/components/motion/progress";
import { Panel, PanelHeader } from "./panel";

export function AiEvaluationPanel({
  evaluation,
  fit,
  delay = 0.3,
}: {
  evaluation: AnswerEvaluation;
  fit: FitRationale;
  delay?: number;
}) {
  return (
    <Panel delay={delay}>
      <PanelHeader
        title="AI Evaluation"
        subtitle="Streaming narrative with calibrated confidence"
        action={
          <ProgressRing
            value={fit.confidence * 100}
            size={56}
            label="Fit confidence"
          />
        }
      />
      <TypewriterText
        text={evaluation.overallEvaluation}
        className="text-sm leading-relaxed"
        speedMs={10}
      />
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-4">
        <TypewriterText
          text={fit.headline}
          as="h3"
          className="font-heading text-sm font-semibold"
          speedMs={18}
        />
        <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
          {fit.narrative}
        </p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <List title="Evaluation strengths" items={evaluation.strengths} />
        <List title="Evaluation weaknesses" items={evaluation.weaknesses} />
      </div>
    </Panel>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="text-xs leading-relaxed text-[var(--foreground)]/85"
          >
            <span className="mr-2 text-[var(--accent)]">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
