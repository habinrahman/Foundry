"use client";

import { UploadIllustration } from "@/components/illustrations/orbit";
import { Button } from "@/components/ui/button";
import { useFileDrop } from "@/hooks";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export function ResumeDropzone({
  onFile,
  className,
}: {
  onFile?: (file: File) => void;
  className?: string;
}) {
  const { t } = useLocale();
  const drop = useFileDrop({
    onFile,
    messages: {
      invalidType: t.validation.fileTypeInvalid,
      tooLarge: (maxSizeMb) =>
        formatMessage(t.validation.fileTooLarge, { maxSizeMb }),
    },
  });

  return (
    <div className={cn("w-full", className)}>
      <div
        {...drop.bind}
        role="button"
        tabIndex={0}
        aria-label={t.common.resumeDropzone.ariaLabel}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            drop.openFilePicker();
          }
        }}
        onClick={drop.openFilePicker}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition",
          drop.isDragging
            ? "border-[var(--accent)] bg-[var(--accent-soft)] scale-[1.01]"
            : "border-[var(--border-strong)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/40"
        )}
      >
        <input {...drop.inputProps} aria-hidden tabIndex={-1} />
        <div className="text-[var(--accent)]">
          <UploadIllustration />
        </div>
        <p className="mt-4 font-heading text-xl">
          {t.common.resumeDropzone.title}
        </p>
        <p className="mt-2 max-w-sm text-sm text-[var(--muted)]">
          {t.common.resumeDropzone.description}
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            drop.openFilePicker();
          }}
        >
          {t.common.resumeDropzone.browse}
        </Button>
        {drop.file ? (
          <p className="mt-4 text-xs text-[var(--accent)]" aria-live="polite">
            {t.common.resumeDropzone.selectedPrefix}: {drop.file.name}
          </p>
        ) : null}
        {drop.error ? (
          <p className="mt-3 text-xs text-[var(--danger)]" role="alert">
            {drop.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
