import type { Metadata } from "next";
import { JobCard } from "@/components/careers/job-card";
import { CAREERS_ROLES } from "@/data/careers/roles";
import { CAREERS_NAME } from "@/lib/careers-site";

export const metadata: Metadata = {
  title: "Open Roles",
  description: `Explore open engineering roles at ${CAREERS_NAME}.`,
};

export default function CareersIndexPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        Engineering
      </p>
      <h1 className="mt-3 font-heading text-4xl tracking-tight sm:text-5xl">
        Open roles
      </h1>
      <p className="mt-4 max-w-2xl text-base text-[var(--muted)] sm:text-lg">
        Find a role that matches how you like to build—then apply with a
        focused, multi-step experience.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {CAREERS_ROLES.map((role) => (
          <JobCard key={role.slug} role={role} featured={role.featured} />
        ))}
      </div>
    </div>
  );
}
