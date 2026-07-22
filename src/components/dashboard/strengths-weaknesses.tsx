"use client";

import type { ResumeAnalysis } from "@/types/candidate";
import { Panel, PanelHeader } from "./panel";

export function StrengthsWeaknesses({
  analysis,
  delay = 0.26,
}: {
  analysis: ResumeAnalysis;
  delay?: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel delay={delay}>
        <PanelHeader title="Strengths" subtitle="Resume + interview signals" />
        <ul className="space-y-2.5">
          {analysis.topStrengths.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-[color-mix(in_oklab,var(--success)_25%,var(--border))] bg-[color-mix(in_oklab,var(--success)_8%,transparent)] px-3 py-2 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </Panel>
      <Panel delay={delay + 0.04}>
        <PanelHeader title="Weaknesses" subtitle="Gaps and stretch areas" />
        <ul className="space-y-2.5">
          {analysis.weaknesses.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-[color-mix(in_oklab,var(--warning)_25%,var(--border))] bg-[color-mix(in_oklab,var(--warning)_8%,transparent)] px-3 py-2 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
        {analysis.missingSkills.length > 0 ? (
          <div className="mt-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">
              Missing skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
