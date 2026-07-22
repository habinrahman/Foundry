"use client";

import { ExternalLink } from "lucide-react";
import type { ProjectEntry } from "@/types/candidate";
import { Panel, PanelHeader } from "./panel";

export function ProjectsPanel({
  projects,
  delay = 0.24,
}: {
  projects: ProjectEntry[];
  delay?: number;
}) {
  return (
    <Panel delay={delay}>
      <PanelHeader title="Projects" subtitle="Signal from shipped work" />
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
                  aria-label={`Open ${project.name}`}
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
                  <span className="mr-2 text-[var(--accent)]">▸</span>
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
