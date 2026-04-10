'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Terminal, Sparkles, Copy, Check, Download, Upload, Zap, Link2, AlertTriangle, Trash2, Loader2 } from 'lucide-react'

function CursorSettingsIcon(_props: Record<string, unknown>) { return <span className="text-xs font-bold font-mono">{'>_'}</span> }
function CodexSettingsIcon(_props: Record<string, unknown>) { return <span className="text-xs font-bold font-mono">{'<>'}</span> }

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all shrink-0"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-[#34d399]" /> : <Copy size={13} />}
    </button>
  )
}

export default function SettingsPage() {
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<string | null>(null)
  const [backfilling, setBackfilling] = useState(false)
  const [backfillResult, setBackfillResult] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleExport() {
    window.location.href = '/api/memories/export'
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true); setImportResult(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const memories = data.memories || data
      if (!Array.isArray(memories)) { setImportResult('Invalid format.'); setImporting(false); return }
      let imported = 0
      for (const mem of memories) {
        const res = await fetch('/api/memories', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: mem.title, content: mem.content, category: mem.category || 'note', tags: mem.tags || [], project: mem.project || null, source: 'manual' }),
        })
        if (res.ok) imported++
      }
      setImportResult(`Imported ${imported} of ${memories.length} memories.`)
    } catch { setImportResult('Failed to parse JSON.') }
    setImporting(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const clients = [
    {
      name: 'Claude Code',
      icon: Terminal,
      command: `claude mcp add --transport http memory-mcp ${origin}/api/mcp`,
    },
    {
      name: 'Claude Chat',
      icon: Sparkles,
      command: `Settings → Connectors → Add Custom Connector\nURL: ${origin}/api/mcp`,
    },
    {
      name: 'Cursor',
      icon: CursorSettingsIcon,
      command: `{ "mcpServers": { "memory-mcp": { "type": "http", "url": "${origin}/api/mcp" } } }`,
    },
    {
      name: 'Codex',
      icon: CodexSettingsIcon,
      command: `codex mcp login memory-mcp`,
    },
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8"
    >
      <motion.div variants={fadeUp}>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Manage connections, data, and setup</p>
      </motion.div>

      {/* Setup Guide */}
      <motion.div variants={fadeUp} className="space-y-4">
        <h2 className="text-base font-heading font-semibold flex items-center gap-2">
          <Link2 size={16} className="text-[#818cf8]" />
          Connect Your AI Tools
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {clients.map((client) => {
            const Icon = client.icon
            return (
              <div key={client.name} className="glass rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--muted-foreground)]">
                    <Icon size={15} strokeWidth={1.8} />
                  </div>
                  <span className="text-sm font-semibold">{client.name}</span>
                </div>
                <div className="flex items-start gap-2 bg-[#0a0a12] rounded-xl border border-[var(--glass-border)] p-3">
                  <code className="text-[11px] font-mono text-[var(--muted-foreground)] break-all leading-relaxed flex-1 whitespace-pre-wrap">
                    {client.command}
                  </code>
                  <CopyButton text={client.command} />
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Connections + Export/Import + Embeddings */}
      <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-3">
        <Link href="/settings/connections" className="block">
          <div className="glass rounded-2xl p-5 h-full hover:border-[var(--glass-border-hover)] transition-all">
            <div className="flex items-center gap-2 mb-2">
              <Link2 size={14} className="text-[#818cf8]" />
              <p className="text-sm font-semibold">MCP Connections</p>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">View and revoke active AI tool sessions.</p>
          </div>
        </Link>

        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Download size={14} className="text-[#22d3ee]" />
            <p className="text-sm font-semibold">Export / Import</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--glass-border-hover)] text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all"
            >
              <Download size={12} />
              Export
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--glass-border-hover)] text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all disabled:opacity-50"
            >
              {importing ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {importing ? 'Importing...' : 'Import'}
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
          {importResult && <p className="text-[11px] text-[var(--muted-foreground)]">{importResult}</p>}
        </div>

        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-[#fbbf24]" />
            <p className="text-sm font-semibold">Embeddings</p>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">Generate vectors for memories missing embeddings.</p>
          <button
            disabled={backfilling}
            onClick={async () => {
              setBackfilling(true); setBackfillResult(null)
              const res = await fetch('/api/memories/backfill', { method: 'POST' })
              const json = await res.json()
              setBackfillResult(json.message)
              setBackfilling(false)
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--glass-border-hover)] text-[var(--muted-foreground)] hover:text-foreground hover:bg-white/5 transition-all disabled:opacity-50"
          >
            {backfilling ? <><Loader2 size={12} className="animate-spin" /> Running...</> : <><Zap size={12} /> Backfill</>}
          </button>
          {backfillResult && <p className="text-[11px] text-[var(--muted-foreground)]">{backfillResult}</p>}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={fadeUp} className="rounded-2xl border border-[#f87171]/15 bg-[#f87171]/[0.03] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className="text-[#f87171]" />
          <h2 className="text-sm font-semibold text-[#f87171]">Danger Zone</h2>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">These actions are irreversible. Please be certain.</p>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-[#f87171]/20 text-[#f87171]/70 hover:text-[#f87171] hover:bg-[#f87171]/10 transition-all">
          <Trash2 size={12} />
          Delete All Memories
        </button>
      </motion.div>
    </motion.div>
  )
}
