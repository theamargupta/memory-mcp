'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export function UserMenu({ email }: { email: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initial = email[0]?.toUpperCase() || '?'

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-[var(--muted-foreground)] hidden sm:block truncate max-w-48">
        {email}
      </span>
      <div className="flex items-center gap-1.5">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#6366f1]/40 to-[#22d3ee]/40 flex items-center justify-center text-xs font-semibold text-foreground/80 ring-1 ring-[var(--glass-border)]">
          {initial}
        </div>
        <button
          onClick={handleSignOut}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-[var(--muted-foreground)] hover:text-foreground hover:bg-[var(--glass)] transition-all cursor-pointer"
          title="Sign out"
        >
          <LogOut size={14} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}
