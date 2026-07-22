import type { Metadata } from "next";
import { CareersLandingPage } from "@/components/careers/careers-landing";
import {
  CAREERS_DESCRIPTION,
  CAREERS_NAME,
  CAREERS_TAGLINE,
} from "@/lib/careers-site";

export const metadata: Metadata = {
  title: `${CAREERS_NAME} · ${CAREERS_TAGLINE}`,
  description: CAREERS_DESCRIPTION,
};

export default function CareersHomePage() {
  return <CareersLandingPage />;
}
