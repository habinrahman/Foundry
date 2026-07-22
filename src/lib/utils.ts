import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatScore(value: number): string {
  return Math.round(value).toString();
}

export function recommendationTone(
  value: string
): "strong" | "positive" | "neutral" | "negative" {
  switch (value) {
    case "Strong Hire":
      return "strong";
    case "Hire":
      return "positive";
    case "Interview":
      return "neutral";
    case "Reject":
      return "negative";
    default:
      return "neutral";
  }
}
