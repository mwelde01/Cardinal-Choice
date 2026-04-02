# CLAUDE.md — Project Context for Claude Code

## What This App Does

**Cardinal Choice** — A web application for MBA students to manage their academic journey, upload course milestones, and curate professional portfolios. Faculty and staff use an admin console to monitor and review the 120+ annual student submissions.

---

## Site Architecture

### Student Experience (Front-End)

Screens where students manage their academic work and portfolio.

| Screen | Purpose |
|--------|-------|
| **Student Dashboard** | Primary landing page — recent activity, quick-upload buttons, progress summary |
| **Curriculum Submission Monitor** | Tracks the 11 core course requirements with status badges (Approved, In Review, Locked) and timestamps |
| **Course-Based Uploads** | Upload area organized by MBA course (e.g. MBA 625) — drop-zones for each milestone and final track deliverable |
| **Portfolio Preview** | Public-facing view of the student's curated best work and academic track |
| **Sharing & Permissions** | Privacy toggles and secure link generation for external reviewers |

### Administrator Console (Back-End)

Screens for faculty and staff to monitor and review submissions.

| Screen | Purpose |
|--------|-------|
| **Submission Management Console** | Global dashboard — sortable list of all 120+ submissions, status filters, volume analytics |
| **Submission Review Detail** | Individual student review workspace — integrated PDF viewer, academic rubric checklist, revision/approval controls |

---

## Key Domain Concepts

- **Milestones** — Deliverables tied to specific MBA courses that students upload for review
- **11 core course requirements** — The fixed set of milestones every student must complete
- **Track-specific deliverable** — A final submission that varies by the student's MBA concentration
- **Submission statuses:** `Approved`, `In Review`, `Locked`
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
- Supabase client at `lib/supabase.ts` — reads from `.env.local`
- `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### HTML Design Mockups (in GitHub main branch)
All screens were pre-designed as HTML prototypes (.txt files) and are being converted to Next.js pages:
- `Student Dashboardl.txt` → `app/dashboard/page.tsx` ✅
- `Curriculum Dashboard.txt` → alternate dashboard design (reference only)
- `Curriculum Submission Monitor.txt` → `app/curriculum/page.tsx` ✅
- `Course Based Uploads.txt` → `app/uploads/page.tsx` ✅
- `Portfolio Preview.txt` → `app/portfolio/page.tsx` ✅
- `Submission Review Detail.txt` → `app/admin/review/page.tsx` ✅
- `Submissions Managment Console.txt` → `app/admin/submissions/page.tsx` ✅

---

## Build Progress

### Phase 1 & 2 Status (as of 2026-03-31)
- [x] Supabase project created
- [x] Database schema deployed
- [x] Next.js project created locally
- [x] Supabase client connected via `.env.local`
- [x] Login page built — `app/login/page.tsx` (styled, connected to Supabase auth)
- [x] Student Dashboard built — `app/dashboard/page.tsx`
- [x] Admin Submissions Console built — `app/admin/submissions/page.tsx`
- [x] Admin Submission Review Detail built — `app/admin/review/page.tsx`
- [x] Curriculum Submission Monitor built — `app/curriculum/page.tsx`
- [x] Course-Based Uploads built — `app/uploads/page.tsx`
- [x] Portfolio Preview built — `app/portfolio/page.tsx`
- [x] Sharing & Permissions built — `app/sharing/page.tsx`
- [x] Middleware created — `middleware.ts` in root (protects all pages, redirects unauthenticated users to `/login`)
- [x] `@supabase/ssr` package installed
- [x] Post-login redirect fixed — uses `window.location.href` (not `router.push`) so middleware reads session cookie
- [x] Supabase client switched to `createBrowserClient` from `@supabase/ssr` (stores session in cookies, not localStorage)
- [x] Sign Out wired up on all 7 pages via `lib/signout.ts`
- [x] Navigation links wired across all pages
- [x] Test student created: `test@louisville.edu` / `Test1234!` (role: student, name: Alex Chen)
- [x] Test admin created: `admin@louisville.edu` (role: admin) — redirects to `/admin/submissions`
- [x] Test data seeded: courses, milestones, submissions in Supabase
- [x] RLS policies in place: profiles readable by owner + all authenticated users; submissions readable by admins
- [x] Student Dashboard connected to live Supabase data (profile name, submission list, status counts)
- [x] Curriculum Submission Monitor connected to live data (submissions with milestone/course joins)
- [x] Admin Submissions Console connected to live data (all submissions with student name, track, course, milestone)
- [x] Admin Review Detail connected to live data (single submission by URL param `?id=`)
- [x] Portfolio page shows logged-in student's name dynamically (not hardcoded placeholder)
- [x] Deployed to Vercel — auto-deploys on push to `master` branch
- [x] Admin Review Detail fixed for Vercel — `useSearchParams()` wrapped in `<Suspense>` + `export const dynamic = 'force-dynamic'`

- [x] WCAG 2.1 AA accessibility audit completed and all fixes applied to all 9 pages ✅

### Pending — Next Session
- [ ] Connect `app/uploads/page.tsx` to live Supabase data (show existing submissions per course)
- [ ] Connect `app/sharing/page.tsx` to live data
- [ ] **File upload functionality** — blocked on university IT hosting decision (university server vs. Supabase Storage); once decided, wire drop-zones to actually upload files and create submission records
- [ ] Add RLS policy so students can read only their own submissions (currently only admin RLS is in place for submissions table)
- [ ] Account creation / access code flow for new students (admin creates account → student gets one-time code → sets password)
- [ ] Panopto embed code submission on uploads page
- [ ] `href="#"` placeholder links on Settings and Analytics nav items — will be fixed when those pages are built

## Authentication Notes
- Middleware uses `@supabase/ssr` — different from client-side `@supabase/supabase-js` in `lib/supabase.ts`
- After login, must use `window.location.href` (not `router.push`) to force full page reload so middleware can pick up the session cookie
- `lib/supabase.ts` uses `createBrowserClient` from `@supabase/ssr` — stores session in cookies for middleware compatibility
- Test student: `test@louisville.edu` / `Test1234!` — profile row: name "Alex Chen", role: student
- Test admin: `admin@louisville.edu` — role: admin, redirects to `/admin/submissions`
- Submission statuses in DB must be lowercase with underscores: `approved`, `in_review`, `locked`

---

## Build Phases

### Phase 1 — Foundation
- Hosting setup (university IT conversation or Vercel/Supabase)
- Database schema design
- Email/password authentication
- Student and admin role setup

### Phase 2 — Student Experience
- Student Dashboard
- Curriculum Submission Monitor (11 milestones + status badges)
- Course-Based Uploads (file drop-zones + Panopto link field)
- Portfolio Preview (with embedded Panopto video player)
- Sharing & Permissions (secure links for external reviewers)

### Phase 3 — Admin Console
- Submission Management Console (sortable list, status filters, volume analytics)
- Submission Review Detail (read-only PDF viewer, rubric checklist, approval/revision controls)

### Phase 4 — Testing & Launch
- Pilot with small student group and one or two faculty reviewers
- Bug fixes and refinements
- Full rollout

### Key Dependency
University IT conversation should happen before or during Phase 1 to determine hosting path.

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

- **Do NOT retry push operations repeatedly.** If a push fails or uses significant session context, stop and report status to the user instead of retrying.
- **Do NOT attempt large multi-file operations near session limits.** If context is running low, stop, document what remains, and ask the user to start a new session.
- **When a push partially completes and breaks the site**, immediately note which files were pushed and which were not — do not attempt further pushes.
- **Push one file at a time for large multi-file tasks** to ensure each succeeds before moving to the next.

---

## Vercel Deployment Notes

- **Production branch must be `master`** (not `main`) — the `main` branch only has `.txt` prototype files and `CLAUDE.md`, no Next.js app
- **Root Directory** should be blank/empty in Vercel settings
- To manually trigger a redeploy: push any commit to `master` — Vercel auto-deploys on every push
- Preview deployments from `claude/*` branches will always fail (those branches have no app code) — this is expected and can be ignored
- Demo credentials: Student `test@louisville.edu` / `Test1234!` — Admin `admin@louisville.edu` / `Admin1234!`

---

## WCAG / ADA Accessibility Work

### Status (as of 2026-04-02) — COMPLETE ✅
A full WCAG 2.1 AA audit was completed and all fixes applied directly to `master`. Vercel redeploys automatically on push to master.

### All 9 Files Fixed

| File | Changes Applied |
|------|----------------|
| `app/layout.tsx` | Skip-nav link, per-page title support |
| `app/login/page.tsx` | htmlFor/id on inputs, role="alert" on error, autocomplete, focus ring |
| `app/dashboard/page.tsx` | Skip-nav target, aria-labels on navs/asides/buttons, interactive card roles |
| `app/curriculum/page.tsx` | aria-labels, id="main-content", text-xs, zinc-500, interactive card roles, aria-pressed, removed opacity-50 |
| `app/uploads/page.tsx` | aria-labels, id="main-content", htmlFor/id on Display Title, label→p for button group, help button aria-label |
| `app/portfolio/page.tsx` | aria-labels on nav/aside/sidebar-nav, id="main-content", text-xs, zinc-500 |
| `app/sharing/page.tsx` | Toggle: role="switch" + aria-checked + aria-label, all nav/aside labels, text-xs, zinc-500 |
| `app/admin/submissions/page.tsx` | scope="col" on table headers, aria-labels on pagination/FAB/buttons, id="main-content", text-xs |
| `app/admin/review/page.tsx` | Breadcrumb aria-label + aria-current="page", nav/aside labels, id="main-content", label on textarea |

### Remaining Known Gap
- `href="#"` placeholder links on Settings and Analytics nav items — not yet built pages, will be addressed when those pages are created

