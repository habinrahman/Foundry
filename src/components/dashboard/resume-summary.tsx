"use client";

import type { ReactNode } from "react";
import {
  Code2,
  Globe,
  Link2,
  Mail,
  Phone,
} from "lucide-react";
import type { ParsedResume, ResumeAnalysis } from "@/types/candidate";
import { Panel, PanelHeader } from "./panel";

export function ResumeSummary({
  resume,
  analysis,
  delay = 0.22,
}: {
  resume: ParsedResume;
  analysis: ResumeAnalysis;
  delay?: number;
}) {
  return (
    <Panel delay={delay}>
      <PanelHeader
        title="Resume Summary"
        subtitle={resume.name ?? "Candidate"}
      />
      <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
        {analysis.professionalSummary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
        {resume.email ? (
          <Meta icon={<Mail className="h-3.5 w-3.5" />} label={resume.email} />
        ) : null}
        {resume.phone ? (
          <Meta icon={<Phone className="h-3.5 w-3.5" />} label={resume.phone} />
        ) : null}
        {resume.linkedin ? (
          <Meta
            icon={<Link2 className="h-3.5 w-3.5" />}
            label="LinkedIn"
            href={resume.linkedin}
          />
        ) : null}
        {resume.github ? (
          <Meta
            icon={<Code2 className="h-3.5 w-3.5" />}
            label="GitHub"
            href={resume.github}
          />
        ) : null}
        {resume.portfolio ? (
          <Meta
            icon={<Globe className="h-3.5 w-3.5" />}
            label="Portfolio"
            href={resume.portfolio}
          />
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {resume.skills.slice(0, 14).map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-[11px] text-[var(--muted)]"
          >
            {skill}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function Meta({
  icon,
  label,
  href,
}: {
  icon: ReactNode;
  label: string;
  href?: string;
}) {
  const content = (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2 py-1">
      {icon}
      {label}
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="hover:text-[var(--foreground)]">
        {content}
      </a>
    );
  }
  return content;
}
