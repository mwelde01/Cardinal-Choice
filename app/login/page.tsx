'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    console.log('Auth result:', { data, error })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    console.log('Profile result:', { profile, profileError })

    if (profile?.role === 'admin') {
  window.location.href = '/admin/submissions'
} else {
  window.location.href = '/dashboard'
}
}
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-full max-w-md px-6">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold font-headline tracking-tighter text-primary uppercase">
            Cardinal Choice
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-body">MBA Portfolio Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl ghost-shadow border border-outline-variant/20 p-10">
          <h2 className="text-xl font-bold font-headline tracking-tight text-on-surface mb-8">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-outline-variant rounded-lg px-4 py-3 text-sm font-body text-on-surface bg-surface-container-low focus:outline-none focus:border-primary transition-colors"
                placeholder="you@louisville.edu"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-outline-variant rounded-lg px-4 py-3 text-sm font-body text-on-surface bg-surface-container-low focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
                <span className="material-symbols-outlined text-error text-sm">error</span>
                <p className="text-error text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full signature-gradient text-white py-3 rounded-lg font-bold text-sm font-headline tracking-wide shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-zinc-400 mt-8 uppercase tracking-widest">
          University of Louisville — MBA Program
        </p>
      </div>
    </main>
  )
}
