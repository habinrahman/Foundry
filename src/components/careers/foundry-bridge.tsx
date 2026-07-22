"use client";

import { Reveal } from "@/components/landing/primitives";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export function FoundryBridge({ className }: { className?: string }) {
  const { t } = useLocale();

  return (
    <section
      className={cn(
        "relative border-y border-[var(--border)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal delay={0.05}>
          <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {t.careers.bridge.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
