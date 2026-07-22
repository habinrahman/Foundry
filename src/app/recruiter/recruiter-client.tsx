"use client";

import dynamic from "next/dynamic";
import { useMounted } from "@/hooks";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/motion/fade-in";

const RecruiterDashboard = dynamic(
  () =>
    import("@/components/dashboard/recruiter-dashboard").then(
      (m) => m.RecruiterDashboard
    ),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false,
  }
);

export function RecruiterPageClient() {
  const mounted = useMounted();

  return (
    <PageTransition>
      {mounted ? <RecruiterDashboard /> : <DashboardSkeleton />}
    </PageTransition>
  );
}
