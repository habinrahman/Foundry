"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const { t } = useLocale();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={t.common.switchToLightMode}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-sm",
          className
        )}
      >
        <Sun className="h-4 w-4" aria-hidden />
        {t.common.light}
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? t.common.switchToLightMode : t.common.switchToDarkMode}
      aria-pressed={!isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        isDark
          ? "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--border-strong)] hover:bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]",
        className
      )}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-[var(--warning)]" aria-hidden />
          {t.common.light}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" aria-hidden />
          {t.common.dark}
        </>
      )}
    </button>
  );
}
