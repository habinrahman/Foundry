# Architecture

## System overview

```mermaid
flowchart TB
  subgraph Client["Browser"]
    Shell["AppProviders\nTheme · Command Palette · Shortcuts · Error Boundary"]
    Home["/ Landing"]
    Candidate["/candidate\nDropzone · Progress · Typewriter"]
    Recruiter["/recruiter\nDashboard · Lazy Charts · Optimistic UI"]
    Store["CandidateStore\n(in-memory session)"]
  end

  subgraph API["Next.js API Routes"]
    Parse["/api/ai/parse-resume"]
    Analyze["/api/ai/analyze"]
    Fit["/api/ai/fit"]
    Questions["/api/ai/questions"]
    Evaluate["/api/ai/evaluate"]
  end

  subgraph AI["AI Layer"]
    TalentAI["TalentAI facade"]
    Provider["AIProvider seam"]
    Gemini["GeminiProvider"]
    OpenAI["OpenAIProvider stub"]
    Prompts["Prompt modules"]
    Schemas["Zod schemas"]
  end

  Shell --> Home
  Shell --> Candidate
  Shell --> Recruiter
  Shell --> Store
  Candidate --> Store
  Recruiter --> Store

  Parse --> TalentAI
  Analyze --> TalentAI
  Fit --> TalentAI
  Questions --> TalentAI
  Evaluate --> TalentAI

  TalentAI --> Prompts
  TalentAI --> Schemas
  TalentAI --> Provider
  Provider --> Gemini
  Provider --> OpenAI
```

## Demo vs live paths

> **Verified:** There is no client-side `fetch` to `/api/ai/*` in `src/` today.

| Path | What runs |
| --- | --- |
| **Demo (current UI)** | `demo-candidate.ts` → `CandidateStoreProvider` → dashboard; `useAiPipeline` animates stages only |
| **Live (API routes)** | `POST /api/ai/*` → `TalentAI` → `GeminiProvider` → Zod-validated JSON (requires `GEMINI_API_KEY`) |

## Folder map

```text
src/
  app/                 # App Router pages + API + OG/favicon
  components/
    command/           # Command palette
    dashboard/         # Recruiter panels
    illustrations/     # Original SVG art
    motion/            # Typewriter, thinking, progress, fade
    providers/         # App shell providers
    ui/                # Button, Badge, Skeleton, ErrorBoundary
    upload/            # Drag & drop
  constants/           # Target role definition
  data/                # Demo candidate seed
  hooks/               # Reusable hooks
  lib/
    ai/                # Provider seam, prompts, services, HTTP
    export/            # PDF / MD / JSON / CSV
    seo.ts / site.ts
  store/               # In-memory candidate session
  types/               # Domain + dashboard types
```

## Design principles

1. **Deep modules** — callers use `TalentAI` / `useCandidateStore`; providers and prompts stay internal.
2. **Memory-first demo** — no auth, no DB; session resets with the page or via command palette.
3. **Provider seam** — swap Gemini → OpenAI without touching UI or route handlers.
4. **Progressive enhancement** — charts and dashboard chunks lazy-load; skeletons fill the gap.
5. **Accessibility** — semantic landmarks, ARIA on interactive surfaces, reduced-motion support.

## Data flow (demo — current)

1. User lands on `/` or `/candidate`.
2. Dropzone accepts PDF/DOCX (validated client-side); analysis animation runs against the seeded candidate.
3. Recruiter dashboard reads the same in-memory `CandidateSession`.
4. Hiring recommendation updates optimistically via `useOptimistic` + store write.
5. Export helpers serialize the session client-side.

## Data flow (live — API only)

1. Client sends `resumeText` to `POST /api/ai/parse-resume`.
2. Chain `analyze` → `fit` → `questions` → (collect answers in UI) → `evaluate`.
3. Assemble `CandidateSession` and call `setCandidate()` in the store.

See [README.md](../README.md) for endpoint schemas and the full live sequence diagram.
