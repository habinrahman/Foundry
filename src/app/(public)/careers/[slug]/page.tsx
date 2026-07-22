import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAREERS_ROLES, getRoleBySlug } from "@/data/careers/roles";
import { CAREERS_NAME } from "@/lib/careers-site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CAREERS_ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) return { title: "Role not found" };
  return {
    title: role.title,
    description: role.summary,
  };
}

export default async function CareerRolePage({ params }: Props) {
  const { slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) notFound();

  return (
    <article className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Link
        href="/careers"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All roles
      </Link>

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        {CAREERS_NAME} · {role.department}
      </p>
      <h1 className="mt-3 font-heading text-4xl tracking-tight sm:text-5xl">
        {role.title}
      </h1>

      <div className="mt-5 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {role.location}
        </span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1">
          {role.employmentType}
        </span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1">
          {role.experience}
        </span>
      </div>

      <p className="mt-8 text-lg leading-relaxed text-[var(--muted)]">
        {role.summary}
      </p>

      <section className="mt-12">
        <h2 className="font-heading text-2xl tracking-tight">What you’ll do</h2>
        <ul className="mt-4 space-y-3 text-[var(--foreground)]">
          {role.responsibilities.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-2xl tracking-tight">What we’re looking for</h2>
        <ul className="mt-4 space-y-3">
          {role.requirements.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--chart-2)]" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14 flex flex-wrap gap-3 border-t border-[var(--border)] pt-8">
        <Link href={`/apply?role=${role.slug}`}>
          <Button variant="primary" size="lg" className="rounded-full px-7">
            Apply for this role
          </Button>
        </Link>
        <Link href="/careers">
          <Button variant="secondary" size="lg" className="rounded-full px-7">
            View other roles
          </Button>
        </Link>
      </div>
    </article>
  );
}
