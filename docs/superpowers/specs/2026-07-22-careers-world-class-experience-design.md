# Tamm Careers — World-Class Product Storytelling Experience

**Date:** 2026-07-22  
**Status:** Approved for implementation planning (Batches 1–4 + final spec refinements)  
**Scope:** UX/presentation enhancement of the public careers experience (`/`, shared careers shell, related public careers pages as needed for i18n wiring)  
**Out of scope:** Product redesign of Foundry app surfaces; application business logic; inventing metrics; copying external company branding/copy/layouts; localizing candidate/recruiter portals beyond careers

---

## 1. Goal

Transform the Tamm Careers landing experience into a flagship engineering story comparable in *quality* (not imitation) to top technology careers pages—through storytelling, visual rhythm, product-first presentation, rich design-system mockups, subtle motion, and scannability.

Preserve:

- Existing functionality, routes, accessibility, responsive behavior
- Employer brand **Tamm Careers** / company **Tamm**
- Localization architecture (EN/AR); careers experience fully bilingual as part of this work
- Design system and motion/a11y patterns

### Guiding principle

> The page should feel like **one continuous engineering story** rather than a collection of independent marketing sections. Every transition should naturally lead into the next section, with each introducing **one new idea** and **avoiding repetition**.

### Brand boundary

| Layer | Brand | Role |
| --- | --- | --- |
| Employer | **Tamm Careers** | Hero, Why, Philosophy, Benefits, Roles, Hiring Timeline, CTA, Footer identity |
| Product | **Foundry** | Building Foundry, How Foundry Works, Comparison — the AI Hiring Intelligence platform engineers design and build |

Do **not** rename the company or replace employer branding.

---

## 2. Decisions locked

| Topic | Decision |
| --- | --- |
| Brand frame | Option A — Tamm employer + Foundry product |
| Section composition | Option B — keep Why, Benefits, Roles, CTA, Footer; evolve Hiring Process → Timeline; absorb Culture / Life / Build into Philosophy / Challenges / Foundry story |
| Visuals | Option C — design-system mockups default; real screenshots only if high-quality captures already exist and clearly add value |
| Implementation | Approach 2 — modular section components; `CareersLandingPage` as orchestrator |
| i18n | Option A — migrate careers landing + shell to `useLocale()` / `t.*`; `LocaleProvider` at `(public)/layout`; do not expand localization into Foundry candidate/recruiter surfaces |
| Showcase title | **Building Foundry** (not “Inside Foundry” / generic “Product Showcase”) |
| Anchors | `#why` `#philosophy` `#challenges` `#foundry` `#pipeline` `#comparison` `#timeline` `#benefits` `#roles` `#faq` |

---

## 3. Scroll narrative (final)

```text
Hero
  → Social Proof
  → Why Tamm                         (#why)
  → Engineering Philosophy           (#philosophy)
  → Engineering Challenges           (#challenges)
  → Bridge (one narrative sentence)
  → Building Foundry                 (#foundry)
  → How Foundry Works                (#pipeline)
  → Traditional Hiring vs Foundry    (#comparison)
  → Hiring Timeline                  (#timeline)
  → Benefits                         (#benefits)
  → Open Roles                       (#roles)
  → FAQ                              (#faq)
  → Final CTA
  → Premium Footer
```

### Removed as standalone sections

- Engineering Culture  
- Life at Tamm  
- What You’ll Build  

Content absorbed into Philosophy / Challenges / Foundry story. Drop dead nav anchors (`#engineering`, `#life`, `#build`).

### Non-duplication rule

Do not duplicate information across sections. Every section introduces a new idea or advances the narrative.

---

## 4. Architecture

### Component structure

```text
src/components/careers/
  careers-landing.tsx          # orchestrator only
  careers-shell.tsx            # localized nav + language switcher ready
  careers-footer.tsx           # expanded footer (extract from landing)
  engineering-philosophy.tsx
  engineering-challenges.tsx
  foundry-bridge.tsx           # slim transition band
  building-foundry.tsx         # showcase orchestrator
  mockups/                     # reusable Foundry chrome mockups
    resume-intelligence.tsx
    ats-analysis.tsx
    recruiter-dashboard.tsx
    interview-generation.tsx
    hiring-recommendation.tsx
    application-timeline.tsx
  foundry-pipeline.tsx
  hiring-comparison.tsx
  hiring-timeline.tsx          # evolves hiring-process.tsx
  careers-faq.tsx
  # preserve: hero-visual, social-proof, job-card, apply-form, …
```

Reuse: `Reveal`, `Section`, `GlassCard`, `Button`, Lucide, Framer Motion, `usePrefersReducedMotion`.

**Implementation rule:** Preserve existing component APIs whenever practical. Prefer composition over refactoring unrelated code.

### i18n wiring (careers scope)

- Implement / complete minimal locale stack needed for careers if missing: `LocaleProvider`, `useLocale`, dictionary merge per existing i18n design (`docs/superpowers/specs/2026-07-22-i18n-arabic-design.md`).
- Mount **`LocaleProvider` at `src/app/(public)/layout.tsx`** (not inside the landing page) so future public pages inherit localization.
- Replace hardcoded careers landing + shell strings with `t.careers.*`.
- Add all new section keys to `src/lib/translations/en/careers.ts` and `src/lib/translations/ar/careers.ts` (AR `satisfies` EN shape).
- Language switcher: wire if a careers-appropriate control exists or add a minimal switcher in the public shell; do not tour-localize Foundry app shells.
- If a translation key is missing, **fail loudly during development** rather than silently falling back to hardcoded English.

### Routes preserved

| Route | Behavior |
| --- | --- |
| `/` | Enhanced careers landing |
| `/careers` | Open roles index |
| `/careers/[slug]` | Role detail |
| `/apply` | Application flow |
| `/application/success` | Success |

No URL redesign.

---

## 5. Section specifications

### 5.1 Hero + Social Proof + Why Tamm

- Preserve structure and intent; migrate copy to `t.*`.
- Why Tamm remains **immediately after** social proof.

### 5.2 Engineering Philosophy (`#philosophy`)

**Role:** Editorial values section (absorbs Culture + Life). Calm, confident, concise—not a feature list.

**Four principles (no numbering — numbers imply sequence):**

- Ship with judgment  
- Build responsibly  
- Learn in public  
- Own outcomes  

**Layout:** Generous whitespace; subtle dividers or left accent lines (not `01/02/03` glass cards). Optional single short prose block from Life’s “intentional remote” idea—max one paragraph.

**Motion:** Restrained fade / translateY stagger; reduced-motion → static.

### 5.3 Engineering Challenges (`#challenges`)

**Role:** What engineers actually solve (absorbs “What you’ll build” themes).

**Subtitle tone:** “Real engineering problems. Real production constraints. Real ownership.”  
Descriptions: grounded engineering language (e.g. “Evaluate LLM behavior using structured metrics”)—never marketing hyperbole.

**Grouping (domains), not six identical cards:**

| Domain | Challenges |
| --- | --- |
| AI Systems | Production AI Evaluation; Multi-Agent Orchestration |
| Platform Engineering | Cloud Infrastructure; Reliability & Observability |
| Developer Experience | Developer Tooling; Manufacturing Reasoning |

**Foreshadowing rule:** Each challenge foreshadows a Foundry capability shown later:

| Challenge | Later shown in Foundry |
| --- | --- |
| Production AI Evaluation | Resume Intelligence / ATS |
| Multi-Agent Orchestration | Pipeline / AI Reasoning |
| Reliability & Observability | Dashboard structure / recommendation evidence |
| Cloud Infrastructure | Platform architecture framing in pipeline copy |
| Developer Tooling | Recruiter Workspace |
| Manufacturing Reasoning | Context-aware analysis framing |

**Bridge (after Challenges, before Foundry):** narrative sentence, e.g.

> These engineering challenges converge in Foundry—our AI Hiring Intelligence platform, where AI systems, infrastructure, and developer experience come together to support modern hiring.

Slim transition band—not a card, not a CTA.

### 5.4 Building Foundry (`#foundry`)

**Role:** Cumulative product narrative—one platform unfolding, not six unrelated tools.

**Story layers:**

```text
Resume enters
  → AI understands it
  → AI evaluates it
  → Recruiter collaborates
  → AI recommends
  → Everything becomes traceable
```

**Six beats** (alternate L/R layout for rhythm):

1. Resume Intelligence  
2. ATS Analysis  
3. Recruiter Dashboard  
4. Interview Generation  
5. Hiring Recommendation  
6. Application Timeline *(product-side session stages—not Tamm hiring timeline)*

**Alive mockups (subtle):** skill chips appearing; score counting once; sequential questions; stage pulse; confidence meter—tiny interactions only.

**Rules:**

- Composed **entirely** from reusable design-system primitives (panels, badges, chips, skeletons, chart shells)—no one-off decorative mockups that cannot evolve with the product  
- Shared Foundry chrome: typography, spacing, color, iconography, status badges, panel chrome  
- Theme-aware, localization-aware, responsive  
- No invented metrics; engineering tone (“Structured evaluation pipeline”, “Evidence-backed recommendation”)  
- Real screenshots only if already in-repo and clearly superior  

### 5.5 How Foundry Works (`#pipeline`)

**Role:** Product **architecture** only—not the candidate hiring journey.

**Stages (visually distinct metaphors):**

| Stage | Visual metaphor |
| --- | --- |
| Resume | Document |
| Parsing | Structured data `{}` |
| Knowledge Extraction | Entities / graph |
| AI Reasoning | LLM node |
| Hiring Intelligence | Report |
| Recruiter Workspace | Dashboard |

**A11y:** Semantic ordered list in the DOM; animated diagram layered on top (not the only representation).

**Motion:** Node glow, connection draw, brief processing state—subtle; reduced-motion → static labeled list/diagram.

### 5.6 Traditional Hiring vs Foundry (`#comparison`)

**Role:** Transformation rows (evolution), not a competitive two-column war table.

Example pattern:

```text
Manual Review  →  AI Resume Intelligence
Keyword Matching  →  Context-Aware Analysis
Generic Notes  →  Structured Hiring Report
Inconsistent Questions  →  Role-Specific Interview Generation
Subjective Evaluations  →  Evidence-Based Recommendations
```

Icons + staggered row reveal. RTL: logical properties; **explicit RTL QA** for row direction and arrows.

### 5.7 Hiring Timeline (`#timeline`)

**Role:** Tamm candidate journey (evolves `HiringProcess`). Concise stage **names**; detail in short descriptions only.

```text
Application
  → Resume Processing
  → AI Analysis
  → Recruiter Review
  → Interview
  → Offer
```

Horizontal `md+`, vertical mobile. Progressive reveal; current-stage pulse; completed vs upcoming states. Semantic `<ol>`.

Fully keyboard-usable if any stage control is interactive.

### 5.8 Benefits (`#benefits`)

Preserve content; migrate to `t.*`.

**Visual chapter change:** Do **not** render as another six-identical-card grid after Challenges. Prefer larger cards with fewer items, asymmetric layout, or 2×3 with larger padding / different surface treatment so it reads as a new chapter.

### 5.9 Open Roles (`#roles`)

Preserve `JobCard`, featured roles, apply/view links, `/careers` “see all”. Localize labels.

### 5.10 FAQ (`#faq`)

Animated accordion; single-open preferred; keyboard + `aria-expanded` / `aria-controls`.

**Topics (factual answers only):**

1. How does Foundry help recruiters?  
2. What AI models power Foundry? *(Gemini via configured provider—no invented roster)*  
3. What technologies power Foundry? *(only stack actually in repo: e.g. Next.js, React, TypeScript, Gemini/`@google/genai`, Zod, Framer Motion, Tailwind—**do not** list FastAPI or other unused tech)*  
4. How are resumes analyzed?  
5. Is remote work supported?  
6. How long is the hiring process? *(no fake day counts)*  
7. Can candidates see the AI analysis? *(accurate to product behavior)*  

### 5.11 Final CTA

Preserve pattern; localize; light polish only.

### 5.12 Premium Footer

Treat as the **final navigation map of the story**:

| Group | Contents |
| --- | --- |
| Engineering | `#philosophy`, `#challenges`, Open Roles `/careers` |
| Hiring | `#timeline`, `#faq`, Apply `/apply` |
| Foundry | `#foundry`, `#pipeline`, `#comparison`, Recruiter demo only if route is publicly reachable without dead-ends |
| Company | `#why`, Contact (existing mailto), Privacy/Accessibility only if real destinations exist |

**Omit any link that does not exist**—no placeholder/dead links.  
Include honest portfolio/demo notice and copyright. Localize all labels.

Update shell nav to stable anchors above.

---

## 6. Visual rhythm

| Section | Visual mode |
| --- | --- |
| Hero | Split copy + visual |
| Social proof | Trust / stats strip |
| Why Tamm | Soft glass card grid |
| Philosophy | Editorial list + whitespace |
| Challenges | Grouped domain grids |
| Bridge | Slim prose band |
| Building Foundry | Alternating large mockups |
| Pipeline | Diagram band |
| Comparison | Transformation rows |
| Timeline | Process steps |
| Benefits | Larger / fewer cards (new chapter) |
| Roles | Job cards |
| FAQ | Accordion |
| CTA | Spotlight band |
| Footer | Multi-column map |

Avoid stacking two identical card grids back-to-back.

---

## 7. Motion policy

**Allowed:** fade, translateY, opacity, subtle scale, stagger.  
**Forbidden:** bounce, spin, exaggerated parallax, flashy loops on employer sections.

Product mockups may be slightly richer (“alive”) but still subtle.  
Respect `prefers-reduced-motion` everywhere.

---

## 8. Accessibility

- Semantic HTML, landmarks, heading order  
- Skip link preserved  
- Keyboard-only usability for FAQ, language switcher, interactive timeline (if any), footer, CTAs  
- Focus visibility  
- Diagrams: textual list + visual layer  
- Decorative icons `aria-hidden`  
- High contrast light/dark  
- Responsive; no horizontal trap  

### RTL QA (explicit)

Independently verify in Arabic/RTL:

- Comparison transformation rows  
- Hiring timeline  
- Foundry pipeline  
- Alternating Building Foundry layouts  

Do not assume logical properties alone are sufficient.

---

## 9. Non-goals

- Do not copy external companies’ wording, branding, illustrations, layouts, slogans, or feature lists  
- Do not invent fake business metrics or customer logos  
- Do not change application submission / role data business logic  
- Do not localize Foundry candidate/recruiter portals in this workstream  
- Do not ship dead footer/nav links  
- Do not duplicate section ideas  

---

## 10. Success criteria

1. Scroll story matches Section 3; Culture/Life/Build gone as standalone blocks.  
2. Brand boundary clear: Tamm employer vs Foundry product.  
3. Modular components; landing is orchestrator.  
4. Careers shell + landing fully driven by EN/AR catalogs via `useLocale()`.  
5. Mockups are design-system primitives; Foundry feels one cohesive platform.  
6. Pipeline ≠ hiring timeline; both accessible as lists.  
7. Comparison uses transformation rows.  
8. Benefits layout is visually distinct from Challenges.  
9. FAQ includes factual tech/stack answer limited to real dependencies.  
10. Motion and RTL/a11y checklists pass.  
11. Existing routes and apply/roles flows still work.  
12. Existing Lighthouse accessibility score should not regress after implementation.

---

## 11. Implementation milestones

Detailed plan: [`docs/superpowers/plans/2026-07-22-careers-world-class-experience.md`](../plans/2026-07-22-careers-world-class-experience.md)

1. Public layout locale foundation  
2. Employer narrative (Philosophy, Challenges, Bridge)  
3. Foundry product story (Building Foundry, Pipeline, Comparison)  
4. Hiring journey (Timeline, Benefits, Roles, FAQ, CTA, Footer)  
5. Motion, RTL, accessibility, regression testing, and final polish  

### Future enhancement backlog (out of scope)

- Interactive recruiter demo mode  
- Scroll-driven product animation refinements  
- Candidate success stories / engineering blog integration  
- Dark/light theme visual QA snapshots  

---

## 12. Spec self-review

- [x] No unresolved placeholders (TODO/TBD) for required decisions  
- [x] Consistent with Batches 1–4 approvals and refinements  
- [x] Employer/product boundary unambiguous  
- [x] Anchors stable (`#comparison`, `#timeline`)  
- [x] FAQ tech list constrained to verified stack (no FastAPI)  
- [x] i18n scope limited to public careers experience  
- [x] Non-duplication and continuous-story principles recorded  
- [x] Preserve-APIs rule, loud missing-key i18n rule, Lighthouse a11y success criterion, five milestones, future backlog noted  
