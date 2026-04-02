# CLAUDE.md — Project Context for Claude Code

## What This App Does

**Cardinal Choice** — A web application for MBA students to manage their academic journey, upload course milestones, and curate professional portfolios. Faculty and staff use an admin console to monitor and review the 120+ annual student submissions.

---

## Site Architecture

### Student Experience (Front-End)

Screens where students manage their academic work and portfolio.

| Screen | Purpose |
|--------|---------|
| **Student Dashboard** | Primary landing page — recent activity, quick-upload buttons, progress summary |
| **Curriculum Submission Monitor** | Tracks the 11 core course requirements with status badges (Approved, In Review, Locked) and timestamps |
| **Course-Based Uploads** | Upload area organized by MBA course (e.g. MBA 625) — drop-zones for each milestone and final track deliverable |
| **Portfolio Preview** | Public-facing view of the student's curated best work and academic track |
| **Sharing & Permissions** | Privacy toggles and secure link generation for external reviewers |

### Administrator Console (Back-End)

Screens for faculty and staff to monitor and review submissions.

| Screen | Purpose |
|--------|---------|
| **Submission Management Console** | Global dashboard — sortable list of all 120+ submissions, status filters, volume analytics |
| **Submission Review Detail** | Individual student review workspace — integrated PDF viewer, academic rubric checklist, revision/approval controls |

---

## Key Domain Concepts

- **Milestones** — Deliverables tied to specific MBA courses that students upload for review
- **11 core course requirements** — The fixed set of milestones every student must complete
- **Track-specific deliverable** — A final submission that varies by the student's MBA concentration
- **Submission statuses (database values):** `approved`, `in_review`, `locked` (lowercase with underscores — enforced by DB check constraint)
- **~120+ students** submit annually

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend / Hosting** | Next.js on Vercel | Or university-hosted if IT supports it |
| **Database + Auth** | Supabase | Includes email/password auth, PostgreSQL |
| **File Storage** | University server (preferred) or Supabase | University server = $0; Supabase 100GB included in Pro plan |
| **Video** | Panopto embed codes | Students paste Panopto embed code for final deliverable — no video file upload |
| **PDF Viewer** | Read-only embedded viewer | No markup or annotation needed |

---

## Key Technical Decisions (Confirmed)

- **Student authentication:** Email + password login — NOT university SSO, NOT magic links
  - Account creation flow: admin creates account using student's university email → student receives one-time access code via email → student uses access code to activate account and set a password → all future logins use email + password
  - Login identifier: university email address (not username)
- **Admin authentication:** Same login system, different role
- **Video submissions:** Students submit Panopto embed code (university-provided platform); video plays embedded on Portfolio Preview page — no file upload, no storage cost
- **PDF viewing:** Read-only viewer only — no annotation or markup capability needed
- **File uploads:** PDFs, Word docs, audio files for milestones; Panopto embed link for final track deliverable
- **File storage:** University server preferred; Supabase storage as fallback if university hosting unavailable

## Pending Decisions (Awaiting University IT Conversation)

- **Hosting path:** University-hosted (in-house, ~$0/yr) vs. cloud (Vercel + Supabase, ~$540/yr) — blocked on university IT proposal/approval process
- **File storage:** University server vs. Supabase storage — depends on hosting outcome above
- **Outside vendor approval:** University requires a proposal process for outside vendors (Vercel, Supabase) — IT conversation needed before committing to cloud path

---

## Hosting & Cost Estimates

### Annual Cost — University Hosts Everything
| Component | Cost |
|-----------|------|
| University server (app + files) | ~$0 |
| **Total** | **~$0/yr** |

### Annual Cost — Cloud Hosting (Vercel + Supabase)
| Component | Cost |
|-----------|------|
| Vercel Pro (web app) | ~$240/yr |
| Supabase Pro (database + auth + file storage) | ~$300/yr |
| Video storage | $0 (Panopto — university-provided) |
| **Total** | **~$540/yr** |

### Annual Cost — Hybrid (Cloud App + University File Storage)
| Component | Cost |
|-----------|------|
| Vercel Pro | ~$240/yr |
| Supabase (database + auth only) | ~$300/yr |
| File storage | $0 (university server) |
| **Total** | **~$540/yr** |

### Storage Projection (Files Only — No Video)
| Timeframe | Students | Estimated Storage |
|-----------|---------|------------------|
| Year 1 | 120 | ~3 GB |
| Year 3 | 360 | ~9 GB |
| Year 5 | 600 | ~15 GB |

Storage remains well within Supabase Pro 100GB limit for the foreseeable future.

---

## Next.js Project Setup

- Project created at: `Documents/AI in Business Application/Reader/cardinal-choice`
- Uses **Tailwind CSS v4** — configuration is in `app/globals.css` using `@import "tailwindcss"` and `@theme {}` block (NOT `tailwind.config.ts`)
- Fonts loaded via Google Fonts links in `app/layout.tsx` (Inter + Manrope + Material Symbols)
- Supabase client at `lib/supabase.ts` — uses `createBrowserClient` from `@supabase/ssr` (stores session in cookies so middleware can read it)
- `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### HTML Design Mockups (in GitHub main branch)
All screens were pre-designed as HTML prototypes (.txt files) and have been converted to Next.js pages:
- `Student Dashboardl.txt` → `app/dashboard/page.tsx` ✅
- `Curriculum Dashboard.txt` → alternate dashboard design (reference only)
- `Curriculum Submission Monitor.txt` → `app/curriculum/page.tsx` ✅
- `Course Based Uploads.txt` → `app/uploads/page.tsx` ✅
- `Portfolio Preview.txt` → `app/portfolio/page.tsx` ✅
- `Sharing & Permissions` → `app/sharing/page.tsx` ✅
- `Submission Review Detail.txt` → `app/admin/review/page.tsx` ✅
- `Submissions Managment Console.txt` → `app/admin/submissions/page.tsx` ✅

---

## Database Schema

### Tables
| Table | Key Columns |
|-------|------------|
| `profiles` | id, email, full_name, role, mba_track, is_active, created_at |
| `courses` | id, code, name, sort_order |
| `milestones` | id, course_id, title, description, is_core, allows_panopto, sort_order |
| `submissions` | id, student_id, milestone_id, status, file_url, file_name, file_type, panopto_embed_code, reviewer_notes, submitted_at, reviewed_at, reviewed_by, created_at, updated_at |
| `portfolio_items` | (columns not yet confirmed) |
| `sharing_links` | (columns not yet confirmed) |
| `access_codes` | (columns not yet confirmed) |

### Submission Status Values (DB constraint)
Must be exactly: `approved`, `in_review`, `locked` (lowercase, underscores)

### RLS Policies in Place
- `profiles`: Users can read own profile; Authenticated users can read all profiles
- `submissions`: Admins can read all submissions; students need a policy added to read their own
- `milestones`: Authenticated users can read milestones
- `courses`: Authenticated users can read courses

### Test Data
- Test student: `test@louisville.edu` / `Test1234!` (role: student, full_name: Alex Chen, id: `07aa6746-8dfa-4068-b39e-5b691c5a02ab`)
- Test admin: `admin@louisville.edu` / `Admin1234!` (role: admin)
- 11 courses (MBA 625–MBA 668) inserted
- 11 milestones inserted (one per course)
- 11 test submissions inserted for Alex Chen (8 approved, 1 in_review, 2 locked)

---

## Build Progress

### Phase 1 Status (as of 2026-03-31)
- [x] Supabase project created
- [x] Database schema deployed
- [x] Next.js project created locally
- [x] Supabase client connected via `.env.local` — uses `createBrowserClient` from `@supabase/ssr`
- [x] Login page built and working — `app/login/page.tsx`
- [x] All 7 pages built
- [x] Middleware created — protects all pages, redirects unauthenticated users to `/login`
- [x] Role-based redirect working — students → `/dashboard`, admins → `/admin/submissions`
- [x] Sign Out wired up on ALL pages
- [x] Navigation links wired on ALL pages
- [x] Student Dashboard connected to live Supabase data ✅
- [x] Curriculum Submission Monitor connected to live Supabase data ✅
- [x] Admin Submissions Console connected to live Supabase data ✅
- [x] Admin Review Detail connected to live Supabase data ✅ (loads via ?id= URL param from View Details button)
- [x] App deployed to Vercel for demo purposes (see Vercel Deployment section below)
- [ ] Add RLS policy so students can read their own submissions (needed for dashboard/curriculum data to load correctly for real students)
- [ ] Connect remaining pages to live data: uploads, portfolio, sharing
- [ ] File upload functionality (blocked on university IT hosting decision)
- [ ] Panopto embed code submission
- [ ] Account creation / access code flow for new students

---

## Vercel Deployment (for demos)

To show the app without running it locally, deploy to Vercel:

1. Go to vercel.com and sign in with GitHub
2. Click **Add New Project** → import `mwelde01/Cardinal-Choice`
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` — copy from `.env.local`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — copy from `.env.local`
4. Click **Deploy**
5. Share the generated URL (e.g. `cardinal-choice.vercel.app`)

**Demo credentials:**
- Student: `test@louisville.edu` / `Test1234!`
- Admin: `admin@louisville.edu` / `Admin1234!`

Note: Vercel free tier is fine for demos. Only upgrade to Pro if going to production.

---

## Authentication Notes
- Middleware uses `@supabase/ssr` — `lib/supabase.ts` also uses `createBrowserClient` from `@supabase/ssr` (NOT `createClient` from `@supabase/supabase-js`) so sessions are stored in cookies the middleware can read
- After login, must use `window.location.href` (not `router.push`) to force full page reload so middleware can pick up the session cookie
- All pages require `'use client'` at the top (first line, before all imports) since they use event handlers

---

## Key File Contents

### `lib/supabase.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### `lib/signout.ts`
```typescript
import { supabase } from './supabase'
export async function signOut() {
  await supabase.auth.signOut()
  window.location.href = '/login'
}
```

---

## Navigation Link Map

### Student pages
| From page | Link label | href |
|-----------|-----------|------|
| All student pages | Dashboard | `/dashboard` |
| All student pages | Materials / My Files | `/uploads` |
| All student pages | Portfolio | `/portfolio` |
| All student pages | Curriculum / Timeline | `/curriculum` |
| All student pages | Access / Sharing | `/sharing` |

### Admin pages
| From page | Link label | href |
|-----------|-----------|------|
| Admin pages | Dashboard | `/dashboard` |
| Admin pages | Submissions | `/admin/submissions` |
| Submissions console | View Details | `/admin/review?id={submission_id}` |

---

## Build Phases

### Phase 1 — Foundation ✅
### Phase 2 — Student Experience ✅ (pages built, dashboard + curriculum connected to live data)
### Phase 3 — Admin Console ✅ (fully connected to live data)
### Phase 4 — Testing & Launch (pending)

---

## User Workflow Preferences

- **Git operations:** Use GitHub Desktop or GitHub.com web UI — do NOT instruct command-line git commands
- **Merging branches:** Guide through GitHub Desktop (Branch → Merge into current branch) or GitHub.com Pull Requests
- **Comfort level:** Non-technical user — give step-by-step UI instructions, avoid terminal commands

---

## Branch Naming Convention

Claude Code branches must follow this pattern:
```
claude/<description>-<SESSION_ID>
```
Example: `claude/add-upload-endpoint-QJGwn`

Push with: `git push -u origin <branch-name>`

---

## Session Behavior Rules (IMPORTANT)

- **Do NOT retry push operations repeatedly.** If a push fails or uses significant session context, stop and report the status to the user instead of retrying.
- **Do NOT attempt large multi-file operations near session limits.** If context is running low, stop, document what remains, and ask the user to start a new session.
- **When a push partially completes and breaks the site**, immediately note which files were pushed and which were not — do not attempt further pushes.

---

## WCAG / ADA Accessibility Work

### Status (as of 2026-04-02)
A full WCAG 2.1 AA audit was completed. An attempt was made to push fixes on branch `claude/add-accessibility-compliance-1I7qf`. The push was **partially completed and broke the site**. The branch should be **reverted to the last working state** before applying fixes again.

### What Was Pushed (may be broken — revert before using)
- `app/layout.tsx` — added skip-nav link and per-page title support
- `app/login/page.tsx` — form label/input id fixes, error alert role, autocomplete
- `app/dashboard/page.tsx` — skip-nav target, aria-labels, button/keyboard fixes

### What Was NOT Pushed (still needs to be done)
- `app/curriculum/page.tsx`
- `app/uploads/page.tsx`
- `app/portfolio/page.tsx`
- `app/sharing/page.tsx`
- `app/admin/submissions/page.tsx`
- `app/admin/review/page.tsx`

### Full List of Required Fixes (apply to all files above)

#### Critical (WCAG 2.1 AA failures)

1. **Form labels not connected to inputs** (`login/page.tsx`, `uploads/page.tsx`)
   - Add `htmlFor="field-id"` to every `<label>` and matching `id="field-id"` to every `<input>`

2. **Icon-only buttons have no accessible name** (every page)
   - Add `aria-label="..."` to every button that contains only a Material Symbols icon and no visible text
   - Affected buttons: notification bell, pagination prev/next chevrons, floating "+" action button, "more_horiz" options button, help button, "open full view" button

3. **No skip navigation link** (every page)
   - Add `<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to main content</a>` at the top of `layout.tsx`
   - Add `id="main-content"` to the `<main>` element on every page

4. **Toggle switches inaccessible** (`sharing/page.tsx`)
   - Add `role="switch"`, `aria-checked={isOn}`, and `aria-label="[what it controls]"` to every toggle `<button>`

5. **Contrast failure — zinc-400 text on light backgrounds** (every page)
   - Replace `text-zinc-400` with `text-zinc-500` everywhere it is used for body/label/metadata text
   - `text-zinc-500` (#71717a) passes WCAG AA at ~4.8:1 on white; `text-zinc-400` (#a1a1aa) fails at ~2.4:1

6. **Font sizes too small** (every page)
   - Replace `text-[8px]`, `text-[9px]`, `text-[10px]` with `text-xs` (12px minimum) throughout all pages

7. **Interactive `<div>` elements not keyboard accessible** (`dashboard`, `curriculum`, `uploads`)
   - Convert milestone cards and upload drop zones from `<div>` with `cursor-pointer` to `<button>` elements (or add `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers)

8. **Focus indicators removed** (`login`, `uploads`, `admin/review`)
   - Remove `focus:outline-none` from inputs and textareas
   - Replace with a visible focus ring: e.g. `focus:ring-2 focus:ring-primary focus:outline-none` (ring is visible; outline suppression is acceptable when a ring replaces it)

9. **Error message not announced to screen readers** (`login/page.tsx`)
   - Add `role="alert"` to the error `<p>` element so screen readers announce it automatically on appearance

#### Moderate (Best Practice / Borderline AA)

10. **Unique page titles** (every page / `layout.tsx`)
    - Each page must export its own `metadata` object with a unique `title`, e.g. `"Dashboard | Cardinal Choice"`
    - Remove or override the shared title in `layout.tsx`

11. **Multiple `<nav>` elements without `aria-label`** (every page)
    - Add distinguishing `aria-label` to each nav: e.g. `aria-label="Primary navigation"`, `aria-label="Sidebar navigation"`, `aria-label="Mobile navigation"`

12. **Table headers missing `scope` attribute** (`admin/submissions/page.tsx`)
    - Add `scope="col"` to every `<th>` in the submissions table

13. **`href="#"` placeholder links** (every page)
    - Replace with real routes, or change to `<button>` elements where no route exists yet

14. **Reduced-opacity elements failing contrast** (`dashboard`, `curriculum`)
    - Remove `opacity-50` / `opacity-60` from text in locked/advanced milestone cards, or darken the base text color to compensate

#### Minor

15. **Autocomplete attributes missing on login form** (`login/page.tsx`)
    - Add `autoComplete="email"` to the email input and `autoComplete="current-password"` to the password input

16. **Breadcrumb missing `aria-label`** (`admin/review/page.tsx`)
    - Add `aria-label="breadcrumb"` to the breadcrumb `<nav>`
    - Add `aria-current="page"` to the last breadcrumb item

17. **`<aside>` elements without `aria-label`** (`dashboard`, `curriculum`, `portfolio`)
    - Add `aria-label="..."` to each `<aside>` to distinguish them in landmark navigation
