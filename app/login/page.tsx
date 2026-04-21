'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    document.title = 'Sign In — Cardinal Choice'
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      window.location.href = '/admin/submissions'
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-surface">
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
              <label htmlFor="email" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                University Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full border border-outline-variant rounded-lg px-4 py-3 text-sm font-body text-on-surface bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder="you@louisville.edu"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full border border-outline-variant rounded-lg px-4 py-3 text-sm font-body text-on-surface bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                placeholder="Password"
                required
              />
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 p-3 bg-error-container rounded-lg">
                <span className="material-symbols-outlined text-error text-sm" aria-hidden="true">error</span>
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

        <p className="text-center text-xs text-zinc-500 mt-8 uppercase tracking-widest">
          University of Louisville — MBA Program
        </p>
      </div>
    </main>
  )
}
