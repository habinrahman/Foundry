export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Foundry";
export const APP_TAGLINE = "AI Hiring Intelligence Platform";
export const APP_DESCRIPTION =
  "Foundry is an AI Hiring Intelligence Platform — a premium candidate careers experience paired with an internal recruiter intelligence workflow for resume parsing, skill extraction, ATS scoring, interview questions, and hiring recommendations.";

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
