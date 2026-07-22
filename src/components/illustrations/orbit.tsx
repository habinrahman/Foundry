"use client";

import { cn } from "@/lib/utils";

/** Abstract orbital illustration — original, not from any brand kit. */
export function OrbitIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Abstract talent intelligence constellation"
    >
      <defs>
        <linearGradient id="foundryGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="360" rx="28" fill="url(#core)" opacity="0.35" />
      <ellipse
        cx="240"
        cy="180"
        rx="150"
        ry="88"
        stroke="url(#foundryGlow)"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <ellipse
        cx="240"
        cy="180"
        rx="108"
        ry="140"
        stroke="url(#foundryGlow)"
        strokeWidth="1.2"
        opacity="0.35"
        transform="rotate(28 240 180)"
      />
      <circle cx="240" cy="180" r="18" fill="#2DD4BF" opacity="0.9" />
      <circle cx="240" cy="180" r="8" fill="#E8EEF4" opacity="0.95" />
      <circle cx="360" cy="140" r="7" fill="#60A5FA" />
      <circle cx="150" cy="120" r="5" fill="#22D3EE" />
      <circle cx="300" cy="250" r="6" fill="#94A3B8" />
      <circle cx="120" cy="220" r="4" fill="#2DD4BF" opacity="0.7" />
      <path
        d="M240 180 L360 140 M240 180 L150 120 M240 180 L300 250 M240 180 L120 220"
        stroke="url(#foundryGlow)"
        strokeWidth="1"
        opacity="0.35"
      />
      <path
        d="M70 290 C140 250, 200 310, 260 270 C320 230, 380 280, 420 250"
        stroke="#2DD4BF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

export function UploadIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-16 w-20", className)}
      aria-hidden
    >
      <rect
        x="18"
        y="22"
        width="84"
        height="58"
        rx="12"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.35"
      />
      <path
        d="M60 66 V38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M48 48 L60 36 L72 48"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="92" cy="28" r="10" fill="var(--accent)" opacity="0.9" />
      <path
        d="M92 23 V33 M87 28 H97"
        stroke="var(--accent-foreground)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
