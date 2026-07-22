"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_CANDIDATE } from "@/data/demo-candidate";
import type { CandidateSession } from "@/types/dashboard";
import type { HiringRecommendation } from "@/types/candidate";

interface CandidateStoreValue {
  candidate: CandidateSession;
  setCandidate: (next: CandidateSession) => void;
  setHiringRecommendation: (value: HiringRecommendation) => void;
  resetToDemo: () => void;
}

const CandidateStoreContext = createContext<CandidateStoreValue | null>(null);

export function CandidateStoreProvider({ children }: { children: ReactNode }) {
  const [candidate, setCandidate] = useState<CandidateSession>(DEMO_CANDIDATE);

  const setHiringRecommendation = useCallback((value: HiringRecommendation) => {
    setCandidate((prev) => ({
      ...prev,
      analysis: { ...prev.analysis, hiringRecommendation: value },
      evaluation: { ...prev.evaluation, hiringRecommendation: value },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const resetToDemo = useCallback(() => {
    setCandidate({
      ...DEMO_CANDIDATE,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const value = useMemo(
    () => ({
      candidate,
      setCandidate,
      setHiringRecommendation,
      resetToDemo,
    }),
    [candidate, setHiringRecommendation, resetToDemo]
  );

  return (
    <CandidateStoreContext.Provider value={value}>
      {children}
    </CandidateStoreContext.Provider>
  );
}

export function useCandidateStore(): CandidateStoreValue {
  const ctx = useContext(CandidateStoreContext);
  if (!ctx) {
    throw new Error("useCandidateStore must be used within CandidateStoreProvider");
  }
  return ctx;
}
