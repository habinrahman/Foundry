import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplicationSuccessView } from "@/components/careers/application-success";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Application submitted",
  robots: { index: false, follow: false },
};

export default function ApplicationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[640px] px-4 py-16">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <ApplicationSuccessView />
    </Suspense>
  );
}
