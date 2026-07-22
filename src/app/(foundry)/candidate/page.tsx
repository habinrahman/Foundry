import type { Metadata } from "next";
import { CandidateFlowClient } from "./candidate-client";

export const metadata: Metadata = {
  title: "Candidate Upload",
  description:
    "Upload a resume, paste LinkedIn, and watch Foundry analyze fit with streaming AI feedback.",
};

export default function CandidatePage() {
  return <CandidateFlowClient />;
}
