"use client";

import { motion } from "framer-motion";
import { FileText, GraduationCap, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import {
  MockHeader,
  MockLabel,
  MockWindow,
  staggerItem,
  useMockReveal,
} from "./foundry-chrome";

export function ResumeIntelligenceMockup({ className }: { className?: string }) {
  const { t } = useLocale();
  const copy = t.careers.foundryShowcase.mockups.resumeIntelligence;
  const { ref, active, reduced } = useMockReveal();

  return (
    <div ref={ref} className={cn(className)}>
      <MockWindow path={copy.urlPath} label={copy.windowLabel} reduced={reduced}>
        <MockHeader
          icon={FileText}
          title={copy.panelTitle}
          subtitle={copy.panelSubtitle}
        />

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-heading text-base font-semibold tracking-tight">
            {copy.candidateName}
          </p>
          <p className="text-xs text-[var(--muted)]">{copy.candidateRole}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          <MetaChip icon={<GraduationCap className="h-3.5 w-3.5" />}>
            {copy.metaEducation}
          </MetaChip>
          <MetaChip icon={<MapPin className="h-3.5 w-3.5" />}>
            {copy.metaLocation}
          </MetaChip>
          <MetaChip>{copy.metaExperience}</MetaChip>
        </div>

        <div className="mt-5">
          <MockLabel>{copy.skillsLabel}</MockLabel>
          <div className="flex flex-wrap gap-1.5">
            {copy.skills.map((skill, index) =>
              reduced ? (
                <Badge key={skill} tone="neutral">
                  {skill}
                </Badge>
              ) : (
                <motion.div
                  key={skill}
                  variants={staggerItem}
                  initial="hidden"
                  animate={active ? "shown" : "hidden"}
                  transition={{ duration: 0.3, delay: index * 0.055 }}
                >
                  <Badge tone="neutral">{skill}</Badge>
                </motion.div>
              )
            )}
          </div>
        </div>
      </MockWindow>
    </div>
  );
}

function MetaChip({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2 py-1">
      {icon}
      {children}
    </span>
  );
}
