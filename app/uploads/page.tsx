'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'

const courses = [
  { code: "MBA 625", icon: "payments" },
  { code: "MBA 626", icon: "diversity_3" },
  { code: "MBA 628", icon: "calculate" },
  { code: "MBA 630", icon: "account_tree" },
  { code: "MBA 631", icon: "trending_up" },
  { code: "MBA 632", icon: "groups" },
  { code: "MBA 635", icon: "analytics" },
  { code: "MBA 640", icon: "ads_click" },
  { code: "MBA 655", icon: "psychology_alt" },
  { code: "MBA 656", icon: "theater_comedy" },
  { code: "MBA 668", icon: "developer_board" },
]

const tracks = [
  { label: "Career Track", sub: "Career Plan", icon: "directions_run" },
  { label: "Industry Track", sub: "White Paper", icon: "factory" },
  { label: "Issue Track", sub: "Improvement Plan", icon: "report_problem" },
]

const recentUploads = [
  { code: "MBA 625", icon: "payments", semester: "Core Semester 1", description: "Final Financial Projection Analysis for Retail Expansion Strategy." },
  { code: "MBA 626", icon: "diversity_3", semester: "Core Semester 1", description: "Organizational Leadership & Change Management Case Study." },
]

export default function UploadsPage() {
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [title, setTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Financials')

  useEffect(() => {
    document.title = 'Materials — Cardinal Choice'
  }, [])

  const categories = ['Financials', 'Strategy', 'Ops']

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
              <a className="text-zinc-500 hover:text-red-700 transition-colors font-headline tracking-tight text-sm font-semibold" href="#">Settings</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="View notifications" className="p-2 text-zinc-500 hover:bg-zinc-100/50 rounded-md transition-all">
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm" aria-hidden="true">
              AC
            </div>
            <button onClick={signOut} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-800 transition-colors">
              <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span> Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="pt-24 pb-16 px-8 max-w-screen-2xl mx-auto flex flex-col gap-12">

        {/* Hero */}
        <header className="max-w-4xl">
          <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-background mb-4">
            Milestone <span className="text-primary italic font-light">Tracker.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Complete milestones across 11 core classes to build your Cardinal Choice Portfolio. Choose your track to unlock your final deliverable zone.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">

            {/* Milestone Upload Grid */}
            <section aria-labelledby="milestones-upload-heading">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm" aria-hidden="true">3</span>
                <h2 id="milestones-upload-heading" className="font-headline text-2xl font-bold">Complete Milestones</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {courses.map((c) => (
                  <label
                    key={c.code}
                    className="border border-dashed border-outline/20 hover:border-primary/40 transition-all rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-white/50 hover:bg-white cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-3xl text-outline group-hover:text-primary transition-colors" aria-hidden="true">
                      {c.icon}
                    </span>
                    <span className="text-xs font-bold font-headline">{c.code}</span>
                    <input type="file" className="hidden" aria-label={`Upload file for ${c.code}`} />
                  </label>
                ))}
                <div className="p-4 flex flex-col items-center justify-center">
                  <p className="text-xs text-on-surface-variant/60 text-center italic leading-tight">MBA 621 &amp; 623 are exempt</p>
                </div>
              </div>
            </section>

            {/* Final Deliverable */}
            <section aria-labelledby="final-deliverable-heading" className="border-t border-outline/10 pt-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm" aria-hidden="true">4</span>
                <h2 id="final-deliverable-heading" className="font-headline text-2xl font-bold">Produce Final Deliverable</h2>
              </div>
              <div className="bg-surface-container-low rounded-xl p-8 border border-primary/20 ghost-shadow">
                <div className="mb-8">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Select Your Path</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Select final deliverable track">
                    {tracks.map((t, i) => (
                      <button
                        key={t.label}
                        onClick={() => setSelectedTrack(i)}
                        aria-pressed={selectedTrack === i}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 text-center transition-all ${
                          selectedTrack === i
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-outline/20 hover:border-primary/40 text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined mb-2" aria-hidden="true">{t.icon}</span>
                        <span className="text-sm font-bold">{t.label}</span>
                        <span className="text-xs opacity-70">{t.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">
                    Submit {tracks[selectedTrack].sub}
                  </p>
                  <label className="group flex flex-col items-center justify-center w-full h-48 bg-white hover:bg-surface-bright transition-all cursor-pointer rounded-xl border-2 border-dashed border-primary/20 overflow-hidden">
                    <span className="material-symbols-outlined text-4xl text-primary mb-3 opacity-40 group-hover:scale-110 transition-transform" aria-hidden="true">file_upload</span>
                    <p className="text-sm font-semibold">Drop Final Deliverable here</p>
                    <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-tighter font-bold">Required for core completion</p>
                    <input type="file" className="hidden" aria-label={`Upload ${tracks[selectedTrack].sub} final deliverable`} />
                  </label>
                </div>
              </div>
            </section>

            {/* Recent Uploads */}
            <section aria-labelledby="recent-uploads-heading" className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 id="recent-uploads-heading" className="font-headline text-3xl font-bold">Recent Uploads</h2>
                <button className="text-primary font-bold text-sm flex items-center gap-1 group">
                  Full Portfolio
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" aria-hidden="true">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {recentUploads.map((r) => (
                  <div key={r.code} className="group bg-white p-5 rounded-xl ghost-shadow border border-outline-variant/10 hover:ring-2 ring-primary/20 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl" aria-hidden="true">{r.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{r.code} Milestone</h4>
                        <p className="text-xs text-on-surface-variant uppercase font-bold tracking-tight">{r.semester}</p>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2 italic mb-3">&ldquo;{r.description}&rdquo;</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs text-green-600" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                      <span className="text-xs font-bold text-green-600">SUBMITTED</span>
                    </div>
                  </div>
                ))}
                <div className="bg-surface-container-low border-2 border-dashed border-outline/10 p-5 rounded-xl flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-3xl" aria-hidden="true">pending</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Next: MBA 628</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <aside aria-label="Document context and upload settings" className="sticky top-28 space-y-8">

              {/* Progress */}
              <div className="bg-white rounded-xl p-6 ghost-shadow border border-outline-variant/10">
                <h3 className="font-headline font-bold text-lg mb-4">Your Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Core Milestones</span>
                    <span className="font-bold">2 / 11</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '18%' }}></div>
                  </div>
                  <div className="flex items-center gap-3 mt-6 p-4 bg-tertiary-fixed/30 rounded-lg">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">info</span>
                    <p className="text-xs text-on-tertiary-fixed font-medium leading-tight">
                      Each core semester includes a “Pit Stop” session to reflect on your milestones and portfolio progress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Context */}
              <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
                <h3 className="font-headline font-bold text-lg">Document Context</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="display-title" className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block">Display Title</label>
                    <input
                      id="display-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-sm"
                      placeholder="e.g. MBA 625 Financial Strategy"
                    />
                  </div>
                  <div className="space-y-2">
                    <p id="category-label" className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Artifact Category</p>
                    <div className="flex flex-wrap gap-2" role="group" aria-labelledby="category-label">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          aria-pressed={selectedCategory === cat}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-tight transition-all ${
                            selectedCategory === cat
                              ? 'bg-primary text-white'
                              : 'bg-white text-on-surface border border-outline/10 hover:border-primary/30'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <button className="w-full py-3 rounded-lg signature-gradient text-white font-headline font-bold text-sm shadow-lg shadow-primary/20">
                      Commit to Milestone
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Floating Help */}
      <div className="fixed bottom-8 right-8">
        <button aria-label="Get help" className="bg-on-surface text-white h-14 w-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined" aria-hidden="true">help</span>
        </button>
      </div>
    </>
  )
}
