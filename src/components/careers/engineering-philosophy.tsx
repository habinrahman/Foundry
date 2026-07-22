"use client";

import { Reveal, Section } from "@/components/landing/primitives";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export function EngineeringPhilosophy({ className }: { className?: string }) {
  const { t } = useLocale();
  const philosophy = t.careers.philosophy;

  return (
    <Section
      id="philosophy"
      className={className}
      eyebrow={philosophy.eyebrow}
      title={philosophy.title}
      description={philosophy.description}
    >
      <div className="max-w-3xl">
        {philosophy.prose ? (
          <Reveal delay={0.05}>
            <p className="text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {philosophy.prose}
            </p>
          </Reveal>
        ) : null}

        <div className={cn("space-y-0", philosophy.prose ? "mt-14" : "mt-2")}>
          {philosophy.principles.map((principle, index) => (
            <Reveal key={principle.title} delay={0.06 * (index + 1)}>
              <article
                className={cn(
                  "border-t border-[var(--border)] py-10 lg:py-12",
                  index === 0 && "border-t-0 pt-0",
                )}
              >
                <div className="flex gap-6 sm:gap-10">
                  <div
                    className="mt-1 w-px shrink-0 self-stretch bg-[var(--accent)]/45"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                      {principle.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                      {principle.body}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
