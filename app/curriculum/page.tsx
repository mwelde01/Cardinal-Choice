'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'
import { supabase } from '@/lib/supabase'

const tracks = [
  { label: "Career Plan", description: "Career Track: Explore your current or future path" },
  { label: "White Paper", description: "Industry Track: Look at a critical industry problem" },
  { label: "Process Improvement Plan", description: "Issue Track: Focus on systemic organizational issues" },
]

export default function CurriculumPage() {
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Curriculum — Cardinal Choice'
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: submissionsData } = await supabase
        .from('submissions')
        .select(`
          id, status, submitted_at,
          milestone:milestones!milestone_id(
            title,
            course:courses!course_id(code, name)
          )
        `)
        .eq('student_id', user.id)
        .order('submitted_at', { ascending: false })

      if (submissionsData) setSubmissions(submissionsData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const cardStyle = (status: string) => {
    if (status === 'approved') return 'bg-white border-2 border-primary/20 shadow-sm hover:shadow-md hover:border-primary cursor-pointer'
    if (status === 'in_review') return 'bg-zinc-50 border-2 border-zinc-200 hover:border-zinc-300 cursor-pointer'
    return 'bg-zinc-50/50 border border-zinc-100'
  }

  const badgeStyle = (status: string) => {
    if (status === 'approved') return 'bg-green-50 text-green-700'
    if (status === 'in_review') return 'bg-amber-50 text-amber-700'
    return 'bg-zinc-200 text-zinc-500'
  }

  const badgeIcon = (status: string) => {
    if (status === 'approved') return 'check_circle'
    if (status === 'in_review') return 'schedule'
    return 'lock'
  }

  return (
    <>
      {/* Top Navigation */}
      <nav aria-label="Primary navigation" className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tighter text-red-800 uppercase font-headline">Cardinal Choice</span>
            <div className="hidden md:flex gap-6 items-center font-headline tracking-tight text-sm font-semibold">
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="/dashboard">Dashboard</a>
              <a className="text-red-800 border-b-2 border-red-800 pb-1" href="/curriculum" aria-current="page">Curriculum</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="/portfolio">Portfolio</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="#">Settings</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="View notifications" className="p-2 hover:bg-zinc-100/50 rounded-md transition-all">
              <span className="material-symbols-outlined text-zinc-600" aria-hidden="true">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold font-headline">Alex Chen</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">MBA Candidate</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm" aria-hidden="true">
                AC
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside aria-label="Workspace navigation" className="hidden lg:flex h-screen w-64 fixed left-0 top-0 flex-col p-4 gap-2 bg-zinc-50 z-40 pt-24">
        <div className="px-4 mb-6">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Workspace</h3>
          <div className="space-y-1">
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/dashboard">
              <span className="material-symbols-outlined" aria-hidden="true">dashboard</span> Overview
            </a>
            <a className="flex items-center gap-3 p-3 bg-white text-red-800 shadow-sm rounded-lg font-medium text-sm transition-transform duration-200 hover:translate-x-1" href="/curriculum" aria-current="page">
              <span className="material-symbols-outlined" aria-hidden="true">account_tree</span> Curriculum
            </a>
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/uploads">
              <span className="material-symbols-outlined" aria-hidden="true">folder_open</span> My Files
            </a>
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/sharing">
              <span className="material-symbols-outlined" aria-hidden="true">share</span> Access
            </a>
          </div>
        </div>
        <div className="mt-auto px-4 pb-4 space-y-1">
          <button className="w-full py-3 signature-gradient text-white rounded-md text-sm font-semibold mb-6 shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Submit Portfolio
          </button>
          <a className="flex items-center gap-3 p-2 text-zinc-500 hover:text-red-800 transition-colors text-sm" href="#">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">help_outline</span> Help
          </a>
          <button onClick={signOut} className="flex items-center gap-3 p-2 text-zinc-500 hover:text-red-800 transition-colors text-sm w-full">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="lg:ml-64 pt-28 pb-12 px-6 md:px-12 max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-background">
              Welcome back, <span className="text-primary">Alex</span>.
            </h1>
            <p className="text-zinc-500 font-medium max-w-md">Your Cardinal Choice Portfolio is organized across 11 core milestones.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-4 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-md hover:bg-zinc-200 transition-all active:scale-95">
              <span className="material-symbols-outlined" aria-hidden="true">download</span> SYLLABUS
            </button>
            <button className="flex items-center gap-2 px-6 py-4 bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold text-sm rounded-md hover:brightness-95 transition-all active:scale-95">
              <span className="material-symbols-outlined" aria-hidden="true">add_box</span> QUICK UPLOAD
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-12">

            {/* Milestone Grid */}
            <section aria-labelledby="milestone-heading">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 id="milestone-heading" className="text-2xl font-bold font-headline tracking-tight">Milestone Progress</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">11 Core Course Requirements</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black font-headline text-primary">8</span>
                    <span className="text-xl font-bold font-headline text-zinc-500">/ 11</span>
                  </div>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Milestones Approved</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {submissions.map((m) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl flex flex-col items-center justify-between min-h-[140px] relative transition-all ${cardStyle(m.status)}`}
                    role={m.status !== 'locked' ? 'button' : undefined}
                    tabIndex={m.status !== 'locked' ? 0 : undefined}
                    onKeyDown={m.status !== 'locked' ? (e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click() } : undefined}
                  >
                    <div className={`absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold uppercase ${badgeStyle(m.status)}`}>
                      <span className="material-symbols-outlined text-xs" aria-hidden="true" style={m.status === 'approved' ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {badgeIcon(m.status)}
                      </span>
                      {m.status === 'in_review' ? 'In Review' : m.status}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs font-bold font-headline mb-0.5">{m.milestone?.course?.code}</p>
                      <p className="text-xs text-zinc-500 font-medium uppercase tracking-tighter leading-tight">{m.milestone?.course?.name}</p>
                    </div>
                    <div className="w-full pt-2 border-t border-zinc-100 mt-2">
                      <p className="text-xs text-zinc-500 font-bold uppercase text-center">{m.submitted_at ? new Date(m.submitted_at).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-zinc-100 rounded-xl flex items-center justify-center min-h-[140px]">
                  <p className="text-xs text-zinc-500 font-medium text-center">MBA 621 and 623 are exempt from Cardinal Choice.</p>
                </div>
              </div>
            </section>

            {/* Final Deliverable */}
            <section aria-labelledby="deliverable-heading" className="bg-white rounded-3xl p-10 ghost-shadow border border-zinc-100">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 id="deliverable-heading" className="text-3xl font-black font-headline tracking-tighter leading-none mb-2">Final Deliverable</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">Synthesis of your academic milestones based on your selected track.</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select Your Track</p>
                    <div className="grid grid-cols-1 gap-3" role="radiogroup" aria-label="Select final deliverable track">
                      {tracks.map((t, i) => (
                        <button
                          key={t.label}
                          onClick={() => setSelectedTrack(i)}
                          aria-pressed={selectedTrack === i}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${selectedTrack === i ? 'border-primary bg-primary/5' : 'border-zinc-100 hover:border-zinc-300'}`}
                        >
                          <div>
                            <p className="font-headline font-bold text-sm">{t.label}</p>
                            <p className="text-xs text-zinc-500">{t.description}</p>
                          </div>
                          <span
                            className={`material-symbols-outlined ${selectedTrack === i ? 'text-primary' : 'text-zinc-300'}`}
                            style={selectedTrack === i ? { fontVariationSettings: "'FILL' 1" } : {}}
                            aria-hidden="true"
                          >
                            {selectedTrack === i ? 'radio_button_checked' : 'radio_button_unchecked'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  aria-label="Upload final synthesis document (available after completing 11 milestones)"
                  className="w-full md:w-64 aspect-[3/4] bg-zinc-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 hover:bg-zinc-100 transition-all"
                >
                  <span className="material-symbols-outlined text-4xl text-zinc-300 mb-2" aria-hidden="true">upload_file</span>
                  <p className="text-xs font-bold text-zinc-500">Upload Final Synthesis</p>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">Available after 11 milestones</p>
                </button>
              </div>
            </section>

            {/* Phase Timeline */}
            <section aria-labelledby="phase-heading" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <h2 id="phase-heading" className="sr-only">Program Timeline</h2>
              <div className="p-8 bg-surface-container-low rounded-2xl border-l-4 border-red-800">
                <span className="text-xs font-black text-red-800 uppercase tracking-[0.2em] mb-4 block">Phase One</span>
                <h3 className="text-xl font-bold font-headline mb-2">Explore</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">Defining your curricular pursuit through question-asking and exploratory positions.</p>
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <p className="text-xs font-bold text-zinc-500 uppercase">Portfolio Submission #1 Due:</p>
                  <p className="text-xs font-bold text-zinc-800">Completion of MBA 631</p>
                </div>
              </div>
              <div className="p-8 bg-surface-container-low rounded-2xl border-l-4 border-red-800">
                <span className="text-xs font-black text-red-800 uppercase tracking-[0.2em] mb-4 block">Phase Two</span>
                <h3 className="text-xl font-bold font-headline mb-2">Analyze</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">Quantitative analysis to understand financial challenges related to your topic.</p>
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <p className="text-xs font-bold text-zinc-500 uppercase">Portfolio Submission #2 Due:</p>
                  <p className="text-xs font-bold text-zinc-800">Completion of MBA 635</p>
                </div>
              </div>
            </section>
          </div>

          {/* Side Rail */}
          <aside aria-label="Progress and activity" className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-8 ghost-shadow border border-zinc-100">
              <h3 className="text-sm font-bold font-headline uppercase tracking-widest text-zinc-500 mb-6">Curriculum Timeline</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold" aria-hidden="true">1</div>
                  <div>
                    <p className="text-sm font-bold">Foundation</p>
                    <p className="text-xs text-zinc-500">Core Milestones 1–4</p>
                    <div className="mt-2 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded inline-block">COMPLETE</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold" aria-hidden="true">2</div>
                  <div>
                    <p className="text-sm font-bold">Intermediate</p>
                    <p className="text-xs text-zinc-500">Core Milestones 5–8</p>
                    <div className="mt-2 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded inline-block">COMPLETE</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center flex-shrink-0 text-xs font-bold" aria-hidden="true">3</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-500">Advanced</p>
                    <p className="text-xs text-zinc-500">Core Milestones 9–11</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 py-3 border border-outline/10 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all rounded">
                Full Program Timeline
              </button>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" aria-hidden="true"></div>
                  <p className="text-xs font-medium"><span className="font-bold">MBA 640</span> milestone approved</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" aria-hidden="true"></div>
                  <p className="text-xs font-medium">New feedback on <span className="font-bold">Strategic Comm</span></p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 w-full bg-white border-t border-zinc-100 flex justify-around py-3 z-50">
        <a className="flex flex-col items-center gap-1 text-zinc-500" href="/dashboard">
          <span className="material-symbols-outlined" aria-hidden="true">dashboard</span>
          <span className="text-xs font-bold uppercase tracking-tighter">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary" href="/curriculum" aria-current="page">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">account_tree</span>
          <span className="text-xs font-bold uppercase tracking-tighter">Timeline</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-zinc-500" href="/uploads">
          <span className="material-symbols-outlined" aria-hidden="true">folder</span>
          <span className="text-xs font-bold uppercase tracking-tighter">Files</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-zinc-500" href="/portfolio">
          <span className="material-symbols-outlined" aria-hidden="true">person</span>
          <span className="text-xs font-bold uppercase tracking-tighter">Profile</span>
        </a>
      </nav>
    </>
  )
}
