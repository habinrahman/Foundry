import type { Metadata } from "next";
import Link from "next/link";
import { CAREERS_NAME } from "@/lib/careers-site";

export const metadata: Metadata = {
  title: "Open Roles",
  description: `Engineering opportunities at ${CAREERS_NAME}.`,
};

/** Phase 1 stub — full listings in Phase 2. */
export default function CareersIndexPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
        Open engineering roles
      </h1>
      <p className="mt-3 max-w-xl text-[var(--muted)]">
        Role listings ship in the next phase. You can still start an application.
      </p>
      <Link
        href="/apply"
        className="mt-8 inline-flex text-sm font-medium text-[var(--accent)] hover:underline"
      >
        Go to application →
      </Link>
    </div>
  );
}
