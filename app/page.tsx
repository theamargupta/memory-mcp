'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, Search, Shield, FolderOpen, Globe, Server, ArrowRight, Terminal, Sparkles } from 'lucide-react'

const ease: [number, number, number, number] = [0.25, 0.4, 0.25, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
}

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const features = [
  { title: 'Save Memories', desc: 'Rules, preferences, decisions, snippets — stored once, used everywhere.', icon: Brain },
  { title: 'Semantic Search', desc: 'Find by meaning, not keywords. Powered by pgvector embeddings.', icon: Search },
  { title: 'Rules Engine', desc: 'Visual .claude.md manager. Export coding standards as markdown.', icon: Shield },
  { title: 'Project Context', desc: 'Scope memories to projects. One tool call loads everything.', icon: FolderOpen },
  { title: 'Cross-Tool', desc: 'Claude, Cursor, Codex — one endpoint, one OAuth flow, all clients.', icon: Globe },
  { title: 'Self-Hosted', desc: 'Your Supabase, your data, your rules. Open source, MIT licensed.', icon: Server },
]

function CursorIcon(_props: Record<string, unknown>) { return <span className="text-sm font-bold font-mono">{'>_'}</span> }
function CodexIcon(_props: Record<string, unknown>) { return <span className="text-sm font-bold font-mono">{'<>'}</span> }
function KofiIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
    </svg>
  )
}

const clients = [
  {
    name: 'Claude Code',
    icon: Terminal,
    cmd: 'claude mcp add --transport http memory-mcp https://your-domain.com/api/mcp',
  },
  {
    name: 'Claude Chat',
    icon: Sparkles,
    cmd: 'Settings → Connectors → Add Custom Connector',
  },
  {
    name: 'Cursor',
    icon: CursorIcon,
    cmd: '{ "mcpServers": { "memory-mcp": { "type": "http" } } }',
  },
  {
    name: 'Codex',
    icon: CodexIcon,
    cmd: 'codex mcp login memory-mcp',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-mesh">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-[#0a0a12]/70 backdrop-blur-xl border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
            <span className="text-white font-bold text-xs font-mono">M</span>
          </div>
          <span className="font-heading font-semibold text-sm tracking-tight">Memory MCP</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-1.5 rounded-lg bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all active:scale-[0.98] shadow-lg shadow-[#6366f1]/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-14 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#6366f1]/8 blur-[150px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[#22d3ee]/5 blur-[100px] pointer-events-none" />

        <motion.div
          className="max-w-3xl text-center space-y-8 relative z-10"
          initial="hidden"
          animate="visible"
        >
          <motion.div custom={0} variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#818cf8] border border-[#6366f1]/20 rounded-full px-4 py-1.5 mb-6 bg-[#6366f1]/5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6366f1] animate-pulse" />
              Open Source MCP Server
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            className="font-heading text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight"
          >
            Your AI tools
            <br />
            <span className="text-gradient">forget everything.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-lg sm:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto leading-relaxed"
          >
            Store your knowledge once. Every AI tool remembers.
            <br className="hidden sm:block" />
            One MCP endpoint. Full OAuth. Semantic search.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} className="flex flex-col items-center gap-4 pt-2">
            <div className="flex gap-3">
              <Link
                href="/login"
                className="group px-6 py-2.5 rounded-lg bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#818cf8] transition-all active:scale-[0.98] glow-primary flex items-center gap-2"
              >
                Start for Free
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#how"
                className="px-6 py-2.5 rounded-lg border border-[var(--glass-border-hover)] text-sm font-medium text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all"
              >
                How It Works
              </Link>
            </div>
            <a
              href="https://mcp.devfrend.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--muted-foreground)]/60 hover:text-[#818cf8] transition-colors"
            >
              or try the live demo at mcp.devfrend.com &rarr;
            </a>
          </motion.div>

          {/* Terminal preview */}
          <motion.div custom={4} variants={fadeUp} className="pt-8">
            <div className="mx-auto max-w-lg rounded-2xl border border-[var(--glass-border)] bg-[#0c0c18]/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-[#6366f1]/5">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--glass-border)] bg-white/[0.02]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]/60" />
                <span className="ml-2 text-[10px] font-mono text-[var(--muted-foreground)]/50">terminal</span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-relaxed space-y-1">
                <p><span className="text-[#6366f1]">$</span> <span className="text-[var(--muted-foreground)]">claude mcp add --transport http memory-mcp https://mcp.devfrend.com/api/mcp</span></p>
                <p className="text-[var(--muted-foreground)]/50">  Connecting... OAuth consent in browser...</p>
                <p className="text-[#34d399]/80">  Connected to Memory MCP (8 tools available)</p>
                <p className="mt-3"><span className="text-[#6366f1]">$</span> <span className="text-[var(--muted-foreground)]">&quot;What&apos;s my tech stack?&quot;</span></p>
                <p className="text-[var(--muted-foreground)]/50">  <span className="text-[#22d3ee]/70">search_memory</span>({`"`}tech stack{`"`})</p>
                <p className="text-foreground/80">  Next.js 16, Tailwind v4, Supabase, Vercel — <span className="text-[#34d399]">94% match</span></p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Problem / Solution ── */}
      <section className="py-24 px-6 border-t border-[var(--glass-border)]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card space-y-5"
            style={{ borderColor: 'rgba(248,113,113,0.15)' }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#f87171]/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f87171]/60" />
              Without Memory MCP
            </span>
            <div className="space-y-3 text-[15px] text-[var(--muted-foreground)]">
              <p className="flex gap-3 items-start"><span className="text-[#f87171] shrink-0 mt-0.5">&#10005;</span> Repeat your tech stack every session</p>
              <p className="flex gap-3 items-start"><span className="text-[#f87171] shrink-0 mt-0.5">&#10005;</span> Re-explain coding rules to every tool</p>
              <p className="flex gap-3 items-start"><span className="text-[#f87171] shrink-0 mt-0.5">&#10005;</span> Lose project context between conversations</p>
              <p className="flex gap-3 items-start"><span className="text-[#f87171] shrink-0 mt-0.5">&#10005;</span> Different AI tools, different starting points</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card space-y-5"
            style={{ borderColor: 'rgba(52,211,153,0.15)' }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#34d399]/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]/60" />
              With Memory MCP
            </span>
            <div className="space-y-3 text-[15px] text-foreground/80">
              <p className="flex gap-3 items-start"><span className="text-[#34d399] shrink-0 mt-0.5">&#10003;</span> Store once, every tool knows</p>
              <p className="flex gap-3 items-start"><span className="text-[#34d399] shrink-0 mt-0.5">&#10003;</span> Rules loaded automatically via <code className="text-xs bg-[#6366f1]/10 text-[#818cf8] px-1.5 rounded font-mono">get_rules</code></p>
              <p className="flex gap-3 items-start"><span className="text-[#34d399] shrink-0 mt-0.5">&#10003;</span> Full project context in one call</p>
              <p className="flex gap-3 items-start"><span className="text-[#34d399] shrink-0 mt-0.5">&#10003;</span> Same brain across Claude, Cursor, Codex</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Clients ── */}
      <section className="py-16 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-4xl mx-auto">
          <motion.p variants={staggerItem} className="text-center text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--muted-foreground)]/60 mb-10">
            Works with every MCP client
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clients.map((c) => (
              <motion.div
                key={c.name}
                variants={staggerItem}
                className="glass-card text-center flex flex-col items-center gap-3 !p-5"
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--muted-foreground)]">
                  <c.icon size={18} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-[10px] font-mono text-[var(--muted-foreground)]/60 leading-relaxed break-all">{c.cmd}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-24 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-4xl mx-auto">
          <motion.h2
            variants={staggerItem}
            className="font-heading text-3xl sm:text-4xl font-bold text-center mb-16"
          >
            Three steps. That&apos;s it.
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[#6366f1]/30 via-[#22d3ee]/30 to-[#6366f1]/30" />

            {[
              { num: '01', title: 'Store', desc: 'Add memories via dashboard or directly from AI tools. Rules, preferences, project context.' },
              { num: '02', title: 'Connect', desc: 'One command. OAuth handles auth. No API keys, no config files, no friction.' },
              { num: '03', title: 'Recall', desc: 'Your AI tools read memories automatically. Semantic search finds anything by meaning.' },
            ].map((step) => (
              <motion.div
                key={step.num}
                variants={staggerItem}
                className="space-y-4 text-center md:text-left"
              >
                <div className="inline-flex items-center justify-center md:justify-start">
                  <span className="text-5xl font-heading font-extralight text-gradient">{step.num}</span>
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-4xl mx-auto">
          <motion.h2
            variants={staggerItem}
            className="font-heading text-3xl sm:text-4xl font-bold text-center mb-4"
          >
            Built for developers who ship.
          </motion.h2>
          <motion.p variants={staggerItem} className="text-center text-[var(--muted-foreground)] mb-16 text-sm">
            Everything you need. Nothing you don&apos;t.
          </motion.p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  variants={staggerItem}
                  className="glass-card group !p-6 space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-[#6366f1]/8 flex items-center justify-center group-hover:bg-[#6366f1]/15 transition-colors">
                    <Icon size={20} className="text-[#818cf8]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Setup ── */}
      <section className="py-24 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-2xl mx-auto text-center space-y-8">
          <motion.h2
            variants={staggerItem}
            className="font-heading text-3xl sm:text-4xl font-bold"
          >
            Running in 30 seconds.
          </motion.h2>
          <motion.div
            variants={staggerItem}
            className="rounded-2xl border border-[var(--glass-border)] bg-[#0c0c18]/80 backdrop-blur-xl overflow-hidden text-left shadow-2xl shadow-[#6366f1]/5"
          >
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[var(--glass-border)] bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]/60" />
            </div>
            <div className="p-5 font-mono text-[13px] leading-loose space-y-0.5">
              <p className="text-[var(--muted-foreground)]/50"># connect to the hosted instance — no setup needed</p>
              <p><span className="text-[#6366f1]">$</span> claude mcp add --transport http memory-mcp https://mcp.devfrend.com/api/mcp</p>
              <p className="text-[var(--muted-foreground)]/50 mt-1"># authenticate in browser, then you&apos;re done</p>
              <p className="mt-4 text-[var(--muted-foreground)]/50"># or self-host it yourself</p>
              <p><span className="text-[#6366f1]">$</span> git clone https://github.com/theamargupta/memory-mcp.git</p>
              <p><span className="text-[#6366f1]">$</span> cd memory-mcp && npm install && npm run dev</p>
            </div>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#818cf8] transition-all active:scale-[0.98] glow-primary"
            >
              Create Free Account
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--glass-border)] py-8 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-[12px] text-[var(--muted-foreground)]/60">
          <span className="font-heading font-medium">Memory MCP</span>
          <div className="flex items-center gap-4">
            <a
              href="https://ko-fi.com/amargupta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#ff5e5b]/30 text-[#ff5e5b] text-[11px] font-semibold hover:bg-[#ff5e5b]/10 transition-all"
            >
              <KofiIcon /> Support on Ko-fi
            </a>
            <Link href="/by-amar" className="hover:text-[#818cf8] transition-colors">Built by Amar Gupta</Link>
            <span className="font-mono">MIT</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
