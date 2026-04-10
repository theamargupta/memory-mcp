'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import type { Memory, MemoryCategory } from '@/types'

const categories: MemoryCategory[] = [
  'preference', 'rule', 'project', 'decision',
  'context', 'snippet', 'note', 'persona',
]

type MemoryFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  memory?: Memory | null
  onSave: (data: {
    title: string
    content: string
    category: MemoryCategory
    tags: string[]
    project: string | null
  }) => Promise<void>
}

export function MemoryForm({ open, onOpenChange, memory, onSave }: MemoryFormProps) {
  const [title, setTitle] = useState(memory?.title || '')
  const [content, setContent] = useState(memory?.content || '')
  const [category, setCategory] = useState<MemoryCategory>(memory?.category || 'note')
  const [tagsInput, setTagsInput] = useState(memory?.tags.join(', ') || '')
  const [project, setProject] = useState(memory?.project || '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    await onSave({ title: title.trim(), content: content.trim(), category, tags, project: project.trim() || null })
    setSaving(false)
    onOpenChange(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => onOpenChange(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            className="relative w-full max-w-lg mx-4 rounded-2xl border border-[var(--glass-border)] bg-[#12121e] shadow-2xl shadow-black/40"
          >
            <div className="px-6 py-4 border-b border-[var(--glass-border)] flex items-center justify-between">
              <h2 className="text-base font-heading font-semibold">{memory ? 'Edit Memory' : 'New Memory'}</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tech Stack Preference"
                  required
                  className="w-full h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="I use Next.js 16, Tailwind v4, Supabase for backend..."
                  rows={5}
                  required
                  className="w-full px-3.5 py-3 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all resize-none font-mono text-[13px] leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MemoryCategory)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm focus:outline-none focus:border-[#6366f1]/50 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#12121e]">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">Project</label>
                  <input
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="my-project"
                    className="w-full h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">Tags</label>
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="tech-stack, frontend, backend"
                  className="w-full h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-foreground border border-[var(--glass-border)] hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !title.trim() || !content.trim()}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all active:scale-[0.98] disabled:opacity-50 glow-primary flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Saving...
                    </>
                  ) : memory ? 'Update' : 'Save Memory'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
