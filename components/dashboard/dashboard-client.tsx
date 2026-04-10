'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StatCard } from '@/components/shared/stat-card'
import { Plus, FileDown, Brain, Terminal, ArrowRight } from 'lucide-react'

const categoryColor: Record<string, string> = {
  preference: 'bg-blue-400/15 text-blue-400',
  rule: 'bg-[#818cf8]/15 text-[#818cf8]',
  project: 'bg-emerald-400/15 text-emerald-400',
  decision: 'bg-violet-400/15 text-violet-400',
  context: 'bg-cyan-400/15 text-cyan-400',
  snippet: 'bg-orange-400/15 text-orange-400',
  note: 'bg-zinc-400/15 text-zinc-400',
  persona: 'bg-pink-400/15 text-pink-400',
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

type Props = {
  totalMemories: number
  ruleCount: number
  projectCount: number
  totalToolCalls: number
  recentMemories: { id: string; title: string; category: string; updated_at: string }[]
  recentActivity: { action: string; source: string; query: string; created_at: string }[]
  categoryCounts: Record<string, number>
}

export function DashboardClient({
  totalMemories,
  ruleCount,
  projectCount,
  totalToolCalls,
  recentMemories,
  recentActivity,
  categoryCounts,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Your knowledge layer at a glance</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Memories" value={totalMemories} />
        <StatCard label="Rules" value={ruleCount} />
        <StatCard label="Projects" value={projectCount} />
        <StatCard label="Tool Calls" value={totalToolCalls} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} className="flex gap-3">
        <Link
          href="/memories"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all active:scale-[0.98] shadow-lg shadow-[#6366f1]/15"
        >
          <Plus size={14} />
          New Memory
        </Link>
        <Link
          href="/rules"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-[var(--glass-border-hover)] text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all"
        >
          <Plus size={14} />
          Add Rule
        </Link>
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all"
        >
          <FileDown size={14} />
          Export
        </Link>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Memories */}
        <motion.div variants={fadeUp} className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--glass-border)] flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent Memories</h2>
            <Link href="/memories" className="text-[11px] font-mono text-[#818cf8] hover:text-[#6366f1] transition-colors flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {recentMemories.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6366f1]/10 mb-3">
                  <Brain size={20} className="text-[#818cf8]" />
                </div>
                <p className="text-sm font-medium">No memories yet</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">Create your first memory to get started.</p>
                <Link
                  href="/memories"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#818cf8] hover:text-[#6366f1] transition-colors"
                >
                  <Plus size={12} /> Create Memory
                </Link>
              </div>
            ) : (
              recentMemories.map((mem) => (
                <div key={mem.id} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${categoryColor[mem.category] || 'bg-zinc-400/15 text-zinc-400'}`}>
                      {mem.category}
                    </span>
                    <span className="text-sm truncate">{mem.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--muted-foreground)]/60 shrink-0 ml-3">
                    {formatTimeAgo(new Date(mem.updated_at))}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[var(--glass-border)]">
            <h2 className="text-sm font-semibold">MCP Activity</h2>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {recentActivity.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22d3ee]/10 mb-3">
                  <Terminal size={20} className="text-[#22d3ee]" />
                </div>
                <p className="text-sm font-medium">No tool calls yet</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-[200px] mx-auto">Connect an AI tool to start seeing activity here.</p>
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#22d3ee] hover:text-[#22d3ee]/80 transition-colors"
                >
                  Setup Guide <ArrowRight size={10} />
                </Link>
              </div>
            ) : (
              recentActivity.map((log, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#6366f1]/10 text-[#818cf8]">
                      {log.action}
                    </span>
                    {log.query && (
                      <span className="text-xs text-[var(--muted-foreground)] truncate">{log.query}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[var(--muted-foreground)]/60 shrink-0 ml-3">
                    {formatTimeAgo(new Date(log.created_at))}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Category Breakdown — only if 2+ categories */}
        {Object.keys(categoryCounts).length >= 2 && (
          <motion.div variants={fadeUp} className="glass rounded-2xl p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold mb-4">By Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(categoryCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-[var(--glass-border)] px-4 py-2.5">
                    <span className="text-xs capitalize text-[var(--muted-foreground)]">{cat}</span>
                    <span className="text-sm font-heading font-bold text-[#818cf8]">{count}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d`
  return date.toLocaleDateString()
}
