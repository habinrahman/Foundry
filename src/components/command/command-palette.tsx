"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FileUp,
  Keyboard,
  LayoutDashboard,
  Moon,
  RotateCcw,
  Search,
  Sun,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCommandPalette } from "@/hooks";
import { useCandidateStore } from "@/store/candidate-store";
import {
  exportCandidateCsv,
  exportCandidateJson,
  exportCandidateMarkdown,
  exportCandidatePdf,
} from "@/lib/export/candidate-export";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
};

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const { candidate, resetToDemo } = useCandidateStore();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<CommandItem[]>(
    () => [
      {
        id: "home",
        label: "Go to home",
        hint: "G H",
        group: "Navigate",
        icon: Home,
        run: () => router.push("/"),
      },
      {
        id: "candidate",
        label: "Candidate upload",
        hint: "G U",
        group: "Navigate",
        icon: FileUp,
        run: () => router.push("/candidate"),
      },
      {
        id: "recruiter",
        label: "Recruiter dashboard",
        hint: "G D",
        group: "Navigate",
        icon: LayoutDashboard,
        run: () => router.push("/recruiter"),
      },
      {
        id: "theme",
        label: resolvedTheme === "dark" ? "Switch to light" : "Switch to dark",
        hint: "T",
        group: "Appearance",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "export-pdf",
        label: "Export PDF",
        group: "Export",
        icon: Search,
        run: () => exportCandidatePdf(candidate),
      },
      {
        id: "export-md",
        label: "Export Markdown",
        group: "Export",
        icon: Search,
        run: () => exportCandidateMarkdown(candidate),
      },
      {
        id: "export-json",
        label: "Export JSON",
        group: "Export",
        icon: Search,
        run: () => exportCandidateJson(candidate),
      },
      {
        id: "export-csv",
        label: "Export CSV",
        group: "Export",
        icon: Search,
        run: () => exportCandidateCsv(candidate),
      },
      {
        id: "reset",
        label: "Reset demo candidate",
        group: "Session",
        icon: RotateCcw,
        run: () => resetToDemo(),
      },
      {
        id: "shortcuts",
        label: "Keyboard shortcuts",
        hint: "?",
        group: "Help",
        icon: Keyboard,
        run: () => router.push("/#shortcuts"),
      },
    ],
    [candidate, resetToDemo, resolvedTheme, router, setTheme]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(id);
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const runActive = () => {
    const item = filtered[active];
    if (!item) return;
    setOpen(false);
    item.run();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-[var(--overlay)] px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-[var(--shadow)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
              <Search className="h-4 w-4 text-[var(--muted)]" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    runActive();
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                placeholder="Type a command or search…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
                aria-autocomplete="list"
                aria-controls="command-list"
              />
              <kbd className="hidden rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)] sm:inline">
                esc
              </kbd>
            </div>
            <ul
              id="command-list"
              role="listbox"
              className="max-h-80 overflow-auto p-2"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-[var(--muted)]">
                  No matches
                </li>
              ) : (
                filtered.map((item, index) => (
                  <li key={item.id} role="option" aria-selected={index === active}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                        index === active
                          ? "bg-[var(--accent-soft)] text-[var(--foreground)]"
                          : "text-[var(--foreground)]/90 hover:bg-[var(--background)]"
                      )}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => {
                        setOpen(false);
                        item.run();
                      }}
                    >
                      <item.icon className="h-4 w-4 text-[var(--accent)]" />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                        {item.group}
                      </span>
                      {item.hint ? (
                        <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                          {item.hint}
                        </kbd>
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
