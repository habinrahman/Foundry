"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/landing/primitives";
import { usePrefersReducedMotion } from "@/hooks";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";

export function CareersFaq({ className }: { className?: string }) {
  const { t } = useLocale();
  const faq = t.careers.faq;
  const reduced = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <Section
      id="faq"
      className={className}
      eyebrow={faq.eyebrow}
      title={faq.title}
      description={faq.description}
    >
      <div className="divide-y divide-[var(--border)] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        {faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          const triggerId = `${baseId}-trigger-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <div key={item.question}>
              <h3>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start font-heading text-base font-semibold tracking-tight outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] sm:px-8 sm:text-lg"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-[var(--muted)] transition-transform",
                      reduced ? "duration-0" : "duration-300",
                      isOpen && "rotate-180 text-[var(--accent)]"
                    )}
                    aria-hidden
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-[15px] leading-relaxed text-[var(--muted)] sm:px-8">
                      {item.answer}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
