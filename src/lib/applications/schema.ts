import { z } from "zod";
import { YEARS_OF_EXPERIENCE } from "./types";

const optionalUrl = z
  .union([z.string().url("Enter a valid URL"), z.literal("")])
  .transform((v) => (v ? v : null));

export const createApplicationSchema = z.object({
  roleSlug: z.string().min(1, "Select a role"),
  personal: z.object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().min(7, "Enter a phone number"),
    countryOfResidence: z.string().trim().min(2, "Enter your country"),
  }),
  professional: z.object({
    yearsOfExperience: z.enum(YEARS_OF_EXPERIENCE),
    currentCompany: z
      .union([z.string().trim(), z.literal("")])
      .transform((v) => (v ? v : null)),
    currentPosition: z
      .union([z.string().trim(), z.literal("")])
      .transform((v) => (v ? v : null)),
    linkedInUrl: z.string().trim().url("Enter a valid LinkedIn URL"),
    githubUrl: optionalUrl,
    portfolioUrl: optionalUrl,
  }),
  resume: z.object({
    fileName: z.string().nullable().optional(),
    mimeType: z.string().nullable().optional(),
    sizeBytes: z.number().nullable().optional(),
    text: z.string().nullable().optional(),
  }),
  answers: z.object({
    interestReason: z
      .string()
      .trim()
      .min(20, "Share a bit more about your interest"),
    strongFitReason: z
      .string()
      .trim()
      .min(20, "Share why you are a strong fit"),
    additionalNotes: z
      .union([z.string().trim(), z.literal("")])
      .transform((v) => (v ? v : null)),
  }),
  metadata: z
    .object({
      userAgent: z.string().nullable().optional(),
      referrer: z.string().nullable().optional(),
    })
    .optional(),
});

export type CreateApplicationPayload = z.infer<typeof createApplicationSchema>;
