export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Foundry";
export const APP_TAGLINE = "AI Hiring Intelligence Platform";
export const APP_DESCRIPTION =
  "Foundry is an AI hiring intelligence platform — parse resumes, generate adaptive interviews, evaluate answers, and ship executive hiring reports.";

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const SITE = {
  name: APP_NAME,
  tagline: APP_TAGLINE,
  description: APP_DESCRIPTION,
  twitterHandle: "@foundry",
} as const;
