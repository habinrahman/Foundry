import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
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
        "group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--card-hover-shadow)] sm:p-8",
        featured && "landing-shine",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
        <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 font-medium text-[var(--foreground)]">
          {role.department}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5">
          <MapPin className="h-3 w-3" aria-hidden />
          {role.location}
        </span>
        <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5">
          {role.employmentType}
        </span>
        <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5">
          {role.experience}
        </span>
      </div>

      <h3 className="mt-5 font-heading text-2xl font-semibold tracking-tight">
        <Link
          href={`/careers/${role.slug}`}
          className="transition hover:text-[var(--accent)]"
        >
          {role.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
        {role.summary}
      </p>

      <div className="mt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          Technologies
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {role.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground)]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link href={`/apply?role=${role.slug}`}>
          <Button variant="primary" size="sm" className="rounded-full px-5">
            Apply
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </Link>
        <Link href={`/careers/${role.slug}`}>
          <Button variant="secondary" size="sm" className="rounded-full px-4">
            View role
          </Button>
        </Link>
      </div>
    </article>
  );
}
