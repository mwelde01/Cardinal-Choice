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

> To be documented as development begins.

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
