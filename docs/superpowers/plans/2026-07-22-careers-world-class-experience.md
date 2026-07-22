# Tamm Careers — World-Class Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a modular, bilingual (EN/AR) Tamm Careers landing experience that tells one continuous engineering story—employer narrative → Foundry product story → hiring journey—without changing routes or application business logic.

**Architecture:** `CareersLandingPage` orchestrates focused section components. `LocaleProvider` mounts at `(public)/layout`. Copy lives in `en`/`ar` `careers` catalogs accessed via `useLocale().t`. Foundry showcase uses design-system mockups (not raster galleries). Preserve existing component APIs; prefer composition.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind 4, Framer Motion, Lucide, existing landing primitives (`Reveal`, `Section`, `GlassCard`), existing i18n registry (`locale.ts`, `dictionary.ts`, `formatMessage`).

**Spec:** [`docs/superpowers/specs/2026-07-22-careers-world-class-experience-design.md`](../specs/2026-07-22-careers-world-class-experience-design.md)

**i18n design reference:** [`docs/superpowers/specs/2026-07-22-i18n-arabic-design.md`](../specs/2026-07-22-i18n-arabic-design.md)

## Global Constraints

- Employer brand = **Tamm Careers**; product = **Foundry** (AI Hiring Intelligence). Do not rename the company.
- Preserve existing routes: `/`, `/careers`, `/careers/[slug]`, `/apply`, `/application/success`.
- Preserve existing component APIs whenever practical; prefer composition over refactoring unrelated code.
- Localize **public careers experience only** (shell + landing + careers index/detail labels as needed). Do not localize Foundry candidate/recruiter portals in this plan.
- English `Messages` is source of truth; Arabic must `satisfies Messages` — `npm run typecheck` fails on missing keys.
- If a translation key path is missing at runtime in development, **fail loudly** (throw) — never silently fall back to hardcoded English strings in components.
- No invented metrics, fake day-counts, unused tech (e.g. FastAPI), or dead footer/nav links.
- Motion: fade / translateY / opacity / subtle scale / stagger only. Respect `prefers-reduced-motion`.
- Prefer CSS logical properties (`ms`/`me`/`ps`/`pe`/`start`/`end`).
- Every section introduces one new idea; no duplicated marketing blocks.
- **Commits:** only when the user explicitly asks (do not auto-commit).
- Verification primary tools: `npm run typecheck`, `npm run lint`, `npm run build`, manual EN/AR + RTL QA, Lighthouse accessibility (must not regress).

## File map (create / modify)

```text
CREATE
  src/lib/i18n/provider.tsx
  src/lib/i18n/hooks.ts
  src/components/i18n/language-switcher.tsx
  src/components/careers/engineering-philosophy.tsx
  src/components/careers/engineering-challenges.tsx
  src/components/careers/foundry-bridge.tsx
  src/components/careers/building-foundry.tsx
  src/components/careers/mockups/resume-intelligence.tsx
  src/components/careers/mockups/ats-analysis.tsx
  src/components/careers/mockups/recruiter-dashboard.tsx
  src/components/careers/mockups/interview-generation.tsx
  src/components/careers/mockups/hiring-recommendation.tsx
  src/components/careers/mockups/application-timeline.tsx
  src/components/careers/foundry-pipeline.tsx
  src/components/careers/hiring-comparison.tsx
  src/components/careers/hiring-timeline.tsx   # replaces usage of hiring-process.tsx on landing
  src/components/careers/careers-faq.tsx
  src/components/careers/careers-footer.tsx

MODIFY
  src/app/(public)/layout.tsx
  src/components/careers/careers-shell.tsx
  src/components/careers/careers-landing.tsx
  src/lib/careers-site.ts                     # nav anchors only
  src/lib/translations/en/careers.ts
  src/lib/translations/ar/careers.ts
  src/lib/translations/en/navigation.ts       # if new nav labels needed
  src/lib/translations/ar/navigation.ts
  src/app/(public)/careers/page.tsx           # localize index copy
  src/app/(public)/careers/[slug]/page.tsx   # localize detail chrome if hardcoded
  src/components/careers/hiring-process.tsx   # deprecate or re-export timeline; do not leave dual sources of truth

OPTIONAL KEEP (unchanged API)
  src/components/careers/hero-visual.tsx
  src/components/careers/social-proof.tsx
  src/components/careers/job-card.tsx
  src/components/landing/primitives.tsx
```

## Execution milestones

| Milestone | Tasks | Deliverable |
| --- | --- | --- |
| **1 — Locale foundation** | 1–3 | Public layout has LocaleProvider; shell localized + language switcher; hero/why/social use `t` |
| **2 — Employer narrative** | 4–6 | Philosophy, Challenges (grouped), Bridge; Culture/Life/Build removed |
| **3 — Foundry story** | 7–9 | Building Foundry + mockups, Pipeline, Comparison |
| **4 — Closing experience** | 10–12 | Timeline, Benefits layout, FAQ, CTA, Footer; roles localized |
| **5 — QA polish** | 13–14 | Motion/RTL/a11y/Lighthouse; typecheck/build green |

---

### Task 1: LocaleProvider + useLocale

**Files:**
- Create: `src/lib/i18n/provider.tsx`
- Create: `src/lib/i18n/hooks.ts`
- Modify: `src/app/(public)/layout.tsx`

**Interfaces:**
- Consumes: `resolveInitialLocale`, `locales`, `LOCALE_STORAGE_KEY`, `getMessages`, `formatMessage`, formatters from `src/lib/utils/format.ts` if present
- Produces:
  ```ts
  function LocaleProvider({ children }: { children: React.ReactNode }): JSX.Element
  function useLocale(): {
    locale: LocaleCode
    direction: "ltr" | "rtl"
    setLocale: (code: LocaleCode) => void
    t: Messages
    formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
    formatPercent: (value: number) => string
    aiLocale: AILocaleContext
  }
  ```

- [ ] **Step 1: Implement `hooks.ts`**

```tsx
"use client";

import { createContext, useContext } from "react";
import type { AILocaleContext, LocaleCode, TextDirection } from "./types";
import type { Messages } from "./dictionary";

export type LocaleContextValue = {
  locale: LocaleCode;
  direction: TextDirection;
  setLocale: (code: LocaleCode) => void;
  t: Messages;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatPercent: (value: number) => string;
  aiLocale: AILocaleContext;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
```

- [ ] **Step 2: Implement `provider.tsx`**

Behavior requirements:
- Server / first paint: `locale = "en"` (avoid hydration mismatch).
- After mount: call `resolveInitialLocale()`, then `setLocale` if different.
- On `setLocale`: write `localStorage[LOCALE_STORAGE_KEY]`, update state, set `document.documentElement.lang` and `.dir`, set `data-locale` attribute for CSS if needed.
- `t` = `getMessages(locale)`.
- `aiLocale` = `{ language: locales[locale].language, code: locale, direction: locales[locale].direction, preserveTechnicalTerms: true }`.
- Wire `formatDate` / `formatNumber` / `formatPercent` with `locales[locale].intl`.

- [ ] **Step 3: Wrap public layout**

```tsx
import { CareersShell } from "@/components/careers/careers-shell";
import { LocaleProvider } from "@/lib/i18n/provider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <CareersShell>{children}</CareersShell>
    </LocaleProvider>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run typecheck`  
Expected: PASS (or only pre-existing unrelated errors). Provider compiles; no careers UI wired yet is OK.

---

### Task 2: Language switcher + localize CareersShell

**Files:**
- Create: `src/components/i18n/language-switcher.tsx`
- Modify: `src/components/careers/careers-shell.tsx`
- Modify: `src/lib/careers-site.ts` (nav hrefs to stable anchors)

**Interfaces:**
- Consumes: `useLocale()`
- Produces: `<LanguageSwitcher />` — keyboard accessible dropdown (English / العربية)

- [ ] **Step 1: Build `LanguageSwitcher`**

Requirements:
- Trigger shows globe + `locales[locale].nativeLabel`
- Menu items: English, العربية with check on active
- `aria-label={t.navigation.switchLanguage}`, `aria-expanded`, `aria-haspopup="listbox"`
- On select: `setLocale(code)` and close
- Escape closes; focus returns to trigger

- [ ] **Step 2: Update `CAREERS_NAV` anchors**

```ts
export const CAREERS_NAV = [
  { href: "/#why", labelKey: "about" },
  { href: "/#philosophy", labelKey: "engineering" },
  { href: "/careers", labelKey: "openRoles" },
  { href: "/apply", labelKey: "apply" },
] as const;
```

Prefer resolving labels via `t.navigation.*` inside the shell rather than hardcoded English in `careers-site.ts`. If `labelKey` pattern is awkward, keep hrefs in `careers-site.ts` and hardcode href list in shell with `t.navigation` labels.

- [ ] **Step 3: Localize shell chrome**

Replace hardcoded strings:
- Skip link → `t.careers.shell.skipToContent` or `t.navigation.skipToContent`
- Apply button → `t.careers.shell.apply`
- Menu open/close → `t.careers.shell.openMenu` / `closeMenu`
- Nav aria labels → `t.navigation.ariaLabels.*`
- Insert `<LanguageSwitcher />` in desktop header and mobile drawer

- [ ] **Step 4: Manual check**

Run: `npm run dev` → open `http://localhost:8600`  
Switch EN ↔ AR: `html[dir]` flips; shell labels change; no console error from `useLocale`.

---

### Task 3: Migrate Hero, Social Proof, Why Tamm to `t.*`

**Files:**
- Modify: `src/components/careers/careers-landing.tsx` (start thinning; keep orchestrator)
- Modify: `src/components/careers/social-proof.tsx` (if strings hardcoded)
- Modify: `src/lib/translations/en/careers.ts`
- Modify: `src/lib/translations/ar/careers.ts`

- [ ] **Step 1: Ensure catalogs cover hero / socialProof / why**

Existing keys in `en/careers.ts` already include `hero`, `socialProof`, `why`. Verify AR mirrors with `satisfies` / structural match. Use `formatMessage(t.careers.why.description, { company: CAREERS_COMPANY })` where `{company}` appears.

- [ ] **Step 2: Wire landing header sections**

In orchestrator (or small extracted `CareersHero` if needed for clarity):
- Replace hardcoded hero title/description/CTAs with `t.careers.hero.*`
- Why section: `t.careers.why.*` + map `t.careers.why.items`
- Keep `CareersHeroVisual` API unchanged; localize its internal labels via `t.careers.heroVisual.*` if still hardcoded

- [ ] **Step 3: Remove temporary Culture / Life / Build from render path**

Delete JSX for `#engineering`, `#life`, `#build` from landing (content returns in Tasks 4–6). Do not leave empty sections.

- [ ] **Step 4: Verify**

`npm run typecheck`  
Manual: `/` shows localized Why + Hero; Culture/Life/Build gone.

---

### Task 4: Engineering Philosophy section

**Files:**
- Create: `src/components/careers/engineering-philosophy.tsx`
- Modify: `src/lib/translations/en/careers.ts` — add `philosophy`
- Modify: `src/lib/translations/ar/careers.ts` — add `philosophy`
- Modify: `src/components/careers/careers-landing.tsx` — mount after Why

**Catalog shape:**

```ts
philosophy: {
  eyebrow: string
  title: string
  description: string
  prose?: string  // optional single calm paragraph
  principles: Array<{ title: string; body: string }> // length 4, NO numbers in UI
}
```

Principles (EN titles): Ship with judgment; Build responsibly; Learn in public; Own outcomes.

- [ ] **Step 1: Add EN + AR catalog entries**

- [ ] **Step 2: Implement editorial layout**

- `Section` id=`philosophy`
- Four principles as rows with left accent / divider — **no** `01` numbering
- `Reveal` stagger; reduced motion respected via existing `Reveal`

- [ ] **Step 3: Mount in orchestrator after Why**

- [ ] **Step 4: Verify** — section renders; AR text wraps cleanly; no feature-card look-alike.

---

### Task 5: Engineering Challenges (grouped domains)

**Files:**
- Create: `src/components/careers/engineering-challenges.tsx`
- Modify: EN/AR `careers.ts` — add `challenges`
- Modify: `careers-landing.tsx`

**Catalog shape:**

```ts
challenges: {
  eyebrow: string
  title: string // "Engineering Challenges"
  subtitle: string // Real engineering problems…
  domains: Array<{
    name: string // AI Systems | Platform Engineering | Developer Experience
    items: Array<{ title: string; body: string; icon: string }> // icon key mapped in component
  }>
}
```

Domain grouping per spec. Descriptions grounded (engineer-written). Icons: map string keys to Lucide components inside the TSX file (do not store React nodes in catalogs).

- [ ] **Step 1: Add catalogs**

- [ ] **Step 2: Implement grouped grid**

Subtle domain headings + 2 items each; hover lift ≤ translateY(2–4px); icon opacity/micro-shift only.

- [ ] **Step 3: Mount after Philosophy**

- [ ] **Step 4: Verify** — three domains visible; no duplication of Why/Philosophy headlines.

---

### Task 6: Foundry bridge sentence

**Files:**
- Create: `src/components/careers/foundry-bridge.tsx`
- Modify: EN/AR catalogs — `bridge: { text: string }`
- Modify: `careers-landing.tsx`

EN text (or close equivalent):

> These engineering challenges converge in Foundry—our AI Hiring Intelligence platform, where AI systems, infrastructure, and developer experience come together to support modern hiring.

- [ ] **Step 1: Slim band component** — no card chrome; max-width prose; links visually to `#foundry` via following section (optional `href="#foundry"` on a “Continue” is unnecessary—keep as prose only).

- [ ] **Step 2: Mount after Challenges**

- [ ] **Step 3: Verify** — reads as intentional handoff, not a CTA.

---

### Task 7: Building Foundry + design-system mockups

**Files:**
- Create: `src/components/careers/building-foundry.tsx`
- Create: six files under `src/components/careers/mockups/`
- Modify: EN/AR — `foundryShowcase` (title **Building Foundry**, six beats with title/body/ariaLabel)

**Interfaces:**
- Each mockup: `function XMockup({ className?: string }): JSX.Element` — uses `useLocale()` for chrome strings under `t.careers.foundryShowcase.mockups.*`
- Shared visual language: same border radius, panel bg `var(--surface)`, accent, badge styles as dashboard components where practical (compose from `Badge`, small panels—not one-off art)

**Beats & “alive” cues (reduced-motion → static final state):**

| Beat | Layout | Alive cue |
| --- | --- | --- |
| Resume Intelligence | mock L / text R | chips stagger in |
| ATS Analysis | text L / mock R | score counts up once |
| Recruiter Dashboard | mock L / text R | muted activity rows |
| Interview Generation | text L / mock R | questions appear sequentially |
| Hiring Recommendation | mock L / text R | confidence meter fill once |
| Application Timeline | text L / mock R | current stage pulse |

Cumulative story copy in catalogs must read as one platform unfolding (resume enters → … → traceable).

- [ ] **Step 1: Add catalog keys for showcase + mockup chrome**

- [ ] **Step 2: Implement mockups using design-system primitives only**

- [ ] **Step 3: Implement `BuildingFoundry` alternating rows**

Use logical properties so RTL swaps start/end correctly (`lg:flex-row` vs `lg:flex-row-reverse` based on index, or `ms`/`me` spacing).

- [ ] **Step 4: Mount after Bridge with `id="foundry"`**

- [ ] **Step 5: Verify** — light/dark; EN/AR; no fake % business metrics; cohesive chrome.

---

### Task 8: How Foundry Works pipeline

**Files:**
- Create: `src/components/careers/foundry-pipeline.tsx`
- Modify: EN/AR — `pipeline`

**Stages (ordered):** Resume → Parsing → Knowledge Extraction → AI Reasoning → Hiring Intelligence → Recruiter Workspace  

Each stage: distinct visual metaphor (document, `{}`, graph, LLM node, report, dashboard).

- [ ] **Step 1: DOM = `<ol>` with stage title + description; visual diagram `aria-hidden` layered or adjacent**

- [ ] **Step 2: Animate connections/nodes only when `!prefers-reduced-motion`**

- [ ] **Step 3: Mount `id="pipeline"` after Building Foundry**

- [ ] **Step 4: Verify** — screen reader list makes sense; distinct from hiring timeline stages.

---

### Task 9: Traditional Hiring vs Foundry (transformation rows)

**Files:**
- Create: `src/components/careers/hiring-comparison.tsx`
- Modify: EN/AR — `comparison`

**Row shape:** `{ from: string; to: string }` — render `from → to` with icon pair; stagger on view.

- [ ] **Step 1: Catalog five transformation rows (spec wording)**

- [ ] **Step 2: Implement transformation UI (not 2-column war table)**

- [ ] **Step 3: Mount `id="comparison"`**

- [ ] **Step 4: RTL QA** — arrow/order readable in Arabic.

---

### Task 10: Hiring Timeline + Benefits layout refresh

**Files:**
- Create: `src/components/careers/hiring-timeline.tsx`
- Modify or deprecate: `src/components/careers/hiring-process.tsx` (re-export timeline or delete unused after landing switch)
- Modify: EN/AR — replace/extend `process` → `timeline` keys (keep `process` only if still referenced; prefer single `timeline` key)
- Modify: Benefits rendering in landing / optional `careers-benefits.tsx`

**Timeline stages (concise names):** Application → Resume Processing → AI Analysis → Recruiter Review → Interview → Offer

- [ ] **Step 1: Implement timeline with `<ol>`, pulse on “current” demo stage, horizontal md+**

- [ ] **Step 2: Benefits visual chapter** — larger cards, fewer columns, or asymmetric 2-column featured + list — **not** identical six-up grid like Challenges

- [ ] **Step 3: Wire `t.careers.benefits.*` and `t.careers.timeline.*`**

- [ ] **Step 4: Mount `#timeline` then `#benefits` then `#roles`**

---

### Task 11: FAQ accordion

**Files:**
- Create: `src/components/careers/careers-faq.tsx`
- Modify: EN/AR — `faq: { eyebrow, title, items: { question, answer }[] }`

**Required topics:** recruiters help; AI models (Gemini / configured provider); **technologies powering Foundry** (only real deps: Next.js, React, TypeScript, Gemini/`@google/genai`, Zod, Framer Motion, Tailwind, etc.); resume analysis; remote; hiring process length (no fake days); candidate visibility of AI analysis (honest to product).

- [ ] **Step 1: Single-open accordion** — buttons with `aria-expanded` / `aria-controls`; keyboard operable

- [ ] **Step 2: Mount `#faq` before CTA**

- [ ] **Step 3: Verify** — answers factual; no FastAPI.

---

### Task 12: Premium Footer + CTA + roles localization

**Files:**
- Create: `src/components/careers/careers-footer.tsx`
- Modify: `careers-landing.tsx` — use footer component; localize CTA
- Modify: `src/app/(public)/careers/page.tsx` and `[slug]/page.tsx` for index/detail chrome via `t`
- Modify: `job-card.tsx` if labels hardcoded

**Footer groups:** Engineering | Hiring | Foundry | Company  

Links only to real anchors/routes. Omit Privacy/Accessibility/Docs/GitHub if no destination. Include portfolio notice + copyright via `formatMessage(..., { company })`.

Foundry → Recruiter demo: link `/recruiter` only if that route is reachable from public site without breaking UX; otherwise omit.

- [ ] **Step 1: Implement footer**

- [ ] **Step 2: Localize CTA + open roles section + job cards**

- [ ] **Step 3: Remove inline footer from landing**

- [ ] **Step 4: Verify** — no dead links; EN/AR footer; apply/roles still navigate correctly.

---

### Task 13: Motion, RTL, accessibility pass

**Files:** touch only components that fail QA

- [ ] **Step 1: Reduced motion** — enable OS reduced motion; confirm no ongoing pulses/loops; content still complete

- [ ] **Step 2: RTL checklist** (switch to AR):
  - Comparison rows
  - Hiring timeline
  - Foundry pipeline
  - Alternating Building Foundry layouts
  - Footer columns

- [ ] **Step 3: Keyboard-only pass** — FAQ, language switcher, nav, CTAs, footer links

- [ ] **Step 4: Lighthouse accessibility** on `/` before/after mindset — score must not regress; fix any new critical issues introduced by this work

---

### Task 14: Final verification gate

- [ ] **Step 1: Run checks**

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 2: Success criteria checklist (from spec)**

1. Scroll story matches spec; Culture/Life/Build gone  
2. Brand boundary clear  
3. Modular orchestrator  
4. Shell + landing on `useLocale()`  
5. Mockups = design-system primitives; cohesive Foundry chrome  
6. Pipeline ≠ timeline; both list-accessible  
7. Comparison = transformation rows  
8. Benefits visually distinct from Challenges  
9. FAQ tech answer = real stack only  
10. Motion + RTL + a11y OK  
11. Routes / apply / roles work  
12. Lighthouse a11y did not regress  

- [ ] **Step 3: Hand off** — note any deferred backlog items (interactive recruiter demo mode, scroll-driven refinements, blog/stories, visual QA snapshots) without implementing them.

---

## Plan self-review

| Spec requirement | Task(s) |
| --- | --- |
| LocaleProvider at public layout | 1 |
| Language switcher + shell `t.*` | 2 |
| Hero / Why / Social `t.*`; remove Culture/Life/Build | 3 |
| Philosophy (editorial, no numbers) | 4 |
| Challenges grouped + foreshadow | 5 |
| Bridge sentence | 6 |
| Building Foundry + alive mockups | 7 |
| Pipeline architecture + `<ol>` | 8 |
| Comparison transformation rows | 9 |
| Hiring timeline + Benefits chapter | 10 |
| FAQ (+ tech question) | 11 |
| Footer / CTA / roles | 12 |
| Motion / RTL / a11y / Lighthouse | 13–14 |
| Preserve APIs; loud missing keys; no dead links; no fake metrics | Global + tasks |
| Future backlog not in milestones | Task 14 note |

**Placeholder scan:** none intentional.  
**API consistency:** `useLocale()` return shape matches i18n design; section ids match `#why` `#philosophy` `#challenges` `#foundry` `#pipeline` `#comparison` `#timeline` `#benefits` `#roles` `#faq`.
