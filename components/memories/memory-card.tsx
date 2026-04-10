'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Pencil, Trash2, Terminal, MessageCircle, Hand } from 'lucide-react'
import type { Memory } from '@/types'

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

const sourceIcon: Record<string, typeof Terminal> = {
  claude_code: Terminal,
  claude_chat: MessageCircle,
  manual: Hand,
}

export function MemoryCard({
  memory,
  index,
  onEdit,
  onDelete,
}: {
  memory: Memory & { similarity?: number }
  index: number
  onEdit: (memory: Memory) => void
  onDelete: (id: string) => void
}) {
  const SourceIcon = sourceIcon[memory.source] || Terminal
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group glass-card relative cursor-pointer"
      onClick={() => router.push(`/memories/${memory.id}`)}
    >
      {/* Similarity badge */}
      {memory.similarity !== undefined && (
        <span className="absolute top-4 right-4 text-[10px] font-mono text-[#34d399] bg-[#34d399]/10 rounded-lg px-2 py-0.5 ring-1 ring-[#34d399]/20">
          {Math.round(memory.similarity * 100)}%
        </span>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-[15px] font-semibold leading-snug truncate pr-2">{memory.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(memory) }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(memory.id) }}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ring-1 ${categoryColor[memory.category] || 'bg-zinc-400/15 text-zinc-400 ring-zinc-400/20'}`}>
          {memory.category}
        </span>
        {memory.project && (
          <span className="text-[10px] font-mono text-[var(--muted-foreground)]/60 px-2 py-0.5 rounded-md border border-[var(--glass-border)]">
            {memory.project}
          </span>
        )}
        <span className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted-foreground)]/50 ml-auto">
          <SourceIcon size={10} />
          {getTimeAgo(new Date(memory.updated_at))}
        </span>
      </div>

      {/* Content */}
      <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed line-clamp-3 whitespace-pre-wrap">
        {memory.content}
      </p>

      {/* Tags */}
      {memory.tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--glass-border)] flex gap-1.5 flex-wrap">
          {memory.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-[var(--muted-foreground)]/60 px-2 py-0.5 rounded-full bg-white/[0.03] ring-1 ring-[var(--glass-border)]">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function getTimeAgo(date: Date): string {
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
