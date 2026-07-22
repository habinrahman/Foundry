"use client";

import { motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/hooks";
import { cn } from "@/lib/utils";
import {
  MockHeader,
  MockWindow,
  staggerItem,
  useMockReveal,
} from "./foundry-chrome";

export function InterviewGenerationMockup({ className }: { className?: string }) {
  const { t } = useLocale();
  const copy = t.careers.foundryShowcase.mockups.interviewGeneration;
  const { ref, active, reduced } = useMockReveal();

  return (
    <div ref={ref} className={cn(className)}>
      <MockWindow path={copy.urlPath} label={copy.windowLabel} reduced={reduced}>
        <MockHeader
          icon={MessageSquareText}
          title={copy.panelTitle}
          subtitle={copy.panelSubtitle}
        />

        <ol className="space-y-3">
          {copy.questions.map((question, index) =>
            reduced ? (
              <li key={question.text}>
                <QuestionRow index={index} question={question} />
              </li>
            ) : (
              <motion.li
                key={question.text}
                variants={staggerItem}
                initial="hidden"
                animate={active ? "shown" : "hidden"}
                transition={{ duration: 0.35, delay: index * 0.16 }}
              >
                <QuestionRow index={index} question={question} />
              </motion.li>
            )
          )}
        </ol>
      </MockWindow>
    </div>
  );
}

function QuestionRow({
  index,
  question,
}: {
  index: number;
  question: { category: string; text: string };
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 p-3.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 font-mono text-xs text-[var(--accent)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <Badge tone="accent" className="mb-2">
            {question.category}
          </Badge>
          <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
            {question.text}
          </p>
        </div>
      </div>
    </div>
  );
}
