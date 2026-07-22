# Tamm Careers + Foundry Applications — Design Spec

**Date:** 2026-07-22  
**Status:** Finalized — awaiting confirmation to proceed to implementation plan  
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
│   ├── layout.tsx                 # Tamm Careers chrome only
│   ├── page.tsx                   # Careers landing (/)
│   ├── careers/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── apply/page.tsx
│   └── application/success/page.tsx
├── (foundry)/
│   ├── layout.tsx                 # Foundry shell + providers
│   ├── candidate/
│   └── recruiter/
├── api/
│   ├── applications/route.ts      # POST create, GET list
│   ├── applications/[id]/route.ts
│   └── ai/...                     # Existing AI routes (unchanged)
├── layout.tsx                     # Root: fonts, ThemeProvider, ErrorBoundary, globals
└── globals.css
```

### Critical refactor: split providers from root

**Today:** Root `layout.tsx` wraps all pages in `AppProviders`, which mounts the Foundry shell (nav, command palette, candidate store) on every route—including the future careers home. That must change.

| Layer | Responsibilities |
|-------|------------------|
| **Root layout** | `html`/`body`, fonts, `ThemeProvider`, `ErrorBoundary`, `{children}` only. **No** Foundry shell. **No** Careers shell. |
| **`(public)/layout.tsx`** | Tamm Careers header/footer, theme toggle, skip link. No `CandidateStoreProvider`, no command palette, no recruiter links. |
| **`(foundry)/layout.tsx`** | Existing Foundry chrome moved here: `CandidateStoreProvider`, `CommandPaletteProvider`, shell nav, command palette, theme toggle. |

Preserve all existing Foundry behavior under `(foundry)`. Do not regress Talk / Hire / AI pipeline / dashboard panels.

### Chrome separation

| Surface | Brand | Navigation |
|---------|--------|------------|
| Public | **Tamm Careers** | About (`#why` / about anchors) · Engineering (`#engineering` or `/careers`) · Open Roles (`/careers`) · Apply (`/apply`) |
| Foundry | **Foundry** | Talk (`/candidate`) · Hire (`/recruiter`) |

Rules:

- Public never links to `/recruiter` or mounts Foundry product chrome.
- Foundry nav does **not** include a Home link to `/` (that would dump recruiters into the careers site). Talk + Hire only.
- Root layout has no product navigation.
- Reuse design-system primitives (buttons, tokens, typography, motion, dropzone).

### Site constants

```
src/lib/site.ts          # Foundry APP_NAME, tagline (existing, keep)
src/lib/careers-site.ts  # CAREERS_NAME = "Tamm Careers", company copy, SEO helpers
```

Public pages use careers site constants. Foundry shell continues to use `APP_NAME`.

---

## 4. Public pages

### `/` — Careers landing

Sections (in order):

1. **Hero** — Headline: “Build AI that transforms manufacturing.” Supporting copy on engineering challenges and impact. Primary CTA: Apply Now → `/apply`. Secondary: View Open Roles → `/careers`. Right side: original animated/abstract visualization (not copied from other careers sites; not Foundry Orbit marketing reuse as the brand hero).
2. **Why Tamm** — AI-first engineering, real-world impact, ownership, global collaboration, continuous learning (premium feature cards).
3. **Engineering Culture** — Ship quickly · Build responsibly · Learn continuously · Own outcomes (timeline or cards).
4. **Life at Tamm** — Short atmospheric section (culture/work-life signal); keep sparse and premium.
5. **What You’ll Build** — LLMs, AI agents, developer tools, automation, cloud, scalable systems, manufacturing intelligence.
6. **Benefits** — Responsive grid: Remote Friendly, Flexible Hours, Learning Budget, Competitive Compensation, Top Equipment, Global Team.
7. **Hiring Process** — Animated timeline: Application → Resume Review → Technical Interview → System Design → Offer. **Do not mention Foundry** in this timeline.
8. **Open Engineering Roles** — Premium job card(s) for catalog roles; Apply → `/apply?role=…`; details → `/careers/[slug]`.
9. **Call to Action**
10. **Footer** — Simple, professional, careers-focused.

**Visual direction:** Premium typography, large whitespace, soft gradients, glass used sparingly, elegant micro-interactions, restrained animations, fast performance, accessibility, mobile-first. Polish level inspired by OpenAI / Linear / Vercel / Apple—not traditional HR software. Original design only (no copied layouts, copy, illustrations, icons, or animations).

**Performance:** Lazy-load heavy below-fold sections (`next/dynamic` or deferred client islands). Prefer CSS for ambient motion when possible. Reserve fixed aspect ratios for hero media to avoid CLS. Semantic HTML landmarks (`header`, `main`, `section`, `footer`, `nav`).

### Inspiration vs originality (important)

Real-world hiring often uses a basic Google Form (name, email, WhatsApp phone, role, country, fit question, resume). This project is a **premium alternative**, not a recreation.

**Collect the same essential information** so the demo is realistic.  
**Do not copy** any real employer’s exact form wording, layout, branding, field labels, or visual design. Write original copy and craft an original UI.

### Role catalog

Seed `src/data/careers/roles.ts` with these open engineering roles (original descriptions/requirements—titles only are shared with common industry naming):

| Slug | Title |
|------|--------|
| `senior-backend-engineer-nodejs` | Senior Backend Engineer (Node.js) |
| `founding-ai-engineer` | Founding AI Engineer |
| `ai-research-engineer` | AI Research Engineer |
| `generative-ai-engineer` | Generative AI Engineer |
| `ai-product-engineer` | AI Product Engineer |
| `engineering-lead` | Engineering Lead |

All roles appear on `/careers` and support `/careers/[slug]` + `/apply?role=<slug>`. **AI Product Engineer** is the flagship detail page (richest content); other roles get complete, credible detail pages without blocking polish on the flagship.

### `/careers`

Engineering opportunities listing from the static catalog. Reuse `JobCard`.

### `/careers/[slug]`

Role details: location (e.g. Remote), employment type (Full-time), experience signal, original overview, responsibilities, requirements. Apply CTA → `/apply?role=<slug>`. Unknown slug → `notFound()`.

### `/apply`

Premium multi-step form (client component). Role is **pre-selected** when arriving from a job page (`?role=`); still changeable via an elegant select (not a Google Forms dropdown clone).

| Step | Fields |
|------|--------|
| 1 · Personal | Full name, email, phone (WhatsApp-capable), country of residence |
| 2 · Position | Role (pre-selected), years of experience, current company (optional), current position (optional) |
| 3 · Professional profile | LinkedIn, GitHub (optional), portfolio (optional) |
| 4 · Resume | Drag-and-drop via `ResumeDropzone`; PDF/DOCX validation; upload/extract progress; attempt `/api/ai/extract-text` |
| 5 · Questions | Why are you interested in this role? · Why are you a strong fit? · Anything else you'd like us to know? (optional) |
| 6 · Review | Summary of all answers → Submit |

**Submit:** `POST /api/applications` → on success navigate to `/application/success?applicationId=<id>`.

**Extraction resilience:** If text extraction fails, still allow submit with resume metadata and `resumeText: null`. Recruiter path will use demo fallback for analysis.

**Validation:** Client UX validation + server Zod (source of truth). Phone labeled for WhatsApp contact without requiring WhatsApp API integration.

### `/application/success`

Query: `applicationId` (required). Optionally fetch application for role title; if fetch fails, show id and generic thank-you.

Copy (approved):

- ✓ Application Submitted  
- Thank you for applying for **{roleTitle}**  
- Application ID: **{id}**  
- What happens next?  
  - Your application has been received.  
  - Recruiters will review your profile.  
  - Foundry will prepare AI-powered hiring insights.  
  - If your experience is a good match, we'll contact you.  
- Buttons: **View Other Roles** → `/careers` · **Back to Careers** → `/`

No `/candidate` link. No recruiter link.

---

## 5. Applications domain layer

### Structure

```
src/lib/applications/
  types.ts
  schema.ts
  repository.ts              # interface + getApplicationRepository()
  memory-store.ts            # MemoryApplicationRepository + module singleton
  service.ts                 # ApplicationService
  id.ts                      # APP-YYYY-##### (zero-padded sequence)
  index.ts

src/data/careers/
  roles.ts                   # CAREERS_ROLES[], getRoleBySlug()
```

### Repository contract

```ts
interface ApplicationRepository {
  create(input: NormalizedCreateInput): Promise<Application>;
  getById(id: string): Promise<Application | null>;
  list(): Promise<Application[]>; // newest first
}
```

- Route handlers and UI call **ApplicationService** only.
- Never import the in-memory `Map` from UI or route handlers.
- `getApplicationRepository()` returns the singleton memory impl for now; later returns Postgres/Supabase impl via env switch without UI changes.

**Next.js note:** Memory store must be a **module-level singleton** so App Router handlers in the same process share state. Document that serverless multi-instance / restarts clear data (acceptable for demo).

### Application record

```ts
type ApplicationStatus = "received" | "analyzing" | "ready" | "demo";

interface Application {
  id: string;                 // APP-2026-00124
  createdAt: string;          // ISO
  roleSlug: string;
  roleTitle: string;
  // Personal
  fullName: string;
  email: string;
  phone: string;              // WhatsApp-capable contact number
  countryOfResidence: string;
  // Position
  yearsOfExperience: string;  // e.g. "0-1" | "1-3" | "3-5" | "5-8" | "8+"
  currentCompany?: string | null;
  currentPosition?: string | null;
  // Profile
  linkedInUrl: string;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  // Questions (original wording in UI; stored as answers)
  interestReason: string;
  strongFitReason: string;
  additionalNotes?: string | null;
  // Resume
  resumeFileName?: string | null;
  resumeMimeType?: string | null;
  resumeSizeBytes?: number | null;
  resumeText?: string | null;
  status: ApplicationStatus;  // default "received"
}
```

**Status semantics (keep thin):**

- `received` — stored, not yet opened for analysis in this session  
- `analyzing` — optional transient client-side while pipeline runs (may not persist)  
- `ready` — optional: set after successful live AI hydrate (persist via `updateStatus` if added; otherwise client-local is fine for demo)  
- `demo` — analysis shown from demo fallback (no live resume text)

For this iteration, **persisting analysis results into the repository is out of scope**. Analysis lives in `CandidateStore` after hydrate. List “analysis status” can be derived: `resumeText ? "Ready to analyze" : "Demo fallback"` until opened; after successful pipeline in-session, show “Analyzed”.

Optional small repo method `updateStatus(id, status)` is allowed if it keeps the list honest without storing full AI payloads.

### API design

Align with existing AI HTTP helpers (`jsonOk` / `jsonError`):

| Method | Path | Behavior |
|--------|------|----------|
| `POST` | `/api/applications` | Zod validate → service.create → `{ ok: true, data: { applicationId, application } }` |
| `GET` | `/api/applications` | `{ ok: true, data: { applications } }` newest first |
| `GET` | `/api/applications/[id]` | `{ ok: true, data: { application } }` or 404 |

- Validation errors → 400 + Zod flatten (same pattern as AI routes).  
- No auth this iteration (demo). Document as intentional non-goal.  
- Do not accept raw file uploads on POST; client sends extracted text + metadata JSON only (keeps API simple; extraction already exists).

### Client API helper

```
src/lib/applications/api-client.ts  # createApplication(), listApplications(), getApplication()
```

Mirror style of `src/lib/ai/api-client.ts`.

---

## 6. Foundry recruiter extension (Option B — medium)

**Goal:** Applications list is the **entry point** into the existing analysis dashboard. Foundry remains an AI hiring intelligence platform—not a full ATS.

### Minimum new UI

`ApplicationsList` above or beside the existing dashboard header on `/recruiter`:

| Column / field | Source |
|----------------|--------|
| Candidate name | `fullName` |
| Role | `roleTitle` |
| Submitted time | `createdAt` |
| Resume status | metadata / `resumeText` presence |
| Analysis status | derived (see §5) |

Empty state: “No applications yet — candidates apply via Tamm Careers.”

### Selection → hydrate (reuse existing pipeline)

1. `GET /api/applications/[id]`.
2. Set selected application id in local recruiter UI state.
3. If `resumeText` present:
   - Run existing `useLiveAiPipeline` (or shared service) with `{ resumeText, linkedInUrl }`.
   - On complete → `setCandidate(session)` (existing store).
   - Prefer mapping `fullName` / `roleTitle` onto the session when building.
4. If no `resumeText`:
   - Seed from `DEMO_CANDIDATE` (or thin merge of application personal fields + demo analysis).
   - Surface a clear non-blocking notice: “Showing representative demo analysis — resume text unavailable.”
5. Existing panels unchanged: overview scores, resume summary, skills, radar, timeline, strengths/risks, interview Qs, evaluation, hiring recommendation, export.

**Preserve:** Export bar, command palette, keyboard shortcuts, theme toggle, demo candidate default when nothing selected.

**Do not:** Second dashboard, kanban, email, auth, multi-stage ATS.

---

## 7. State management

| Concern | Where |
|---------|--------|
| Apply form wizard | Local React state in `ApplyForm` |
| Submitted application | Server memory repository |
| Success page | Read `applicationId` from query; optional GET |
| Recruiter applications list | Fetch on mount / focus; local selected id |
| Dashboard insights | Existing `CandidateStore` (Foundry layout only) |
| Theme | Root `ThemeProvider` (shared) |

No global careers store. No duplicating candidate session into the applications repository.

---

## 8. Component reuse vs new

### Reuse as-is

- `Button`, `Badge`, `Skeleton`, `EmptyState`, `ErrorBoundary`
- `ResumeDropzone`, `UploadIllustration`
- Motion: `FadeIn`, `PageTransition`, `usePrefersReducedMotion`, `useInView` patterns
- Design tokens / glass utilities in `globals.css`
- Dashboard panels, `useLiveAiPipeline`, `buildCandidateSession`, AI API client
- `jsonOk` / `jsonError`

### New (careers-specific)

- Careers shell, landing sections, hero visualization, job card, hiring process, apply form, success view
- `ApplicationsList` + thin hydrate wiring in recruiter dashboard

### Retire / stop mounting

- Foundry marketing home (`LandingPage` at `/`) — replace with Careers landing.
- Prefer removing unused `src/components/landing/*` mount points once Careers lands; delete dead marketing home if nothing else imports it (avoid two competing homes). Extract any shared reveal/glass helpers into `src/components/careers` or shared `ui` only if needed—**do not** duplicate both trees long-term.

---

## 9. Accessibility

- Semantic landmarks and heading hierarchy on all public pages.
- Skip-to-content on both shells.
- Apply wizard: step announced (`aria-current`), focus move to step heading on change, keyboard-accessible controls.
- Form errors associated via `aria-describedby` / `aria-invalid`.
- Success page: status role for confirmation.
- Applications list: keyboard selectable rows (`button` or `aria-selected` listbox pattern), visible focus rings using existing accent tokens.
- Respect `prefers-reduced-motion` for landing animations and hiring timeline.
- Color contrast via existing semantic tokens (light + dark).

---

## 10. Performance & mobile

- Public landing: defer below-fold client bundles; keep hero lean.
- Images: `next/image` where used; fixed dimensions / aspect ratio.
- Recruiter: keep existing dynamic import for radar chart; applications list must be light (no chart libs).
- Mobile: careers nav collapses to simple header + menu or compact links; apply steps stack full-width; applications list scrolls horizontally or stacks cards on small screens without breaking dashboard.
- No layout shift from fonts (existing `fontVariables`) or hero orbs (absolute decorative, `aria-hidden`).

---

## 11. Scalability (future DB)

```
ApplicationService
  → ApplicationRepository (interface)
      → MemoryApplicationRepository   // now
      → SupabaseRepository            // later
      → PostgresRepository            // later
```

Swap rules:

1. Keep Zod schemas and `Application` type stable.  
2. Change only `getApplicationRepository()` wiring / factory.  
3. No UI, route path, or careers component changes required for storage swap.  
4. When adding DB: migrate `resumeText` size carefully (consider object storage for files later—out of scope now).

---

## 12. Complexity guards (YAGNI)

| Avoid | Prefer |
|-------|--------|
| Full ATS / stages / auth / email | Lightweight list + hydrate |
| Storing AI JSON on Application | CandidateStore after analyze |
| Pathname-based shell switching | Route group layouts |
| Parallel careers design system | Existing tokens + Button |
| Candidate AI interview | Public journey ends at success |
| Uploading binary to applications API | Extract text client-side, POST JSON |

---

## 13. SEO, sitemap, command palette

- Public metadata: Tamm Careers titles/descriptions via `careers-site` helpers.
- Foundry metadata: unchanged for `/candidate` and `/recruiter`.
- Update `sitemap.ts` for `/`, `/careers`, `/careers/ai-product-engineer`, `/apply` (success can be `noindex`).
- Command palette mounts **only** in Foundry layout.
- Theme toggle on both shells.

---

## 14. Non-goals (this iteration)

- Full ATS pipeline / stages / kanban  
- Authentication / authorization  
- Email workflows  
- Candidate AI interview / assessment  
- Real database integration  
- Multi-tenancy  
- Replacing existing dashboard panels with a new ATS UI  
- Persisting full AI analysis payloads on the Application record  

---

## 15. Acceptance criteria

1. `/` is a polished Tamm Careers landing with all required sections; original design; responsive; accessible; light + dark.  
2. `/careers` lists all six seeded roles; `/careers/[slug]` works for each; Apply routes to `/apply?role=…`.  
3. `/apply` multi-step collects personal → position → profile → resume → questions → review; validates; extracts text when possible; POSTs; redirects to success with id.  
4. Apply UI/copy is original—not a Google Form clone or a reproduction of any employer’s form.  
5. `/application/success` ends the candidate journey with approved copy; CTAs only to careers.  
6. Public layout never shows Foundry nav, command palette, or recruiter links.  
7. Foundry Talk/Hire/AI/export behavior preserved; Applications list appears on `/recruiter`.  
8. Selecting an application hydrates the existing dashboard; live AI when `resumeText` exists; labeled demo fallback otherwise.  
9. Storage behind `ApplicationRepository`; memory singleton only for now.  
10. Root no longer wraps public routes in Foundry `AppProviders` shell.  
11. `npm run typecheck` and `npm run build` pass after each implementation phase.  

---

## 16. Implementation phases (for the plan — not started yet)

| Phase | Deliverable | Verify before next |
|-------|-------------|--------------------|
| **1 · Layouts** | `(public)` / `(foundry)` split; root slimmed; Foundry shell unchanged in behavior | Build; `/candidate` + `/recruiter` work; `/` temporarily placeholder OK |
| **2 · Careers pages** | Catalog, `/careers`, `/careers/[slug]`, landing sections | Build; public nav; no Foundry chrome on public |
| **3 · Apply + success** | Multi-step form, extract-text attempt, success page UI (API can stub then harden) | Build; form UX |
| **4 · API** | Domain layer + POST/GET applications | Build; create + list via curl/fetch |
| **5 · Recruiter integration** | Applications list + hydrate existing dashboard | Build; E2E apply → appear → analyze |
| **6 · Polish** | SEO/sitemap, a11y pass, remove dead Foundry marketing home, motion/perf | Final typecheck + build |

Each phase must preserve existing Foundry functionality. Refactor only where required for the public/internal split.

---

## 17. Comprehensive self-review (2026-07-22)

| Area | Finding | Resolution in this revision |
|------|---------|------------------------------|
| Architectural consistency | Root `AppProviders` currently paints Foundry on all routes | Explicit provider/layout split (§3) |
| Route organization | Route groups approved; Home→`/` conflict for recruiters | Foundry nav = Talk + Hire only (§3) |
| Public vs internal | Risk of command palette / store on public | Foundry providers only in `(foundry)/layout` |
| Component reuse | Dual landing trees | Reuse primitives; retire Foundry marketing home mount (§8) |
| API design | Need shape consistency with AI routes | `jsonOk`/`jsonError`; JSON-only POST; no file binary (§5) |
| State management | Unclear where analysis lives | Applications in repo; insights in CandidateStore (§7) |
| Analysis status | Over-modeling risk | Derived + optional thin status; no AI payload persistence (§5–6) |
| Accessibility | Under-specified | Dedicated §9 |
| Performance | Under-specified | Dedicated §10; lazy below-fold |
| Mobile | Under-specified | Nav collapse, stacked apply, list adaptation (§10) |
| Scalability | Interface OK; singleton/factory vague | Factory + singleton + swap rules (§5, §11) |
| Extraction failure | Could block apply | Submit allowed without `resumeText` (§4) |
| Unnecessary complexity | Full ATS / stored AI JSON | Explicit YAGNI table (§12) |
| Duplicated logic | Parallel design systems | Forbidden; share tokens/Button/dropzone |
| Regression risk | Layout move could break Foundry | Phase 1 verification gate; preserve Talk/Hire/AI/export (§16) |

**Ambiguity closed:** `/candidate` is Foundry-only demo Talk—not hiring. Success never links there.

**Form realism (2026-07-22 addendum):** Apply steps mirror essential info from a typical careers Google Form (identity, role, country, fit narrative, resume) but use a premium multi-step UX and **original** copy/UI. Six engineering roles seeded in the catalog.

**No TBD placeholders** remain for this scope.
