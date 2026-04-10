'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Pencil, Trash2, Terminal, MessageCircle, Hand, Clock, Tag, FolderOpen } from 'lucide-react'
import { MemoryForm } from '@/components/memories/memory-form'
import type { Memory, MemoryCategory } from '@/types'

const categoryColor: Record<string, string> = {
  preference: 'bg-blue-400/15 text-blue-400 ring-blue-400/20',
  rule: 'bg-[#818cf8]/15 text-[#818cf8] ring-[#818cf8]/20',
  project: 'bg-emerald-400/15 text-emerald-400 ring-emerald-400/20',
  decision: 'bg-violet-400/15 text-violet-400 ring-violet-400/20',
  context: 'bg-cyan-400/15 text-cyan-400 ring-cyan-400/20',
  snippet: 'bg-orange-400/15 text-orange-400 ring-orange-400/20',
  note: 'bg-zinc-400/15 text-zinc-400 ring-zinc-400/20',
  persona: 'bg-pink-400/15 text-pink-400 ring-pink-400/20',
}

const sourceLabel: Record<string, { icon: typeof Terminal; label: string }> = {
  claude_code: { icon: Terminal, label: 'Claude Code' },
  claude_chat: { icon: MessageCircle, label: 'Claude Chat' },
  manual: { icon: Hand, label: 'Manual' },
}

export default function MemoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [memory, setMemory] = useState<Memory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    async function fetchMemory() {
      setLoading(true)
      const res = await fetch(`/api/memories/${id}`)
      if (!res.ok) {
        setError('Memory not found')
        setLoading(false)
        return
      }
      const json = await res.json()
      setMemory(json.data)
      setLoading(false)
    }
    fetchMemory()
  }, [id])

  async function handleDelete() {
    if (!memory) return
    await fetch(`/api/memories/${memory.id}`, { method: 'DELETE' })
    router.push('/memories')
  }

  async function handleSave(data: {
    title: string; content: string; category: MemoryCategory; tags: string[]; project: string | null
  }) {
    if (!memory) return
    const res = await fetch(`/api/memories/${memory.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (json.data) setMemory(json.data)
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-xl skeleton-shimmer" />
        <div className="h-64 rounded-2xl skeleton-shimmer border border-[var(--glass-border)]" />
      </div>
    )
  }

  if (error || !memory) {
    return (
      <div className="text-center py-20">
        <p className="text-base font-heading font-semibold">Memory not found</p>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">This memory may have been deleted.</p>
        <button
          onClick={() => router.push('/memories')}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all"
        >
          <ArrowLeft size={14} />
          Back to Memories
        </button>
      </div>
    )
  }

  const source = sourceLabel[memory.source] || sourceLabel.manual
  const SourceIcon = source.icon

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/memories')}
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-[var(--glass-border)] hover:bg-white/5 transition-all"
            >
              <Pencil size={13} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-[#f87171]/20 text-[#f87171] hover:bg-[#f87171]/10 transition-all"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="glass-card space-y-6">
          {/* Title + Category */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md ring-1 ${categoryColor[memory.category] || 'bg-zinc-400/15 text-zinc-400 ring-zinc-400/20'}`}>
                {memory.category}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)]/60">
                <SourceIcon size={11} />
                {source.label}
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">{memory.title}</h1>
          </div>

          {/* Content */}
          <div className="text-[14px] text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap font-mono">
            {memory.content}
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-[var(--glass-border)] space-y-3">
            {memory.project && (
              <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]/70">
                <FolderOpen size={13} />
                <span className="font-mono text-[12px]">{memory.project}</span>
              </div>
            )}

            {memory.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={13} className="text-[var(--muted-foreground)]/50 shrink-0" />
                {memory.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-mono text-[var(--muted-foreground)]/60 px-2.5 py-1 rounded-full bg-white/[0.03] ring-1 ring-[var(--glass-border)]">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--muted-foreground)]/50">
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                Created {new Date(memory.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span>
                Updated {new Date(memory.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <MemoryForm
        open={formOpen}
        onOpenChange={(open) => setFormOpen(open)}
        memory={memory}
        onSave={handleSave}
      />
    </>
  )
}
