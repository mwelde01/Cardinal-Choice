# CLAUDE.md — Project Context for Claude Code

## What This App Does

**Cardinal Choice** — A web application for MBA students to manage their academic journey, upload course milestones, and curate professional portfolios. Faculty and staff use an admin console to monitor and review the 120+ annual student submissions.

---

## Site Architecture

### Student Experience (Front-End)

| Screen | Purpose |
|--------|-------|
| **Student Dashboard** | Primary landing page — recent activity, quick-upload buttons, progress summary |
| **Curriculum Submission Monitor** | Tracks the 11 core course requirements with status badges (Approved, In Review, Locked) and timestamps |
| **Course-Based Uploads** | Upload area organized by MBA course — drop-zones for each milestone and final track deliverable |
| **Portfolio Preview** | Public-facing view of the student’s curated best work and academic track |
| **Sharing & Permissions** | Privacy toggles and secure link generation for external reviewers |

### Administrator Console (Back-End)

| Screen | Purpose |
|--------|-------|
| **Submission Management Console** | Global dashboard — sortable list of all 120+ submissions, status filters, volume analytics |
| **Submission Review Detail** | Individual student review workspace — integrated PDF viewer, academic rubric checklist, revision/approval controls |

---

## Key Domain Concepts

- **Milestones** — Deliverables tied to specific MBA courses that students upload for review
- **11 core course requirements** — The fixed set of milestones every student must complete
- **Track-specific deliverable** — A final submission that varies by the student’s MBA concentration
- **Submission statuses:** `approved`, `in_review`, `locked` (lowercase with underscores in DB)
- **~120+ students** submit annually

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend / Hosting** | Next.js on Vercel | Auto-deploys from master branch |
| **Database + Auth** | Supabase | Includes email/password auth, PostgreSQL |
| **File Storage** | University server (preferred) or Supabase | University server = $0; Supabase 100GB included in Pro plan |
| **Video** | Panopto embed codes | Students paste Panopto embed code — no file upload |
| **PDF Viewer** | Read-only embedded viewer | No markup or annotation needed |

---

## Key Technical Decisions (Confirmed)

- **Student authentication:** Email + password login — NOT university SSO, NOT magic links
  - Account creation flow: admin creates account → student receives one-time access code via email → student sets password → all future logins use email + password
- **Admin authentication:** Same login system, different role
- **Video submissions:** Students submit Panopto embed code; video plays embedded on Portfolio Preview — no file upload
- **PDF viewing:** Read-only viewer only
- **File uploads:** PDFs, Word docs, audio files for milestones; Panopto embed link for final track deliverable
- **File storage:** University server preferred; Supabase storage as fallback

## Pending Decisions (Awaiting University IT Conversation)

- **Hosting path:** University-hosted (~$0/yr) vs. cloud (Vercel + Supabase, ~$540/yr) — blocked on IT approval process
- **File storage:** University server vs. Supabase storage — depends on hosting outcome
- **Outside vendor approval:** University requires proposal process for Vercel, Supabase — procurement forms in progress

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

### Storage Projection (Files Only — No Video)
| Timeframe | Students | Estimated Storage |
|-----------|---------|------------------|
| Year 1 | 120 | ~3 GB |
| Year 3 | 360 | ~9 GB |
| Year 5 | 600 | ~15 GB |

Storage remains well within Supabase Pro 100GB limit for the foreseeable future.

---

## Next.js Project Setup

- Uses **Tailwind CSS v4** — configuration in `app/globals.css` using `@import "tailwindcss"` and `@theme {}` block (NOT `tailwind.config.ts`)
- Fonts loaded via Google Fonts in `app/layout.tsx` (Inter + Manrope + Material Symbols)
- Supabase client at `lib/supabase.ts` — reads from `.env.local`
- `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### HTML Design Mockups
All screens were pre-designed as HTML prototypes (.txt files) and converted to Next.js pages:
- `Student Dashboardl.txt` → `app/dashboard/page.tsx` ✅
- `Curriculum Submission Monitor.txt` → `app/curriculum/page.tsx` ✅
- `Course Based Uploads.txt` → `app/uploads/page.tsx` ✅
- `Portfolio Preview.txt` → `app/portfolio/page.tsx` ✅
- `Submission Review Detail.txt` → `app/admin/review/page.tsx` ✅
- `Submissions Managment Console.txt` → `app/admin/submissions/page.tsx` ✅

---

## Build Progress

### Phase 1 & 2 Status (as of 2026-04-20)
- [x] Supabase project created and schema deployed
- [x] Next.js project created locally
- [x] Supabase client connected via `.env.local`
- [x] All 7 pages built (login, dashboard, curriculum, uploads, portfolio, sharing, admin/submissions, admin/review)
- [x] Middleware created — `middleware.ts` in root (redirects unauthenticated users to `/login`)
- [x] `@supabase/ssr` package installed
- [x] Post-login redirect uses `window.location.href` so middleware reads session cookie
- [x] Supabase client uses `createBrowserClient` from `@supabase/ssr` (cookies, not localStorage)
- [x] Sign Out wired on all 7 pages via `lib/signout.ts`
- [x] Navigation links wired across all pages
- [x] Test student: `test@louisville.edu` / `Test1234!` (role: student, name: Alex Chen)
- [x] Test admin: `admin@louisville.edu` (role: admin) — redirects to `/admin/submissions`
- [x] Test data seeded: courses, milestones, submissions in Supabase
- [x] RLS policies: profiles readable by all authenticated users; submissions readable by admins
- [x] Student Dashboard connected to live Supabase data
- [x] Curriculum Submission Monitor connected to live data
- [x] Admin Submissions Console connected to live data
- [x] Admin Review Detail connected to live data (URL param `?id=`)
- [x] Portfolio page shows logged-in student’s name dynamically
- [x] Deployed to Vercel — auto-deploys on push to `master` branch
- [x] Admin Review Detail fixed for Vercel — `useSearchParams()` wrapped in `<Suspense>`

### Accessibility (WCAG 2.1 AA) — In Progress
A full audit was completed on 2026-04-20. Issues found and fix status:

**Fixed (pushed to master):**
- [x] `app/layout.tsx` — Added skip navigation link (`Skip to main content`)
- [x] `app/login/page.tsx` — Fixed label/input associations (htmlFor + id), added autocomplete attributes, added `role="alert"` to error message, improved focus ring
- [x] `app/dashboard/page.tsx` — Added aria-labels to nav/aside/buttons, fixed font sizes (text-[8-10px] → text-xs), fixed contrast (zinc-400 → zinc-500 for meaningful text), added aria-hidden to decorative icons, added `id="main-content"`, added unique page title

**Still To Fix (next session):**
- [ ] `app/curriculum/page.tsx` — Same pattern as dashboard
- [ ] `app/uploads/page.tsx` — Fix label/input associations, aria labels, font sizes
- [ ] `app/portfolio/page.tsx` — Aria labels, font sizes, contrast
- [ ] `app/sharing/page.tsx` — Fix Toggle component (needs `role="switch"`, `aria-checked`, `aria-label`), aria labels, font sizes
- [ ] `app/admin/submissions/page.tsx` — Add `scope="col"` to table headers, fix filter select labels (missing htmlFor/id), aria labels, font sizes
- [ ] `app/admin/review/page.tsx` — Fix breadcrumb (`aria-label="Breadcrumb"`, `aria-current="page"`), fix textarea label association, aria labels, font sizes

**Issues common to ALL remaining pages:**
- Font sizes: `text-[8px]`, `text-[9px]`, `text-[10px]` → `text-xs` minimum
- Contrast: `text-zinc-400` on light backgrounds (2.4:1) → `text-zinc-500` (4.8:1) for meaningful text
- Icon-only buttons need `aria-label`; decorative icon spans need `aria-hidden="true"`
- `<nav>` elements need `aria-label` to distinguish multiple navs per page
- `<main>` elements need `id="main-content"` for skip nav to work
- Each page needs unique `document.title` set in useEffect

### Pending — Next Session
- [ ] Complete remaining 6 pages of accessibility fixes (see above)
- [ ] Investigate Vercel build status after accessibility push — confirm site is loading
- [ ] Connect `app/uploads/page.tsx` to live Supabase data
- [ ] Connect `app/sharing/page.tsx` to live data
- [ ] **File upload functionality** — blocked on university IT hosting decision
- [ ] Add RLS policy so students can read only their own submissions
- [ ] Account creation / access code flow for new students
- [ ] Panopto embed code submission on uploads page

## Authentication Notes
- Middleware uses `@supabase/ssr` — different from client-side `@supabase/supabase-js`
- After login, must use `window.location.href` (not `router.push`) to force full page reload
- `lib/supabase.ts` uses `createBrowserClient` from `@supabase/ssr` — stores session in cookies
- Test student: `test@louisville.edu` / `Test1234!` — name: Alex Chen, role: student
- Test admin: `admin@louisville.edu` — role: admin, redirects to `/admin/submissions`
- Submission statuses in DB: `approved`, `in_review`, `locked` (lowercase with underscores)

---

## Build Phases

### Phase 1 — Foundation ✅
### Phase 2 — Student Experience ✅
### Phase 3 — Admin Console ✅
### Phase 4 — Accessibility, Data, & Launch
- WCAG 2.1 AA compliance (in progress)
- File upload functionality (pending IT decision)
- Account creation / access code flow
- Pilot with small student group
- Full rollout

### Key Dependency
University IT conversation needed to determine hosting and file storage path.

---

## User Workflow Preferences

- **Git operations:** GitHub Desktop or GitHub.com web UI — do NOT instruct command-line git commands
- **Comfort level:** Non-technical user — give step-by-step UI instructions, avoid terminal commands
- **Session limit:** If session data is running low during a push loop, stop immediately and report status rather than continuing

---

## Branch Naming Convention

```
claude/<description>-<SESSION_ID>
```
Example: `claude/add-upload-endpoint-QJGwn`

Push with: `git push -u origin <branch-name>`
