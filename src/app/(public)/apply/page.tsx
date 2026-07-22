import type { Metadata } from "next";
import { CAREERS_NAME } from "@/lib/careers-site";

export const metadata: Metadata = {
  title: "Apply",
  description: `Apply for engineering roles at ${CAREERS_NAME}.`,
};

/** Phase 1 stub — multi-step apply form in Phase 3. */
export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl tracking-tight sm:text-4xl">
        Apply
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        The premium multi-step application experience ships in a following
        phase. Routing and careers chrome are ready.
      </p>
    </div>
  );
}
