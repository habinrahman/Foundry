"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks";

export function LandingBackground() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="landing-noise absolute inset-0" />
      <div className="landing-grid-bg absolute inset-0 opacity-40" />

      <div className="landing-orb-1 absolute -left-[20%] top-[-10%] h-[520px] w-[520px] rounded-full opacity-60 blur-[120px]" />
      <div className="landing-orb-2 absolute -right-[15%] top-[5%] h-[480px] w-[480px] rounded-full opacity-50 blur-[110px]" />
      <div className="landing-orb-3 absolute bottom-[10%] left-[30%] h-[360px] w-[360px] rounded-full opacity-40 blur-[100px]" />

      {!reduced
        ? [0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[var(--accent)]/40"
              style={{
                left: `${12 + i * 18}%`,
                top: `${20 + (i % 3) * 22}%`,
              }}
              animate={{
                y: [0, -18, 0],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 4 + i * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            />
          ))
        : null}
    </div>
  );
}
