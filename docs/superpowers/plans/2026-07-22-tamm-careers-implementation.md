# Tamm Careers + Foundry Applications — Implementation Plan

> **For agentic workers:** Execute phase-by-phase. After each phase: `npm run typecheck` and `npm run build` must pass; Foundry `/candidate` and `/recruiter` must not regress. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public Tamm Careers experience that submits applications into Foundry, where recruiters open a lightweight Applications list and hydrate the existing AI hiring dashboard.

**Architecture:** Next.js App Router route groups `(public)` / `(foundry)` with separate shells; `ApplicationService` → `ApplicationRepository` → memory store; careers catalog in `src/data/careers/roles.ts`; nested `Application` type with `analysis: null` on create.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind 4, Zod, existing AI pipeline, Framer Motion, next-themes.

**Spec:** `docs/superpowers/specs/2026-07-22-tamm-careers-design.md`

## Global Constraints

- Do not create a second application or ATS product.
- Candidates never see Foundry chrome; recruiters never see Careers chrome on internal routes.
- No candidate AI assessment; journey ends at `/application/success`.
- No auth, email, kanban, hiring stages, comments, scheduling, or real DB.
- Preserve Foundry Talk / Hire / AI / export behavior.
- Original careers copy/UI — do not clone Google Forms or third-party careers sites.
- Reuse design tokens, `Button`, `ResumeDropzone`, dashboard panels, `useLiveAiPipeline`.
- Verify typecheck + build after every phase.

---

## File map (create / move)

```
src/app/layout.tsx                          # slim: theme + error boundary only
src/app/(public)/layout.tsx                 # NEW careers shell
src/app/(public)/page.tsx                   # NEW careers landing
src/app/(public)/careers/page.tsx
src/app/(public)/careers/[slug]/page.tsx
src/app/(public)/apply/page.tsx
src/app/(public)/application/success/page.tsx
src/app/(foundry)/layout.tsx                # NEW — move Foundry providers/shell here
src/app/(foundry)/candidate/page.tsx        # MOVE from src/app/candidate
src/app/(foundry)/recruiter/page.tsx        # MOVE
src/app/api/applications/route.ts
src/app/api/applications/[id]/route.ts
src/lib/careers-site.ts
src/lib/applications/*                      # types, schema, repository, memory, service, id, api-client
src/data/careers/roles.ts
src/components/careers/*                    # shell, landing, job-card, apply-form, success
src/components/dashboard/applications-list.tsx
src/components/providers/app-providers.tsx  # Foundry-only shell (Talk + Hire)
```

Remove / stop mounting: `src/app/page.tsx`, `src/app/home-client.tsx`, Foundry marketing `LandingPage` at `/` (delete unused landing mount after careers home ships).

---

### Phase 1: Architecture — route groups, layouts, navigation, providers

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx` (temporary placeholder OK)
- Create: `src/app/(foundry)/layout.tsx`
- Move: `candidate/*`, `recruiter/*` under `(foundry)/`
- Modify: `src/components/providers/app-providers.tsx` — Talk + Hire only; remove Home→`/`
- Create: `src/lib/careers-site.ts`, `src/components/careers/careers-shell.tsx`

- [ ] **Step 1:** Slim root layout to ThemeProvider + ErrorBoundary + children (no `AppProviders`).
- [ ] **Step 2:** Move Foundry pages under `(foundry)/`; `(foundry)/layout.tsx` wraps `AppProviders`.
- [ ] **Step 3:** Update Foundry nav to Talk + Hire only; `g h` shortcut → `/recruiter` (not public `/`).
- [ ] **Step 4:** Create `(public)/layout.tsx` with Careers shell (brand, About, Engineering, Open Roles, Apply, theme toggle). No command palette / CandidateStore.
- [ ] **Step 5:** `(public)/page.tsx` placeholder “Tamm Careers” so `/` builds.
- [ ] **Step 6:** `npm run typecheck` && `npm run build`. Manually confirm `/candidate` and `/recruiter` still work; `/` has Careers chrome only.
- [ ] **Step 7:** Commit `feat: split public and Foundry app router layouts`

---

### Phase 2: Public careers — landing, listings, job details

**Files:**
- Create: `src/data/careers/roles.ts` (6 roles + helpers)
- Create: `src/components/careers/landing/*`, `job-card.tsx`, `hiring-process.tsx`
- Replace: `(public)/page.tsx` with full landing
- Create: `(public)/careers/page.tsx`, `(public)/careers/[slug]/page.tsx`

Role shape:

```ts
export interface CareerRole {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  featured?: boolean;
}
```

Slugs: `senior-backend-engineer-nodejs`, `founding-ai-engineer`, `ai-research-engineer`, `generative-ai-engineer`, `ai-product-engineer`, `engineering-lead`.

Landing sections in order: Hero, Why Tamm, Engineering Culture, Life at Tamm, What You’ll Build, Benefits, Hiring Process, Open Roles, CTA, Footer.

- [ ] **Step 1:** Implement roles catalog + `getRoleBySlug`.
- [ ] **Step 2:** Job card + careers list + `[slug]` detail (notFound for unknown).
- [ ] **Step 3:** Full landing with original copy; lazy-load below-fold; reduced-motion safe.
- [ ] **Step 4:** Wire CTAs: Apply → `/apply?role=…`, View roles → `/careers`.
- [ ] **Step 5:** typecheck + build; spot-check mobile/desktop.
- [ ] **Step 6:** Commit `feat: add Tamm Careers landing and role pages`

---

### Phase 3: Application flow — multi-step form, review, success UI

**Files:**
- Create: `src/components/careers/apply-form.tsx` (+ step subcomponents if needed)
- Create: `src/components/careers/application-success.tsx`
- Create: `(public)/apply/page.tsx`, `(public)/application/success/page.tsx`
- Extend: `ResumeDropzone` usage for progress if needed (prefer props, avoid breaking candidate upload)

Steps: Personal → Position → Profile → Resume → Questions → **Review (edit any section)** → Submit.

Until Phase 4 API exists, submit may call a temporary client stub **or** land Phase 4 first within the same PR stream—prefer implementing form UI + client validation in Phase 3, wire real POST in Phase 4 immediately after (same session). Review must support jump-to-step edit.

- [ ] **Step 1:** Apply page reads `?role=` → `getRoleBySlug`; invalid slug falls back to featured/default with notice.
- [ ] **Step 2:** Implement steps 1–5 with accessible field labels and validation.
- [ ] **Step 3:** Resume step: dropzone, PDF/DOCX, extract-text attempt, progress, allow continue without text.
- [ ] **Step 4:** Review step summarizing personal / role / resume / links / answers with Edit actions.
- [ ] **Step 5:** Success page UI (fetch by id once API exists; accept `applicationId` query).
- [ ] **Step 6:** typecheck + build.
- [ ] **Step 7:** Commit `feat: add premium multi-step careers application flow`

---

### Phase 4: Backend — applications API + repository

**Files:**
- Create: `src/lib/applications/types.ts` (nested Application model from spec)
- Create: `schema.ts`, `id.ts`, `repository.ts`, `memory-store.ts`, `service.ts`, `api-client.ts`, `index.ts`
- Create: `src/app/api/applications/route.ts`, `[id]/route.ts`
- Wire: Apply form submit → `createApplication()` → redirect success

Use `jsonOk` / `jsonError` from `src/lib/ai/http.ts`.

```ts
// create assigns: id, submittedAt, status: "received", analysis: null,
 // role resolved from catalog by slug, metadata.source: "tamm-careers"
```

- [ ] **Step 1:** Types + Zod create schema matching nested model.
- [ ] **Step 2:** Memory singleton repository + service.
- [ ] **Step 3:** POST/GET list + GET by id routes.
- [ ] **Step 4:** Wire apply form submit; success page loads application.
- [ ] **Step 5:** Manual POST test; typecheck + build.
- [ ] **Step 6:** Commit `feat: add applications API with repository abstraction`

---

### Phase 5: Foundry integration — applications list + AI hydrate

**Files:**
- Create: `src/components/dashboard/applications-list.tsx`
- Modify: `src/components/dashboard/recruiter-dashboard.tsx`
- Reuse: `useLiveAiPipeline`, `useCandidateStore`, `DEMO_CANDIDATE`

List fields: name, role, submitted time, resume status, analysis status.

On select: load application → if `resume.text` run pipeline → `setCandidate`; else demo fallback + notice.

- [ ] **Step 1:** ApplicationsList + fetch on mount.
- [ ] **Step 2:** Selection hydrate logic; map personal name / role title into session when possible.
- [ ] **Step 3:** Empty/loading/error states; preserve export + panels.
- [ ] **Step 4:** E2E: apply → list shows → select → panels populate.
- [ ] **Step 5:** typecheck + build; confirm `/candidate` unchanged.
- [ ] **Step 6:** Commit `feat: wire careers applications into Foundry recruiter dashboard`

---

### Phase 6: Polish — a11y, performance, SEO, cleanup

**Files:**
- Modify: `src/app/sitemap.ts`, SEO helpers, `robots.ts` if needed
- Remove dead Foundry marketing home (`home-client`, unused `landing/*` if unreferenced)
- Pass: focus management, skip links, reduced motion, empty/error states
- Responsive pass on careers + apply + applications list

- [ ] **Step 1:** Sitemap + metadata for public routes; success `noindex`.
- [ ] **Step 2:** Delete unused marketing home; fix imports.
- [ ] **Step 3:** A11y + mobile polish.
- [ ] **Step 4:** Final typecheck + build + manual QA checklist from spec §15.
- [ ] **Step 5:** Commit `chore: polish careers experience and SEO`

---

## Phase verification checklist (every phase)

- [ ] `npm run typecheck` passes  
- [ ] `npm run build` passes  
- [ ] `/candidate` still loads Foundry Talk  
- [ ] `/recruiter` still loads dashboard  
- [ ] Public routes show Tamm Careers chrome only  
- [ ] No Foundry command palette on public routes  

## Execution

Proceed **inline, phase-by-phase** in this session (user approved plan and order). Do not skip verification gates.
