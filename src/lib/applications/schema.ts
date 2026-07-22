import { z } from "zod";
import { YEARS_OF_EXPERIENCE } from "./types";

/**
 * Zod issue `message` values below are stable codes — not English text —
 * matching `Messages["validation"]` keys (see `src/lib/translations/*​/validation.ts`).
 * The API keeps returning these verbatim inside `error.details` (via `flatten()`
 * in `jsonError`); any UI surfacing them should localize with `t.validation[code]`
 * rather than displaying the code directly. This mirrors the client-side
 * `apply-form.tsx` validation, which already uses the same codes.
 */
const optionalUrl = z
  .union([z.string().url("urlInvalid"), z.literal("")])
  .transform((v) => (v ? v : null));

export const createApplicationSchema = z.object({
  roleSlug: z.string().min(1, "roleRequired"),
  personal: z.object({
    fullName: z.string().trim().min(2, "fullNameRequired"),
    email: z.string().trim().email("emailInvalid"),
    phone: z.string().trim().min(7, "phoneRequired"),
    countryOfResidence: z.string().trim().min(2, "countryRequired"),
  }),
  professional: z.object({
    yearsOfExperience: z.enum(YEARS_OF_EXPERIENCE, "experienceRequired"),
    currentCompany: z
      .union([z.string().trim(), z.literal("")])
      .transform((v) => (v ? v : null)),
    currentPosition: z
      .union([z.string().trim(), z.literal("")])
      .transform((v) => (v ? v : null)),
    linkedInUrl: z.string().trim().url("linkedInUrlInvalid"),
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
    interestReason: z.string().trim().min(20, "interestReasonTooShort"),
    strongFitReason: z.string().trim().min(20, "strongFitReasonTooShort"),
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
