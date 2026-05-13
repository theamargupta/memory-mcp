import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memory MCP sign-in is invite-only',
  description:
    'Memory MCP is a dogfooded portfolio piece by Amar Gupta. Sign-in is invite-only. See the architecture, watch the demo, or request access.',
  alternates: { canonical: '/login' },
  robots: { index: true, follow: true },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-mesh">
      <div
        aria-hidden
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#6366f1]/8 blur-[120px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#22d3ee]/5 blur-[100px] pointer-events-none"
      />

      <div className="w-full max-w-[560px] relative z-10">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
            <span className="text-white font-bold text-sm font-mono">M</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">Memory MCP</span>
        </div>

        <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-2xl p-7 shadow-2xl shadow-black/20">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#818cf8]">
            Invite-only
          </p>
          <h1 className="mt-2 text-[22px] font-heading font-bold tracking-[-0.01em]">
            Sign-in is closed by design.
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-[var(--muted-foreground)]">
            Memory MCP is part of{' '}
            <Link
              href="https://amargupta.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline decoration-[#6366f1] decoration-2 underline-offset-4 hover:text-[#818cf8]"
            >
              Amar Gupta&apos;s
            </Link>{' '}
            portfolio &mdash; a dogfooded MCP server giving Claude, Cursor, and
            Codex a shared semantically-searchable memory. Built on real OpenAI
            embeddings, OAuth 2.0 + PKCE, and live Supabase pgvector
            infrastructure. Public access would leak secrets and rate-limit the
            apps demoed to recruiters, so the gate stays on.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            <Link
              href="/"
              className="rounded-xl border border-[var(--glass-border)] bg-white/[0.03] px-4 py-2.5 text-center text-[13px] text-foreground hover:border-[#6366f1]/40"
            >
              See the architecture &rarr;
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-[var(--glass-border)] bg-white/[0.03] px-4 py-2.5 text-center text-[13px] text-foreground hover:border-[#6366f1]/40"
            >
              About the builder &rarr;
            </Link>
            <Link
              href="https://amargupta.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[var(--glass-border)] bg-white/[0.03] px-4 py-2.5 text-center text-[13px] text-foreground hover:border-[#6366f1]/40"
            >
              Portfolio site &rarr;
            </Link>
            <Link
              href="mailto:theamargupta.tech@gmail.com?subject=Memory%20MCP%20demo%20access%20request"
              className="rounded-xl bg-[#6366f1] px-4 py-2.5 text-center text-[13px] font-medium text-white hover:bg-[#818cf8] glow-primary"
            >
              Request demo access &rarr;
            </Link>
          </div>

          <div className="mt-8 border-t border-[var(--glass-border)] pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]/60">
              What Memory MCP is
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted-foreground)]">
              An open-source MCP server giving any agent (Claude, Cursor, Codex)
              a shared, semantically-searchable memory store. 8 MCP tools, OAuth
              2.0 + PKCE, pgvector embeddings via Supabase Edge Function
              (gte-small, 384-dim), soft-delete-only model. Used by Sutra to
              index project history for cross-session continuity.
            </p>
          </div>

          <p className="mt-6 text-center text-[12px] text-[var(--muted-foreground)]/60">
            Operator?{' '}
            <Link
              href="/admin/login"
              className="text-[#818cf8] underline-offset-2 hover:underline"
            >
              Admin sign-in
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-[var(--muted-foreground)]/50 mt-6 font-mono flex items-center justify-center gap-1.5">
          <span aria-hidden className="h-1 w-1 rounded-full bg-[#34d399]/50" />
          Built by Amar Gupta · portfolio piece
        </p>
      </div>
    </div>
  )
}
