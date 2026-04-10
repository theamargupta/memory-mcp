import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/shared/app-sidebar'
import { UserMenu } from '@/components/shared/user-menu'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-ambient">
      <AppSidebar />
      <div className="flex-1 ml-55 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 h-14 flex items-center justify-end px-8 border-b border-[var(--glass-border)] bg-[#0a0a12]/80 backdrop-blur-xl">
          <UserMenu email={user.email || ''} />
        </header>
        <main className="flex-1 px-8 py-8 max-w-300 w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
