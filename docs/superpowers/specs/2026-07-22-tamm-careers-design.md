# Tamm Careers + Foundry Applications — Design Spec

**Date:** 2026-07-22  
**Status:** Approved (pending final confirmation)  
**Scope:** Public Tamm Careers experience + application API + lightweight Foundry Applications entry into existing recruiter analysis

---

## 1. Product intent

Foundry is the **internal** AI hiring intelligence platform for recruiters.

Tamm Careers is the **public** candidate-facing hiring experience.

Candidates apply through Careers. They never use Foundry after applying. Recruiters open applications in Foundry, where AI analyzes resumes and prepares hiring insights.

### End-to-end demo narrative

```
Candidate discovers a role (Tamm Careers)
  → Applies (premium form)
  → Application stored (POST /api/applications)
  → Application Submitted (journey ends)
  → Recruiter sees application in Foundry
  → AI analyzes resume
  → Recruiter reviews insights and decides
```

---

## 2. Journey (locked)

### Public

```
/                          Tamm Careers Landing
  → /careers               Open Engineering Roles
  → /careers/[slug]        Role Details
  → /apply                 Premium Multi-Step Application
  → POST /api/applications
  → /application/success   Application Submitted
```

**Candidate journey ends at success.** No AI assessment. No redirect to `/candidate`.

### Internal

```
/recruiter
  → Applications list (lightweight)
  → Select application
  → Hydrate existing dashboard
  → Resume parsing → skills → ATS score → timeline → strengths → risks
    → interview questions → hiring recommendation
```

`/candidate` remains under the Foundry shell as an optional internal/demo Talk path. It is **not** part of the hiring journey and is **not** linked from Careers or success.

---

## 3. App Router architecture

Use route groups so public and internal chrome are separate layouts—not pathname conditionals in one shell.

```
src/app/
├── (public)/
│   ├── layout.tsx                 # Tamm Careers chrome
│   ├── page.tsx                   # Careers landing (/)
│   ├── careers/
│   │   ├── page.tsx               # Listings
│   │   └── [slug]/page.tsx       # Role details
│   ├── apply/page.tsx
│   └── application/success/page.tsx
├── (foundry)/
│   ├── layout.tsx                 # Existing Foundry shell (moved)
│   ├── candidate/
│   └── recruiter/
├── api/
│   ├── applications/route.ts      # POST create, GET list
│   ├── applications/[id]/route.ts # GET by id
│   └── ai/...                     # Existing AI routes (unchanged)
├── layout.tsx                     # Root: fonts, ThemeProvider, globals only
└── globals.css
```

### Chrome separation

| Surface | Brand | Navigation |
|---------|--------|------------|
| Public | **Tamm Careers** | About · Engineering · Open Roles · Apply |
| Foundry | **Foundry** | Talk · Hire (+ theme / command palette as today) |

Rules:

- Public never links to `/recruiter` or exposes Foundry product chrome.
- Foundry never uses Tamm Careers marketing nav.
- Root layout has no product navigation.
- Reuse design-system primitives (buttons, tokens, typography, motion, dropzone).

### Site constants

Introduce Careers-facing site metadata (e.g. `Tamm Careers`) separate from Foundry `APP_NAME` / tagline used by the internal shell and SEO for Foundry routes. Public pages must not brand as Foundry in the header.

---

## 4. Public pages

### `/` — Careers landing

Sections (in order):

1. Hero — headline: “Build AI that transforms manufacturing.” Primary CTA: Apply Now. Secondary: View Open Roles. Original animated/abstract visualization (not copied from other careers sites).
2. Why Tamm
3. Engineering Culture
4. Life at Tamm
5. What You’ll Build
6. Benefits
7. Hiring Process (timeline: Application → Resume Review → Technical Interview → System Design → Offer). Do not mention Foundry in this timeline.
8. Open Engineering Roles (job card → apply / role detail)
9. Call to Action
10. Footer (careers-focused, simple)

Visual direction: premium typography, large whitespace, soft gradients, glass used sparingly, restrained motion, mobile-first, accessible, `prefers-reduced-motion` respected. Aesthetic closer to OpenAI / Linear / Vercel / Apple polish level—not traditional HR software. Original design; do not copy layouts, copy, or illustrations from those brands.

Performance: lazy-load heavy below-fold sections; avoid layout shift; semantic HTML.

### `/careers`

Engineering opportunities listing from static job catalog. Premium job cards.

### `/careers/[slug]`

Role details for catalog entries. First role: **AI Product Engineer** (`ai-product-engineer`). Apply CTA → `/apply?role=<slug>`.

### `/apply`

Premium multi-step application:

- Personal details (name, email, phone optional)
- Professional links (LinkedIn, portfolio/GitHub optional)
- Role (from `?role=` / catalog)
- Resume upload (reuse `ResumeDropzone`)
- Work preferences / notes (lightweight)
- Submit → `POST /api/applications` → redirect to success with `applicationId`

On resume upload, attempt text extraction via existing `/api/ai/extract-text` so recruiters can run AI analysis later. Store resume **metadata** (filename, mime, size) plus extracted text when available. Do not require a full file blob store for this iteration.

### `/application/success`

Experience:

- Application Submitted confirmation
- Role title thank-you
- Application ID (e.g. `APP-2026-00124`)
- What happens next:
  - Application received
  - Recruiters will review the profile
  - Foundry will prepare AI-powered hiring insights (candidate is informed the team uses AI-assisted review; candidate does not use Foundry)
  - If a good match, they will be contacted
- CTAs: **View Other Roles** · **Back to Careers**
- No link to `/candidate` or recruiter UI

---

## 5. Applications domain layer

### Structure

```
src/lib/applications/
  types.ts                 # Application, CreateApplicationInput, status enums
  schema.ts                # Zod create/list schemas
  repository.ts            # ApplicationRepository interface
  memory-store.ts          # MemoryApplicationRepository
  service.ts               # ApplicationService (create, get, list)
  id.ts                    # APP-YYYY-##### generator

src/data/careers/
  roles.ts                 # Static role catalog (slug, title, location, type, etc.)
```

### Repository contract

```ts
interface ApplicationRepository {
  create(input: CreateApplicationInput): Promise<Application>;
  getById(id: string): Promise<Application | null>;
  list(): Promise<Application[]>;
}
```

UI and route handlers call **ApplicationService** only. They must not import the in-memory Map.

Later swap: `MemoryApplicationRepository` → `SupabaseRepository` / `PostgresRepository` with no UI or routing changes.

### Application record (minimum fields)

- `id` (display + storage id, e.g. `APP-2026-00124`)
- `createdAt`
- `roleSlug`, `roleTitle`
- Personal: `fullName`, `email`, `phone?`
- Links: `linkedInUrl?`, `portfolioUrl?`
- Preferences: `workPreference?`, `notes?`
- Resume: `resumeFileName?`, `resumeMimeType?`, `resumeSizeBytes?`, `resumeText?`
- Status: e.g. `received` | `analyzing` | `ready` (for list “analysis status”; keep minimal)

### API

| Method | Path | Behavior |
|--------|------|----------|
| `POST` | `/api/applications` | Validate with Zod, create via service, return `{ applicationId, application }` |
| `GET` | `/api/applications` | List applications (newest first) for Foundry |
| `GET` | `/api/applications/[id]` | Fetch one application for dashboard hydrate |

Validation failures → 400 with structured errors. Missing id → 404.

In-memory store is process-local (acceptable for demo; document restart clears data).

---

## 6. Foundry recruiter extension (Option B — medium)

**Goal:** Applications list is the entry point into the **existing** analysis dashboard. Not a full ATS.

### Minimum new UI

On `/recruiter`, add a lightweight Applications list sourced from `GET /api/applications` / repository:

- Candidate name
- Role
- Submitted time
- Resume status (uploaded / missing / text available)
- Analysis status

### Selection behavior

1. Load application by id.
2. If `resumeText` is present → run existing AI analysis pipeline (parse → analyze → fit → questions) → `setCandidate(session)` on the existing store.
3. If resume text is unavailable → gracefully fall back to representative demo / seeded session, clearly separated from persistence (do not pretend live analysis succeeded).
4. Existing panels render: resume summary, skills, ATS score, experience, strengths, risks, interview questions, hiring recommendation.

Do **not** build a second dashboard or full ATS pipeline UI (stages, kanban, email, auth).

Keep recruiter dashboard focused as an **AI hiring intelligence** surface.

---

## 7. Component organization

```
src/components/careers/
  careers-shell.tsx          # Public header/footer chrome
  landing/                   # Landing sections + hero illustration
  job-card.tsx
  hiring-process.tsx
  apply-form.tsx             # Multi-step apply UI
  application-success.tsx

src/components/dashboard/
  applications-list.tsx      # NEW — lightweight entry list
  recruiter-dashboard.tsx    # Wire list → hydrate existing panels
  ...existing panels...
```

Reuse: `Button`, badges, skeletons, `ResumeDropzone`, motion helpers, theme tokens, glass utilities from `globals.css`.

Existing Foundry marketing landing under `src/components/landing/` is superseded at `/` by Careers; remove or stop mounting it from the public home (prefer deleting unused marketing home mount rather than leaving two homes).

---

## 8. SEO, sitemap, and command palette

- Public routes: careers-oriented titles/descriptions (Tamm Careers).
- Update `sitemap.ts` / `robots.ts` for new public routes.
- Command palette (Foundry): keep internal; do not surface recruiter commands on public layouts. Public layout should not mount Foundry command chrome.
- Theme toggle: available on both experiences via shared ThemeProvider at root.

---

## 9. Non-goals (this iteration)

- Full ATS pipeline / stages / kanban
- Authentication / authorization
- Email workflows
- Candidate AI interview / assessment
- Real database integration
- Multi-tenancy
- Replacing existing dashboard panels with a new ATS UI

---

## 10. Acceptance criteria

1. `/` is a polished Tamm Careers landing with all required sections; original design; responsive; accessible.
2. `/careers` and `/careers/ai-product-engineer` work with Apply routing to `/apply?role=…`.
3. `/apply` validates, uploads resume, extracts text when possible, `POST`s application, redirects to success with id.
4. `/application/success` ends the candidate journey with approved copy and CTAs only to careers.
5. Public layout never shows Foundry nav or recruiter links.
6. Foundry layout unchanged in spirit; Applications list appears on `/recruiter`.
7. Selecting an application hydrates the existing dashboard; AI runs when resume text exists; demo fallback otherwise.
8. Storage is behind `ApplicationRepository`; memory impl only for now.
9. `npm run typecheck` and `npm run build` pass.

---

## 11. Implementation order (guidance for plan)

1. Route group split + public/foundry layouts
2. Applications domain + API
3. Careers data + listing + role detail
4. Careers landing page
5. Apply + success
6. Foundry Applications list + hydrate pipeline
7. SEO/sitemap cleanup + remove dead Foundry marketing home mount
8. Verify typecheck/build and manual E2E demo path

---

## Self-review notes (2026-07-22)

| Check | Result |
|-------|--------|
| Placeholders / TBD | None remaining for this scope |
| Consistency | Public ends at success; Foundry is recruiter-only; no candidate AI assessment |
| Scope | Option B medium Foundry only; repository-swappable storage |
| Ambiguity | `/candidate` kept as optional Foundry Talk demo, not hiring path — explicit |
| Success copy | Mentions Foundry preparing insights for recruiters without giving candidates Foundry UI |
| Dashboard | Applications list = entry; no second ATS UI |
