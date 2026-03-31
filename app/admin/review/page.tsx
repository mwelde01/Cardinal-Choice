'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { signOut } from '@/lib/signout'
import { supabase } from '@/lib/supabase'

export default function SubmissionReviewPage() {
  const searchParams = useSearchParams()
  const submissionId = searchParams.get('id')

  const [checked, setChecked] = useState({ conceptual: true, analytical: true, formatting: false })
  const [feedback, setFeedback] = useState('')
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubmission() {
      if (!submissionId) { setLoading(false); return }

      const { data } = await supabase
        .from('submissions')
        .select(`
          id, status, submitted_at, file_name, reviewer_notes,
          student:profiles!student_id(full_name, mba_track),
          milestone:milestones!milestone_id(
            title,
            course:courses!course_id(code, name)
          )
        `)
        .eq('id', submissionId)
        .single()

      if (data) setSubmission(data)
      setLoading(false)
    }
    fetchSubmission()
  }, [submissionId])

  return (

    <>
      {/* Top Navigation */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 bg-white/60 backdrop-blur-md z-50 shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black tracking-tighter text-red-700 font-headline">Cardinal Choice</span>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-zinc-500 hover:text-red-600 transition-colors text-sm" href="/dashboard">Dashboard</a>
            <a className="text-red-700 font-semibold border-b-2 border-red-700 pb-1 text-sm" href="/admin/submissions">Submissions</a>
            <a className="text-zinc-500 hover:text-red-600 transition-colors text-sm" href="#">Analytics</a>
            <a className="text-zinc-500 hover:text-red-600 transition-colors text-sm" href="#">Settings</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-100 rounded-md transition-all">
            <span className="material-symbols-outlined text-zinc-600">notifications</span>
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-md transition-all">
            <span className="material-symbols-outlined text-zinc-600">help_outline</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ml-2">
            AD
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-800 transition-colors">
            <span className="material-symbols-outlined text-lg">logout</span> Sign Out
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 flex flex-col p-4 gap-2 bg-zinc-50 border-r border-zinc-100 z-40">
        <div className="mb-6 px-2">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Review Portal</p>
          <h2 className="text-sm font-bold font-headline text-zinc-800">Admin Console</h2>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-transform duration-200 hover:translate-x-1 text-xs" href="/admin/submissions">
            <span className="material-symbols-outlined text-[20px]">folder_shared</span> All Submissions
          </a>
          <a className="flex items-center gap-3 px-3 py-2 bg-white text-red-700 font-bold shadow-sm rounded-lg transition-transform duration-200 hover:translate-x-1 text-xs" href="#">
            <span className="material-symbols-outlined text-[20px]">pending_actions</span> Pending Review
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-transform duration-200 hover:translate-x-1 text-xs" href="#">
            <span className="material-symbols-outlined text-[20px]">task_alt</span> Approved
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-transform duration-200 hover:translate-x-1 text-xs" href="#">
            <span className="material-symbols-outlined text-[20px]">report_problem</span> Flagged
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-200/50 rounded-lg transition-transform duration-200 hover:translate-x-1 text-xs" href="#">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span> Archive
          </a>
        </nav>
        <button className="mt-4 mb-8 bg-zinc-200 text-zinc-800 py-2 rounded-lg text-xs font-bold hover:bg-zinc-300 transition-colors">
          Batch Export
        </button>
        <div className="mt-auto flex flex-col gap-1 border-t border-zinc-200 pt-4">
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 text-xs hover:text-zinc-800 transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">dns</span> System Status
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 text-xs hover:text-zinc-800 transition-colors" href="#">
            <span className="material-symbols-outlined text-[18px]">contact_support</span> Support
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-16 min-h-screen bg-surface flex flex-col">

        {/* Page Header */}
        <section className="px-12 py-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
            <div>
              <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                <a href="/admin/submissions" className="hover:text-red-700 transition-colors">Submissions</a>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-zinc-400">Reviewing Submission</span>
              </nav>
            <h1 className="text-4xl font-extrabold tracking-tight font-headline text-zinc-900 mb-2">{submission?.student?.full_name ?? 'Loading...'}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                  {submission?.milestone?.course?.code} {submission?.milestone?.course?.name}
                </span>
                <span className="text-sm text-zinc-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">fingerprint</span> ID: 2994-MT
                </span>
                <span className="text-sm text-zinc-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">school</span> Milestone 1: Executive Summary
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Academic Track</span>
              <span className="text-lg font-bold text-zinc-800">{submission?.student?.mba_track ?? '—'}</span>
            </div>
          </div>
        </section>

        {/* Editor View */}
        <section className="flex-1 flex max-w-7xl mx-auto w-full gap-12 px-12 py-12">

          {/* Left: PDF Viewer */}
          <div className="w-2/3 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline text-zinc-900">Submission Document</h3>
           <button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
                <span className="material-symbols-outlined">open_in_full</span> Open full view
              </button>
            </div>

            {/* PDF Placeholder */}
            <div className="bg-zinc-100 rounded-xl overflow-hidden min-h-[800px] relative shadow-sm border border-black/[0.03]">
              <div className="absolute inset-0 p-16 flex flex-col">
                <div className="w-full h-full bg-white shadow-lg p-12 flex flex-col gap-8">
                  <div className="flex justify-between items-start border-b border-zinc-100 pb-8">
                    <div className="flex flex-col gap-2">
                      <div className="w-48 h-6 bg-zinc-100 rounded"></div>
                      <div className="w-32 h-4 bg-zinc-50 rounded"></div>
                    </div>
                    <div className="w-12 h-12 bg-zinc-100 rounded"></div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="w-full h-4 bg-zinc-50 rounded"></div>
                    <div className="w-[90%] h-4 bg-zinc-50 rounded"></div>
                    <div className="w-[95%] h-4 bg-zinc-50 rounded"></div>
                    <div className="w-[85%] h-4 bg-zinc-50 rounded"></div>
                    <div className="w-full h-4 bg-zinc-50 rounded"></div>
                    <div className="w-[40%] h-4 bg-zinc-50 rounded mb-8"></div>
                    <div className="w-1/2 h-8 bg-zinc-100 rounded mt-12 mb-6"></div>
                    <div className="w-full h-4 bg-zinc-50 rounded"></div>
                    <div className="w-[92%] h-4 bg-zinc-50 rounded"></div>
                    <div className="w-[88%] h-4 bg-zinc-50 rounded"></div>
                    <div className="w-full h-4 bg-zinc-50 rounded"></div>
                    <div className="w-[75%] h-4 bg-zinc-50 rounded"></div>
                  </div>
                  <div className="mt-8 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50 h-48 flex items-center justify-center">
                    <span className="material-symbols-outlined text-zinc-300 text-6xl">insert_chart</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Review Sidebar */}
          <div className="w-1/3 flex flex-col gap-8">

            {/* Guidelines Callout */}
            <div className="p-6 bg-surface-container-high rounded-xl border-l-4 border-tertiary">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-tertiary">info</span>
                <h4 className="font-bold font-headline text-sm text-zinc-800">Reviewing Milestones</h4>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                Please ensure the submission meets the "Advanced Level" criteria defined in the 2024 Accounting Rubric.
              </p>
              <a className="text-xs font-bold text-tertiary-container hover:underline flex items-center gap-1" href="#">
                Review Guidelines <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
              </a>
            </div>

            {/* Grading Form */}
            <div className="bg-surface-container-low p-8 rounded-xl flex flex-col gap-8">
              <div>
                <h4 className="text-lg font-bold font-headline text-zinc-900 mb-6">Academic Rubric</h4>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked.conceptual}
                      onChange={(e) => setChecked({ ...checked, conceptual: e.target.checked })}
                      className="mt-1 rounded-sm border-zinc-300 text-primary h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">Conceptual Understanding</p>
                      <p className="text-xs text-zinc-500">Student demonstrates mastery of GAAP principles.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked.analytical}
                      onChange={(e) => setChecked({ ...checked, analytical: e.target.checked })}
                      className="mt-1 rounded-sm border-zinc-300 text-primary h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">Analytical Rigor</p>
                      <p className="text-xs text-zinc-500">Depth of financial analysis and data interpretation.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked.formatting}
                      onChange={(e) => setChecked({ ...checked, formatting: e.target.checked })}
                      className="mt-1 rounded-sm border-zinc-300 text-primary h-4 w-4"
                    />
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">Formatting & Citations</p>
                      <p className="text-xs text-zinc-500">Proper APA 7th edition usage and professional tone.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reviewer Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full h-48 bg-surface-container-highest border-none rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-zinc-400 resize-none"
                  placeholder={`Provide constructive feedback for ${submission?.student?.full_name ?? 'student'}...`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button className="w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/10">
                  Approve Submission
                </button>
                <button className="w-full py-3 bg-transparent border-2 border-outline/20 text-zinc-700 font-bold rounded-lg text-sm transition-all hover:border-outline/40 hover:bg-zinc-100">
                  Request Revisions
                </button>
                <button className="w-full py-3 text-error font-bold text-xs flex items-center justify-center gap-2 hover:bg-error-container/20 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">flag</span> Flag for Review
                </button>
              </div>
            </div>

            {/* File Details */}
            <div className="px-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">File Details</p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-fixed rounded-full">GOS0SlAws8rL$d3xnm2g
                  <span className="material-symbols-outlined text-[16px] text-on-primary-fixed">description</span>
                  <span className="text-[11px] font-bold text-on-primary-fixed uppercase tracking-tight">PDF Document</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-tertiary-fixed rounded-full">
                  <span className="material-symbols-outlined text-[16px] text-on-tertiary-fixed">analytics</span>
                  <span className="text-[11px] font-bold text-on-tertiary-fixed uppercase tracking-tight">Financial Model</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
