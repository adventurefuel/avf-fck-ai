# FCK AI Command Center

Adventure Fuel's FCK AI activation framework as a live web app: framework explainer, First 50 opportunity diagnostic with auto-drafted campaign blueprints, a First 50 roster tracker, the tactic playbook, and a shared campaign tracker.

## Stack

- Static single-page site (`index.html` — no build step)
- Data layer: [Supabase](https://supabase.com) Postgres (tables `fck_ai_campaigns`, `fck_ai_first50`), realtime-subscribed via `@supabase/supabase-js`
- Hosting: [Render](https://render.com) static site, auto-deploys on push to `main`

## Local development

Just open `index.html` in a browser — there's no build step. The Supabase URL and publishable (anon) key are inlined near the bottom of the file's `<script>` block.

## Data model

All tables live in the "ADventure Fuel's Project" Supabase project, namespaced with an `fck_ai_` prefix so they don't collide with the agency's existing CRM tables in the same database (`fck_ai_campaigns`, `fck_ai_first50`, `fck_ai_canvass_runs`, `fck_ai_canvass_stops`).

## Access control

The site requires sign-in (Supabase Auth, email + password) — the anon key shipped in the page has no read/write access to any `fck_ai_*` table on its own; every request has to carry a logged-in session. This reuses the same `auth.users` / `public.profiles` (role: `hunter` or `admin`) system already used by the agency CRM in this Supabase project, so existing teammates can sign in with the same account.

- **Campaigns** stays a shared, team-wide tracker — any signed-in teammate can see and edit every campaign, same as before, just gated behind login now.
- **First 50** and **Canvassing** are private per login — each person only sees the prospects/roster and canvassing runs they personally added. Rows are tagged with `owner_id` and Row Level Security enforces `owner_id = auth.uid()`.
- Anyone with the `admin` role in `public.profiles` sees everyone's First 50 and canvassing data (tagged by name in the UI), in addition to the shared campaigns tracker.

**Adding a teammate:** create their login in the Supabase dashboard — Authentication → Users → Add user (set an email + password, or send an invite). The existing `handle_new_user()` trigger will automatically create their `profiles` row with the default `hunter` role. To make someone an admin, update their row in `public.profiles` (`role = 'admin'`) via the Table Editor or SQL editor.

**Important:** because `profiles`/`auth.users` are shared with the CRM, double-check in Supabase → Authentication → Sign In / Providers that public email sign-ups are turned off — otherwise a stranger could self-register and get default `hunter` access to both this tool and the CRM. This site's own login form has no sign-up link; accounts are admin-created only.
