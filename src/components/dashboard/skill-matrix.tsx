"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import type { SkillMatrixItem } from "@/types/dashboard";
import { Panel, PanelHeader } from "./panel";

export const SkillMatrix = memo(function SkillMatrix({
  skills,
  delay = 0.15,
}: {
  skills: SkillMatrixItem[];
  delay?: number;
}) {
  return (
    <Panel delay={delay} className="h-full">
      <PanelHeader
        title="Skill matrix"
        subtitle="Proficiency vs role relevance"
      />
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={skill.skill} className="group">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium transition group-hover:text-[var(--accent)]">
                  {skill.skill}
                </p>
                <p className="text-[11px] text-[var(--muted)]">{skill.evidence}</p>
              </div>
              <div className="text-right text-[11px] tabular-nums text-[var(--muted)]">
                <div>P {skill.proficiency}</div>
                <div>R {skill.relevance}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Bar
                value={skill.proficiency}
                delay={delay + index * 0.04}
                tone="accent"
                label={`${skill.skill} proficiency`}
              />
              <Bar
                value={skill.relevance}
                delay={delay + index * 0.04 + 0.05}
                tone="blue"
                label={`${skill.skill} relevance`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-[11px] text-[var(--muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> Proficiency
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--chart-2)]" /> Relevance
        </span>
      </div>
    </Panel>
  );
});

function Bar({
  value,
  delay,
  tone,
  label,
}: {
  value: number;
  delay: number;
  tone: "accent" | "blue";
  label: string;
}) {
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: tone === "accent" ? "var(--accent)" : "var(--chart-2)",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
