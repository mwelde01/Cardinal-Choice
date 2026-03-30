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
- `submissions`: Admins can read all submissions
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

### Phase 1 Status (as of 2026-03-30)
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
- [x] Admin Submissions Console connected to live Supabase data ✅
- [x] Student Dashboard — partially connected to live Supabase data (mid-step when session ended)
- [ ] **NEXT STEP: Finish connecting Student Dashboard to live data** — was mid-way through updating milestone card section. Need to apply these remaining changes to `app/dashboard/page.tsx`:

  **1. Badge className — update status checks:**
  Find:
  ```
  ${m.status === "Approved" ? "bg-green-50 text-green-700" : ""}
  ${m.status === "In Review" ? "bg-amber-50 text-amber-700" : ""}
  ${m.status === "In Progress" ? "bg-zinc-100 text-zinc-500" : ""}
  ${m.status === "Locked" ? "bg-zinc-200 text-zinc-500" : ""}
  ```
  Replace with:
  ```
  ${m.status === "approved" ? "bg-green-50 text-green-700" : ""}
  ${m.status === "in_review" ? "bg-amber-50 text-amber-700" : ""}
  ${m.status === "locked" ? "bg-zinc-200 text-zinc-500" : ""}
  ```

  **2. Badge icon — update status checks:**
  Find:
  ```
  {m.status === "Approved" ? "check_circle" : m.status === "In Review" ? "schedule" : m.status === "In Progress" ? "edit_note" : "lock"}
  ```
  Replace with:
  ```
  {m.status === "approved" ? "check_circle" : m.status === "in_review" ? "schedule" : "lock"}
  ```

  **3. Course code — replace hardcoded field:**
  Find:
  ```
  <p className="text-xs font-bold font-headline mb-0.5">{m.code}</p>
  <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter leading-tight">{m.name}</p>
  ```
  Replace with:
  ```
  <p className="text-xs font-bold font-headline mb-0.5">{m.milestone?.course?.code}</p>
  <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter leading-tight">{m.milestone?.title}</p>
  ```

  **4. Submission date — replace hardcoded field:**
  Find:
  ```
  <p className="text-[8px] text-zinc-400 font-bold uppercase text-center">{m.date}</p>
  ```
  Replace with:
  ```
  <p className="text-[8px] text-zinc-400 font-bold uppercase text-center">{m.submitted_at ? new Date(m.submitted_at).toLocaleDateString() : '—'}</p>
  ```

- [ ] Connect Curriculum Submission Monitor to live data (`app/curriculum/page.tsx`)
- [ ] Connect Admin Review Detail to live data (`app/admin/review/page.tsx`)
- [ ] Connect remaining pages to live data (uploads, portfolio, sharing)

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

### Sign Out button pattern (used on all pages)
```typescript
<button onClick={signOut} className="flex items-center gap-3 p-2 text-zinc-500 hover:text-red-800 transition-colors text-sm w-full">
  <span className="material-symbols-outlined text-lg">logout</span> Sign Out
</button>
```

### Dashboard data fetching pattern (top of `app/dashboard/page.tsx`)
```typescript
'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [profile, setProfile] = useState<{ full_name: string; mba_track: string } | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, mba_track')
        .eq('id', user.id)
        .single()

      const { data: submissionsData } = await supabase
        .from('submissions')
        .select(`
          id, status, submitted_at,
          milestone:milestones!milestone_id(
            title,
            course:courses!course_id(code)
          )
        `)
        .eq('student_id', user.id)
        .order('submitted_at', { ascending: false })

      if (profileData) setProfile(profileData)
      if (submissionsData) setSubmissions(submissionsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'
  const approved = submissions.filter(s => s.status === 'approved').length

  return (
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

---

## Build Phases

### Phase 1 — Foundation ✅
### Phase 2 — Student Experience ✅ (pages built, data connection in progress)
### Phase 3 — Admin Console ✅ (pages built, submissions console connected to live data)
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
