# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Dogevity Food** — marketing landing page for a Thai pet nutrition coaching business. Static single-page site with:
- Marketing sections (Hero, Problem, Solution, Recipe example, Credentials, Testimonials)
- An embedded RER/DER calorie calculator (no login required)
- A contact form that writes leads to Supabase and notifies via EmailJS
- CTAs pointing to the separate webapp at **https://app.dogsanook.com/** (that webapp lives in another repo and is out of scope here)

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

Defined via Vite (`VITE_*` prefix):

| Var | Purpose |
|---|---|
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase client (`src/lib/supabase.js`) — used only by `ContactForm` to insert into `contacts` table |
| `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` | EmailJS notification when contact form submitted |
| `VITE_LINE_OA_URL` / `VITE_LINE_OA_ID` | LINE Official Account deep links |

Supabase placeholders fall back to dummy values so the build never crashes on missing env, but the contact-form insert will fail at runtime.

## Architecture

Single-page React app rendered by `src/App.jsx`. No router — App just lays out landing sections in order. All components live in `src/components/`, styled by `src/index.css`.

### Key files

- `src/App.jsx` — top-level composition of landing sections
- `src/components/CalorieCalculator.jsx` — embedded RER/DER calculator. Formulas: `RER = 70 × weight^0.75`; `DER = RER × factor` where factor comes from an AAFCO-derived table (neutered 1.6, intact 1.8, weight-loss 1.0, etc.). If the webapp's calculator formulas change, mirror them here.
- `src/components/ContactForm.jsx` — inserts into the `contacts` table and fires an EmailJS notification. Non-blocking: EmailJS failures don't surface to the user.
- `src/data/index.js` — copy content for the Recipe example, macro breakdown, testimonials, problem/solution cards
- `src/lib/supabase.js` — thin Supabase client wrapper

### Styling conventions

- Color palette in `:root` of `src/index.css` uses `oklch()` (teal, gold, cream, brown for the Hero pill). New colors should be `oklch()` for consistency.
- `.fi` class + `FadeInObserver` is the scroll-triggered fade-in pattern used throughout.

### JSX gotcha — `>` in option text

Putting a literal `>` in JSX text content (e.g. `<option>อายุ >4 เดือน</option>`) **fails Vite/Rolldown's parser**. Use `{'>'}` or `&gt;`. See `CalorieCalculator.jsx` for examples.

## Database setup

The schema lives in `supabase-schema.sql` and is run manually in Supabase Dashboard → SQL Editor. It defines only the `contacts` table (public insert, admin-side reads happen in the separate webapp project). The file is idempotent (`if not exists`) so it's safe to re-run.

## Deployment

Vercel, framework auto-detected as Vite. `vercel.json` sets only the build command / output — no SPA rewrites, because there is no client-side routing.
