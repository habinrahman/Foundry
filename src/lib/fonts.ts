import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";

/**
 * General Sans (Indian Type Foundry) — self-hosted from Fontshare files.
 * License: https://www.fontshare.com/fonts/general-sans
 */
export const fontHeading = localFont({
  src: [
    {
      path: "../assets/fonts/general-sans/GeneralSans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/general-sans/GeneralSans-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/general-sans/GeneralSans-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/general-sans/GeneralSans-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
  preload: true,
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
});

export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
  preload: true,
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
});

export const fontMono = GeistMono;

export const fontVariables = `${fontHeading.variable} ${fontBody.variable} ${fontMono.variable}`;
