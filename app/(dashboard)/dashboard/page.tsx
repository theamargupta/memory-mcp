import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { StatCard } from '@/components/shared/stat-card'
import { DashboardClient } from '@/components/dashboard/dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { count: totalMemories } = await supabase
    .from('memories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .eq('is_active', true)

  const { data: categoryData } = await supabase
    .from('memories')
    .select('category')
    .eq('user_id', user!.id)
    .eq('is_active', true)

  const categoryCounts: Record<string, number> = {}
  for (const row of categoryData || []) {
    categoryCounts[row.category] = (categoryCounts[row.category] || 0) + 1
  }

  const { data: projectData } = await supabase
    .from('memories')
    .select('project')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .not('project', 'is', null)

  const projectSet = new Set((projectData || []).map((r) => r.project))

  const { data: recentMemories } = await supabase
    .from('memories')
    .select('id, title, category, updated_at')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(6)

  const { count: totalToolCalls } = await supabase
    .from('memory_access_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const { data: recentActivity } = await supabase
    .from('memory_access_log')
    .select('action, source, query, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <DashboardClient
      totalMemories={totalMemories || 0}
      ruleCount={categoryCounts['rule'] || 0}
      projectCount={projectSet.size}
      totalToolCalls={totalToolCalls || 0}
      recentMemories={recentMemories || []}
      recentActivity={recentActivity || []}
      categoryCounts={categoryCounts}
    />
  )
}
