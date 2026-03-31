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

    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tighter text-red-800 uppercase font-headline">Cardinal Choice</span>
            <div className="hidden md:flex gap-6 items-center font-headline tracking-tight text-sm font-semibold">
              <a className="text-red-800 border-b-2 border-red-800 pb-1" href="#">Dashboard</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="/uploads">Materials</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="/portfolio">Portfolio</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="#">Settings</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-100/50 rounded-md transition-all">
              <span className="material-symbols-outlined text-zinc-600">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold font-headline">{profile?.full_name ?? 'Loading...'}</p>
               <p className="text-[10px] text-zinc-500 uppercase tracking-widest">MBA Candidate</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {initials}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 flex-col p-4 gap-2 bg-zinc-50 z-40 pt-24">
        <div className="px-4 mb-6">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4">Workspace</h3>
          <div className="space-y-1">
            <a className="flex items-center gap-3 p-3 bg-white text-red-800 shadow-sm rounded-lg font-medium text-sm transition-transform duration-200 hover:translate-x-1" href="#">
              <span className="material-symbols-outlined">dashboard</span> Overview
            </a>
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/curriculum">
              <span className="material-symbols-outlined">account_tree</span> Curriculum
            </a>
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/uploads">
              <span className="material-symbols-outlined">folder_open</span> My Files
            </a>
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/sharing">
              <span className="material-symbols-outlined">share</span> Access
            </a>
          </div>
        </div>
         <div className="mt-auto px-4 pb-4 space-y-1">
            <button className="w-full py-3 signature-gradient text-white rounded-md text-sm font-semibold mb-6 shadow-lg shadow-primary/20 active:scale-95 transition-all">
              Submit Portfolio
            </button>
            <a className="flex items-center gap-3 p-2 text-zinc-500 hover:text-red-800 transition-colors text-sm" href="#">
              <span className="material-symbols-outlined text-lg">help_outline</span> Help
            </a>
            <button onClick={signOut} className="flex items-center gap-3 p-2 text-zinc-500 hover:text-red-800 transition-colors text-sm w-full">
              <span className="material-symbols-outlined text-lg">logout</span> Sign Out
            </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="lg:ml-64 pt-28 pb-12 px-6 md:px-12 max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-background">
            Welcome back, <span className="text-primary">{firstName}</span>.
            </h1>
            <p className="text-zinc-500 font-medium max-w-md">Your Cardinal Choice Portfolio is organized across 11 core milestones.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-4 bg-zinc-100 text-zinc-700 font-bold text-sm rounded-md hover:bg-zinc-200 transition-all active:scale-95">
              <span className="material-symbols-outlined">download</span> SYLLABUS
            </button>
            <button className="flex items-center gap-2 px-6 py-4 bg-tertiary-fixed-dim text-on-tertiary-fixed font-bold text-sm rounded-md hover:brightness-95 transition-all active:scale-95">
              <span className="material-symbols-outlined">add_box</span> QUICK UPLOAD
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-12">

            {/* Milestone Progress */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold font-headline tracking-tight">Milestone Progress</h2>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">11 Core Course Requirements</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black font-headline text-primary">{approved}</span>
                   <span className="text-xl font-bold font-headline text-zinc-400">/ 11</span>
                  </div>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Milestones Approved</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               {submissions.map((m) => (

                  <div
                   key={m.id}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-between min-h-[140px] relative cursor-pointer transition-all
                   ${m.status === "approved" ? "bg-white border-primary/20 shadow-sm hover:shadow-md hover:border-primary" : ""}
		   ${m.status === "in_review" ? "bg-zinc-50 border-zinc-200 hover:border-zinc-300" : ""}
		   ${m.status === "locked" ? "bg-zinc-50/50 border border-zinc-100 opacity-60" : ""}

                    `}
                  >
           <div className={`absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase
                      ${m.status === "approved" ? "bg-green-50 text-green-700" : ""}
                      ${m.status === "in_review" ? "bg-amber-50 text-amber-700" : ""}
                      ${m.status === "locked" ? "bg-zinc-200 text-zinc-500" : ""}
                    `}>
                      <span className="material-symbols-outlined text-[10px]">
                        {m.status === "approved" ? "check_circle" : m.status === "in_review" ? "schedule" : "lock"}
                      </span>
                      {m.status}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs font-bold font-headline mb-0.5">{m.milestone?.course?.code}</p>
                      <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter leading-tight">{m.milestone?.title}</p>
                    </div>
                    <div className="w-full pt-2 border-t border-zinc-100 mt-2">
                      <p className="text-[8px] text-zinc-400 font-bold uppercase text-center">{m.submitted_at ? new Date(m.submitted_at).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-zinc-100 rounded-xl flex items-center justify-center min-h-[140px]">
                  <p className="text-[9px] text-zinc-500 font-medium text-center">MBA 621 and 623 are exempt from Cardinal Choice.</p>
                </div>
              </div>
            </section>


            {/* Final Deliverable */}
            <section className="bg-white rounded-3xl p-10 ghost-shadow border border-zinc-100">
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-3xl font-black font-headline tracking-tighter leading-none mb-2">Final Deliverable</h2>
                    <p className="text-zinc-500 text-sm leading-relaxed">Synthesis of your academic milestones based on your selected track.</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Select Your Track</label>
                    <div className="grid grid-cols-1 gap-3">
                      <button className="flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5 text-left transition-all">
                        <div>
                          <p className="font-headline font-bold text-sm">Career Plan</p>
                          <p className="text-[10px] text-zinc-500">Career Track: Explore your current or future path</p>
                        </div>
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>radio_button_checked</span>
                      </button>
                      <button className="flex items-center justify-between p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-300 text-left transition-all">
                        <div>
                          <p className="font-headline font-bold text-sm">White Paper</p>
                          <p className="text-[10px] text-zinc-500">Industry Track: Look at a critical industry problem</p>
                        </div>
                        <span className="material-symbols-outlined text-zinc-300">radio_button_unchecked</span>
                      </button>
                      <button className="flex items-center justify-between p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-300 text-left transition-all">
                        <div>
                          <p className="font-headline font-bold text-sm">Process Improvement Plan</p>
                          <p className="text-[10px] text-zinc-500">Issue Track: Focus on systemic organizational issues</p>
                        </div>
                        <span className="material-symbols-outlined text-zinc-300">radio_button_unchecked</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-[3/4] bg-zinc-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 hover:bg-zinc-100 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-4xl text-zinc-300 mb-2">upload_file</span>
                  <p className="text-xs font-bold text-zinc-400">Upload Final Synthesis</p>
                  <p className="text-[10px] text-zinc-300 mt-1 uppercase tracking-tighter">Available after 11 milestones</p>
                </div>
              </div>
            </section>

            {/* Phase Timeline */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-surface-container-low rounded-2xl border-l-4 border-red-800">
                <span className="text-[10px] font-black text-red-800 uppercase tracking-[0.2em] mb-4 block">Phase One</span>
                <h3 className="text-xl font-bold font-headline mb-2">Explore</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">Defining your curricular pursuit through question-asking and exploratory positions.</p>
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Portfolio Submission #1 Due:</p>
                  <p className="text-xs font-bold text-zinc-800">Completion of MBA 631</p>
                </div>
              </div>
              <div className="p-8 bg-surface-container-low rounded-2xl border-l-4 border-red-800">
                <span className="text-[10px] font-black text-red-800 uppercase tracking-[0.2em] mb-4 block">Phase Two</span>
                <h3 className="text-xl font-bold font-headline mb-2">Analyze</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">Quantitative analysis to understand financial challenges related to your topic.</p>
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase">Portfolio Submission #2 Due:</p>
                  <p className="text-xs font-bold text-zinc-800">Completion of MBA 635</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Rail */}
          <aside className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-8 ghost-shadow border border-zinc-100">
              <h3 className="text-sm font-bold font-headline uppercase tracking-widest text-zinc-400 mb-6">Curriculum Timeline</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</div>
                  <div>
                    <p className="text-sm font-bold">Foundation</p>
                    <p className="text-xs text-zinc-500">Core Milestones 1–4</p>
                    <div className="mt-2 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded inline-block">COMPLETE</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-800 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</div>
                  <div>
                    <p className="text-sm font-bold">Intermediate</p>
                    <p className="text-xs text-zinc-500">Core Milestones 5–8</p>
                    <div className="mt-2 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded inline-block">COMPLETE</div>
                  </div>
                </div>
                <div className="flex gap-4 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</div>
                  <div>
                    <p className="text-sm font-bold text-zinc-400">Advanced</p>
                    <p className="text-xs text-zinc-400">Core Milestones 9–11</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 py-3 border border-outline/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all rounded">
                Full Program Timeline
              </button>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs font-medium"><span className="font-bold">MBA 640</span> milestone approved</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                  <p className="text-xs font-medium">New feedback on <span className="font-bold">Strategic Comm</span></p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-zinc-100 flex justify-around py-3 z-50">
        <a className="flex flex-col items-center gap-1 text-primary" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-zinc-400" href="/curriculum">
          <span className="material-symbols-outlined">account_tree</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Timeline</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-zinc-400" href="/uploads">
          <span className="material-symbols-outlined">folder</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Files</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-zinc-400" href="/portfolio">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </a>
      </nav>
    </>
  );
}
