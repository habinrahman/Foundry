import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE, getAppUrl, SITE } from "@/lib/site";

const appUrl = getAppUrl();

export const rootMetadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: `${APP_NAME} · ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  keywords: [
    "AI recruitment",
    "hiring intelligence",
    "AI hiring",
    "resume analysis",
    "AI interview",
    "hiring dashboard",
    "Gemini",
    "Series A SaaS",
  ],
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: APP_NAME,
    title: `${APP_NAME} · ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} · ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: ["/opengraph-image"],
    creator: SITE.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon" }],
  },
  alternates: {
    canonical: appUrl,
  },
};
