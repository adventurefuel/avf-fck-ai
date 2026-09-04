# FCK AI Command Center

Adventure Fuel's FCK AI activation framework as a live web app: framework explainer, First 50 opportunity diagnostic with auto-drafted campaign blueprints, a First 50 roster tracker, the tactic playbook, and a shared campaign tracker.

## Stack

- Static single-page site (`index.html` — no build step)
- Data layer: [Supabase](https://supabase.com) Postgres (tables `fck_ai_campaigns`, `fck_ai_first50`), realtime-subscribed via `@supabase/supabase-js`
- Hosting: [Render](https://render.com) static site, auto-deploys on push to `main`

## Local development

Just open `index.html` in a browser — there's no build step. The Supabase URL and publishable (anon) key are inlined near the bottom of the file's `<script>` block.

## Data model

Both tables live in the "ADventure Fuel's Project" Supabase project, namespaced with an `fck_ai_` prefix so they don't collide with the agency's existing CRM tables in the same database. Row Level Security is enabled with open (public) read/write policies — there's no per-user auth, so anyone with the site URL can add, edit, or delete rows. That's intentional for an internal team tool; tighten the policies in Supabase if this ever needs to be locked down or made client-facing.
