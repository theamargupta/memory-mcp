import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Memory MCP — built by Amar Gupta',
  description:
    'Memory MCP is a dogfooded MCP / AI / full-stack portfolio piece by Amar Gupta. 8 MCP tools, OAuth 2.0 + PKCE, pgvector semantic search, soft-delete-only data model. Read what it demonstrates and how to get in touch.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Memory MCP — built by Amar Gupta',
    description:
      'Open-source MCP server with semantic memory across Claude, Cursor, and Codex. OAuth 2.0 + PKCE, pgvector, Supabase. By Amar Gupta.',
    url: '/about',
    type: 'profile',
  },
}

const DECISIONS = [
  {
    skill: 'MCP server design',
    detail:
      'A single OAuth-protected MCP endpoint at /api/mcp registers 8 tools (save / search / list / get / update / delete / get_rules / get_context). Every tool input is validated with Zod v4. Every call is logged to memory_access_log so abuse and quota questions are answerable from one table.',
  },
  {
    skill: 'OAuth 2.0 + PKCE, hand-rolled',
    detail:
      'Full authorization-code flow with PKCE for public MCP clients — discovery via /.well-known, authorize / consent / callback routes, opaque hashed tokens stored in mcp_oauth_tokens. ~600 lines of protocol code, written against the MCP spec rather than wrapped in a library.',
  },
  {
    skill: 'Semantic search with pgvector',
    detail:
      'Memories carry a vector(384) column populated by a Supabase Edge Function calling gte-small. Search is a PL/pgSQL function (search_memories) — embeddings stay in Postgres, no external vector DB, ranking is one cosine-distance query.',
  },
  {
    skill: 'Postgres + RLS at the boundary',
    detail:
      'RLS on every table — memories, mcp_oauth_clients, mcp_oauth_authorization_codes, mcp_oauth_tokens, memory_access_log. Service-role client is gated behind `import "server-only"` and used only in API routes. Soft-delete-only: is_active flips, rows are never dropped.',
  },
  {
    skill: 'Multi-client MCP surface',
    detail:
      'Claude Code, Claude Chat, Cursor, and Codex all hit the same endpoint. Different transports (HTTP, stdio proxy via the local proxy.ts), one consent screen, one token store. get_context bundles rules + recent memories so an AI tool boots into a project with one round-trip.',
  },
  {
    skill: 'Next.js 16 + App Router discipline',
    detail:
      'Server Components by default, route groups for (auth) / (dashboard) / (marketing), on-demand revalidation via tagged caches. Tailwind v4 with CSS variables, ShadCN UI primitives, Framer Motion for ambient motion — no tailwind.config.ts, the modern way.',
  },
] as const

const SIBLING_PRODUCTS = [
  { name: 'Setu', role: 'Chat relay — browser/mobile/WhatsApp → Claude Code via MCP', href: 'https://setu.devfrend.com' },
  { name: 'Sandesh', role: 'Content publishing — LinkedIn, Threads, Instagram, YouTube', href: 'https://sandesh.devfrend.com' },
  { name: 'Sankalp', role: 'Job-application autopilot — scrape, store, auto-apply', href: 'https://sankalp.devfrend.com' },
  { name: 'Swayam', role: 'Automation routines — scheduled Claude Code wakes', href: 'https://swayam.devfrend.com' },
  { name: 'Sathi', role: 'Personal manager — daily routines, briefings, life ops', href: 'https://sathi.devfrend.com' },
  { name: 'Sutra', role: 'Desktop Electron relay — local MCP, SSE bridge, push dispatch', href: 'https://sutra.devfrend.com' },
  { name: 'project-memory', role: 'Multi-tenant memory/task/code knowledge layer w/ remote MCP', href: 'https://pm.devfrend.com' },
  { name: 'ai-chat-devfrend', role: 'Multi-tenant RAG chatbot platform + embeddable widget', href: 'https://devfrend.com' },
] as const

const SKILLS = [
  'MCP server design',
  'OAuth 2.0 + PKCE',
  'TypeScript / Next.js 16',
  'Supabase + Postgres RLS',
  'pgvector / semantic search',
  'Edge Functions (Deno)',
  'LLM tool calling',
  'Tailwind v4 / ShadCN',
] as const

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-mesh">
      <div className="fixed top-4 left-6 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-[#818cf8] transition-colors px-3 py-1.5 rounded-lg bg-[#0a0a12]/60 backdrop-blur-sm border border-[var(--glass-border)]"
        >
          &larr; Back
        </Link>
      </div>

      <main className="mx-auto w-full max-w-5xl px-6 pt-24 pb-12">
        <section className="space-y-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#818cf8]">
            About this project
          </p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Memory MCP is a portfolio piece, not a startup.
          </h1>
          <p className="max-w-3xl text-base text-[var(--muted-foreground)] md:text-lg leading-relaxed">
            It&apos;s built and dogfooded by Amar Gupta to demonstrate end-to-end ownership of a
            non-trivial MCP server — from the Postgres schema and RLS, through a hand-rolled OAuth
            2.0 + PKCE flow, to a semantic-search pipeline running on pgvector, to a Next.js 16
            dashboard that lets you author rules and project context. Open source, MIT licensed,
            self-hostable, also runs hosted at mcp.devfrend.com.
          </p>
        </section>
      </main>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl p-6 md:p-8">
          <div className="flex items-start gap-5">
            <div
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[#12121e] font-mono text-base text-[#818cf8]"
            >
              AG
            </div>
            <div className="space-y-1.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#818cf8]">
                About the builder
              </p>
              <h2 className="text-xl font-heading font-bold text-white md:text-2xl">Amar Gupta</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                AI-powered full-stack engineer &middot; 7+ years &middot; building agent-native software
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-foreground/80 md:text-base">
            Memory MCP is part of an eight-product portfolio of dogfooded apps that share
            infrastructure: a custom MCP fabric, Supabase with RLS, channel-based wakes, a desktop
            Electron relay, and a multi-tenant memory layer. I built every layer here — the
            protocol code, the OAuth broker, the embeddings pipeline, the dashboard, and the
            Claude Code integration that makes the system actually do work.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]/70">
                Currently building
              </p>
              <p className="mt-1 text-sm text-foreground/80">
                Memory MCP, Setu (chat relay), Sandesh (publishing), Sankalp (job autopilot),
                Swayam (automation), Sathi (personal manager), Sutra (desktop relay).
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]/70">
                Open to
              </p>
              <p className="mt-1 text-sm text-foreground/80">
                Senior / staff full-stack &middot; AI eng &middot; MCP and agent infra roles.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[var(--glass-border)] px-2.5 py-1 font-mono text-[10px] text-[var(--muted-foreground)]"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://amargupta.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--glass-border)] px-4 py-2 font-mono text-xs text-white hover:border-[#6366f1]/40 hover:text-[#818cf8] transition-colors"
            >
              amargupta.tech &rarr;
            </a>
            <a
              href="https://www.linkedin.com/in/theamargupta/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--glass-border)] px-4 py-2 font-mono text-xs text-white hover:border-[#6366f1]/40 hover:text-[#818cf8] transition-colors"
            >
              LinkedIn &rarr;
            </a>
            <a
              href="https://github.com/theamargupta"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--glass-border)] px-4 py-2 font-mono text-xs text-white hover:border-[#6366f1]/40 hover:text-[#818cf8] transition-colors"
            >
              GitHub &rarr;
            </a>
            <a
              href="mailto:theamargupta.tech@gmail.com"
              className="rounded-full border border-[var(--glass-border)] px-4 py-2 font-mono text-xs text-white hover:border-[#6366f1]/40 hover:text-[#818cf8] transition-colors"
            >
              Email &rarr;
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl space-y-6 px-6 py-12">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#818cf8]">
            What Memory MCP demonstrates
          </p>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Six skills, one running system.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {DECISIONS.map((item, index) => (
            <div
              key={item.skill}
              className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl p-5"
            >
              <p className="font-mono text-[11px] text-[#818cf8]">{`0${index + 1}`}</p>
              <p className="mt-1 text-base text-white">{item.skill}</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl space-y-6 px-6 py-12">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#818cf8]">
            Architecture
          </p>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            The system, end-to-end.
          </h2>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[var(--glass-border)] bg-[#0c0c18]/80 backdrop-blur-xl p-5 shadow-2xl shadow-[#6366f1]/5">
          <pre className="min-w-[640px] font-mono text-[11px] leading-[1.55] text-foreground/70 md:text-[12px]">
{`┌──────────────────────┐     OAuth (PKCE)     ┌────────────────────┐
│  Claude / Cursor /   │ ───────────────────▶ │  /oauth/authorize  │
│  Codex (MCP client)  │ ◀─── access token ── │  /oauth/callback   │
└──────────┬───────────┘                       └─────────┬──────────┘
           │                                             │
           │ POST /api/mcp  (Bearer <opaque-hash>)       │
           ▼                                             ▼
   ┌────────────────────┐                       ┌─────────────────┐
   │  MCP server (8     │                       │ mcp_oauth_*     │
   │  tools, Zod, log)  │                       │  tables (RLS)   │
   └─────────┬──────────┘                       └─────────────────┘
             │
             │ save / search / list / get_rules / get_context ...
             ▼
   ┌────────────────────────────────────────────┐
   │                Supabase                    │
   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
   │  │ memories │  │ access_  │  │ Edge Fn  │  │
   │  │ + vector │  │   log    │  │ (embed)  │  │
   │  └────┬─────┘  └──────────┘  └────┬─────┘  │
   │       │ pgvector cosine            │        │
   │       └────────────────────────────┘        │
   └─────────────────────────────────────────────┘
                  ▲
                  │  REST CRUD (dashboard) + on-demand revalidation
   ┌──────────────┴───────────────┐
   │  Next.js 16 dashboard        │
   │  /memories /rules /projects  │
   └──────────────────────────────┘`}
          </pre>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl space-y-6 px-6 py-12">
        <div className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#818cf8]">
            Sibling products
          </p>
          <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
            Memory MCP is one of eight.
          </h2>
          <p className="max-w-3xl text-sm text-[var(--muted-foreground)] md:text-base leading-relaxed">
            The portfolio is a working ecosystem of MCP-driven products that share infrastructure
            and dogfood each other. Memory MCP is the knowledge layer underneath the rest — what
            every AI tool reads from when it needs to remember who you are.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {SIBLING_PRODUCTS.map((product) => (
            <a
              key={product.name}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl p-5 hover:border-[#6366f1]/30 transition-colors"
            >
              <p className="text-base text-white group-hover:text-[#818cf8] transition-colors">
                {product.name}
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{product.role}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] backdrop-blur-xl p-8 text-center md:p-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#818cf8]">Hiring?</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">
            I&apos;m open to senior / staff roles.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted-foreground)] md:text-base leading-relaxed">
            Full-stack, AI eng, MCP / agent infra. Happy to walk a hiring panel through any layer
            of this system live — the OAuth broker, the embeddings pipeline, the RLS surface, or
            the Claude Code integration that makes it actually work.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:theamargupta.tech@gmail.com?subject=Memory%20MCP%20%E2%80%94%20hiring%20conversation"
              className="rounded-full bg-[#6366f1] px-5 py-2.5 font-mono text-xs text-white hover:bg-[#818cf8] transition-colors glow-primary"
            >
              Email Amar &rarr;
            </a>
            <a
              href="https://amargupta.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--glass-border)] px-5 py-2.5 font-mono text-xs text-white hover:border-[#6366f1]/40 transition-colors"
            >
              amargupta.tech &rarr;
            </a>
            <a
              href="https://www.linkedin.com/in/theamargupta/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--glass-border)] px-5 py-2.5 font-mono text-xs text-white hover:border-[#6366f1]/40 transition-colors"
            >
              LinkedIn &rarr;
            </a>
            <a
              href="https://github.com/theamargupta"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[var(--glass-border)] px-5 py-2.5 font-mono text-xs text-white hover:border-[#6366f1]/40 transition-colors"
            >
              GitHub &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
