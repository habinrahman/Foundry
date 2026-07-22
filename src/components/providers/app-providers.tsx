"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useMemo, useRef } from "react";
import { FileUp, LayoutDashboard, Search } from "lucide-react";
import { CommandPalette } from "@/components/command/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  CommandPaletteProvider,
  useCommandPalette,
  useKeyboardShortcuts,
} from "@/hooks";
import { APP_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CandidateStoreProvider } from "@/store/candidate-store";

function ShellChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpen, toggle, open } = useCommandPalette();
  const { setTheme, resolvedTheme } = useTheme();
  const chordRef = useRef<string | null>(null);

  const bindings = useMemo(
    () => [
      { combo: { key: "k", meta: true }, handler: () => toggle() },
      { combo: { key: "Escape" }, handler: () => setOpen(false) },
      {
        combo: { key: "t" },
        handler: () => {
          if (open) return;
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
        },
      },
      {
        combo: { key: "g" },
        handler: () => {
          if (open) return;
          chordRef.current = "g";
          window.setTimeout(() => {
            chordRef.current = null;
          }, 700);
        },
      },
      {
        combo: { key: "d" },
        handler: () => {
          if (open || chordRef.current !== "g") return;
          router.push("/recruiter");
        },
      },
      {
        combo: { key: "u" },
        handler: () => {
          if (open || chordRef.current !== "g") return;
          router.push("/candidate");
        },
      },
      {
        combo: { key: "h" },
        handler: () => {
          if (open || chordRef.current !== "g") return;
          router.push("/recruiter");
        },
      },
    ],
    [open, resolvedTheme, router, setOpen, setTheme, toggle]
  );

  useKeyboardShortcuts(bindings);

  const nav = [
    { href: "/candidate", label: "Talk", icon: FileUp },
    { href: "/recruiter", label: "Hire", icon: LayoutDashboard },
  ] as const;

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
              href="/recruiter"
              className="font-heading text-lg tracking-tight transition hover:opacity-80"
            >
              {APP_NAME}
            </Link>
            <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition",
                    pathname === item.href
                      ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => setOpen(true)}
              aria-keyshortcuts="Meta+K Control+K"
              aria-label="Open command palette"
            >
              <Search className="h-3.5 w-3.5 text-[var(--muted)]" aria-hidden />
              <span className="text-[var(--muted)]">Search</span>
              <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                ⌘K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open command palette"
            >
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="pb-20 md:pb-0">
        {children}
      </main>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-2 px-2 py-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition",
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <CommandPalette />
    </>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CandidateStoreProvider>
      <CommandPaletteProvider>
        <ShellChrome>{children}</ShellChrome>
      </CommandPaletteProvider>
    </CandidateStoreProvider>
  );
}
