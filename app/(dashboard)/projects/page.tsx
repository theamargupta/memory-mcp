'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, ChevronDown, ChevronUp } from 'lucide-react'
import type { Memory } from '@/types'

type ProjectGroup = {
  name: string
  memories: Memory[]
  categories: Record<string, number>
  lastUpdated: string
}

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/memories?limit=100')
    const json = await res.json()
    const memories: Memory[] = json.data || []
    const grouped = new Map<string, Memory[]>()
    for (const mem of memories) {
      if (!mem.project) continue
      if (!grouped.has(mem.project)) grouped.set(mem.project, [])
      grouped.get(mem.project)!.push(mem)
    }
    const result: ProjectGroup[] = []
    for (const [name, mems] of grouped) {
      const categories: Record<string, number> = {}
      for (const m of mems) categories[m.category] = (categories[m.category] || 0) + 1
      const lastUpdated = mems.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0]?.updated_at || ''
      result.push({ name, memories: mems, categories, lastUpdated })
    }
    result.sort((a, b) => b.memories.length - a.memories.length)
    setProjects(result)
    setLoading(false)
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''} with scoped memories</p>
      </motion.div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl skeleton-shimmer border border-[var(--glass-border)]" />)}
        </div>
      ) : projects.length === 0 ? (
        <motion.div variants={fadeUp} className="text-center py-20">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#34d399]/10 mb-4">
            <FolderOpen size={28} className="text-[#34d399]" />
          </div>
          <p className="text-base font-heading font-semibold">No projects yet</p>
          <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-xs mx-auto">
            Add a <code className="font-mono text-[#818cf8] bg-[#6366f1]/10 px-1.5 rounded">project</code> field when saving memories to group them here.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const isExpanded = expanded === project.name
            return (
              <motion.div
                key={project.name}
                variants={fadeUp}
                whileHover={{ y: isExpanded ? 0 : -3, transition: { duration: 0.2 } }}
                className="glass-card cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : project.name)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold font-mono">{project.name}</h3>
                    {project.lastUpdated && (
                      <p className="text-[10px] text-[var(--muted-foreground)]/50 font-mono mt-0.5">
                        updated {getTimeAgo(new Date(project.lastUpdated))}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-heading font-bold text-[#818cf8]">{project.memories.length}</span>
                    {isExpanded ? <ChevronUp size={14} className="text-[var(--muted-foreground)]" /> : <ChevronDown size={14} className="text-[var(--muted-foreground)]" />}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {Object.entries(project.categories).map(([cat, count]) => (
                    <span key={cat} className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${categoryColor[cat] || 'bg-zinc-400/15 text-zinc-400'}`}>
                      {count} {cat}
                    </span>
                  ))}
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-3 border-t border-[var(--glass-border)] space-y-2.5 overflow-hidden"
                    >
                      {project.memories.map((mem) => (
                        <div key={mem.id}>
                          <p className="text-xs font-medium">{mem.title}</p>
                          <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-1">{mem.content}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}
