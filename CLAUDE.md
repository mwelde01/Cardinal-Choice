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

## Build Progress

### Phase 1 Status (as of 2026-03-27)
- [x] Supabase project created
- [x] Database schema deployed
- [x] Next.js project created locally
- [x] Supabase client connected via `.env.local` — uses `createBrowserClient` from `@supabase/ssr`
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
- [x] Login page uses `window.location.href` (not `router.push`) for post-login redirect so middleware can pick up session cookie
- [x] Role-based redirect working — students → `/dashboard`, admins → `/admin/submissions`
- [x] Sign Out wired up on ALL pages using `lib/signout.ts`
- [x] All pages have `'use client'` directive and `import { signOut } from '@/lib/signout'`
- [x] Test user exists in Supabase: `test@louisville.edu` / `Test1234!` (role: student)
- [x] RLS policy added to profiles table so users can read their own profile
- [x] Navigation links partially wired — dashboard top nav done (Materials → `/uploads`, Portfolio → `/portfolio`)
- [ ] **Next step: Finish wiring navigation links on `app/dashboard/page.tsx`** — left sidebar and mobile nav still have `href="#"` placeholders; user was mid-way through this when session ended
- [ ] Wire navigation links on remaining pages: `curriculum`, `uploads`, `portfolio`, `sharing`, `admin/submissions`, `admin/review`
- [ ] Create admin test user in Supabase (role: admin) to test admin redirect
- [ ] Connect pages to live Supabase data
- [ ] Wire up remaining navigation links between pages

---

## Authentication Notes
- Middleware uses `@supabase/ssr` — `lib/supabase.ts` also uses `createBrowserClient` from `@supabase/ssr` (NOT `createClient` from `@supabase/supabase-js`) so sessions are stored in cookies the middleware can read
- After login, must use `window.location.href` (not `router.push`) to force full page reload so middleware can pick up the session cookie
- Test user: `test@louisville.edu` / `Test1234!` — profile row exists in `profiles` table with role: student
- Next admin test user should be created with role: admin to test admin redirect
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

### Sign Out button pattern (used on all pages)
```typescript
<button onClick={signOut} className="flex items-center gap-3 p-2 text-zinc-500 hover:text-red-800 transition-colors text-sm w-full">
  <span className="material-symbols-outlined text-lg">logout</span> Sign Out
</button>
```

---

## Navigation Link Map (for wiring href="#" placeholders)

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
| Admin pages | Submissions | `/admin/submissions` |
| Admin pages | Review (per student) | `/admin/review` |

---

## Build Phases

### Phase 1 — Foundation
- Hosting setup (university IT conversation or Vercel/Supabase)
- Database schema design
- Email/password authentication ✅
- Student and admin role setup ✅

### Phase 2 — Student Experience
- Student Dashboard ✅
- Curriculum Submission Monitor (11 milestones + status badges) ✅
- Course-Based Uploads (file drop-zones + Panopto link field) ✅
- Portfolio Preview (with embedded Panopto video player) ✅
- Sharing & Permissions (secure links for external reviewers) ✅

### Phase 3 — Admin Console
- Submission Management Console (sortable list, status filters, volume analytics) ✅
- Submission Review Detail (read-only PDF viewer, rubric checklist, approval/revision controls) ✅

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
