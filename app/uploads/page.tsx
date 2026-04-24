'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'

const PHASES = [
  {
    num: 1,
    label: 'Phase 1',
    subtitle: 'Explore',
    description: 'Leadership, organizational behavior, and strategic thinking.',
    courses: [
      { code: 'MBA 626', name: 'Organizational Behavior', icon: 'diversity_3' },
      { code: 'MBA 632', name: 'Leadership', icon: 'groups' },
      { code: 'MBA 631', name: 'Strategic Management', icon: 'trending_up' },
    ],
  },
  {
    num: 2,
    label: 'Phase 2',
    subtitle: 'Develop',
    description: 'Quantitative analysis, financial modeling, and market strategy.',
    courses: [
      { code: 'MBA 628', name: 'Financial Analysis', icon: 'calculate' },
      { code: 'MBA 625', name: 'Accounting', icon: 'payments' },
      { code: 'MBA 635', name: 'Marketing Analytics', icon: 'analytics' },
    ],
  },
  {
    num: 3,
    label: 'Phase 3',
    subtitle: 'Refine',
    description: 'Operations, entrepreneurship, and global business perspectives.',
    courses: [
      { code: 'MBA 630', name: 'Operations Management', icon: 'account_tree' },
      { code: 'MBA 640', name: 'Entrepreneurship', icon: 'ads_click' },
      { code: 'MBA 668', name: 'Global Business', icon: 'developer_board' },
    ],
  },
  {
    num: 4,
    label: 'Phase 4',
    subtitle: 'Final',
    description: 'Capstone courses and your track-specific final deliverable.',
    courses: [
      { code: 'MBA 655', name: 'Business Strategy', icon: 'psychology_alt' },
      { code: 'MBA 656', name: 'Capstone', icon: 'theater_comedy' },
    ],
  },
]

const phaseColors = [
  {
    sectionBg: 'bg-blue-50/60',
    border: 'border-blue-100',
    numBg: 'bg-blue-700',
    badge: 'bg-blue-100 text-blue-800',
    submitBtn: 'bg-blue-700 hover:bg-blue-800',
    bar: 'bg-blue-500',
    cardHover: 'hover:border-blue-400 hover:bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    sectionBg: 'bg-emerald-50/60',
    border: 'border-emerald-100',
    numBg: 'bg-emerald-700',
    badge: 'bg-emerald-100 text-emerald-800',
    submitBtn: 'bg-emerald-700 hover:bg-emerald-800',
    bar: 'bg-emerald-500',
    cardHover: 'hover:border-emerald-400 hover:bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    sectionBg: 'bg-purple-50/60',
    border: 'border-purple-100',
    numBg: 'bg-purple-700',
    badge: 'bg-purple-100 text-purple-800',
    submitBtn: 'bg-purple-700 hover:bg-purple-800',
    bar: 'bg-purple-500',
    cardHover: 'hover:border-purple-400 hover:bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    sectionBg: 'bg-red-50/60',
    border: 'border-red-100',
    numBg: 'bg-red-800',
    badge: 'bg-red-100 text-red-800',
    submitBtn: 'bg-red-800 hover:bg-red-900',
    bar: 'bg-red-600',
    cardHover: 'hover:border-red-300 hover:bg-red-50',
    iconColor: 'text-red-700',
  },
]

export default function UploadsPage() {
  const [uploads, setUploads] = useState<Record<string, string>>({})
  const [panopto, setPanopto] = useState('')
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({})
  const [finalSubmitted, setFinalSubmitted] = useState(false)

  useEffect(() => {
    document.title = 'Materials — Cardinal Choice'
  }, [])

  function handleFileChange(code: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setUploads(prev => ({ ...prev, [code]: file.name }))
  }

  function submitPhase(phaseNum: number) {
    setSubmitted(prev => ({ ...prev, [phaseNum]: true }))
  }

  const totalUploaded = Object.keys(uploads).length
  const totalCourses = 11

  return (
    <>
      {/* Top Navigation */}
      <nav aria-label="Primary navigation" className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-12">
            <span className="text-xl font-bold tracking-tighter text-red-800 uppercase font-headline">Cardinal Choice</span>
            <div className="hidden md:flex gap-8 items-center">
              <a className="text-zinc-500 hover:text-red-700 transition-colors font-headline tracking-tight text-sm font-semibold" href="/dashboard">Dashboard</a>
              <a className="text-red-800 border-b-2 border-red-800 pb-1 font-headline tracking-tight text-sm font-semibold" href="/uploads" aria-current="page">Materials</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors font-headline tracking-tight text-sm font-semibold" href="/portfolio">Portfolio</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors font-headline tracking-tight text-sm font-semibold" href="/curriculum">Timeline</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="View notifications" className="p-2 text-zinc-500 hover:bg-zinc-100/50 rounded-md transition-all">
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm" aria-hidden="true">AC</div>
            <button onClick={signOut} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-800 transition-colors">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="pt-24 pb-16 px-8 max-w-screen-2xl mx-auto">

        {/* Hero */}
        <header className="max-w-4xl mb-10">
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-background mb-3">
            Milestone <span className="text-primary italic font-light">Tracker.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Upload your milestone documents across four portfolio phases. You can upload files individually as you complete each course, or submit an entire phase at once.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column — Phase Sections */}
          <div className="lg:col-span-8 space-y-8">
            {PHASES.map((phase, i) => {
              const color = phaseColors[i]
              const phaseUploaded = phase.courses.filter(c => uploads[c.code]).length
              const allUploaded = phaseUploaded === phase.courses.length
              const isSubmitted = submitted[phase.num]
              const remaining = phase.courses.length - phaseUploaded

              return (
                <section
                  key={phase.num}
                  aria-labelledby={`phase-${phase.num}-heading`}
                  className={`rounded-2xl border ${color.border} ${color.sectionBg} p-8`}
                >
                  {/* Phase Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${color.numBg} text-white flex items-center justify-center font-black text-sm flex-shrink-0`} aria-hidden="true">
                        {phase.num}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h2 id={`phase-${phase.num}-heading`} className="font-headline text-xl font-extrabold text-zinc-900">{phase.label}</h2>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color.badge}`}>{phase.subtitle}</span>
                        </div>
                        <p className="text-xs text-zinc-500">{phase.courses.map(c => c.code).join(' · ')}{phase.num === 4 ? ' · Final Deliverable' : ''}</p>
                      </div>
                    </div>
                    {isSubmitted && (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                        <span className="material-symbols-outlined text-sm" aria-hidden="true">check_circle</span>
                        Submitted for Review
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-zinc-500 mb-6">{phase.description}</p>

                  {/* Course Upload Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {phase.courses.map(course => {
                      const uploaded = uploads[course.code]
                      return (
                        <label
                          key={course.code}
                          className={`bg-white rounded-xl p-5 cursor-pointer border-2 border-dashed border-zinc-200 transition-all ${isSubmitted ? 'opacity-60 cursor-default' : color.cardHover} flex flex-col items-center text-center gap-3 group`}
                        >
                          <span className={`material-symbols-outlined text-3xl transition-colors ${uploaded ? 'text-green-600' : color.iconColor + ' opacity-60 group-hover:opacity-100'}`} aria-hidden="true">
                            {uploaded ? 'check_circle' : course.icon}
                          </span>
                          <div>
                            <p className="font-bold text-sm text-zinc-900">{course.code}</p>
                            <p className="text-xs text-zinc-500">{course.name}</p>
                          </div>
                          {uploaded ? (
                            <p className="text-xs text-green-600 font-medium truncate w-full text-center">{uploaded}</p>
                          ) : (
                            <p className="text-xs text-zinc-400 font-medium">Click to upload</p>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.mp3,.wav"
                            onChange={e => handleFileChange(course.code, e)}
                            aria-label={`Upload file for ${course.code} ${course.name}`}
                            disabled={isSubmitted}
                          />
                        </label>
                      )
                    })}
                  </div>

                  {/* Phase 4: Panopto Final Deliverable */}
                  {phase.num === 4 && (
                    <div className="bg-white rounded-xl p-6 border border-dashed border-red-200 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-red-700" aria-hidden="true">play_circle</span>
                        <div>
                          <h3 className="font-bold text-sm text-zinc-900">Final Deliverable — Panopto Video</h3>
                          <p className="text-xs text-zinc-500">Paste your Panopto embed code below. Your video will display on your Portfolio Preview.</p>
                        </div>
                        {finalSubmitted && (
                          <span className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
                            <span className="material-symbols-outlined text-sm" aria-hidden="true">check_circle</span>
                            Submitted
                          </span>
                        )}
                      </div>
                      <label htmlFor="panopto-embed" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Panopto Embed Code</label>
                      <textarea
                        id="panopto-embed"
                        value={panopto}
                        onChange={e => setPanopto(e.target.value)}
                        disabled={finalSubmitted}
                        className="w-full h-28 bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-800/20 resize-none placeholder:text-zinc-400"
                        placeholder='<iframe src="https://louisville.hosted.panopto.com/Panopto/Pages/Embed.aspx?id=..." ...></iframe>'
                      />
                      {panopto && (
                        <div className="mt-4">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Preview</p>
                          <div
                            className="rounded-lg overflow-hidden bg-zinc-900 aspect-video"
                            dangerouslySetInnerHTML={{ __html: panopto }}
                          />
                        </div>
                      )}
                      {!finalSubmitted && (
                        <button
                          onClick={() => setFinalSubmitted(true)}
                          disabled={!panopto.trim()}
                          className="mt-4 px-5 py-2 bg-red-800 hover:bg-red-900 text-white font-bold rounded-lg text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Submit Final Deliverable
                        </button>
                      )}
                    </div>
                  )}

                  {/* Progress Bar + Submit Phase */}
                  <div className="flex items-center justify-between pt-5 border-t border-zinc-200/70 gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-zinc-500 font-medium">{phaseUploaded} of {phase.courses.length} documents uploaded</span>
                        {isSubmitted && <span className="text-xs text-green-600 font-bold">In review</span>}
                        {!isSubmitted && !allUploaded && phaseUploaded > 0 && (
                          <span className="text-xs text-zinc-400">{remaining} remaining</span>
                        )}
                      </div>
                      <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${isSubmitted ? 'bg-green-500' : color.bar} rounded-full transition-all`}
                          style={{ width: isSubmitted ? '100%' : `${(phaseUploaded / phase.courses.length) * 100}%` }}
                        />
                      </div>
                      {!isSubmitted && !allUploaded && (
                        <p className="text-xs text-zinc-400 mt-1.5">
                          Upload all {phase.courses.length} documents to enable submission
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => submitPhase(phase.num)}
                      disabled={isSubmitted || !allUploaded}
                      className={`flex-shrink-0 px-6 py-2.5 ${
                        isSubmitted
                          ? 'bg-green-600 cursor-default'
                          : allUploaded
                          ? color.submitBtn + ' cursor-pointer'
                          : 'bg-zinc-300 cursor-not-allowed'
                      } text-white font-bold rounded-lg text-sm transition-colors shadow-sm`}
                    >
                      {isSubmitted ? '✓ Submitted' : `Submit ${phase.label}`}
                    </button>
                  </div>
                </section>
              )
            })}
          </div>

          {/* Right Column — Progress Sidebar */}
          <div className="lg:col-span-4">
            <aside aria-label="Submission progress" className="sticky top-28 space-y-6">

              {/* Overall Progress */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-100">
                <h3 className="font-headline font-bold text-lg mb-4">Overall Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-500">Core Milestones</span>
                  <span className="font-bold text-sm">{totalUploaded} / {totalCourses}</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(totalUploaded / totalCourses) * 100}%` }}
                  />
                </div>

                {/* Per-phase breakdown */}
                <div className="space-y-4">
                  {PHASES.map((phase, i) => {
                    const color = phaseColors[i]
                    const phaseUploaded = phase.courses.filter(c => uploads[c.code]).length
                    const isSubmitted = submitted[phase.num]
                    return (
                      <div key={phase.num}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${color.bar}`} aria-hidden="true" />
                            <span className="text-xs font-bold text-zinc-700">{phase.label} — {phase.subtitle}</span>
                          </div>
                          <span className="text-xs text-zinc-500">
                            {isSubmitted ? (
                              <span className="text-green-600 font-bold">Submitted</span>
                            ) : (
                              `${phaseUploaded}/${phase.courses.length}`
                            )}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isSubmitted ? 'bg-green-500' : color.bar} rounded-full transition-all`}
                            style={{ width: isSubmitted ? '100%' : `${(phaseUploaded / phase.courses.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-surface-container-low rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5" aria-hidden="true">info</span>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 mb-2">Submission Tips</h4>
                    <ul className="space-y-2 text-xs text-zinc-600 leading-relaxed">
                      <li>Upload all documents for a phase before submitting — the Submit button activates only when all files are in.</li>
                      <li>Accepted formats: PDF, Word (.docx), and audio files (.mp3, .wav).</li>
                      <li>Your Phase 4 final deliverable is a Panopto video — paste the embed code from Panopto.</li>
                      <li>Each phase is reviewed as a batch by your advisor after you click Submit.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* View Portfolio link */}
              <a
                href="/portfolio"
                className="flex items-center justify-between p-5 bg-white rounded-xl border border-zinc-100 shadow-sm hover:border-red-200 transition-colors group"
              >
                <div>
                  <p className="font-bold text-sm text-zinc-900">View Portfolio Preview</p>
                  <p className="text-xs text-zinc-500">See how your work appears to reviewers</p>
                </div>
                <span className="material-symbols-outlined text-zinc-400 group-hover:text-red-700 group-hover:translate-x-1 transition-all" aria-hidden="true">arrow_forward</span>
              </a>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
