"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useLocale } from "@/lib/i18n/hooks";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
        {t.foundry.notFound.eyebrow}
      </p>
      <EmptyState
        icon={<Compass className="h-8 w-8" />}
        title={t.foundry.notFound.title}
        description={t.foundry.notFound.description}
        action={
          <Link href="/">
            <Button variant="primary">{t.foundry.notFound.backToHome}</Button>
          </Link>
        }
        className="border-none bg-transparent px-0 py-0"
      />
    </div>
  );
}
