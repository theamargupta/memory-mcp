'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/memories'

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for a confirmation link.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        window.location.href = next
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-mesh">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#6366f1]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#22d3ee]/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
            <span className="text-white font-bold text-sm font-mono">M</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">Memory MCP</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-2xl p-7 space-y-6 shadow-2xl shadow-black/20">
          <div className="text-center space-y-1.5">
            <h1 className="text-xl font-heading font-bold">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {isSignUp ? 'Start building your AI knowledge layer' : 'Sign in to your memory bank'}
            </p>
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
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm text-foreground placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
              />
            </div>

            {error && (
              <div className="text-sm text-[#f87171] bg-[#f87171]/10 rounded-xl px-3.5 py-2.5 border border-[#f87171]/20">{error}</div>
            )}
            {message && (
              <div className="text-sm text-[#34d399] bg-[#34d399]/10 rounded-xl px-3.5 py-2.5 border border-[#34d399]/20">{message}</div>
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
              ) : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-[var(--muted-foreground)] hover:text-foreground transition-colors"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setMessage(null)
              }}
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span className="text-[#818cf8] font-medium">
                {isSignUp ? 'Sign in' : 'Sign up'}
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-[var(--muted-foreground)]/50 mt-6 font-mono flex items-center justify-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-[#34d399]/50" />
          Your data stays in your Supabase instance.
        </p>
      </motion.div>
    </div>
  )
}
