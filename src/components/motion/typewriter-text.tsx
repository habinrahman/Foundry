"use client";

import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks";

export function TypewriterText({
  text,
  className,
  speedMs = 16,
  showCursor = true,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  speedMs?: number;
  showCursor?: boolean;
  as?: "p" | "span" | "h1" | "h2" | "h3";
}) {
  const { display, done } = useTypewriter(text, { speedMs });

  return (
    <Tag className={cn("relative", className)}>
      <span aria-hidden>{display}</span>
      {showCursor && !done ? (
        <span
          className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.08em] bg-[var(--accent)] align-baseline animate-[foundry-blink_1s_steps(2,start)_infinite]"
          aria-hidden
        />
      ) : null}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}
