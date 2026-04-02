'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'

export default function SharingPage() {
  const [portfolioPublic, setPortfolioPublic] = useState(true)
  const [allowDownload, setAllowDownload] = useState(false)
  const [showContact, setShowContact] = useState(true)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    document.title = 'Sharing & Access — Cardinal Choice'
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText('cardinalchoice.edu/p/chen-alex-2024')
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const Toggle = ({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) => (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-zinc-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} aria-hidden="true" />
    </button>
  )

  return (
    <>
      {/* Top Navigation */}
      <nav aria-label="Primary navigation" className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tighter text-red-800 uppercase font-headline">Cardinal Choice</span>
            <div className="hidden md:flex gap-6 items-center font-headline tracking-tight text-sm font-semibold">
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="/dashboard">Dashboard</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="/uploads">Materials</a>
              <a className="text-zinc-500 hover:text-red-700 transition-colors" href="/portfolio">Portfolio</a>
              <a className="text-red-800 border-b-2 border-red-800 pb-1" href="/sharing" aria-current="page">Sharing</a>
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
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/curriculum">
              <span className="material-symbols-outlined" aria-hidden="true">account_tree</span> Curriculum
            </a>
            <a className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg text-sm transition-transform duration-200 hover:translate-x-1" href="/uploads">
              <span className="material-symbols-outlined" aria-hidden="true">folder_open</span> My Files
            </a>
            <a className="flex items-center gap-3 p-3 bg-white text-red-800 shadow-sm rounded-lg font-medium text-sm transition-transform duration-200 hover:translate-x-1" href="/sharing" aria-current="page">
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
      <main id="main-content" className="lg:ml-64 pt-28 pb-12 px-6 md:px-12 max-w-5xl">

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold font-headline tracking-tighter text-on-background mb-3">
            Sharing & <span className="text-primary">Access</span>.
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg">Control who can view your portfolio and manage secure links for external reviewers.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Portfolio Link */}
            <div className="bg-white rounded-2xl p-8 ghost-shadow border border-zinc-100">
              <h2 className="text-lg font-bold font-headline mb-1">Your Portfolio Link</h2>
              <p className="text-xs text-zinc-500 mb-6">Share this link with faculty, employers, or external reviewers.</p>
              <div className="flex items-center bg-surface-container-low rounded-xl p-2 pl-5 gap-3">
                <span className="material-symbols-outlined text-zinc-500 text-sm" aria-hidden="true">link</span>
                <span className="text-sm text-zinc-600 font-medium flex-1 truncate">cardinalchoice.edu/p/chen-alex-2024</span>
                <button
                  onClick={handleCopy}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${linkCopied ? 'bg-green-600 text-white' : 'signature-gradient text-white'}`}
                >
                  {linkCopied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="material-symbols-outlined text-green-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">check_circle</span>
                <span className="text-xs text-green-600 font-bold">Registrar verified — ready to share</span>
              </div>
            </div>

            {/* Privacy Toggles */}
            <div className="bg-white rounded-2xl p-8 ghost-shadow border border-zinc-100">
              <h2 className="text-lg font-bold font-headline mb-6">Privacy Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Portfolio Publicly Visible</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Anyone with the link can view your portfolio</p>
                  </div>
                  <Toggle enabled={portfolioPublic} onToggle={() => setPortfolioPublic(!portfolioPublic)} label="Portfolio publicly visible" />
                </div>
                <div className="h-px bg-zinc-100"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Allow File Downloads</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Viewers can download your submitted documents</p>
                  </div>
                  <Toggle enabled={allowDownload} onToggle={() => setAllowDownload(!allowDownload)} label="Allow file downloads" />
                </div>
                <div className="h-px bg-zinc-100"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Show Contact Button</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Allow viewers to contact you via your portfolio</p>
                  </div>
                  <Toggle enabled={showContact} onToggle={() => setShowContact(!showContact)} label="Show contact button" />
                </div>
              </div>
            </div>

            {/* Secure Links */}
            <div className="bg-white rounded-2xl p-8 ghost-shadow border border-zinc-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold font-headline mb-1">Secure Review Links</h2>
                  <p className="text-xs text-zinc-500">Generate time-limited links for specific reviewers.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 signature-gradient text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-90 transition-opacity">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">add</span> New Link
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Prof. Williams", email: "j.williams@louisville.edu", expires: "Expires in 7 days", active: true },
                  { name: "Deloitte Recruiting", email: "recruiting@deloitte.com", expires: "Expires in 3 days", active: true },
                  { name: "Career Services", email: "careers@louisville.edu", expires: "Expired", active: false },
                ].map((link) => (
                  <div key={link.email} className={`flex items-center justify-between p-4 rounded-xl border ${link.active ? 'bg-zinc-50 border-zinc-100' : 'bg-zinc-50/50 border-zinc-100 opacity-60'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${link.active ? 'bg-primary/10 text-primary' : 'bg-zinc-200 text-zinc-500'}`} aria-hidden="true">
                        {link.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-800">{link.name}</p>
                        <p className="text-xs text-zinc-500">{link.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold uppercase tracking-wide ${link.active ? 'text-green-600' : 'text-zinc-500'}`}>
                        {link.expires}
                      </span>
                      <button aria-label={`More options for ${link.name}`} className="p-1.5 hover:bg-zinc-200 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-zinc-500 text-sm" aria-hidden="true">more_horiz</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail */}
          <aside aria-label="Visibility status and access log" className="space-y-6">

            {/* Visibility Status */}
            <div className={`rounded-2xl p-6 border ${portfolioPublic ? 'bg-green-50 border-green-100' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={`material-symbols-outlined ${portfolioPublic ? 'text-green-600' : 'text-zinc-500'}`} style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                  {portfolioPublic ? 'public' : 'lock'}
                </span>
                <p className={`text-sm font-bold ${portfolioPublic ? 'text-green-800' : 'text-zinc-600'}`}>
                  {portfolioPublic ? 'Portfolio is Public' : 'Portfolio is Private'}
                </p>
              </div>
              <p className={`text-xs leading-relaxed ${portfolioPublic ? 'text-green-700' : 'text-zinc-500'}`}>
                {portfolioPublic
                  ? 'Your portfolio is visible to anyone with the link. Toggle off to restrict access.'
                  : 'Your portfolio is private. Only you and admins can view it.'}
              </p>
            </div>

            {/* Access Log */}
            <div className="bg-white rounded-2xl p-6 ghost-shadow border border-zinc-100">
              <h3 className="text-sm font-bold font-headline uppercase tracking-widest text-zinc-500 mb-5">Recent Access</h3>
              <div className="space-y-4">
                {[
                  { who: "Prof. Williams", when: "2 hours ago", icon: "school" },
                  { who: "Anonymous Viewer", when: "Yesterday", icon: "person" },
                  { who: "Deloitte Recruiting", when: "3 days ago", icon: "business" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-zinc-500 text-sm" aria-hidden="true">{log.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-700">{log.who}</p>
                      <p className="text-xs text-zinc-500">{log.when}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-surface-container-low rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Tips</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5" aria-hidden="true">lightbulb</span>
                  <p className="text-xs text-zinc-600 leading-relaxed">Use secure links for employer sharing — they expire automatically.</p>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5" aria-hidden="true">lightbulb</span>
                  <p className="text-xs text-zinc-600 leading-relaxed">Keep downloads off until your portfolio is fully approved.</p>
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
        <a className="flex flex-col items-center gap-1 text-zinc-500" href="/curriculum">
          <span className="material-symbols-outlined" aria-hidden="true">account_tree</span>
          <span className="text-xs font-bold uppercase tracking-tighter">Timeline</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-zinc-500" href="/uploads">
          <span className="material-symbols-outlined" aria-hidden="true">folder</span>
          <span className="text-xs font-bold uppercase tracking-tighter">Files</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary" href="/sharing" aria-current="page">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">share</span>
          <span className="text-xs font-bold uppercase tracking-tighter">Access</span>
        </a>
      </nav>
    </>
  )
}
