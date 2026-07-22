"use client";

import { LandingHero } from "@/components/landing/hero";
import { LandingSections } from "@/components/landing/sections";

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <LandingHero />
      <LandingSections />
    </div>
  );
}
