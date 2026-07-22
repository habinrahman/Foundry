import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CAREERS_DESCRIPTION,
  CAREERS_NAME,
  CAREERS_TAGLINE,
} from "@/lib/careers-site";

export const metadata: Metadata = {
  title: `${CAREERS_NAME} · ${CAREERS_TAGLINE}`,
  description: CAREERS_DESCRIPTION,
};

/** Temporary Phase 1 placeholder — replaced by full landing in Phase 2. */
export default function CareersHomePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1200px] flex-col items-start justify-center gap-6 px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
        {CAREERS_NAME}
      </p>
      <h1 className="max-w-[16ch] font-heading text-4xl tracking-tight sm:text-5xl lg:text-6xl">
        Build AI that transforms manufacturing.
      </h1>
      <p className="max-w-xl text-base text-[var(--muted)] sm:text-lg">
        Careers landing ships in the next phase. Explore open roles or start an
        application.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/apply">
          <Button variant="primary" size="lg" className="rounded-full px-7">
            Apply Now
          </Button>
        </Link>
        <Link href="/careers">
          <Button variant="secondary" size="lg" className="rounded-full px-7">
            View Open Roles
          </Button>
        </Link>
      </div>
    </div>
  );
}
