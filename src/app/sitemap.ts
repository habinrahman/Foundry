import type { MetadataRoute } from "next";
import { CAREERS_ROLES } from "@/data/careers/roles";
import { getAppUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl();
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/careers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    ...CAREERS_ROLES.map((role) => ({
      url: `${base}/careers/${role.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    {
      url: `${base}/apply`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    },
    {
      url: `${base}/candidate`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    {
      url: `${base}/recruiter`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];
}
