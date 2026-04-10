'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MemoryCard } from './memory-card'
import { MemoryForm } from './memory-form'
import { Search, Plus, Brain, Sparkles } from 'lucide-react'
import type { Memory, MemoryCategory } from '@/types'

const categories: MemoryCategory[] = [
  'preference', 'rule', 'project', 'decision',
  'context', 'snippet', 'note', 'persona',
]

type SearchResult = Memory & { similarity?: number }

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function MemoryList() {
  const [memories, setMemories] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [searchMode, setSearchMode] = useState<'text' | 'semantic'>('text')
  const [formOpen, setFormOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [count, setCount] = useState(0)

  const fetchMemories = useCallback(async () => {
    setLoading(true)

    if (searchMode === 'semantic' && search.trim()) {
      const res = await fetch('/api/memories/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: search,
          limit: 20,
          category: category !== 'all' ? category : null,
        }),
      })
      const json = await res.json()
      setMemories(json.results || [])
      setCount(json.results?.length || 0)
    } else {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (category !== 'all') params.set('category', category)
      const res = await fetch(`/api/memories?${params}`)
      const json = await res.json()
      setMemories(json.data || [])
      setCount(json.count || 0)
    }

    setLoading(false)
  }, [search, category, searchMode])

  useEffect(() => {
    const debounce = setTimeout(fetchMemories, searchMode === 'semantic' ? 400 : 0)
    return () => clearTimeout(debounce)
  }, [fetchMemories, searchMode])

  async function handleSave(data: {
    title: string; content: string; category: MemoryCategory; tags: string[]; project: string | null
  }) {
    if (editingMemory) {
      await fetch(`/api/memories/${editingMemory.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
    } else {
      await fetch('/api/memories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
    }
    setEditingMemory(null)
    fetchMemories()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/memories/${id}`, { method: 'DELETE' })
    fetchMemories()
  }

  function handleEdit(memory: Memory) {
    setEditingMemory(memory)
    setFormOpen(true)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Memories</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
            {count} {searchMode === 'semantic' && search ? 'found' : 'stored'}
          </p>
        </div>
        <button
          onClick={() => { setEditingMemory(null); setFormOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all active:scale-[0.98] shadow-lg shadow-[#6366f1]/15"
        >
          <Plus size={14} />
          New Memory
        </button>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]/50" size={16} />
            <input
              placeholder={searchMode === 'semantic' ? 'Ask about your memories...' : 'Search memories...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-[var(--glass-border)] bg-white/[0.02] text-sm placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/40 focus:ring-2 focus:ring-[#6366f1]/10 focus:bg-white/[0.03] transition-all backdrop-blur-sm"
            />
          </div>

          {/* Search mode toggle */}
          <div className="flex rounded-xl border border-[var(--glass-border)] overflow-hidden shrink-0 bg-white/[0.02]">
            <button
              className={`px-3.5 py-2.5 text-[11px] font-mono transition-all flex items-center gap-1.5 ${searchMode === 'text' ? 'bg-[#6366f1]/15 text-[#818cf8]' : 'text-[var(--muted-foreground)]/60 hover:text-[var(--muted-foreground)]'}`}
              onClick={() => setSearchMode('text')}
            >
              <Search size={11} />
              text
            </button>
            <button
              className={`px-3.5 py-2.5 text-[11px] font-mono transition-all flex items-center gap-1.5 ${searchMode === 'semantic' ? 'bg-[#22d3ee]/15 text-[#22d3ee]' : 'text-[var(--muted-foreground)]/60 hover:text-[var(--muted-foreground)]'}`}
              onClick={() => setSearchMode('semantic')}
            >
              <Sparkles size={11} />
              semantic
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategory('all')}
            className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
              category === 'all'
                ? 'border-[#6366f1]/30 bg-[#6366f1]/10 text-[#818cf8]'
                : 'border-[var(--glass-border)] text-[var(--muted-foreground)]/60 hover:text-[var(--muted-foreground)] hover:border-[var(--glass-border-hover)] hover:bg-white/[0.02]'
            }`}
          >
            all
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(category === cat ? 'all' : cat)}
              className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border transition-all ${
                category === cat
                  ? 'border-[#6366f1]/30 bg-[#6366f1]/10 text-[#818cf8]'
                  : 'border-[var(--glass-border)] text-[var(--muted-foreground)]/60 hover:text-[var(--muted-foreground)] hover:border-[var(--glass-border-hover)] hover:bg-white/[0.02]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-2xl skeleton-shimmer border border-[var(--glass-border)]" />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <motion.div variants={fadeUp} className="text-center py-20">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366f1]/10 mb-4">
            <Brain size={28} className="text-[#818cf8]" />
          </div>
          <p className="text-base font-heading font-semibold">{search ? 'No results' : 'No memories yet'}</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-xs mx-auto">
            {search
              ? 'Try a different query or switch search modes.'
              : 'Your AI tools have no shared memory yet. Create your first one.'}
          </p>
          {!search && (
            <button
              onClick={() => { setEditingMemory(null); setFormOpen(true) }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all glow-primary"
            >
              <Plus size={14} />
              Create Memory
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memories.map((memory, i) => (
            <MemoryCard key={memory.id} memory={memory} index={i} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <MemoryForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingMemory(null) }}
        memory={editingMemory}
        onSave={handleSave}
      />
    </motion.div>
  )
}
