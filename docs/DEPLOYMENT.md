# Deployment guide (Vercel)



Foundry is configured for a **zero-modification** Vercel deploy.



## 1. Prerequisites



- GitHub/GitLab/Bitbucket repo (or Vercel CLI)

- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)



## 2. One-click / CLI



```bash

npm i -g vercel

vercel

```



Or import the repository in the Vercel dashboard → **Add New Project**.



Framework preset: **Next.js** (auto-detected).  

Build command: `npm run build` (see `vercel.json`).



## 3. Environment variables



In **Project → Settings → Environment Variables**, add:



| Name | Example | Required |

| --- | --- | --- |

| `GEMINI_API_KEY` | `AIza…` | Yes (for live AI routes) |

| `AI_PROVIDER` | `gemini` | No (default) |

| `AI_MODEL` | `gemini-2.5-flash` | No |

| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Recommended for OG |

| `NEXT_PUBLIC_APP_NAME` | `Foundry` | No |



Copy from `.env.example` for the full list.



> The recruiter dashboard and candidate demo UI work without a key (seeded memory data). API routes under `/api/ai/*` require `GEMINI_API_KEY`.



## 4. Verify



1. Visit `/` — landing + shortcuts.

2. Visit `/candidate` — drag-drop + progress animation.

3. Visit `/recruiter` — dashboard + exports.

4. Press `⌘K` — command palette.

5. Optional: `curl` an AI route with a sample body once the key is set (see [README.md](../README.md#example-curl)).



## 5. Production notes



- `vercel.json` sets install/build commands and security headers.

- `next.config.ts` enables compression, image formats, and `optimizePackageImports`.

- Region default: `iad1` (change in `vercel.json` if needed).

- No database migrations. No auth setup. No Redis.

- API routes use **Node.js runtime** (`runtime = "nodejs"`); OG image routes use Edge.



## 6. Local development



```bash

cp .env.example .env.local

npm install

npm run dev

```



Dev server runs at **http://localhost:8600** (`next dev --turbopack -p 8600`).



For correct local OG/sitemap URLs, set:



```bash

NEXT_PUBLIC_APP_URL=http://localhost:8600

```



## 7. Local production parity



```bash

cp .env.example .env.local

npm install

npm run build

npm run start

```



`npm run start` serves on port **3000** by default unless `PORT` is set.

