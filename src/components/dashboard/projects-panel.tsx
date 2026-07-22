"use client";

import { ExternalLink } from "lucide-react";
import type { ProjectEntry } from "@/types/candidate";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelHeader } from "./panel";

export function ProjectsPanel({
  projects,
  delay = 0.24,
}: {
  projects: ProjectEntry[];
  delay?: number;
}) {
  const { t } = useLocale();
  const panel = t.recruiter.panels.projects;

  if (projects.length === 0) {
    return (
      <Panel delay={delay}>
        <PanelHeader title={panel.title} subtitle={panel.subtitle} />
        <EmptyState title={panel.empty.title} description={panel.empty.description} />
      </Panel>
    );
  }

  return (
    <Panel delay={delay}>
      <PanelHeader title={panel.title} subtitle={panel.subtitle} />
      <div className="space-y-4">
        {projects.map((project) => (
          <article
            key={project.name}
            className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-heading text-sm font-semibold">
                {project.name}
              </h3>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--muted)] transition hover:text-[var(--accent)]"
                  aria-label={formatMessage(panel.openAria, { name: project.name })}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
              {project.description}
            </p>
            <ul className="mt-3 space-y-1">
              {project.highlights.map((item) => (
                <li key={item} className="text-xs text-[var(--foreground)]/85">
                  <span className="me-2 text-[var(--accent)]">▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] text-[var(--accent)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
