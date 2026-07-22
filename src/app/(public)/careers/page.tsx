import type { Metadata } from "next";
import { CareersIndex } from "@/components/careers/careers-index";
import { CAREERS_ROLES } from "@/data/careers/roles";
import { CAREERS_NAME } from "@/lib/careers-site";

export const metadata: Metadata = {
  title: "Open Roles",
  description: `Explore open engineering roles at ${CAREERS_NAME}.`,
};

export default function CareersIndexPage() {
  return <CareersIndex roles={CAREERS_ROLES} />;
}
