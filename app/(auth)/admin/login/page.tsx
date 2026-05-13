'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  )
}

function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/memories'

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    window.location.href = next
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-mesh">
      <div
        aria-hidden
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#6366f1]/8 blur-[120px] pointer-events-none"
      />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
            <span className="text-white font-bold text-sm font-mono">M</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">Memory MCP</span>
        </div>

        <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-2xl p-7 space-y-6 shadow-2xl shadow-black/20">
          <div className="text-center space-y-1.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#818cf8]">
              Admin
            </p>
            <h1 className="text-xl font-heading font-bold">Sign in</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Operator access only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm text-foreground placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm text-foreground placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
              />
            </div>

            {error && (
              <div className="text-sm text-[#f87171] bg-[#f87171]/10 rounded-xl px-3.5 py-2.5 border border-[#f87171]/20">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-[#6366f1] text-white text-sm font-semibold hover:bg-[#818cf8] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed glow-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Loading...
                </>
              ) : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
