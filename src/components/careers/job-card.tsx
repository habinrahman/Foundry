import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CareerRole } from "@/data/careers/roles";
import { cn } from "@/lib/utils";

export function JobCard({
  role,
  className,
  featured = false,
}: {
  role: CareerRole;
  className?: string;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]",
        featured && "landing-shine",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5">
          {role.department}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" aria-hidden />
          {role.location}
        </span>
        <span>{role.employmentType}</span>
        <span>{role.experience}</span>
      </div>
      <h3 className="mt-4 font-heading text-xl font-semibold tracking-tight">
        <Link
          href={`/careers/${role.slug}`}
          className="transition hover:text-[var(--accent)]"
        >
          {role.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
        {role.summary}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/apply?role=${role.slug}`}>
          <Button variant="primary" size="sm" className="rounded-full px-4">
            Apply
          </Button>
        </Link>
        <Link href={`/careers/${role.slug}`}>
          <Button variant="ghost" size="sm" className="rounded-full px-3">
            Details
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </Link>
      </div>
    </article>
  );
}
