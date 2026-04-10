'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Download, Pencil, Trash2, ChevronDown, Shield, Loader2 } from 'lucide-react'
import type { Memory } from '@/types'

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function RulesPage() {
  const [rules, setRules] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newProject, setNewProject] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchRules = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/memories?category=rule')
    const json = await res.json()
    setRules(json.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchRules() }, [fetchRules])

  async function handleAdd() {
    if (!newContent.trim()) return
    setSaving(true)
    await fetch('/api/memories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle.trim() || 'Rule', content: newContent.trim(), category: 'rule', project: newProject.trim() || null }),
    })
    setNewTitle(''); setNewContent(''); setNewProject(''); setShowForm(false)
    setSaving(false)
    fetchRules()
  }

  async function handleUpdate(id: string) {
    if (!editContent.trim()) return
    await fetch(`/api/memories/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent.trim() }),
    })
    setEditingId(null)
    fetchRules()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/memories/${id}`, { method: 'DELETE' })
    fetchRules()
  }

  function exportAsClaudeMd() {
    const grouped = new Map<string, Memory[]>()
    for (const rule of rules) {
      const key = rule.project || '_global'
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(rule)
    }
    let md = '# Rules\n\n'
    const global = grouped.get('_global')
    if (global) for (const rule of global) md += `## ${rule.title}\n\n${rule.content}\n\n`
    for (const [project, projectRules] of grouped) {
      if (project === '_global') continue
      md += `# Project: ${project}\n\n`
      for (const rule of projectRules) md += `## ${rule.title}\n\n${rule.content}\n\n`
    }
    const blob = new Blob([md.trim() + '\n'], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'CLAUDE.md'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Rules</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Coding standards your AI tools follow</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--muted-foreground)]/50 px-2.5 py-1 rounded-lg border border-[var(--glass-border)] bg-white/[0.02]">
            .claude.md
          </span>
          <button
            onClick={exportAsClaudeMd}
            disabled={rules.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--glass-border-hover)] text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Add rule toggle */}
      <motion.div variants={fadeUp}>
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.button
              key="toggle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all active:scale-[0.98] shadow-lg shadow-[#6366f1]/15"
            >
              <Plus size={14} />
              Add Rule
            </motion.button>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-2xl p-5 space-y-3 overflow-hidden"
            >
              <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)]/60">New Rule</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Rule title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
                />
                <input
                  placeholder="Project scope (optional)"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm font-mono placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all"
                />
              </div>
              <textarea
                placeholder="Always use const over let. Never use any in TypeScript..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-3 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm font-mono text-[13px] leading-relaxed placeholder:text-[var(--muted-foreground)]/40 focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={saving || !newContent.trim()}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Adding...</> : 'Save Rule'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setNewTitle(''); setNewContent(''); setNewProject('') }}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-foreground border border-[var(--glass-border)] hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Rules list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl skeleton-shimmer border border-[var(--glass-border)]" />)}
        </div>
      ) : rules.length === 0 ? (
        <motion.div variants={fadeUp} className="text-center py-20">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22d3ee]/10 mb-4">
            <Shield size={28} className="text-[#22d3ee]" />
          </div>
          <p className="text-base font-heading font-semibold">No rules yet</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-xs mx-auto">
            Add coding rules and standards. Your AI tools will load them via <code className="font-mono text-[#818cf8] bg-[#6366f1]/10 px-1.5 rounded">get_rules</code>.
          </p>
          {/* Ghost example card */}
          <div className="mt-8 max-w-md mx-auto glass rounded-2xl p-4 border-l-[3px] border-l-[#6366f1]/20 text-left opacity-40">
            <p className="text-xs font-medium mb-1">Example: TypeScript Standards</p>
            <p className="text-[11px] font-mono text-[var(--muted-foreground)] leading-relaxed">Always use const. Prefer interfaces over types. No any.</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group glass rounded-2xl hover:border-[var(--glass-border-hover)] transition-all border-l-[3px] border-l-[#6366f1]/30"
            >
              <div className="px-5 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-[var(--muted-foreground)]/40">#{i + 1}</span>
                    <span className="text-sm font-semibold">{rule.title}</span>
                    {rule.project && (
                      <span className="text-[10px] font-mono text-[var(--muted-foreground)]/60 px-2 py-0.5 rounded-md border border-[var(--glass-border)]">
                        {rule.project}
                      </span>
                    )}
                  </div>
                  {editingId === rule.id ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full px-3.5 py-3 rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-sm font-mono text-[13px] leading-relaxed focus:outline-none focus:border-[#6366f1]/50 focus:ring-2 focus:ring-[#6366f1]/10 transition-all resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(rule.id)} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-all">Save</button>
                        <button onClick={() => setEditingId(null)} className="px-3.5 py-1.5 rounded-lg text-xs text-[var(--muted-foreground)] hover:text-foreground border border-[var(--glass-border)] transition-all">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] font-mono text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">{rule.content}</p>
                  )}
                </div>
                {editingId !== rule.id && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => { setEditingId(rule.id); setEditContent(rule.content) }}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
