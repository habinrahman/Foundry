"use client";

import type { AnswerEvaluation, FitRationale } from "@/types/candidate";
import { useLocale } from "@/lib/i18n/hooks";
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
  const { t } = useLocale();
  const panel = t.recruiter.panels.aiEvaluation;

  return (
    <Panel delay={delay}>
      <PanelHeader
        title={panel.title}
        subtitle={panel.subtitle}
        action={
          <ProgressRing
            value={fit.confidence * 100}
            size={56}
            label={panel.fitConfidence}
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
        <List title={panel.strengths} items={evaluation.strengths} />
        <List title={panel.weaknesses} items={evaluation.weaknesses} />
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
            <span className="me-2 text-[var(--accent)]">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
