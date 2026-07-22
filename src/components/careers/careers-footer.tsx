"use client";

import Link from "next/link";
import { CAREERS_COMPANY, CAREERS_NAME } from "@/lib/careers-site";
import { formatMessage } from "@/lib/i18n/format-message";
import { useLocale } from "@/lib/i18n/hooks";

type FooterLink =
  | { kind: "anchor"; href: `#${string}`; label: string }
  | { kind: "route"; href: string; label: string }
  | { kind: "mail"; href: string; label: string };

/**
 * Closing navigation map of the careers story: Why → Philosophy →
 * Challenges → Foundry → Timeline → FAQ → Apply. Every link points to a
 * section or route that actually exists—no placeholder destinations.
 */
export function CareersFooter() {
  const { t } = useLocale();
  const footer = t.careers.footer;
  const groups = footer.groups;

  const columns: { heading: string; links: FooterLink[] }[] = [
    {
      heading: groups.engineering.heading,
      links: [
        { kind: "anchor", href: "#philosophy", label: groups.engineering.philosophy },
        { kind: "anchor", href: "#challenges", label: groups.engineering.challenges },
        { kind: "route", href: "/careers", label: groups.engineering.openRoles },
      ],
    },
    {
      heading: groups.hiring.heading,
      links: [
        { kind: "anchor", href: "#timeline", label: groups.hiring.timeline },
        { kind: "anchor", href: "#faq", label: groups.hiring.faq },
        { kind: "route", href: "/apply", label: groups.hiring.apply },
      ],
    },
    {
      heading: groups.foundry.heading,
      links: [
        { kind: "anchor", href: "#foundry", label: groups.foundry.overview },
        { kind: "anchor", href: "#pipeline", label: groups.foundry.pipeline },
        { kind: "anchor", href: "#comparison", label: groups.foundry.comparison },
        { kind: "route", href: "/recruiter", label: groups.foundry.recruiterDemo },
      ],
    },
    {
      heading: groups.company.heading,
      links: [
        { kind: "anchor", href: "#why", label: groups.company.why },
        { kind: "mail", href: "mailto:careers@example.com", label: groups.company.contact },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-[1200px] gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-heading text-lg tracking-tight">{CAREERS_NAME}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            {formatMessage(footer.tagline, { company: CAREERS_COMPANY })}
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.heading}>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
              {column.heading}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.kind === "route" ? (
                    <Link href={link.href} className="hover:text-[var(--foreground)]">
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className="hover:text-[var(--foreground)]">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-[1200px] flex-col gap-2 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>{formatMessage(footer.copyright, { company: CAREERS_COMPANY })}</p>
        <p className="max-w-md text-xs sm:text-end">{footer.demoNotice}</p>
      </div>
    </footer>
  );
}
