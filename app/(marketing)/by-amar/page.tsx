'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, ArrowUpRight, ExternalLink, Quote } from 'lucide-react'

const socials = [
  { name: 'GitHub', href: 'https://github.com/theamargupta', icon: GitHubIcon },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/theamargupta', icon: LinkedInIcon },
  { name: 'Portfolio', href: 'https://amargupta.tech', icon: GlobeIcon },
  { name: 'Email', href: 'mailto:theamargupta.tech@gmail.com', icon: MailIcon },
]

const products = [
  {
    id: 'memory-mcp',
    name: 'Memory MCP',
    tagline: "Your AI tools' shared brain",
    description: 'Personal knowledge layer for Claude, Cursor, Codex. Save memories, rules, project context — search semantically. One MCP endpoint. OAuth. Self-hosted.',
    tech: ['Next.js', 'Supabase', 'pgvector', 'MCP Protocol'],
    href: 'https://mcp.devfrend.com',
    current: true,
  },
  {
    id: 'devfrend',
    name: 'Devfrend',
    tagline: 'Ship $99 websites at scale',
    description: 'Task management, loan tracking, client tools. MCP-powered — manage from Claude or Cursor. 500+ global clients served.',
    tech: ['Next.js', 'Supabase', 'MCP Protocol', 'Custom Auth'],
    href: 'https://app.devfrend.com',
    current: false,
  },
]

const skills = {
  Frontend: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'Framer Motion'],
  Backend: ['Node.js', 'Supabase', 'PostgreSQL', 'MongoDB', 'pgvector'],
  AI: ['MCP Protocol', 'LangChain', 'RAG', 'Claude API', 'GPT'],
  DevOps: ['Vercel', 'Docker', 'GitHub Actions', 'Cloudflare'],
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

export default function ByAmarPage() {
  return (
    <div className="min-h-screen bg-mesh">
      {/* Back link */}
      <div className="fixed top-4 left-6 z-50">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-[#818cf8] transition-colors px-3 py-1.5 rounded-lg bg-[#0a0a12]/60 backdrop-blur-sm border border-[var(--glass-border)]">
          &larr; Back
        </Link>
      </div>

      {/* ── Section 1: The Maker ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#6366f1]/8 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#22d3ee]/5 blur-[100px] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center space-y-6 relative z-10"
        >
          {/* Avatar */}
          <motion.div variants={staggerItem} className="mx-auto relative w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6366f1]/40 to-[#22d3ee]/20 animate-pulse" />
            <div className="absolute inset-1 rounded-full bg-[#12121e] flex items-center justify-center">
              <span className="text-4xl font-heading font-bold text-gradient">A</span>
            </div>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight">Built by Amar Gupta</h1>
            <p className="text-lg text-muted-foreground mt-3 max-w-md mx-auto">
              Full-stack developer building AI-powered tools for developers
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <span>Delhi, India</span>
            <span className="h-1 w-1 rounded-full bg-[var(--glass-border-hover)]" />
            <span>7+ years building for the web</span>
          </motion.div>

          {/* Social links */}
          <motion.div variants={staggerItem} className="flex justify-center gap-3">
            {socials.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex h-10 w-10 items-center justify-center rounded-xl glass text-muted-foreground hover:text-[#818cf8] hover:border-[#6366f1]/30 transition-all"
                title={s.name}
              >
                <s.icon />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Section 2: The Ecosystem ── */}
      <section className="py-24 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-4xl mx-auto">
          <motion.h2 variants={staggerItem} className="font-heading text-3xl font-bold text-center mb-4">
            The Ecosystem
          </motion.h2>
          <motion.p variants={staggerItem} className="text-center text-muted-foreground mb-12 text-sm">
            Two products. One mission. Make developers more productive.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => (
              <motion.a
                key={product.id}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group block rounded-2xl p-6 space-y-4 transition-all duration-300 relative overflow-hidden ${
                  product.current
                    ? 'gradient-border !bg-[#12121e] glow-primary'
                    : 'glass-card'
                }`}
              >
                {product.current && (
                  <span className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-widest text-[#818cf8] bg-[#6366f1]/15 px-2.5 py-0.5 rounded-full ring-1 ring-[#6366f1]/20">
                    You are here
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-heading font-bold">{product.name}</h3>
                  <p className="text-sm text-[#818cf8] font-medium mt-0.5">{product.tagline}</p>
                </div>

                <p className="text-[13px] text-muted-foreground leading-relaxed">{product.description}</p>

                <div className="flex gap-1.5 flex-wrap">
                  {product.tech.map((t) => (
                    <span key={t} className="text-[10px] font-mono text-muted-foreground px-2 py-0.5 rounded-lg bg-white/[0.03] ring-1 ring-[var(--glass-border)]">
                      {t}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#818cf8] group-hover:text-[#6366f1] transition-colors">
                  {product.current ? 'Currently exploring' : 'Try this too'}
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </motion.a>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Section 3: The Stack ── */}
      <section className="py-24 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-4xl mx-auto">
          <motion.h2 variants={staggerItem} className="font-heading text-3xl font-bold text-center mb-12">
            The Stack
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <motion.div key={category} variants={staggerItem}>
                <h3 className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg glass text-foreground/80 hover:text-[#818cf8] hover:border-[#6366f1]/30 cursor-default transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Section 4: Philosophy ── */}
      <section className="py-24 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-2xl mx-auto text-center">
          <motion.div variants={staggerItem} className="relative">
            <Quote size={32} className="text-[#6366f1]/20 mx-auto mb-4" />
            <blockquote className="text-lg text-foreground/80 leading-relaxed font-heading">
              &ldquo;I build tools that make developers more productive. Every product I ship solves a problem I faced myself.
              Memory MCP exists because I was tired of repeating my preferences to every AI tool.&rdquo;
            </blockquote>
            <div className="mt-6 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#6366f1]/30 to-transparent" />
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ── Section 5: Connect ── */}
      <section className="py-24 px-6 border-t border-[var(--glass-border)]">
        <AnimatedSection className="max-w-xl mx-auto text-center space-y-8">
          <motion.div variants={staggerItem} className="space-y-3">
            <h2 className="font-heading text-3xl font-bold">Have an idea? Let&apos;s talk.</h2>
            <p className="text-muted-foreground text-sm">Always open to interesting projects and collaborations.</p>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-4">
            <a href="mailto:theamargupta.tech@gmail.com" className="font-mono text-sm text-muted-foreground hover:text-[#818cf8] transition-colors">
              theamargupta.tech@gmail.com
            </a>

            <div className="flex justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium glass text-muted-foreground hover:text-[#818cf8] hover:border-[#6366f1]/30 transition-all"
                >
                  <s.icon /> {s.name}
                </a>
              ))}
            </div>

            <a
              href="https://amargupta.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-8 py-3 rounded-xl bg-[#6366f1] text-white font-semibold text-sm hover:bg-[#818cf8] transition-all active:scale-[0.98] glow-primary"
            >
              View Full Portfolio
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--glass-border)] py-8 px-6 text-center">
        <p className="text-xs text-muted-foreground/60">
          Built with Next.js, Supabase, and too much chai
        </p>
      </footer>
    </div>
  )
}

/* ── Icons ── */

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
