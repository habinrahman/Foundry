import { z } from "zod";

const nullableString = z.string().nullable();

export const educationEntrySchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: nullableString,
  endDate: nullableString,
  highlights: z.array(z.string()),
});

export const experienceEntrySchema = z.object({
  company: z.string(),
  title: z.string(),
  location: nullableString,
  startDate: nullableString,
  endDate: nullableString,
  current: z.boolean(),
  description: z.string(),
  highlights: z.array(z.string()),
  technologies: z.array(z.string()),
});

export const projectEntrySchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  url: nullableString,
  highlights: z.array(z.string()),
});

export const achievementEntrySchema = z.object({
  title: z.string(),
  description: z.string(),
  date: nullableString,
});

export const certificationEntrySchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: nullableString,
  credentialUrl: nullableString,
});

export const parsedResumeSchema = z.object({
  name: nullableString,
  email: nullableString,
  phone: nullableString,
  skills: z.array(z.string()),
  education: z.array(educationEntrySchema),
  experience: z.array(experienceEntrySchema),
  projects: z.array(projectEntrySchema),
  achievements: z.array(achievementEntrySchema),
  certifications: z.array(certificationEntrySchema),
  github: nullableString,
  portfolio: nullableString,
  linkedin: nullableString,
  rawTextExcerpt: nullableString,
});

export type ParsedResumeSchema = z.infer<typeof parsedResumeSchema>;
