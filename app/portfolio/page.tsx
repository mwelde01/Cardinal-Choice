'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'
import { supabase } from '@/lib/supabase'

const milestones = [
  { code: "MBA 625", title: "Managerial Economics & Strategy", description: "Comparative analysis of pricing strategies in competitive markets.", fileType: "PDF", fileIcon: "picture_as_pdf" },
  { code: "MBA 626", title: "Business Intelligence", description: "Interactive dashboard development for consumer behavioral data.", fileType: "Word Doc", fileIcon: "description" },
  { code: "MBA 628", title: "Digital Leadership", description: "Podcast presentation on remote team management frameworks.", fileType: "MP3", fileIcon: "mic" },
  { code: "MBA 630", title: "Accounting for Decisions", description: "Financial health audit of a publicly traded manufacturing firm.", fileType: "PDF", fileIcon: "picture_as_pdf" },
  { code: "MBA 631", title: "Corporate Finance", description: "Capital budgeting and risk assessment for infrastructure projects.", fileType: "Word Doc", fileIcon: "description" },
  { code: "MBA 632", title: "Marketing Management", description: "Brand positioning strategy for a luxury automotive startup.", fileType: "PDF", fileIcon: "picture_as_pdf" },
  { code: "MBA 635", title: "Operations & Logistics", description: "Lean Six Sigma implementation plan for hospital administration.", fileType: "Word Doc", fileIcon: "description" },
  { code: "MBA 640", title: "Talent Management", description: "Executive summary of DE&I metrics in tech sector hiring.", fileType: "PDF", fileIcon: "picture_as_pdf" },
  { code: "MBA 655", title: "Strategic Communication", description: "Crisis communication simulation and stakeholder management.", fileType: "MP3", fileIcon: "mic" },
  { code: "MBA 656", title: "Ethical Enterprise", description: "Critical analysis of corporate social responsibility frameworks.", fileType: "PDF", fileIcon: "picture_as_pdf" },
  { code: "MBA 668", title: "Applied Strategy", description: "Business simulation retrospective and future growth forecasting.", fileType: "Word Doc", fileIcon: "description" },
]

export default function PortfolioPage() {
  const [profile, setProfile] = useState<{ full_name: string; mba_track: string } | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('full_name, mba_track')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data)
    }
    fetchProfile()
  }, [])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Julian'
  const lastName = profile?.full_name?.split(' ')[1] ?? 'Vance'

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-outline">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-xl font-extrabold tracking-tighter text-primary uppercase font-headline">Cardinal Choice</span>
            <div className="hidden md:flex items-center gap-6">
              <a className="text-zinc-400 hover:text-primary transition-colors font-headline tracking-tight text-sm font-semibold" href="/dashboard">Dashboard</a>
              <a className="text-zinc-400 hover:text-primary transition-colors font-headline tracking-tight text-sm font-semibold" href="/uploads">Materials</a>
              <a className="text-primary border-b-2 border-primary pb-1 font-headline tracking-tight text-sm font-semibold" href="#">Public Portfolio</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-100 rounded-md transition-all">
              <span className="material-symbols-outlined text-zinc-600">notifications</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              AC
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 pt-20 bg-zinc-50 border-r border-outline flex-col p-4 gap-2 z-40">
        <div className="mb-8 px-2">
          <h2 className="font-headline font-black text-primary text-lg">Portfolio View</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Industry Track</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-white hover:text-primary transition-all text-sm font-semibold rounded-lg" href="/dashboard">
            <span className="material-symbols-outlined">dashboard</span> Overview
          </a>
          <a className="flex items-center gap-3 px-3 py-2 bg-white text-primary shadow-sm border border-outline rounded-lg transition-all text-sm font-bold" href="#">
            <span className="material-symbols-outlined">visibility</span> Public Preview
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-white hover:text-primary transition-all text-sm font-semibold rounded-lg" href="/sharing">
            <span className="material-symbols-outlined">share</span> Share Link
          </a>
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-outline pt-4">
          <button className="bg-gradient-to-br from-primary to-primary-container text-white py-3 px-4 rounded-xl text-sm font-bold mb-4 shadow-lg hover:opacity-90 transition-opacity">
            Submit for Review
          </button>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 text-zinc-600 hover:bg-zinc-100 transition-all text-sm font-medium rounded-lg w-full">
            <span className="material-symbols-outlined">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-12">

          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 border-b border-outline pb-20">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#FEBE10] px-3 py-1 rounded text-[10px] font-black text-[#261900] uppercase tracking-widest">Industry Track Candidate</span>
                <span className="text-zinc-300">|</span>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Class of 2024</span>
              </div>
              <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background mb-6 leading-none">
                {firstName} <span className="text-primary">{lastName}</span>
              </h1>
              <p className="text-zinc-600 leading-relaxed text-lg max-w-2xl mb-8">
                An MBA candidate specializing in operational excellence and organizational strategy. This portfolio documents my progression through the Cardinal Choice curriculum, culminating in a data-driven Industry White Paper on sustainable supply chain frameworks.
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-4 rounded-full font-bold text-sm shadow-xl hover:scale-[0.98] transition-all">
                  View Full Portfolio
                </button>
                <button className="flex items-center gap-2 px-8 py-4 border-2 border-outline rounded-full font-bold text-sm hover:bg-zinc-50 transition-colors">
                  <span className="material-symbols-outlined text-sm">mail</span> Contact Candidate
                </button>
              </div>
            </div>
            <div className="lg:col-span-4 relative">
              <div className="aspect-square bg-zinc-100 rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl relative z-10 flex items-center justify-center">
                <span className="font-headline font-black text-8xl text-zinc-300">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-[#FEBE10] rounded-full flex flex-col items-center justify-center shadow-xl z-20 border-4 border-white">
                <span className="font-headline font-black text-3xl text-[#261900]">100%</span>
                <span className="text-[8px] font-bold uppercase text-[#261900]/70 tracking-widest">Complete</span>
              </div>
            </div>
          </section>

          {/* Final Deliverable */}
          <section className="mb-24">
            <div className="bg-primary p-1 rounded-[3rem] shadow-2xl">
              <div className="bg-white rounded-[2.8rem] p-10 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEBE10]/10 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[#FEBE10]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Capstone Milestone</span>
                    </div>
                    <h2 className="font-headline text-4xl md:text-5xl font-black mb-6 leading-tight">Industry White Paper</h2>
                    <p className="text-zinc-500 mb-8 text-lg leading-relaxed">
                      <strong>Topic:</strong> Strategic Resilience in Global Distribution Networks.<br />
                      A 45-page comprehensive analysis investigating the integration of IoT and predictive analytics in mid-market logistics.
                    </p>
                    <button className="bg-gradient-to-br from-primary to-primary-container text-white px-10 py-5 rounded-2xl font-black text-base shadow-lg transition-all flex items-center gap-3 hover:opacity-90">
                      <span className="material-symbols-outlined">description</span>
                      Download Full Deliverable
                    </button>
                  </div>
                  <div className="w-full md:w-1/3 aspect-[3/4] bg-zinc-50 rounded-2xl border-4 border-outline flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-6xl text-zinc-300 group-hover:text-primary mb-4 transition-colors">article</span>
                    <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest group-hover:text-primary transition-colors">Final Version Published<br />March 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Milestones Grid */}
          <section className="mb-24">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
              <div>
                <h2 className="font-headline text-3xl font-black text-on-background tracking-tight">Core Curriculum Milestones</h2>
                <p className="text-zinc-500 font-medium mt-1">11 verified course submissions from the Cardinal Choice MBA program.</p>
              </div>
              <div className="h-[2px] flex-1 bg-outline mx-8 hidden md:block"></div>
              <span className="text-primary font-bold text-sm bg-primary/5 px-4 py-1 rounded-full">11 Deliverables</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((m) => (
                <div key={m.code} className="bg-zinc-50 border border-outline p-6 rounded-[2rem] hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-white px-3 py-1.5 rounded-xl border border-outline shadow-sm">
                      <span className="text-primary font-black text-sm tracking-tight">{m.code}</span>
                    </div>
                    <span className="material-symbols-outlined text-zinc-300 group-hover:text-[#FEBE10] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg mb-4 leading-snug group-hover:text-primary transition-colors">{m.title}</h3>
                  <p className="text-zinc-500 text-sm mb-8 flex-grow">{m.description}</p>
                  <a className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-outline group-hover:border-primary transition-colors" href="#">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">{m.fileIcon}</span>
                      <span className="text-xs font-bold text-zinc-600">View {m.fileType}</span>
                    </div>
                    <span className="material-symbols-outlined text-zinc-300 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Share & Verification */}
          <section className="bg-white rounded-[3rem] p-12 border border-outline shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-primary/10 font-black text-8xl leading-none">{lastName}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="font-headline text-3xl font-black mb-4">Official Portfolio Link</h2>
                <p className="text-zinc-500 text-sm mb-8 font-medium">This verified link is formatted for professional sharing with faculty and hiring managers.</p>
                <div className="flex items-center bg-zinc-50 border border-outline rounded-2xl p-2 pl-6">
                  <span className="text-zinc-400 text-sm truncate flex-1 font-semibold">{`cardinalchoice.edu/p/${lastName.toLowerCase()}-${firstName.toLowerCase()}-2024`}</span>
                  <button className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:opacity-90 transition-all">Copy Link</button>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-5 bg-zinc-50 border border-outline rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white border border-outline flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                      <p className="text-sm font-black">Registrar Verified</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Cardinal Choice Curriculum</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-zinc-50 border border-outline rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white border border-outline flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined">badge</span>
                    </div>
                    <div>
                      <p className="text-sm font-black">Professional Identity</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Authentication Confirmed</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-24 pt-12 border-t border-outline flex flex-col md:flex-row justify-between items-center gap-6 pb-12">
            <div className="flex items-center gap-2">
              <span className="text-primary font-black text-lg tracking-tighter">CARDINAL CHOICE</span>
              <span className="text-zinc-300 h-4 w-[1px] bg-zinc-300 mx-2"></span>
              <span className="text-zinc-400 text-[10px] uppercase font-black tracking-[0.2em]">Academic Portfolio v4.0</span>
            </div>
            <div className="flex gap-8">
              <a className="text-[10px] font-black text-zinc-400 hover:text-primary uppercase tracking-widest transition-colors" href="#">Privacy Policy</a>
              <a className="text-[10px] font-black text-zinc-400 hover:text-primary uppercase tracking-widest transition-colors" href="#">System Status</a>
              <a className="text-[10px] font-black text-zinc-400 hover:text-primary uppercase tracking-widest transition-colors" href="#">Support</a>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}
