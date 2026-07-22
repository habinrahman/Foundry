import type { Metadata } from "next";
import { HomePageClient } from "./home-client";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${APP_NAME} · ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
};

export default function HomePage() {
  return <HomePageClient />;
}
