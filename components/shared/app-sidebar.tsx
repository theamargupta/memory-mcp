'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutGrid, Brain, Shield, FolderOpen, Settings, Sparkles, Heart } from 'lucide-react'

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { title: 'Memories', href: '/memories', icon: Brain },
  { title: 'Rules', href: '/rules', icon: Shield },
  { title: 'Projects', href: '/projects', icon: FolderOpen },
  { title: 'Settings', href: '/settings', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] flex flex-col border-r border-[var(--glass-border)] bg-[#08080f] z-30">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-[var(--glass-border)]">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#818cf8] flex items-center justify-center shadow-lg shadow-[#6366f1]/20">
          <span className="text-white font-bold text-sm font-mono">M</span>
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-semibold text-sm text-foreground/90 tracking-tight leading-none">
            Memory MCP
          </span>
          <span className="text-[9px] font-mono text-[var(--muted-foreground)] leading-none mt-0.5">
            knowledge layer
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--muted-foreground)]/50 px-2.5 mb-2">
          Navigate
        </p>
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard' || pathname === '/'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors group"
            >
              {/* Animated active background */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-[var(--accent-muted)]"
                  transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                />
              )}

              {/* Left accent bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#6366f1]"
                  transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                />
              )}

              <span className={`relative z-10 transition-colors ${isActive ? 'text-[#818cf8]' : 'text-[var(--sidebar-foreground)] group-hover:text-foreground/70'}`}>
                <item.icon size={16} strokeWidth={1.8} />
              </span>
              <span className={`relative z-10 transition-colors ${isActive ? 'text-foreground' : 'text-[var(--sidebar-foreground)] group-hover:text-foreground/70'}`}>
                {item.title}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[var(--glass-border)] space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#6366f1]/30 to-[#22d3ee]/30 flex items-center justify-center">
            <Sparkles size={10} className="text-[#22d3ee]" />
          </div>
          <span className="text-[10px] font-mono text-[var(--muted-foreground)]/60">v0.1.0</span>
        </div>
        <Link href="/by-amar" className="block text-[11px] text-[var(--muted-foreground)]/60 hover:text-[#818cf8] transition-colors">
          Built by Amar &rarr;
        </Link>
        <a
          href="https://ko-fi.com/amargupta"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]/60 hover:text-[#ff5e5b] transition-colors"
        >
          <Heart size={10} /> Support on Ko-fi
        </a>
      </div>
    </aside>
  )
}
