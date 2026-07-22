"use client";

import { memo, useMemo } from "react";
import type {
  AnswerEvaluation,
  CandidateAnswer,
  TechnicalQuestionSet,
} from "@/types/candidate";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader } from "./panel";
import { EmptyState } from "@/components/ui/empty-state";

export const InterviewQaPanel = memo(function InterviewQaPanel({
  questions,
  answers,
  evaluation,
  delay = 0.28,
}: {
  questions: TechnicalQuestionSet;
  answers: CandidateAnswer[];
  evaluation: AnswerEvaluation;
  delay?: number;
}) {
  const { t, formatNumber } = useLocale();
  const panel = t.recruiter.panels.interviewQa;
  const emptyValue = t.common.emptyValue;

  const rows = useMemo(() => {
    const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]));
    const evalMap = new Map(
      evaluation.perQuestion.map((item) => [item.questionId, item])
    );
    return questions.questions.map((q, index) => ({
      q,
      index,
      answer: answerMap.get(q.id) ?? emptyValue,
      evalItem: evalMap.get(q.id),
    }));
  }, [answers, evaluation.perQuestion, questions.questions, emptyValue]);

  if (rows.length === 0) {
    return (
      <Panel delay={delay}>
        <EmptyState
          title={panel.emptyTitle}
          description={panel.emptyDescription}
        />
      </Panel>
    );
  }

  return (
    <Panel delay={delay} className="overflow-hidden p-0 sm:p-0">
      <div className="border-b border-[var(--border)] px-5 pt-5">
        <PanelHeader
          title={panel.title}
          subtitle={questions.adaptationNotes}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-start text-sm">
          <caption className="sr-only">{panel.caption}</caption>
          <thead className="sticky top-0 bg-[var(--surface-elevated)] text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-5 py-3 font-medium">
                {panel.columns.index}
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                {panel.columns.question}
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                {panel.columns.answer}
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                {panel.columns.aiNote}
              </th>
              <th scope="col" className="px-5 py-3 text-end font-medium">
                {panel.columns.score}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ q, index, answer, evalItem }) => (
              <tr
                key={q.id}
                className="border-b border-[var(--border)] align-top transition hover:bg-[var(--background)]/70"
              >
                <td className="px-5 py-4 font-mono text-xs text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="px-3 py-4">
                  <p className="max-w-sm font-medium leading-snug">{q.question}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--accent)]">
                      {q.category}
                    </span>
                    <span className="rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {q.difficulty}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <p className="max-w-sm text-xs leading-relaxed text-[var(--foreground)]/85">
                    {answer}
                  </p>
                </td>
                <td className="px-3 py-4">
                  <p className="max-w-xs text-xs leading-relaxed text-[var(--muted)]">
                    {evalItem?.feedback ?? emptyValue}
                  </p>
                  {evalItem ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {evalItem.strengths.slice(0, 2).map((s) => (
                        <Chip key={s} tone="success" label={s} />
                      ))}
                      {evalItem.weaknesses.slice(0, 1).map((w) => (
                        <Chip key={w} tone="warning" label={w} />
                      ))}
                    </div>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-end">
                  <span
                    className={cn(
                      "inline-flex min-w-10 justify-center rounded-lg px-2 py-1 font-mono text-xs tabular-nums",
                      scoreTone(evalItem?.score ?? 0)
                    )}
                  >
                    {evalItem ? `${formatNumber(evalItem.score)}/10` : emptyValue}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
});

function scoreTone(score: number): string {
  if (score >= 9) return "bg-[var(--accent-soft)] text-[var(--accent)]";
  if (score >= 7)
    return "bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--success)]";
  if (score >= 5)
    return "bg-[color-mix(in_oklab,var(--warning)_12%,transparent)] text-[var(--warning)]";
  return "bg-[color-mix(in_oklab,var(--danger)_12%,transparent)] text-[var(--danger)]";
}

function Chip({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px]",
        tone === "success"
          ? "bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--success)]"
          : "bg-[color-mix(in_oklab,var(--warning)_12%,transparent)] text-[var(--warning)]"
      )}
    >
      {label}
    </span>
  );
}
