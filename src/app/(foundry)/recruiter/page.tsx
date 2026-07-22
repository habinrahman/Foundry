import type { Metadata } from "next";
import { RecruiterPageClient } from "./recruiter-client";

export const metadata: Metadata = {
  title: "Recruiter Dashboard",
  description:
    "Executive hiring dashboard with scores, radar, skill matrix, interview evaluation, and exports.",
};

export default function RecruiterPage() {
  return <RecruiterPageClient />;
}
