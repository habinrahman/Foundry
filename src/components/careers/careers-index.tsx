"use client";

import { JobCard } from "@/components/careers/job-card";
import type { CareerRole } from "@/data/careers/roles";
import { useLocale } from "@/lib/i18n/hooks";

/** Localized shell for the `/careers` roles index — data fetching stays server-side in `page.tsx`. */
export function CareersIndex({ roles }: { roles: CareerRole[] }) {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        {t.careers.index.eyebrow}
      </p>
      <h1 className="mt-3 font-heading text-4xl tracking-tight sm:text-5xl">
        {t.careers.index.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
        {t.careers.index.description}
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <JobCard key={role.slug} role={role} featured={role.featured} />
        ))}
      </div>
    </div>
  );
}
