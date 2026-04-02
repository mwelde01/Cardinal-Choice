'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'
import { supabase } from '@/lib/supabase'

const avatarColors = [
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-purple-100 text-purple-800',
  'bg-amber-100 text-amber-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
  'bg-indigo-100 text-indigo-800',
  'bg-orange-100 text-orange-800',
  'bg-cyan-100 text-cyan-800',
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function SubmissionsConsolePage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Submissions Console — Cardinal Choice'
    async function fetchSubmissions() {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          id,
          status,
          submitted_at,
          student:profiles!student_id(full_name, mba_track),
          milestone:milestones!milestone_id(
            title,
            course:courses!course_id(code)
          )
        `)
        .order('submitted_at', { ascending: false })

      if (!error && data) {
        setSubmissions(data)
      }
      setLoading(false)
    }
    fetchSubmissions()
  }, [])

  const statusStyle = (status: string) => {
    if (status === 'Approved') return 'bg-green-50 text-green-700 border-green-100'
    if (status === 'Pending Review') return 'bg-red-50 text-red-800 border-red-100'
    return 'bg-amber-50 text-amber-600 border-amber-100'
  }

  const statusDot = (status: string) => {
    if (status === 'Approved') return 'bg-green-500'
    if (status === 'Pending Review') return 'bg-red-600'
    return 'bg-amber-500'
  }

  return (
    <>
      {/* Top Navigation */}
      <nav aria-label="Primary navigation" className="fixed top-0 left-0 w-full flex justify-between items-center px-8 h-16 z-50 bg-white/60 backdrop-blur-md shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-headline font-extrabold tracking-tighter text-red-800">Submission Management</span>
          <div className="hidden md:flex gap-6">
            <a className="text-zinc-500 font-medium hover:text-red-700 transition-colors text-sm" href="/dashboard">Dashboard</a>
            <a className="text-red-800 font-bold border-b-2 border-red-800 pb-1 text-sm" href="/admin/submissions" aria-current="page">Submissions</a>
            <a className="text-zinc-500 font-medium hover:text-red-700 transition-colors text-sm" href="#">Analytics</a>
            <a className="text-zinc-500 font-medium hover:text-red-700 transition-colors text-sm" href="#">Settings</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="View notifications" className="p-2 text-zinc-600 hover:bg-zinc-100/50 rounded-full transition-all">
            <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
          </button>
          <button aria-label="Help and resources" className="p-2 text-zinc-600 hover:bg-zinc-100/50 rounded-full transition-all">
            <span className="material-symbols-outlined" aria-hidden="true">help_outline</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ml-2" aria-hidden="true">
            AD
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-800 transition-colors">
            <span className="material-symbols-outlined text-lg" aria-hidden="true">logout</span> Sign Out
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <aside aria-label="Admin navigation" className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-16 bg-zinc-50 border-r border-zinc-100 z-40">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-red-900 flex items-center justify-center text-white" aria-hidden="true">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <p className="text-sm font-black text-red-900 tracking-wide uppercase">Console</p>
              <p className="text-xs text-zinc-500">Management</p>
            </div>
          </div>
          <nav aria-label="Admin sidebar navigation" className="space-y-1">
            <a className="flex items-center gap-3 bg-white text-red-800 font-bold rounded-lg shadow-sm px-4 py-3 hover:translate-x-1 transition-transform text-sm" href="/admin/submissions" aria-current="page">
              <span className="material-symbols-outlined" aria-hidden="true">list_alt</span> All Submissions
            </a>
            <a className="flex items-center gap-3 text-zinc-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all hover:translate-x-1 text-sm" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">pending_actions</span> Pending Review
            </a>
            <a className="flex items-center gap-3 text-zinc-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all hover:translate-x-1 text-sm" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span> Approved
            </a>
            <a className="flex items-center gap-3 text-zinc-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all hover:translate-x-1 text-sm" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">report_problem</span> Flagged
            </a>
            <a className="flex items-center gap-3 text-zinc-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all hover:translate-x-1 text-sm" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">archive</span> Archived
            </a>
          </nav>
          <div className="mt-12">
            <button className="w-full py-3 px-4 signature-gradient text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
              Export Report
            </button>
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-zinc-200/50">
          <a className="flex items-center gap-3 text-zinc-600 hover:text-red-700 px-4 py-3 rounded-lg transition-all text-sm" href="#">
            <span className="material-symbols-outlined" aria-hidden="true">contact_support</span> Help Center
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="lg:ml-64 pt-24 px-8 pb-12 min-h-screen">

        {/* Header & Stats */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Submissions Console</h1>
              <p className="text-zinc-500 max-w-lg text-sm">Manage the Cardinal Choice Portfolio pipeline. Review student work, track milestones, and maintain academic excellence across all tracks.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex flex-col items-center min-w-[120px]">
                <span className="text-3xl font-headline font-extrabold text-red-800">124</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Total</span>
              </div>
              <div className="px-6 py-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex flex-col items-center min-w-[120px]">
                <span className="text-3xl font-headline font-extrabold text-amber-600">15</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Pending</span>
              </div>
              <div className="px-6 py-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex flex-col items-center min-w-[120px]">
                <span className="text-3xl font-headline font-extrabold text-green-700">42</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Approved</span>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <section aria-label="Submission filters" className="mb-8 p-6 bg-surface-container-low rounded-2xl flex flex-col xl:flex-row items-center gap-6">
          <div className="relative w-full xl:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/20 text-sm"
              placeholder="Search by student name or ID..."
              type="text"
              aria-label="Search submissions by student name or ID"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <label htmlFor="filter-milestone" className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Milestone:</label>
              <select id="filter-milestone" className="bg-white border border-zinc-200 rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800/20 cursor-pointer">
                <option>All Courses</option>
                <option>MBA 625</option>
                <option>MBA 626</option>
                <option>MBA 628</option>
                <option>MBA 630</option>
                <option>MBA 631</option>
                <option>MBA 632</option>
                <option>MBA 635</option>
                <option>MBA 640</option>
                <option>MBA 655</option>
                <option>MBA 656</option>
                <option>MBA 668</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-track" className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Track:</label>
              <select id="filter-track" className="bg-white border border-zinc-200 rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800/20 cursor-pointer">
                <option>All Tracks</option>
                <option>Career</option>
                <option>Industry</option>
                <option>Issue</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-status" className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Status:</label>
              <select id="filter-status" className="bg-white border border-zinc-200 rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800/20 cursor-pointer">
                <option>All Statuses</option>
                <option>Approved</option>
                <option>Pending Review</option>
                <option>Submitted</option>
              </select>
            </div>
            <button className="ml-auto flex items-center gap-2 text-red-800 font-bold text-sm hover:underline">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">filter_list</span> Clear All
            </button>
          </div>
        </section>

        {/* Table */}
        <section aria-label="Submissions table">
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)] border border-zinc-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th scope="col" className="py-5 px-8 text-xs font-black text-zinc-500 uppercase tracking-widest">Student</th>
                    <th scope="col" className="py-5 px-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Milestone</th>
                    <th scope="col" className="py-5 px-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Track</th>
                    <th scope="col" className="py-5 px-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Submitted</th>
                    <th scope="col" className="py-5 px-6 text-xs font-black text-zinc-500 uppercase tracking-widest">Status</th>
                    <th scope="col" className="py-5 px-8 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {loading ? (
                    <tr><td colSpan={6} className="py-12 text-center text-zinc-500 text-sm">Loading submissions...</td></tr>
                  ) : submissions.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-zinc-500 text-sm">No submissions found.</td></tr>
                  ) : submissions.map((s, i) => (
                    <tr key={s.id} className="hover:bg-surface-bright transition-colors group">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center font-bold text-sm flex-shrink-0`} aria-hidden="true">
                            {getInitials(s.student?.full_name ?? '?')}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 text-sm">{s.student?.full_name ?? 'Unknown'}</p>
                            <p className="text-xs text-zinc-500">ID: {s.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-sm font-medium text-zinc-700">{s.milestone?.course?.code ?? '—'}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600">{s.student?.mba_track ?? '—'}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-sm text-zinc-500">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : '—'}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle(s.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot(s.status)}`} aria-hidden="true"></span>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a href={`/admin/review?id=${s.id}`} className="text-sm font-bold text-red-800 hover:text-red-900">View Details</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-8 flex items-center justify-between border-t border-zinc-100">
              <p className="text-sm text-zinc-500 font-medium">Showing <span className="text-zinc-900">1–10</span> of <span className="text-zinc-900">124</span> submissions</p>
              <div className="flex items-center gap-2">
                <button aria-label="Previous page" className="p-2 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-800 text-white font-bold text-sm" aria-current="page" aria-label="Page 1">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 font-medium text-zinc-600 text-sm" aria-label="Page 2">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 font-medium text-zinc-600 text-sm" aria-label="Page 3">3</button>
                  <span className="mx-2 text-zinc-300" aria-hidden="true">…</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-100 font-medium text-zinc-600 text-sm" aria-label="Page 13">13</button>
                </div>
                <button aria-label="Next page" className="p-2 border border-zinc-100 rounded-lg hover:bg-zinc-50 transition-colors">
                  <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Insights */}
        <section aria-label="Submission insights" className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-900 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-headline font-bold mb-3">Submission Review Guidelines</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">Ensure all portfolios meet the 2024 academic standards. Review the new rubric for the Issue track before providing feedback.</p>
              <button className="px-6 py-2.5 bg-white text-zinc-900 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors">Download Rubric (PDF)</button>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-red-900/20 rounded-full blur-3xl group-hover:bg-red-900/30 transition-all" aria-hidden="true"></div>
          </div>
          <div className="p-8 rounded-3xl bg-red-50 border border-red-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-red-800 flex-shrink-0">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">trending_up</span>
            </div>
            <div>
              <h3 className="text-lg font-headline font-bold text-red-950">Approvals are up 12%</h3>
              <p className="text-red-800/70 text-sm leading-relaxed">Students are completing milestones faster this semester. Keep up the review momentum.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button aria-label="Add new item" className="fixed bottom-8 right-8 w-16 h-16 rounded-full signature-gradient text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50">
        <span className="material-symbols-outlined text-3xl" aria-hidden="true">add</span>
      </button>
    </>
  )
}
