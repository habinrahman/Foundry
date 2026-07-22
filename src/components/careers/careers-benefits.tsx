"use client";

import {
  GraduationCap,
  Globe2,
  Laptop,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Section } from "@/components/landing/primitives";
import { useLocale } from "@/lib/i18n/hooks";

/** Three unhurried primary cards plus a compact secondary list—kept
 * deliberately calmer and less symmetric than the Challenges card grid. */
const PRIMARY_ICONS: readonly LucideIcon[] = [Globe2, Laptop, GraduationCap];
const SECONDARY_ICONS: readonly LucideIcon[] = [Wallet, Laptop, Users];

export function CareersBenefits({ className }: { className?: string }) {
  const { t } = useLocale();
  const benefits = t.careers.benefits;
  const primary = benefits.items.slice(0, 3);
  const secondary = benefits.items.slice(3);

  return (
    <Section
      id="benefits"
      className={className}
      eyebrow={benefits.eyebrow}
      title={benefits.title}
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {primary.map((item, i) => {
          const Icon = PRIMARY_ICONS[i];
          return (
            <Reveal key={item.title} delay={0.06 * (i + 1)} className="h-full">
              <div className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)] sm:p-9">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 font-heading text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.26} className="mt-8">
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-3xl border border-[var(--border)]">
          {secondary.map((item, i) => {
            const Icon = SECONDARY_ICONS[i];
            return (
              <li
                key={item.title}
                className="flex flex-col gap-1 px-7 py-5 sm:flex-row sm:items-baseline sm:gap-4 sm:px-9"
              >
                <span className="flex items-center gap-2.5 sm:w-56 sm:shrink-0">
                  <Icon
                    className="h-4 w-4 shrink-0 text-[var(--accent)]"
                    aria-hidden
                  />
                  <span className="font-heading text-[15px] font-semibold">
                    {item.title}
                  </span>
                </span>
                <span className="text-sm leading-relaxed text-[var(--muted)]">
                  {item.body}
                </span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
