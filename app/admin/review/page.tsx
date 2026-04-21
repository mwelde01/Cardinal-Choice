'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signOut } from '@/lib/signout'
import { supabase } from '@/lib/supabase'

const PHASES = [
  { num: 1, label: 'Phase 1', subtitle: 'Explore', courses: ['MBA 626', 'MBA 632', 'MBA 631'] },
  { num: 2, label: 'Phase 2', subtitle: 'Develop', courses: ['MBA 628', 'MBA 625', 'MBA 635'] },
  { num: 3, label: 'Phase 3', subtitle: 'Refine', courses: ['MBA 630', 'MBA 640', 'MBA 668'] },
  { num: 4, label: 'Phase 4', subtitle: 'Final', courses: ['MBA 655', 'MBA 656'] },
]

function statusBadge(status: string) {
  if (status === 'approved') return 'bg-green-50 text-green-700 border-green-200'
  if (status === 'in_review') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-zinc-50 text-zinc-400 border-zinc-200'
}

function statusLabel(status: string) {
  if (status === 'approved') return '✓ Approved'
  if (status === 'in_review') return '● In Review'
  return '— Not Started'
}

function ReviewContent() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get('student')
  const phaseNum = parseInt(searchParams.get('phase') ?? '1')
  const phase = PHASES.find(p => p.num === phaseNum) ?? PHASES[0]

  const [student, setStudent] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [finalDeliverable, setFinalDeliverable] = useState<any>(null)
  const [phaseFeedback, setPhaseFeedback] = useState('')
  const [finalFeedback, setFinalFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingFinal, setSavingFinal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Batch Review — Cardinal Choice'
    if (!studentId) { setLoading(false); return }

    async function fetchData() {
      const [{ data: studentData }, { data: allSubs }] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, mba_track').eq('id', studentId).single(),
        supabase.from('submissions').select(`
          id, status, submitted_at, file_name, file_type, reviewer_notes, panopto_embed_code,
          milestone:milestones!milestone_id(
            id, title, is_core, allows_panopto,
            course:courses!course_id(code, name)
          )
        `).eq('student_id', studentId),
      ])

      if (studentData) setStudent(studentData)
      if (allSubs) {
        const phaseSubs = allSubs.filter((s: any) => phase.courses.includes(s.milestone?.course?.code))
        setSubmissions(phaseSubs)
        if (phaseNum === 4) {
          const finalSub = allSubs.find((s: any) => s.milestone?.allows_panopto === true)
          if (finalSub) {
            setFinalDeliverable(finalSub)
            setFinalFeedback(finalSub.reviewer_notes ?? '')
          }
        }
        const firstWithNotes = phaseSubs.find((s: any) => s.reviewer_notes)
        if (firstWithNotes) setPhaseFeedback(firstWithNotes.reviewer_notes ?? '')
      }
      setLoading(false)
    }
    fetchData()
  }, [studentId, phaseNum])

  async function approvePhase() {
    if (submissions.length === 0) return
    setSaving(true)
    for (const sub of submissions) {
      await supabase.from('submissions').update({ status: 'approved', reviewer_notes: phaseFeedback }).eq('id', sub.id)
    }
    setSubmissions(submissions.map(s => ({ ...s, status: 'approved', reviewer_notes: phaseFeedback })))
    setSaving(false)
  }

  async function requestRevisions() {
    if (submissions.length === 0) return
    setSaving(true)
    for (const sub of submissions) {
      await supabase.from('submissions').update({ status: 'in_review', reviewer_notes: phaseFeedback }).eq('id', sub.id)
    }
    setSubmissions(submissions.map(s => ({ ...s, status: 'in_review', reviewer_notes: phaseFeedback })))
    setSaving(false)
  }

  async function approveFinal() {
    if (!finalDeliverable) return
    setSavingFinal(true)
    await supabase.from('submissions').update({ status: 'approved', reviewer_notes: finalFeedback }).eq('id', finalDeliverable.id)
    setFinalDeliverable({ ...finalDeliverable, status: 'approved', reviewer_notes: finalFeedback })
    setSavingFinal(false)
  }

  async function requestFinalRevisions() {
    if (!finalDeliverable) return
    setSavingFinal(true)
    await supabase.from('submissions').update({ status: 'in_review', reviewer_notes: finalFeedback }).eq('id', finalDeliverable.id)
    setFinalDeliverable({ ...finalDeliverable, status: 'in_review', reviewer_notes: finalFeedback })
    setSavingFinal(false)
  }

  const phaseApproved = submissions.length > 0 && submissions.every(s => s.status === 'approved')

  return (
    <>
      {/* Top Navigation */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-white/60 backdrop-blur-md z-50 shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black tracking-tighter text-red-700 font-headline">Cardinal Choice</span>
          <nav aria-label="Primary navigation" className="hidden md:flex gap-6 items-center">
            <a className="text-zinc-500 hover:text-red-600 transition-colors text-sm" href="/dashboard">Dashboard</a>
            <a className="text-red-700 font-semibold border-b-2 border-red-700 pb-1 text-sm" href="/admin/submissions" aria-current="page">Submissions</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ml-2" aria-hidden="true">AD</div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-800 transition-colors">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span> Sign Out
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside aria-label="Review portal navigation" className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 flex flex-col p-4 gap-2 bg-zinc-50 border-r border-zinc-100 z-40">
        <div className="mb-4 px-2">
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Review Portal</p>
          <h2 className="text-sm font-bold font-headline text-zinc-800">{student?.full_name ?? 'Loading...'}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{student?.mba_track ?? ''} Track</p>
        </div>

        {/* Phase tabs */}
        <nav aria-label="Phase navigation" className="flex flex-col gap-1">
          {PHASES.map(p => (
            <a
              key={p.num}
              href={`/admin/review?student=${studentId}&phase=${p.num}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-xs font-bold ${
                p.num === phaseNum
                  ? 'bg-white text-red-800 shadow-sm'
                  : 'text-zinc-600 hover:bg-zinc-200/50 hover:translate-x-1'
              }`}
              aria-current={p.num === phaseNum ? 'page' : undefined}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                p.num === phaseNum ? 'bg-red-800 text-white' : 'bg-zinc-200 text-zinc-500'
              }`}>{p.num}</span>
              <span>{p.label} — {p.subtitle}</span>
            </a>
          ))}
        </nav>

        <div className="mt-4 border-t border-zinc-200 pt-4">
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-all text-xs" href="/admin/submissions">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span> All Students
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="ml-64 pt-16 min-h-screen bg-surface">

        {/* Page Header */}
        <section className="px-10 py-8 bg-surface-container-low border-b border-zinc-100">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <a href="/admin/submissions" className="hover:text-red-700 transition-colors">Submissions</a>
            <span className="material-symbols-outlined text-xs" aria-hidden="true">chevron_right</span>
            <span>{student?.full_name ?? 'Student'}</span>
            <span className="material-symbols-outlined text-xs" aria-hidden="true">chevron_right</span>
            <span className="text-zinc-800 font-bold" aria-current="page">{phase.label}</span>
          </nav>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight font-headline text-zinc-900 mb-1">
                {loading ? 'Loading...' : student?.full_name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="bg-red-100 text-red-800 px-3 py-0.5 rounded-full text-xs font-bold">{phase.label} — {phase.subtitle}</span>
                <span className="text-sm text-zinc-500">{phase.courses.join(' · ')}{phaseNum === 4 ? ' · Final Deliverable' : ''}</span>
              </div>
            </div>
            {phaseApproved && (
              <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-bold">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">check_circle</span>
                Phase Approved
              </span>
            )}
          </div>
        </section>

        <div className="px-10 py-10 max-w-6xl">

          {/* Phase Documents Section */}
          <section className="mb-12">
            <h2 className="text-lg font-headline font-bold text-zinc-900 mb-6">
              {phaseNum === 4 ? 'Portfolio Documents' : `${phase.label} Documents`}
            </h2>

            {loading ? (
              <div className="py-12 text-center text-zinc-400 text-sm">Loading submissions...</div>
            ) : submissions.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-sm bg-zinc-50 rounded-2xl border border-zinc-100">
                No documents submitted for this phase yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4 mb-8">
                {submissions.map(sub => (
                  <div key={sub.id} className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-800 flex-shrink-0">
                          <span className="material-symbols-outlined text-xl" aria-hidden="true">description</span>
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 text-sm">{sub.milestone?.course?.code} — {sub.milestone?.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {sub.file_name ?? 'No file uploaded'}
                            {sub.submitted_at && <span className="ml-2">· {new Date(sub.submitted_at).toLocaleDateString()}</span>}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 ${statusBadge(sub.status)}`}>
                        {statusLabel(sub.status)}
                      </span>
                    </div>
                    {sub.file_name && (
                      <div className="mt-4 ml-14 p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-zinc-400" aria-hidden="true">picture_as_pdf</span>
                          <span className="text-sm text-zinc-600">{sub.file_name}</span>
                        </div>
                        <button className="text-xs font-bold text-red-800 hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span> View
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Shared Feedback + Approval */}
            {!loading && (
              <div className="bg-surface-container-low p-8 rounded-2xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">
                  {phaseNum === 4 ? 'Portfolio Feedback' : `${phase.label} Feedback`}
                </h3>
                <textarea
                  value={phaseFeedback}
                  onChange={e => setPhaseFeedback(e.target.value)}
                  className="w-full h-36 bg-white border border-zinc-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 placeholder:text-zinc-400 resize-none mb-6"
                  placeholder={`Provide batch feedback for ${phase.label}...`}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={approvePhase}
                    disabled={saving || submissions.length === 0}
                    className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : `Approve ${phaseNum === 4 ? 'Portfolio Documents' : phase.label}`}
                  </button>
                  <button
                    onClick={requestRevisions}
                    disabled={saving || submissions.length === 0}
                    className="px-6 py-2.5 border-2 border-zinc-200 text-zinc-700 font-bold rounded-lg text-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Revisions
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Phase 4 Only: Final Deliverable Section */}
          {phaseNum === 4 && !loading && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-headline font-bold text-zinc-900">Final Deliverable</h2>
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded-full">Panopto Video</span>
              </div>

              {finalDeliverable ? (
                <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm mb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 flex-shrink-0">
                        <span className="material-symbols-outlined text-xl" aria-hidden="true">play_circle</span>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{finalDeliverable.milestone?.title ?? 'Final Deliverable'}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Track-specific portfolio presentation</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 ${statusBadge(finalDeliverable.status)}`}>
                      {statusLabel(finalDeliverable.status)}
                    </span>
                  </div>
                  {finalDeliverable.panopto_embed_code ? (
                    <div
                      className="mt-4 rounded-xl overflow-hidden bg-zinc-900"
                      dangerouslySetInnerHTML={{ __html: finalDeliverable.panopto_embed_code }}
                    />
                  ) : (
                    <div className="mt-4 p-8 bg-zinc-50 rounded-xl border border-zinc-100 text-center text-zinc-400 text-sm">
                      Panopto embed code not yet submitted.
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-400 text-sm bg-zinc-50 rounded-2xl border border-zinc-100 mb-6">
                  No final deliverable submitted yet.
                </div>
              )}

              <div className="bg-surface-container-low p-8 rounded-2xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">Final Deliverable Feedback</h3>
                <textarea
                  value={finalFeedback}
                  onChange={e => setFinalFeedback(e.target.value)}
                  className="w-full h-36 bg-white border border-zinc-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 placeholder:text-zinc-400 resize-none mb-6"
                  placeholder="Provide feedback on the final deliverable..."
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={approveFinal}
                    disabled={savingFinal || !finalDeliverable}
                    className="px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingFinal ? 'Saving...' : 'Approve Final Deliverable'}
                  </button>
                  <button
                    onClick={requestFinalRevisions}
                    disabled={savingFinal || !finalDeliverable}
                    className="px-6 py-2.5 border-2 border-zinc-200 text-zinc-700 font-bold rounded-lg text-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Revisions
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}

export default function SubmissionReviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>}>
      <ReviewContent />
    </Suspense>
  )
}
