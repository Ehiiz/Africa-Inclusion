# Afri Inclusion Advisory

Next.js (App Router, TypeScript) marketing site and insights blog, built from
`design/landing page.png` and the `Brand Identity.pdf` system (Rev 2026.1).

```bash
npm install
cp .env.example .env.local      # fill in ADMIN_PASSWORD and AUTH_SECRET
npm run seed                    # optional: the four posts drawn in the comp
npm run dev                     # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on :3000 |
| `npm run build` / `npm start` | Production build and server |
| `npm run seed` | Insert the comp's four insights (idempotent — existing slugs are skipped) |

`npm run seed` passes `--env-file-if-exists=.env.local`, so it writes to the same
database the app reads. Running `tsx scripts/seed.ts` directly would skip that file
and quietly seed the local SQLite file instead of your remote one.

## Routes

| Path | |
| --- | --- |
| `/` | Landing page. The Insights section reads published posts from the database. |
| `/about` | History, vision, mission and the five core values. Static. |
| `/insights` | All published posts, newest first. |
| `/insights/[slug]` | A single post; Markdown body rendered to HTML. |
| `/admin` | Post list — title, category, status, publish date. Requires sign-in. |
| `/admin/comments` | Every comment, with the commenter's email. Hide or delete. |
| `/admin/posts/new` | Write a post. |
| `/admin/posts/[id]` | Edit, publish/unpublish, feature or delete a post. |
| `/admin/login` | Password sign-in. |

## Project layout

```
app/
  layout.tsx           fonts, metadata
  globals.css          the whole design system + blog + admin styles
  page.tsx             landing page composition
  fonts/               the 7 Helvetica Now Display faces the site uses
  about/               the About page
  insights/            public blog + the comment and like server actions
  admin/               admin area + server actions
components/
  site/                one component per landing-page section
  about/               CoreValues — the self-advancing core-values slider
  insights/            comment thread, comment form, like button, share bar
  admin/               LoginForm, PostForm
lib/
  site.ts              the booking URL, shared by every consultation CTA
  db.ts                libSQL client + schema
  posts.ts             queries, slugify, read-time estimate, date formatting
  engagement.ts        comment and like queries
  engagement-shared.ts comment validation + formatting, safe to import client-side
  visitor.ts           the anonymous visitor cookie, and the commenter prefill
  auth.ts              password check + session cookie (server only)
  auth-shared.ts       HMAC session token — also runs in Edge middleware
  markdown.ts          Markdown → HTML, with raw HTML disabled
middleware.ts          gates /admin/*
public/assets/img/     every image the site serves
design/                source material, not served (comps, brand PDF, exports, full font family)
scripts/seed.ts        demo content
```

## Database — read this before deploying

The app uses **libSQL**, which *is* SQLite: same engine, same SQL, same file
format. Locally it writes a plain file at `data/afri.db`, created on first use.

**A local SQLite file cannot be used on Vercel.** Serverless functions get a
read-only filesystem (apart from an ephemeral, per-instance `/tmp`), so writes
either fail or silently vanish between requests. `lib/db.ts` throws a clear error
rather than appearing to work.

The fix is to point the same client at [Turso](https://turso.tech), which is
hosted libSQL. No code changes — only environment variables:

```bash
turso db create afri-inclusion
turso db show afri-inclusion --url          # -> DATABASE_URL
turso db tokens create afri-inclusion       # -> DATABASE_AUTH_TOKEN
```

Set both in the Vercel project, along with `ADMIN_PASSWORD`, `AUTH_SECRET` and
`NEXT_PUBLIC_SITE_URL`. The schema is created automatically on the first query,
and columns added after the first release are applied then too (`migrate()` in
`lib/db.ts`), so deploying over an existing database needs no manual step.

If you would rather use Postgres (Neon, Supabase, Vercel Postgres), `lib/posts.ts`
is the only file that writes SQL — the page and admin code do not touch the
database directly.

## Admin authentication

A single shared password, set as `ADMIN_PASSWORD`. Signing in issues an httpOnly,
SameSite=Lax cookie holding `<expiry>.<hmac>` signed with `AUTH_SECRET` — no
session table, and the cookie cannot be forged without the secret. Sessions last
12 hours. `middleware.ts` blocks `/admin/*` at the edge and the admin layout checks
again on the server.

This is deliberately simple. If more than one person needs access, or you want
per-author attribution and audit trails, this is the layer to replace.

Generate a secret with `openssl rand -base64 32`.

## Posts

Bodies are **Markdown** (GFM). Raw HTML is escaped before parsing, so a pasted
snippet cannot inject script tags even though only the admin can write.

- **Slug** auto-fills from the title and stays editable. Collisions get `-2`, `-3`…
- **Excerpt** falls back to the opening paragraph. When it is auto-derived, the
  article page skips the standfirst rather than printing the paragraph twice.
- **Read time** falls back to a 200-words-per-minute estimate.
- **Featured** takes the large card on the landing page and is exclusive — setting
  it on one post clears it everywhere else.
- **Published** is the only thing that makes a post public. Drafts are invisible
  outside `/admin`.

## About page

`/about` is built from `ABOUT SECTION1.pdf` — history, vision, mission and the
five core values. It is static: nothing on it reads the database, so Next
prerenders it at build time.

The core values are a self-advancing slider (`components/about/CoreValues.tsx`),
as the brief asked. It is a real tab list — arrow keys move between values, each
panel is a labelled `tabpanel` — and the rotation is restrained rather than
insistent:

- it pauses while a reader hovers the block or tabs into it;
- it does not start at all under `prefers-reduced-motion: reduce`;
- a rail fills across the active tab over the 7-second interval, so the next
  slide is visible coming rather than a surprise.

Change `INTERVAL_MS` in that file to retime it.

The nav and footer **About** links point here. The landing page's `id="about"`
section (The Challenge) is untouched and still anchorable at `/#about`.

## Booking a consultation

`BOOKING_URL` in `lib/site.ts` is the Zoho slot-booking page. It backs the
closing CTA's "Book a Consultation" button and all four Who We Work With cards,
so those five links cannot drift apart. Spread `BOOKING_LINK_PROPS` onto an
anchor to get the href plus the `target`/`rel` an outbound link needs.

"Send an Inquiry" and the footer address stay on `mailto:` — an inquiry is not a
booking.

## Comments, likes and sharing

Every published insight carries a comment thread, a like button and a share row.
None of it asks the reader to make an account.

**Comments** take a name, an email and the comment. The email is stored for the
admin's benefit and is **never rendered on the public page** — `listComments()`
does not select the column, so the bytes never reach the browser. Bodies are
plain text that React escapes; unlike post bodies they are not Markdown, so a
commenter cannot inject links or formatting.

Comments go live immediately. Three things keep that honest:

- a honeypot field that people never see. A bot that fills it gets a success
  message and a comment flagged `hidden`, which is the quietest way to fail;
- a 30-second cooldown per browser (`COMMENT_COOLDOWN_SECONDS`);
- length and format limits in `validateComment()`.

Moderation is therefore after the fact, at `/admin/comments` — **hide** takes a
comment off the site but keeps it, **delete** is final.

**Likes** are anonymous and toggle. A reader is identified only by `afri_visitor`,
an opaque random id in an httpOnly cookie that holds no personal data; clearing
cookies simply looks like a new reader. One row per (post, visitor) in
`post_likes` means the count is exact and a like can be taken back. The button
updates optimistically and settles on whatever the server returns.

`afri_commenter` remembers the last name and email used from that browser so a
returning reader does not retype them. It is httpOnly and read on the server, so
the values are filled in by the page rather than by script.

**Share** uses the native share sheet where the browser has one, and otherwise
falls back to LinkedIn, X, Facebook, WhatsApp, email and copy-link. The absolute
URL comes from `NEXT_PUBLIC_SITE_URL`, and is re-resolved against the address bar
on the client so sharing still works if that variable is unset.

Counts appear under each card on `/insights` once a post has any, and beside the
read time on the post itself.

Deleting a post deletes its comments and likes (`deleteEngagementFor`). That
cascade is done in code rather than declared as a foreign key, because SQLite
only enforces those when `PRAGMA foreign_keys` is on — which it is not, by
default.

## Brand

Colours are the guideline's, as CSS custom properties at the top of `globals.css`:

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#121010` | Advisory Ink — primary |
| `--green` | `#00A050` | Inclusion Green — secondary |
| `--yellow` | `#FFEA00` | Optimism Yellow — accent |
| `--red` | `#FF0606` | Momentum Red — accent |
| `--paper` / `--mist` / `--line` / `--slate` | `#FFFFFF` / `#F4F3F1` / `#C9C6C2` / `#2A2726` | neutrals |

`--green-deep` (`#168447`) is the deeper ground behind the hero and Insights;
`--yellow-warm` and `--red-soft` are the applied tints sampled from the comp.

**Helvetica Now Display** is self-hosted via `next/font/local` — 400/500/700/900
upright and 400/500/700 italic, in `app/fonts/`. The rest of the licensed family
(Thin, Light, ExtraBold, `.ttf`/`.eot` variants) is in `design/fonts/` and unused.

Landing-page headings use hard `<br>` breaks to match the comp, tuned against this
font. They collapse to natural wrapping below 820px.

## Images

`public/assets/img/` is generated from `design/exports/` and `design/logos/` —
trimmed of transparent rounded margins and flattened onto white.

| Source | Served as | Used by |
| --- | --- | --- |
| `Complete Landing Girl Image.png` | `hero-merchant.jpg` | Hero |
| `Opening An Account.png` | `challenge-branch.jpg` | The Challenge |
| `Commercial Bank & MFI.jpg` | `commercial-banks-mfis.jpg` | Who We Work With |
| `Fintechs & Payment Providers.jpg` | `fintechs-payment-providers.jpg` | Who We Work With |
| `Regulators.jpg` | `regulators.jpg` | Who We Work With |
| `Development Finance Institutions.jpg` | `development-finance-institutions.jpg` | Who We Work With |
| `why digital account opening.png` | `insight-featured.jpg` | Insights featured card |

Served files are named for the section they appear in, in URL-safe form — no
spaces or ampersands, which would have to be percent-encoded in every `src`.

`why digital account opening.png` has the card's headline and body baked in, so
only the clean photo band above them is used and the text renders live. It is a
short strip stretched to fill the card; a taller clean export would sharpen it.

The four Who We Work With photographs are full-resolution (900px wide for a
~240px slot, so crisp at 2×). The hero, Challenge and Insights images are still
roughly 1× and will look slightly soft on a retina screen — re-export those at 2×
under the same filenames whenever convenient.

`design/logos/` holds the full identity pack. Three variants are the sources for
the served logos and favicon; the other five are unused by the site but kept as
brand source material.

### Post preview images

Each post can carry its own image, uploaded in the admin and stored in the
database as a BLOB. It is served by `app/insights/image/[id]/route.ts` at
`/insights/image/<id>?v=<updated_at>` — the timestamp in the URL changes on every
save, so the response is cached as immutable. List queries select an explicit
column list that excludes the blob, so no page load pulls image bytes it does not
render.

The image appears as the Insights index thumbnail, the landing-page list
thumbnail, the featured card background, and a banner on the post itself. Posts
without one fall back to the default artwork and the grey block from the comp.

Limits: 2 MB, JPEG/PNG/WebP/AVIF (`MAX_IMAGE_BYTES` and `ALLOWED_IMAGE_TYPES` in
`lib/posts-shared.ts`). The Server Action body cap is raised to 4 MB in
`next.config.ts` to leave headroom. Storing images in the database keeps the app
deployable with no extra services; if the library grows to hundreds of posts or
you want larger artwork, move to object storage (Vercel Blob, S3) and swap the
BLOB column for a URL.

## Placeholders still to fill in

- **Social links** — `components/site/SiteFooter.tsx`. Facebook and LinkedIn are in
  place with the right icons and labels but `href="#"`.
