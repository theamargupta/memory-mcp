'use client'

import { AnimatedNumber } from './animated-number'
import { Brain, Shield, FolderOpen, Zap } from 'lucide-react'

const iconMap: Record<string, { icon: typeof Brain; color: string; bg: string; borderColor: string }> = {
  Memories: { icon: Brain, color: '#818cf8', bg: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.15)' },
  Rules: { icon: Shield, color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', borderColor: 'rgba(34,211,238,0.15)' },
  Projects: { icon: FolderOpen, color: '#34d399', bg: 'rgba(52,211,153,0.1)', borderColor: 'rgba(52,211,153,0.15)' },
  'Tool Calls': { icon: Zap, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.15)' },
}

export function StatCard({ label, value }: { label: string; value: number }) {
  const config = iconMap[label] || iconMap.Memories
  const Icon = config.icon

  return (
    <div
      className="glass-card group cursor-default"
      style={{ borderTopColor: config.borderColor, borderTopWidth: '2px' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: config.bg }}
        >
          <Icon size={18} style={{ color: config.color }} strokeWidth={1.8} />
        </div>
      </div>
      <p className="text-3xl font-heading font-bold tracking-tight">
        <AnimatedNumber value={value} />
      </p>
      <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--muted-foreground)] mt-1">{label}</p>
    </div>
  )
}
