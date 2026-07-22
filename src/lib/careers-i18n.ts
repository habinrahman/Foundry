import type { CareerRole } from "@/data/careers/roles";
import type { Messages } from "@/lib/i18n/types";

type RoleMetadata = Messages["careers"]["roles"]["metadata"];
type RoleBySlug = Messages["careers"]["roles"]["bySlug"];
export type RoleCopy = RoleBySlug[keyof RoleBySlug];

/**
 * `CareerRole` fields like `department`/`location` are plain strings (data),
 * while the catalog keys them by their English value. Cast-and-fallback so a
 * role whose metadata value isn't in the catalog yet still renders (in
 * English) instead of crashing.
 */
export function localizeRoleMeta(t: Messages, role: CareerRole) {
  const meta = t.careers.roles.metadata as {
    departments: Record<string, string>;
    locations: Record<string, string>;
    employmentTypes: Record<string, string>;
    experienceLevels: Record<string, string>;
  } & RoleMetadata;
  return {
    department: meta.departments[role.department] ?? role.department,
    location: meta.locations[role.location] ?? role.location,
    employmentType:
      meta.employmentTypes[role.employmentType] ?? role.employmentType,
    experience: meta.experienceLevels[role.experience] ?? role.experience,
  };
}

/** Localized summary/responsibilities/requirements for a role, falling back to the English data if the slug is missing from the catalog. */
export function getRoleCopy(t: Messages, role: CareerRole): RoleCopy {
  const bySlug = t.careers.roles.bySlug as Record<string, RoleCopy>;
  return bySlug[role.slug] ?? role;
}
