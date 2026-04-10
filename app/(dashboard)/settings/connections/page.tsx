'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Connection = {
  id: string
  client_id: string
  client_name: string
  created_at: string
  expires_at: string
  revoked_at: string | null
  last_used_at: string | null
  is_active: boolean
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConnections = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/connections')
    const json = await res.json()
    setConnections(json.connections || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchConnections() }, [fetchConnections])

  async function handleRevoke(id: string) {
    await fetch('/api/connections', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchConnections()
  }

  const active = connections.filter((c) => c.is_active)
  const revoked = connections.filter((c) => !c.is_active)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Connections</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{active.length} active session{active.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-16 rounded-xl bg-card/20 border border-border/20 animate-pulse" />)}
        </div>
      ) : connections.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm font-medium">No connections yet</p>
          <p className="text-xs text-muted-foreground mt-1">Connect an AI tool to see sessions here.</p>
          <div className="mt-4 bg-background rounded-lg border border-border/40 p-3 max-w-md mx-auto">
            <code className="text-[11px] font-mono text-muted-foreground">
              claude mcp add --transport http memory-mcp {typeof window !== 'undefined' ? window.location.origin : ''}/api/mcp
            </code>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70">Active</p>
              {active.map((conn, i) => (
                <motion.div
                  key={conn.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-border/40 bg-card/20 px-5 py-3 flex items-center justify-between hover:border-border/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{conn.client_name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex gap-3 text-[10px] font-mono text-muted-foreground/70">
                      <span>connected {formatDate(conn.created_at)}</span>
                      {conn.last_used_at && <span>used {formatDate(conn.last_used_at)}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(conn.id)}
                    className="px-3 py-1 rounded-md text-[11px] font-mono text-destructive/70 hover:text-destructive border border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5 transition-all"
                  >
                    Revoke
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {revoked.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/70">Expired / Revoked</p>
              {revoked.slice(0, 10).map((conn) => (
                <div key={conn.id} className="rounded-xl border border-border/20 bg-card/10 px-5 py-3 opacity-40">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{conn.client_name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/70">
                      {conn.revoked_at ? 'revoked' : 'expired'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 60) return 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString()
}
