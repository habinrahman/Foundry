"use client";

import {
  Activity,
  Brain,
  Cloud,
  Cog,
  Layers,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Section } from "@/components/landing/primitives";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

const CHALLENGE_ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  layers: Layers,
  cloud: Cloud,
  activity: Activity,
  wrench: Wrench,
  cog: Cog,
};

function ChallengeIcon({ iconKey }: { iconKey: string }) {
  const Icon = CHALLENGE_ICONS[iconKey] ?? Brain;

  return (
    <Icon
      className="h-5 w-5 text-[var(--accent)] opacity-85 transition duration-300 group-hover:translate-y-0.5 group-hover:opacity-100"
      aria-hidden
    />
  );
}

export function EngineeringChallenges({ className }: { className?: string }) {
  const { t } = useLocale();
  const challenges = t.careers.challenges;

  return (
    <Section
      id="challenges"
      className={className}
      eyebrow={challenges.eyebrow}
      title={challenges.title}
      description={challenges.subtitle}
    >
      <div className="space-y-16 lg:space-y-20">
        {challenges.domains.map((domain, domainIndex) => (
          <Reveal key={domain.name} delay={0.05 * (domainIndex + 1)}>
            <div>
              <h3 className="font-heading text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
                {domain.name}
              </h3>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {domain.items.map((item, itemIndex) => (
                  <Reveal
                    key={item.title}
                    delay={0.06 * (domainIndex * 2 + itemIndex + 1)}
                  >
                    <article
                      className={cn(
                        "group h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow)]",
                        "transition duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)]",
                      )}
                    >
                      <ChallengeIcon iconKey={item.icon} />
                      <h4 className="mt-5 font-heading text-lg font-semibold tracking-tight">
                        {item.title}
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                        {item.body}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
