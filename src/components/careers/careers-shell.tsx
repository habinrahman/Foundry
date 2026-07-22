"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CAREERS_NAME, CAREERS_NAV } from "@/lib/careers-site";
import { cn } from "@/lib/utils";

export function CareersShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:text-[var(--accent-foreground)]"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_78%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-heading text-lg tracking-tight transition hover:opacity-80"
            >
              {CAREERS_NAME}
            </Link>
            <nav aria-label="Careers" className="hidden items-center gap-1 md:flex">
              {CAREERS_NAV.map((item) => {
                const active =
                  item.href === "/careers"
                    ? pathname.startsWith("/careers")
                    : item.href === "/apply"
                      ? pathname.startsWith("/apply") ||
                        pathname.startsWith("/application")
                      : false;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm transition",
                      active
                        ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                        : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link href="/apply" className="hidden sm:block">
              <Button variant="primary" size="sm" className="rounded-full px-4">
                Apply
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              aria-expanded={open}
              aria-controls="careers-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {open ? (
          <nav
            id="careers-mobile-nav"
            aria-label="Careers mobile"
            className="border-t border-[var(--border)] px-4 py-3 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {CAREERS_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--surface)]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <ThemeToggle className="w-full justify-center" />
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      <main id="main-content">{children}</main>
    </>
  );
}
