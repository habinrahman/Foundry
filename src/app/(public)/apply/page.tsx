import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplyForm } from "@/components/careers/apply-form";
import { CAREERS_NAME } from "@/lib/careers-site";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Apply",
  description: `Apply for engineering roles at ${CAREERS_NAME}.`,
};

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[720px] space-y-4 px-4 py-16">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <ApplyForm />
    </Suspense>
  );
}
