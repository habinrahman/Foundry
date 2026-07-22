# Foundry — Production-Grade Internationalization (i18n) & Arabic Localization

**Date:** 2026-07-22  
**Status:** Approved with refinements (2026-07-22) — ready for implementation plan  
**Scope:** English (default) + Arabic with RTL, locale-aware AI prompts, no URL prefixes  
**Out of scope:** Redesign, business-logic changes, `/en`/`/ar` routes, retroactive translation of cached AI analyses

---

## 1. Goal

Convert Foundry / Tamm Careers from English-only into a fully bilingual application with production-grade localization comparable to modern SaaS (Stripe, Vercel, GitHub, Notion, Linear).

Users can switch languages instantly. The UI adapts (including RTL for Arabic). New AI generations respect the active locale via prompt engineering — not post-hoc translation.

### Supported locales (v1)

| Code | Language | Direction | Default |
| --- | --- | --- | --- |
| `en` | English | `ltr` | Yes |
| `ar` | العربية (Modern Standard Arabic) | `rtl` | No |

### Explicit non-goals

- No locale URL segments (`/ar`, `/en`)
- Do not auto-translate historical / cached analyses when switching language
- Do not redesign product surfaces or change hiring business logic
- Do not hardcode `if (language === "ar")` throughout components

---

## 2. Architecture overview

```text
Language Switcher
        ↓
  Locale Provider  (locale, direction, setLocale, t, formatDate, formatNumber)
        ↓
 Translation Registry  (locales → domain message trees)
        ↓
   UI Components  (+ aria-* localized)
        ↓
    AI Context  { language, code, direction, preserveTechnicalTerms }
        ↓
   Prompt Builder  (system + locale instructions)
        ↓
      Gemini
        ↓
 Structured Output (Zod) → CandidateSession / panels
```

URLs stay unchanged. Preference persists in `localStorage` and restores on refresh.

---

## 3. File layout

```text
src/lib/i18n/
  locale.ts          # Locale registry, defaults, storage key, dir/lang helpers
  types.ts           # LocaleCode, LocaleMeta, MessageTree, AILocaleContext
  dictionary.ts      # Merge domain modules → typed dictionaries per locale
  provider.tsx       # LocaleProvider + document lang/dir sync
  hooks.ts           # useLocale() (single hook surface)
  ai-locale.ts       # buildAILocaleContext(locale), prompt instruction builders

src/lib/translations/
  en/
    common.ts
    navigation.ts
    careers.ts
    apply.ts
    foundry.ts
    recruiter.ts
    ai.ts
    validation.ts
    index.ts         # merges domains → Messages
  ar/
    common.ts
    navigation.ts
    careers.ts
    apply.ts
    foundry.ts
    recruiter.ts
    ai.ts
    validation.ts
    index.ts

src/lib/utils/format.ts   # formatDate, formatNumber, formatPercent (Intl)

src/components/i18n/
  language-switcher.tsx    # Premium dropdown: globe + English / العربية
```

Domain split scales better than one monolithic dictionary. Adding French later means `translations/fr/*.ts` + one registry entry.

---

## 4. Locale registry & extensibility

```ts
// locale.ts (conceptual)
export const locales = {
  en: {
    code: "en",
    language: "English",
    nativeLabel: "English",
    direction: "ltr",
    htmlLang: "en",
    intl: "en-US",
  },
  ar: {
    code: "ar",
    language: "Arabic",
    nativeLabel: "العربية",
    direction: "rtl",
    htmlLang: "ar",
    intl: "ar-SA",
  },
} as const;

export type LocaleCode = keyof typeof locales;
export const DEFAULT_LOCALE: LocaleCode = "en";
export const LOCALE_STORAGE_KEY = "foundry.locale";
```

**Adding a language** requires only:

1. New `translations/<code>/` domain files  
2. Register in `locales`  
3. Entry appears automatically in the language switcher  

No component branching on language codes.

---

## 5. Strong typing (no stringly keys)

Avoid `t("hero.title")`. Prefer nested typed objects:

```ts
const { t } = useLocale();
t.navigation.openRoles;
t.careers.hero.title;
t.apply.resumeUpload;
t.validation.emailInvalid;
```

**Implementation approach:**

- `Messages` type is inferred from the English tree (`typeof enMessages`)
- Arabic must satisfy `Messages` (TypeScript compile error on missing keys)
- Optional thin helper for interpolation; primary API is nested object access
- Interpolation for dynamic strings: small `formatMessage(template, vars)` using `{name}` placeholders in catalogs

### Translation integrity

English is the source of truth. Every locale must satisfy the `Messages` type.

- **Missing keys:** `npm run typecheck` / CI must fail if any locale omits a key present in English.
- **Extra / stale keys:** Prefer assigning Arabic as `satisfies Messages` (or an equivalent exhaustiveness check) so surplus keys are flagged; document a lightweight `assertSameKeys(en, ar)` helper for runtime/dev asserts if structural typing alone is insufficient for nested extras.
- Goal: catalogs stay synchronized over time without silent drift.

### Message formatting (v1 vs future)

V1 intentionally uses simple `{name}` interpolation. If additional locales with complex pluralization are added, the formatting layer can evolve to support ICU-style message formatting **without changing component APIs** (`t` / `useLocale` remain stable).

---

## 6. Locale Provider API

Single hook surface:

```ts
const {
  locale,       // LocaleCode
  direction,    // "ltr" | "rtl"
  setLocale,    // (code: LocaleCode) => void
  t,            // Messages
  formatDate,   // (date: Date | string | number, options?) => string
  formatNumber, // (value: number, options?) => string
  formatPercent,// (value: number) => string — contract: 0–100 (e.g. ATS 95 → ٩٥٪)
  aiLocale,     // AILocaleContext for request payloads
} = useLocale();
```

**Provider responsibilities:**

- Resolve initial locale with this **precedence** (deterministic):
  1. `localStorage` preference (`foundry.locale`) if valid `LocaleCode`
  2. Browser language (`navigator.language` / `navigator.languages`) mapped to a supported locale (e.g. `ar*` → `ar`, otherwise `en`)
  3. Default locale (`en`)
- Hydrate safely (avoid SSR mismatch — default `en` on server, sync client after mount, pattern similar to next-themes)
- Persist on `setLocale`
- Sync `<html lang>` and `<html dir>`
- Apply Arabic font CSS variable class / data attribute when `locale === "ar"`
- Wrap root layout alongside `ThemeProvider`

---

## 7. Language switcher UX

Premium control in **both** navbars (Careers shell + Foundry shell):

- Trigger: globe icon + current native label + chevron (e.g. `🌐 English ▾`)
- Menu:
  - ✓ English  
  - العربية  
- Optional flag emoji accents allowed if they remain accessible (text labels required)
- Desktop, tablet, mobile (including mobile drawer for Careers)
- `aria-label`, `aria-expanded`, `aria-haspopup` localized via `t`

---

## 8. RTL & CSS

Arabic: `dir="rtl"`. English: `dir="ltr"`.

### Rules

- Prefer **CSS logical properties** everywhere practical:
  - `margin-inline-start/end`, `padding-inline-start/end`
  - `inset-inline-start/end`, `border-inline-start/end`
  - `text-align: start` / `end`
- Tailwind: prefer `ms-*` / `me-*` / `ps-*` / `pe-*` / `start-*` / `end-*` over `ml-*` / `mr-*` / `pl-*` / `pr-*` / `left-*` / `right-*`
- Audit existing physical utilities during implementation; convert as needed for correct Arabic layout
- Directional icons (arrows, chevrons, back/next): flip with `rtl:rotate-180` or a small `DirectionalIcon` wrapper — not global mirror of decorative graphics
- Timelines, steppers, progress, breadcrumbs must read naturally in RTL
- Animations remain smooth; no “badly mirrored” hero/visuals (flip only direction-dependent chrome)

---

## 9. Typography

| Locale | Headings | Body |
| --- | --- | --- |
| English | General Sans (existing) | Inter (existing) |
| Arabic | IBM Plex Sans Arabic | IBM Plex Sans Arabic |

- Load IBM Plex Sans Arabic via `next/font/google` with Arabic subset
- Switch via `html[lang="ar"]` CSS rules mapping `--font-heading` / `--font-body` to the Arabic face
- Mono (Geist) unchanged for code/IDs

---

## 10. Formatting (dates, numbers, percents)

Centralize in `src/lib/utils/format.ts` using `Intl` with `locales[code].intl`:

| Use case | English example | Arabic example |
| --- | --- | --- |
| Date | July 22, 2026 | ٢٢ يوليو ٢٠٢٦ |
| Number | 1,250 | ١٬٢٥٠ |
| Percent / ATS | 95% | ٩٥٪ |

**Requirement:** All user-visible numeric presentation in UI (metrics, ATS, chart axes/tooltips where we control labels, relative-time helpers that include numbers) goes through these helpers with the active locale — not ad-hoc `toLocaleString()` without locale argument.

Charts (Recharts): localize titles, legends, tooltips, empty/loading copy, month/date tick formatters, and numeric tick formatters.

---

## 11. Content coverage

Translate **all** user-facing chrome, including:

- Landing / hero / Why Tamm / Engineering / Benefits / Hiring process / Open roles / Footer  
- Job details (descriptive text; role **titles** may remain English proper names)  
- Apply wizard, review, success, validation, dropzone  
- Foundry Talk + Hire chrome, command palette, theme toggle labels  
- Recruiter inbox, metrics, empty states, AI processing stages, badges  
- Dashboard panels: resume summary chrome, ATS, skill matrix, radar, interview Q chrome, hiring recommendation labels  
- Errors, loading, skeleton aria, new `not-found.tsx`  
- Export bar toasts / button labels (exported file content may stay English in v1 unless trivial)  

**Role catalog:** `roles.ts` either gains parallel localized fields or a localization map keyed by slug under `translations/*/careers.ts`. Prefer keeping slug/English title stable; localize summary, responsibilities, requirements, department labels, employment metadata display strings.

Do not leave mixed-language chrome.

---

## 12. Validation

- Zod schemas use message keys or factories: `z.string().email({ message: messages.validation.emailInvalid })`
- Client-side apply form validation strings come from `t.validation.*`
- Upload errors (`use-file-drop`, resume dropzone) from dictionaries  
- No hardcoded English Zod messages in shared schemas without locale injection — pass messages into schema builders (`createApplicationSchema(messages)`) or map error codes → `t` at the UI boundary

Preferred pattern: **error codes** from Zod → UI maps code → `t.validation[code]` so API can stay locale-agnostic while UI localizes.

---

## 13. Accessibility

On locale change / initial sync:

- `<html lang="…">` and `<html dir="…">` update  
- Localized `aria-label`, `aria-expanded`, `aria-current`, `aria-live` copy  
- Focus rings and keyboard navigation unchanged  
- `prefers-reduced-motion` behavior unchanged  
- Language switcher fully keyboard operable  

---

## 14. AI locale (Option B + enhancements)

### Policy

| Content | Behavior |
| --- | --- |
| Static UI | Always follows active locale |
| **New** AI generations | Generated in active locale via prompts |
| **Existing** / cached / demo analyses | Unchanged when switching language |

Do **not** post-translate model output.

### Analysis language metadata

Because historical analyses are intentionally not translated, persist the language used to generate each analysis on the session:

```ts
// CandidateSession
analysisLanguage: LocaleCode; // "en" | "ar"
```

- Set when a new pipeline run completes (`buildCandidateSession` / live AI pipeline).
- Demo seed uses `analysisLanguage: "en"` (or the language of the seeded copy).
- UI may show a localized banner, e.g. “Generated in English” / “تم إنشاؤه بالعربية”, when `analysisLanguage !== locale`.

### Regenerate in current language

Do not auto-translate on locale switch. Offer an explicit action:

- Copy: “This analysis was generated in English.” + button **Regenerate in Arabic** (labels from dictionaries; swap languages as appropriate).
- Action re-runs the existing live AI pipeline with the **current** `aiLocale`, replacing session analysis fields and updating `analysisLanguage`.
- Place near the hiring report header / export bar on the recruiter dashboard (and candidate Talk completion surface if it shows the same report chrome).

This keeps Option B (no silent rewrite) while improving usability.

### Rich AI locale context (passed explicitly — not global-only)

```ts
type AILocaleContext = {
  language: string;      // "English" | "Arabic"
  code: LocaleCode;      // "en" | "ar"
  direction: "ltr" | "rtl";
  preserveTechnicalTerms: true;
};
```

Request bodies to `/api/ai/*` include `locale: AILocaleContext` (or equivalent nested field). Handlers pass it into TalentAI / PromptBuilder — **do not** rely solely on ambient React state on the server.

### PromptBuilder

Introduce a clear pipeline:

```text
UI → AIContext → PromptBuilder → Gemini → Zod parser → Structured output
```

PromptBuilder appends system instructions such as:

- UI language is Arabic → respond in Modern Standard Arabic  
- Professional recruiter tone; no colloquial Arabic  
- Preserve technical terms in English (Python, React, TypeScript, Next.js, FastAPI, PostgreSQL, Docker, Kubernetes, Gemini, OpenAI, LLM, RAG, ATS, API, JWT, OAuth, etc.)  
- Do not translate technology names; translate surrounding explanations  

English locale: respond in clear professional English with the same term-preservation rules where relevant.

### Extensibility

New languages only require PromptBuilder copy templates keyed by `locale.code` (or a shared instruction builder driven by `language` + flags).

---

## 15. Recruiter dashboard & AI chrome

Localize all operational copy, including but not limited to:

- “AI Processing…”, stage labels, “Generating questions…”, “Resume analyzed”  
- Metrics strip, empty states, badges (resume/AI/ATS)  
- Hiring recommendation **labels** and helper descriptions in chrome  
- Chart chrome and formatters  

Generated recommendation text / questions / summaries follow §14 for **new** runs only.

---

## 16. README & portfolio narrative

Update README with **## Internationalization** covering:

- English + Arabic support  
- RTL layout + logical CSS  
- Locale switching + persistence (localStorage → browser → default)  
- Accessibility (`lang` / `dir` / aria)  
- Localized typography (IBM Plex Sans Arabic)  
- Locale-aware formatting  
- Locale-aware AI prompt engineering + `analysisLanguage` + regenerate  
- Extensible translation registry + translation integrity via typecheck  

Include a **dedicated localization architecture diagram** (engineering highlight):

```text
Language Switcher
        ↓
Locale Provider
        ↓
Translation Registry
        ↓
UI Components
        ↓
AI Context
        ↓
Prompt Builder
        ↓
Gemini
        ↓
Structured Output
```

Screenshots (capture after implementation):

1. English Careers UI  
2. Arabic RTL Careers UI  
3. Recruiter dashboard EN  
4. Recruiter dashboard AR  

Explicitly call out portfolio value: production i18n, RTL, locale-aware AI, formatting, a11y, extensible catalogs, client persistence, analysis-language metadata + regenerate.

---

## 17. Testing / verification checklist

- [ ] English UI complete and unchanged in quality  
- [ ] Arabic UI: no leftover English chrome (except intentional proper nouns / tech terms)  
- [ ] RTL layout correct on mobile + desktop (nav, forms, steppers, cards)  
- [ ] Theme toggle still works  
- [ ] Apply form + validation messages localize  
- [ ] Recruiter inbox + dashboard chrome localize  
- [ ] New AI analysis with `locale.code === "ar"` returns MSA content with English tech terms  
- [ ] Switching language does **not** rewrite existing CandidateSession analysis text  
- [ ] Banner + **Regenerate in current language** when `analysisLanguage !== locale`  
- [ ] `analysisLanguage` set on new runs and preserved on locale toggle  
- [ ] `lang` / `dir` update; screen-reader-facing labels update  
- [ ] Typecheck: Arabic catalog satisfies `Messages`; missing/extra keys fail early  
- [ ] Charts show localized numbers/dates where applicable  
- [ ] Language switching while an AI request is in progress (UI chrome updates; in-flight request keeps its request-scoped locale)  
- [ ] Refresh persistence after switching languages  
- [ ] Browser back/forward after changing locale (locale remains from storage; URLs unchanged)  
- [ ] Long Arabic text wrapping without overflow  
- [ ] Mixed English technical terms inside Arabic paragraphs render cleanly  
- [ ] RTL layout on very small mobile screens (~320–375px)

---

## 18. Implementation constraints

- Do not break existing functionality  
- Do not redesign the product  
- Do not change hiring business logic beyond locale plumbing  
- Prefer deep modules: UI → `useLocale` / formatters; AI routes → PromptBuilder + explicit `locale`  

---

## 19. Decision log

| Decision | Choice |
| --- | --- |
| Library | Custom typed catalogs + provider (no next-intl / i18next) |
| Routes | Unchanged; client-side locale only |
| AI | Option B — prompt locale; no retroactive translation |
| AI payload | Rich `AILocaleContext`, not bare `"ar"` string |
| Typing | Nested `t.domain.key`, English as source of truth for `Messages` |
| Hook API | Single `useLocale()` |
| Arabic font | IBM Plex Sans Arabic only |
| Switcher | Premium dropdown with globe |
| CSS | Logical properties; audit physical utilities |
| Validation | Codes → dictionary or schema factory with messages |
| Charts | Full chrome + Intl formatters |
| a11y | `lang`/`dir` + localized aria |
| Persistence precedence | localStorage → browser language → `en` |
| Translation integrity | `Messages` type + typecheck/CI; flag stale extras |
| Analysis metadata | `CandidateSession.analysisLanguage` |
| Regenerate | Explicit “Regenerate in current language” — no auto-translate |
| ICU / plurals | Future work; v1 simple `{name}` interpolation |
