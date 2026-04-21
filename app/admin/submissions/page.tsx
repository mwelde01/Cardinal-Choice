'use client'

import { useState, useEffect } from 'react'
import { signOut } from '@/lib/signout'
import { supabase } from '@/lib/supabase'

const PHASES = [
  { num: 1, label: 'Phase 1', subtitle: 'Explore', courses: ['MBA 626', 'MBA 632', 'MBA 631'] },
  { num: 2, label: 'Phase 2', subtitle: 'Develop', courses: ['MBA 628', 'MBA 625', 'MBA 635'] },
  { num: 3, label: 'Phase 3', subtitle: 'Refine', courses: ['MBA 630', 'MBA 640', 'MBA 668'] },
  { num: 4, label: 'Phase 4', subtitle: 'Final', courses: ['MBA 655', 'MBA 656'] },
]

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
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getPhaseStatus(courses: string[], submissions: any[]) {
  const phaseSubs = submissions.filter(s => courses.includes(s.milestone?.course?.code))
  if (phaseSubs.length === 0) return 'not_started'
  if (phaseSubs.every((s: any) => s.status === 'approved')) return 'approved'
  return 'in_review'
}

const statusStyle: Record<string, string> = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  in_review: 'bg-amber-50 text-amber-700 border-amber-200',
  not_started: 'bg-zinc-50 text-zinc-400 border-zinc-200',
}

const statusLabel: Record<string, string> = {
  approved: '✓ Approved',
  in_review: '● In Review',
  not_started: '— Not Started',
}

export default function SubmissionsConsolePage() {
  const [students, setStudents] = useState<any[]>([])
  const [submissionsByStudent, setSubmissionsByStudent] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPhase, setFilterPhase] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    document.title = 'Submissions Console — Cardinal Choice'
    async function fetchData() {
      const { data: studentData } = await supabase
        .from('profiles')
        .select('id, full_name, email, mba_track')
        .eq('role', 'student')
        .order('full_name')

      const { data: submissionData } = await supabase
        .from('submissions')
        .select(`
          id, status, student_id,
          milestone:milestones!milestone_id(
            title,
            course:courses!course_id(code)
          )
        `)

      if (studentData) setStudents(studentData)
      if (submissionData) {
        const grouped: Record<string, any[]> = {}
        submissionData.forEach((s: any) => {
          if (!grouped[s.student_id]) grouped[s.student_id] = []
          grouped[s.student_id].push(s)
        })
        setSubmissionsByStudent(grouped)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredStudents = students.filter(student => {
    if (searchQuery && !student.full_name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    const subs = submissionsByStudent[student.id] || []
    if (filterStatus !== 'all') {
      if (filterPhase !== 'all') {
        const phase = PHASES.find(p => String(p.num) === filterPhase)
        if (phase && getPhaseStatus(phase.courses, subs) !== filterStatus) return false
      } else {
        const hasMatch = PHASES.some(p => getPhaseStatus(p.courses, subs) === filterStatus)
        if (!hasMatch) return false
      }
    }
    return true
  })

  const totalStudents = students.length
  const totalInReview = students.filter(s => PHASES.some(p => getPhaseStatus(p.courses, submissionsByStudent[s.id] || []) === 'in_review')).length
  const totalComplete = students.filter(s => PHASES.every(p => getPhaseStatus(p.courses, submissionsByStudent[s.id] || []) === 'approved')).length

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
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs ml-2" aria-hidden="true">AD</div>
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
              <span className="material-symbols-outlined" aria-hidden="true">groups</span> All Students
            </a>
            <a className="flex items-center gap-3 text-zinc-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all hover:translate-x-1 text-sm" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">pending_actions</span> In Review
            </a>
            <a className="flex items-center gap-3 text-zinc-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg transition-all hover:translate-x-1 text-sm" href="#">
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span> Approved
            </a>
          </nav>
          <div className="mt-12">
            <button className="w-full py-3 px-4 signature-gradient text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
              Export Report
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="lg:ml-64 pt-24 px-8 pb-12 min-h-screen">

        {/* Header & Stats */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Submissions Console</h1>
              <p className="text-zinc-500 max-w-lg text-sm">Monitor student progress across all four portfolio submission phases.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex flex-col items-center min-w-[110px]">
                <span className="text-3xl font-headline font-extrabold text-red-800">{totalStudents}</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Students</span>
              </div>
              <div className="px-6 py-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex flex-col items-center min-w-[110px]">
                <span className="text-3xl font-headline font-extrabold text-amber-600">{totalInReview}</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">In Review</span>
              </div>
              <div className="px-6 py-4 bg-white rounded-xl border border-zinc-100 shadow-sm flex flex-col items-center min-w-[110px]">
                <span className="text-3xl font-headline font-extrabold text-green-700">{totalComplete}</span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Complete</span>
              </div>
            </div>
          </div>
        </header>

        {/* Phase Legend */}
        <div className="mb-6 flex flex-wrap gap-3">
          {PHASES.map(phase => (
            <div key={phase.num} className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-lg shadow-sm text-xs">
              <span className="font-black text-red-800">{phase.label}</span>
              <span className="text-zinc-400">—</span>
              <span className="text-zinc-600">{phase.subtitle}</span>
              <span className="text-zinc-300">({phase.courses.join(', ')})</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <section aria-label="Submission filters" className="mb-8 p-5 bg-surface-container-low rounded-2xl flex flex-col xl:flex-row items-center gap-4">
          <div className="relative w-full xl:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/20 text-sm"
              placeholder="Search by student name..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search by student name"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <label htmlFor="filter-phase" className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Phase:</label>
              <select id="filter-phase" value={filterPhase} onChange={e => setFilterPhase(e.target.value)} className="bg-white border border-zinc-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-800/20 cursor-pointer">
                <option value="all">All Phases</option>
                {PHASES.map(p => <option key={p.num} value={String(p.num)}>{p.label} — {p.subtitle}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-status" className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Status:</label>
              <select id="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white border border-zinc-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-800/20 cursor-pointer">
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="in_review">In Review</option>
                <option value="not_started">Not Started</option>
              </select>
            </div>
            <button onClick={() => { setSearchQuery(''); setFilterPhase('all'); setFilterStatus('all') }} className="ml-auto flex items-center gap-2 text-red-800 font-bold text-sm hover:underline">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">filter_list</span> Clear
            </button>
          </div>
        </section>

        {/* Student Table */}
        <section aria-label="Student submissions table">
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_40px_40px_-10px_rgba(27,27,27,0.04)] border border-zinc-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th scope="col" className="py-5 px-8 text-xs font-black text-zinc-500 uppercase tracking-widest">Student</th>
                    {PHASES.map(phase => (
                      <th key={phase.num} scope="col" className="py-5 px-6 text-xs font-black text-zinc-500 uppercase tracking-widest">
                        <div>{phase.label}</div>
                        <div className="text-zinc-400 font-medium normal-case tracking-normal text-[11px]">{phase.subtitle}</div>
                      </th>
                    ))}
                    <th scope="col" className="py-5 px-8 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {loading ? (
                    <tr><td colSpan={6} className="py-12 text-center text-zinc-500 text-sm">Loading students...</td></tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-zinc-500 text-sm">No students found.</td></tr>
                  ) : filteredStudents.map((student, i) => {
                    const subs = submissionsByStudent[student.id] || []
                    return (
                      <tr key={student.id} className="hover:bg-surface-bright transition-colors group">
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center font-bold text-sm flex-shrink-0`} aria-hidden="true">
                              {getInitials(student.full_name ?? '?')}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 text-sm">{student.full_name}</p>
                              <p className="text-xs text-zinc-500">{student.mba_track ?? '—'} Track</p>
                            </div>
                          </div>
                        </td>
                        {PHASES.map(phase => {
                          const status = getPhaseStatus(phase.courses, subs)
                          return (
                            <td key={phase.num} className="py-5 px-6">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyle[status]}`}>
                                {statusLabel[status]}
                              </span>
                            </td>
                          )
                        })}
                        <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {PHASES.map(phase => (
                              <a
                                key={phase.num}
                                href={`/admin/review?student=${student.id}&phase=${phase.num}`}
                                className="text-xs font-bold text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              >
                                P{phase.num}
                              </a>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
