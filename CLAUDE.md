# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Dogevity Food** — Pet nutrition coach product (Thai language). Two surfaces:
- **Landing page** at `/` — marketing site with embedded RER/DER calorie calculator and contact form
- **Webapp** at `/app` — authenticated multi-dog tracker (profile, weight, health, recipe) with admin tools at `/app` (admin email only)

UI copy is **Thai**. Comments and identifiers are English. Font is `'Prompt'` loaded from Google Fonts in `index.html`.

## Commands

```bash
npm run dev      # vite dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run lint     # eslint .
npm run preview  # serve dist/
```

No test suite is set up.

## Required environment variables

Defined via Vite (`VITE_*` prefix). All consumed in `src/`:

| Var | Purpose |
|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase client (`src/lib/supabase.js`) |
| `VITE_ADMIN_EMAIL` | Frontend admin gate in `WebApp.jsx`. **Must match the email hardcoded in `supabase-schema.sql` RLS policies** (currently `chaivoot@gmail.com`) — otherwise admin reads/writes will silently fail. |
| `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` | EmailJS notifications when contact form submitted |
| `VITE_LINE_OA_URL` / `VITE_LINE_OA_ID` | LINE Official Account deep links |

Supabase placeholders fall back to dummy values so the build never crashes on missing env, but auth/data calls will fail at runtime.

## Architecture

### Two-surface code split

| Surface | Code | Styles |
|---|---|---|
| Landing page | `src/components/` + `src/data/index.js` | `src/index.css` |
| Webapp | `src/webapp/` (own `pages/` + `components/` + `utils.js` + `data.js`) | `src/webapp/webapp.css` |

The two surfaces share `src/lib/supabase.js` but otherwise have **separate component libraries, data files, and CSS**. Calculator math (RER/DER) is duplicated in `src/webapp/utils.js` and `src/components/CalorieCalculator.jsx` — keep them in sync if the formulas change.

### Routing (`src/App.jsx`)

- `/` — `LandingPage` (Nav, Hero, Problem, Solution, Recipe, CalorieCalculator, Credentials, Testimonials, CTASection, Footer)
- `/login` — auth (signup or login)
- `/app` — `WebApp.jsx`, which owns the sidebar nav and renders one of `PageDashboard | PageProfile | PageRecipe | PageWeight | PageHealth | PageAdmin`

`vercel.json` rewrites all paths to `/index.html` so the SPA router handles them.

### Data model

One row per user in `user_data`. The `dogs` column is **a JSONB array** — a user can own multiple dogs, each with embedded `weights[]`, `health[]`, and `recipe[]`. The shape is defined by `newDogEntry()` in `src/webapp/data.js`.

`WebApp.jsx` includes a **legacy migration** from the old single-dog schema (`data.dog`, `data.weights`, `data.health`, `data.recipe`) into the new `dogs[]` array. Don't remove this until it's confirmed all rows are migrated.

The `contacts` table is separate — it stores landing-page form submissions (publicly insertable, admin-readable). The admin's `PageAdmin` reads both `contacts` and `user_data` to build recipes for clients.

### Authentication pattern (unusual)

`src/webapp/auth.js` uses **phone number as the Supabase password**. `signUp({ email, password: phone })` and `signInWithPassword({ email, password: phone })`. Don't attempt to "fix" this to a real password unless explicitly asked — it's the product's intentional low-friction onboarding.

### Admin authorization

Two layers, **both must agree on the email**:
1. **Frontend** — `WebApp.jsx` reads `VITE_ADMIN_EMAIL` and toggles admin UI
2. **Backend** — `supabase-schema.sql` RLS policies hardcode `auth.jwt() ->> 'email' = 'chaivoot@gmail.com'` for read-all, update-all, delete on `user_data` and `contacts`

If you change the admin email, **update both places** and re-run the SQL.

### Photo storage

Bucket `dog-photos`, public read, owner-scoped write. Path convention: `${userId}/${dogId}.${ext}` — `uploadPhoto` in `WebApp.jsx` enforces this. The bucket itself must be created manually in the Supabase dashboard before the policies in `supabase-schema.sql` will work.

### Styling conventions

- Color palette in `:root` of `src/index.css` uses `oklch()` (teal, gold, cream). Same conventions in webapp.css. New colors should be `oklch()` for consistency.
- Brown tones used for the Hero pill (warm, food-themed).
- `.fi` class + `FadeInObserver` is the landing page's scroll-triggered fade-in pattern.

### JSX gotcha — `>` in option text

Putting a literal `>` in JSX text content (e.g. `<option>อายุ >4 เดือน</option>`) **fails Vite/Rolldown's parser**. Use `{'>'}` or `&gt;`. See `CalorieCalculator.jsx` and `PageProfile.jsx` for examples.

## Database setup

The schema lives in `supabase-schema.sql` and is run manually in Supabase Dashboard → SQL Editor. The storage bucket `dog-photos` must be created via the dashboard UI **first**, then the RLS policies in that file will apply. The file is idempotent (`if not exists` / `add column if not exists`) so it's safe to re-run after edits.

## Deployment

Vercel, framework auto-detected as Vite. `vercel.json` provides SPA rewrites only.
