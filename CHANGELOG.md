# Changelog — Documentation

All notable documentation changes for the Foundry repository.

## [2026-07-22] — Definitive README merge

### Preserved

- **docs/ARCHITECTURE.md** — Mermaid system diagram, folder map, design principles (kept as deep-dive; not deleted)
- **docs/DEPLOYMENT.md** — Vercel prerequisites, env var table, verification checklist, production notes
- **.env.example** / **.env.local.example** — Full environment variable templates and comments
- Existing README sections: product surfaces, architecture diagram, demo vs live AI callout, tech stack, API reference with curl examples, AI pipeline temperatures, keyboard shortcuts, engineering decisions table, known limitations
- Badge row (Next.js, React, TypeScript, Gemini, Vercel)
- License note (private demo / portfolio)

### Added

- **CHANGELOG.md** (this file)
- README **Troubleshooting** section
- README **Intended live AI flow** diagram
- README link to CHANGELOG in Further reading
- README author attribution — [Habin Rahman](https://github.com/habinrahman)
- `package.json` `author` field

### Improved

- **README.md** — Clarified `AI_REQUEST_TIMEOUT_MS` is config-only (not wired to `AbortController` in `GeminiProvider`)
- **README.md** — Documented default **light** theme (`theme-provider.tsx`)
- **README.md** — Added **Troubleshooting** table (port 8600, 503, upload behavior, theme, hydration)
- **README.md** — Added **Intended live AI flow** Mermaid sequence (labeled as not UI-wired)
- **README.md** — Added **Repository metadata** (package `foundry` vs folder name)
- **docs/ARCHITECTURE.md** — Added **Demo vs live paths** table; split data flow into demo (current) and live (API)
- **docs/DEPLOYMENT.md** — Added dev port **8600**, local `NEXT_PUBLIC_APP_URL` guidance, Node vs Edge runtime note
- **.env.example** / **.env.local.example** — Default `NEXT_PUBLIC_APP_URL` aligned to port **8600**

### Removed

- Nothing removed from existing documentation files.
- **Justification:** User instruction was to preserve institutional docs and improve in place, not replace subsidiary guides with README-only content.

### Verification notes (repository audit)

| Claim | Verified |
| --- | --- |
| No client `fetch` to `/api/ai/*` | Yes — grep over `src/` |
| Dev port 8600 | Yes — `package.json` scripts |
| `defaultTheme="light"` | Yes — `theme-provider.tsx` |
| OpenAI provider stub | Yes — `openai.ts` throws |
| No test files | Yes — zero `*.test.*` / `*.spec.*` |
| No GitHub Actions | Yes — no `.github/workflows` |
| Five API routes, Node runtime | Yes — `src/app/api/ai/*/route.ts` |
| `React.memo` on dashboard panels | Yes — recruiter-dashboard, overview-cards, skill-matrix, radar-chart, interview-qa |
| Seven UI pipeline stages | Yes — `use-ai-pipeline.ts` |
